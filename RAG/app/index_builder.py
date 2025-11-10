# import chromadb
# from chromadb.config import Settings    

# # custom imports
# from chunker import simpleChunk
# from embedder import embed_article
# from config import CHROMA_DB_PATH, COLLECTION_NAME

# client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory=CHROMA_DB_PATH))

# collection = client.get_or_create_collection(COLLECTION_NAME)

# def add_article_to_vector_db(article_id: str, title: str, content: str):
#     chunks = simpleChunk(content)
#     embeddings = [embed_article(chunk) for chunk in chunks]

#     ids = [f"{article_id}_{i}" for i in range(len(chunks))]
#     metadata = [{"article_id": article_id, "title": title} for _ in chunks]

#     collection.add(
#         documents=chunks,
#         embeddings=embeddings,
#         ids=ids,
#         metadatas=metadata
#     )

#     return {"status" : "ok", "chunks": len(chunks)}
