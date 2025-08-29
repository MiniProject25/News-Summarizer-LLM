from fastapi import FastAPI
from Article import router as article_router
from Category import router as category_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include your routers
app.include_router(article_router)
app.include_router(category_router)

