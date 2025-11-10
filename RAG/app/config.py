from dotenv import load_dotenv
import os

load_dotenv()

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
EMBED_MODEL_NAME = os.getenv("EMBED_MODEL_NAME")
SUMMARY_API_URL = os.getenv("SUMMARIZER_URL")
