from sentence_transformers import SentenceTransformer
import chromadb
from chunker import prepared_chunks
from config import COLLECTION_NAME, EMBED_MODEL_NAME, CHROMA_DB_PATH
import logging

model = SentenceTransformer(EMBED_MODEL_NAME)

client = chromadb.Client()
vector_store = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = vector_store.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"}  # optional but recommended
)

def embed_text(text: str):
    return model.encode(text).tolist()

def embed_article(article_id: int, content: str, title: str, url: str, category: str = None, date: str = None):
    logging.warning("ENTERING **EMBED_ARTICLE**")
    try:
        if not content or not content.strip():
            logging.warning(f"Skipping article {article_id} for embedding")
            return 

        chunks, metaList = prepared_chunks(
            article_id=article_id,
            title=title,
            category=category,
            date=date,
            text=content
        )

        for idx, chunk in enumerate(chunks):
            chunk_id = f"{article_id}_chunk_{idx}"
            emb_list = embed_text(chunk)
            collection.add(
                ids=[chunk_id],
                documents=[chunk],
                metadatas=[metaList[idx]],
                embeddings=[emb_list]
            )

        # collection.persist()
        logging.warning(f"Stored {len(chunks)} chunks for article {article_id}")
        logging.warning("EXITING **EMBED_ARTICLE**")
    except Exception as e:
        logging.exception(f"Exception while embedding: {e}")
        raise