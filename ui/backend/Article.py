from fastapi import APIRouter,HTTPException, Query
from datetime import datetime, timedelta
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

@router.post("/articles/{article_id}/increment-views")
def increment_views(article_id: int):
    db: Session = SessionLocal()
    article = db.query(Article).filter(Article.article_id == article_id).first()
    if not article:
        db.close()
        raise HTTPException(status_code=404, detail="Article not found")

    article.views += 1
    db.commit()
    db.refresh(article)
    db.close()

    return {"article_id": article_id, "views": article.views}

@router.get("/articles/trending")
def get_trending_articles(
    search: str = Query(None, description="Search text"),
    category: str = Query(None, description="Filter by category"),
):
    db: Session = SessionLocal()
    cutoff = datetime.utcnow() - timedelta(hours=48)

    query = db.query(Article).filter(Article.created_at >= cutoff)

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

    articles = query.order_by(Article.views.desc()).limit(20).all()

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

@router.get("/articles/{article_id}", response_model=ArticleSchema)
def get_article_by_id(article_id: int):
    db: Session = SessionLocal()
    article = db.query(Article).filter(Article.article_id == article_id).first()
    if not article:
        db.close()
        raise HTTPException(status_code=404, detail="Article not found")
    
    sources=[]

    if article.references:
        for ref in article.references:
            sources.append({
                "reference_id": getattr(ref,"reference_id",None),
                "source_name": getattr(ref,"source_name",None),
                "source_url": getattr(ref,"source_url",None),
                "bias": getattr(ref,"bias",None)
            })    
    # Manually construct the result to include 'sources' as 'references'
    # The response_model will handle the conversion
    result = {
        "article_id": article.article_id,
        "title": article.title,
        "summary": article.summary,
        "category": article.category,
        "image_url": article.image_url,
        "left_bias": article.left_bias,
        "right_bias": article.right_bias,
        "center_bias": article.center_bias,
        "created_at": article.created_at,
        "views": article.views,
        "sources": article.references
    }

    db.close()
    return result
