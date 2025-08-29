from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# ---------------- DB CONNECTION ----------------
DATABASE_URL = "postgresql://postgres:1@localhost/newsInfo"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# ---------------- SQLALCHEMY MODEL ----------------
class Article(Base):
    __tablename__ = "articles"
    article_id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    summary = Column(Text)
    category = Column(String(100))
    image_url = Column(Text)
    left_bias = Column(Integer)
    right_bias = Column(Integer)
    center_bias = Column(Integer)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    views = Column(Integer, default=0)

# ---------------- Pydantic SCHEMA ----------------
class ArticleSchema(BaseModel):
    article_id: int
    title: str
    summary: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    left_bias: Optional[int] = None
    right_bias: Optional[int] = None
    center_bias: Optional[int] = None
    created_at: datetime
    views: int

    class Config:
        from_attributes = True  # Pydantic v2
