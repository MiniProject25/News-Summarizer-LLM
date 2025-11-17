# run this server on a different port (other than 8000) - [For eg. PORT 8002]
import logging
from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from embedder import embed_article
from retriever import retrieve_similar_articles

app = FastAPI()

# Request body models
class EmbedRequest(BaseModel):
    id: str
    content: str
    title: str
    url: str
    category: str
    date: str

class QueryRequest(BaseModel):
    id: Union[int, str]
    top_k: int = 5

@app.post("/embed")
async def embed(req: EmbedRequest):
    """
    Receive articles -> chunk -> embed -> store in chromaDB
    """
    logging.warning("ENTERING **/EMBED ROUTE**")
    try:    
        embed_article(req.id, req.content, req.title, req.category, req.date)
        return {"status": "stored"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during embedding: {e}")
    
@app.post("/query")
async def query(req: QueryRequest):
    logging.warning("ENTERING **/QUERY ROUTE**")
    try:
        ids = retrieve_similar_articles(str(req.id), req.top_k)
        logging.warning("EXITING **/QUERY ROUTE**")
        return {"article_id": req.id, "results": ids}
    except Exception as e:  
        logging.exception(f"Query error: {e}")
        return {"error": str(e)}
        # raise HTTPException(status_code=500, detail=f"Error while querying Vector DB: {e}")

@app.get("/")
def read_root():
    return "RAG service listening at PORT 8002"