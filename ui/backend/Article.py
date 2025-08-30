from fastapi import APIRouter,HTTPException
from sqlalchemy.orm import Session
from db_connection import SessionLocal, Article, ArticleSchema

router = APIRouter()

@router.get("/articles/", response_model=list[ArticleSchema])
def get_articles():
    db: Session = SessionLocal()
    articles = db.query(Article).all()

    # convert SQLAlchemy objects to dict + attach references
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
            "sources": a.references   # ✅ automatically fetched
        })

    db.close()
    return result

@router.post("/articles/{article_id}/increment_view")
def increment_view(article_id: int):
    db: Session = SessionLocal()
    article = db.query(Article).filter(Article.article_id == article_id).first()
    if not article:
        db.close()
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment the views
    article.views += 1
    db.commit()
    db.refresh(article)
    db.close()

    return {"views": article.views}