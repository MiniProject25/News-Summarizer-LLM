from fastapi import APIRouter
from sqlalchemy.orm import Session
from db_connection import SessionLocal, Article, ArticleSchema

router = APIRouter()

@router.get("/articles/", response_model=list[ArticleSchema])
def get_articles():
    db: Session = SessionLocal()
    articles = db.query(Article).all()
    db.close()
    return articles
