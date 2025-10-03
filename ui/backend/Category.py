from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from db_connection import SessionLocal, Article

router = APIRouter()

@router.get("/categories/")
def get_categories():
    db: Session = SessionLocal()
    categories = db.query(distinct(Article.category)).all()
    db.close()
    return [c[0] for c in categories if c[0] is not None]
