from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

# ---------------- DB CONNECTION ----------------
DATABASE_URL = "postgresql://postgres:1@localhost/newsInfo"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# ---------------- SQLALCHEMY MODELS ----------------
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

    # relationship with references
    references = relationship("ArticleReference", back_populates="article")


class ArticleReference(Base):
    __tablename__ = "article_references"
    reference_id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.article_id"), nullable=False)
    source_url = Column(Text)
    published_date = Column(Date)
    source_name = Column(String(150))
    bias = Column(String(20))

    article = relationship("Article", back_populates="references")


# ---------------- Pydantic SCHEMAS ----------------
class ArticleReferenceSchema(BaseModel):
    reference_id: int
    article_id: int
    source_url: Optional[str] = None
    published_date: Optional[datetime] = None
    source_name: Optional[str] = None
    bias: Optional[str] = None

    class Config:
        from_attributes = True


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
    sources: List[ArticleReferenceSchema] = []   # ✅ include sources

    class Config:
        from_attributes = True
