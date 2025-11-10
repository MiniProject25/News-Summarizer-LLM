import logging
from config import COLLECTION_NAME, CHROMA_DB_PATH
import chromadb
from sentence_transformers import CrossEncoder
import numpy as np

client = chromadb.Client()
vector_store = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = vector_store.get_or_create_collection(name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-12-v2")

def retrieve_similar_articles(article_id: str, top_k: int = 5):
    logging.warning(f"Querying for similar articles (id={article_id})")

    if not article_id:
        return []

    article_id = str(article_id)

    # fetch metadata & docs for the article
    doc = collection.get(
        where={"article_id": article_id},
        include=["embeddings", "metadatas"]
    )
    
    embs = doc.get("embeddings")
    if embs is None or len(embs) == 0 or embs[0] is None:
        raise ValueError(f"No embedding found for article_id={article_id}")
    
    embedding = embs[0]

    query_meta = doc["metadatas"][0]
    query_text = query_meta["full_text"]

    # search with that embedding (similarity search)
    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k * 4,   # extra 1 so we can drop the source article
    )

    # ids = results["ids"][0]
    metas = results["metadatas"][0]

    # collect candidate texts
    candidates = []
    for meta in metas:
        aid = str(meta["article_id"])
        if aid == article_id:
            continue
        candidates.append(meta)

    if not candidates:
        return []

    # building reranker pairs (query, candidate)
    pairs = [(query_text, c["full_text"]) for c in candidates]

    # cross-encoder scores
    scores = reranker.predict(pairs)

    # sort candidates by reranker score
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)

    related_articles = []
    for meta, _score in ranked:
        aid = str(meta["article_id"])
        if aid not in related_articles:
            related_articles.append(aid)
            if len(related_articles) >= top_k:
                break

    return [int(x) for x in related_articles]