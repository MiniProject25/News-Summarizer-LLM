from fastapi import APIRouter,HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from db_connection import SessionLocal, Article, ArticleSchema

router = APIRouter()

@router.get("/articles/", response_model=list[ArticleSchema])
def get_articles(
    search: str = Query(None, description="Search text"),
    category: str = Query(None, description="Filter by category"),
):
    db: Session = SessionLocal()
    query = db.query(Article)

    # ✅ filter by category
    if category and category.lower() != "all":
        query = query.filter(Article.category == category)

    # ✅ search in title, summary, or sources
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                Article.title.ilike(search_term),
                Article.summary.ilike(search_term),
                Article.category.ilike(search_term),
            )
        )

    articles = query.order_by(Article.created_at.desc()).all()

    result = []
    for a in articles:
        result.append({
            "article_id": a.article_id,
            "title": a.title,
            "summary": a.summary,
            "category": a.category,
            "image_url": a.image_url,
            "left_bias": a.left_bias,
            "right_bias": a.right_bias,
            "center_bias": a.center_bias,
            "created_at": a.created_at,
            "views": a.views,
            "sources": a.references
        })

    db.close()
    return result
