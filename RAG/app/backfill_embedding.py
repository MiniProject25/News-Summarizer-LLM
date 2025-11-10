from embedder import embed_article, model, collection
import logging

logging.basicConfig(level=logging.INFO)

def backfill():
    # fetch all ids and docs
    data = collection.get(include=["documents", "embeddings"])
    ids = data.get("ids", [])
    docs = data.get("documents", [])
    existing_embs = data.get("embeddings", [])

    total = len(ids)
    logging.info(f"Found {total} docs in vector store")

    for i, doc_id in enumerate(ids):
        doc = docs[i]
        emb = existing_embs[i]

        if emb is None or len(emb) == 0:
            # if embedding is missing
            if not doc:
                logging.warning(f"No text for {doc_id}, skipping")
                continue

            logging.info(f"Generating embedding for {doc_id}")
            emb_list = model.encode(doc).to_list()

            collection.add(
                ids=[doc_id],
                documents=[doc],
                embeddings=[emb_list],
                metadatas=[{}]
            )

if __name__ == "__main__":
    backfill()
