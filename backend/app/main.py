from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.dependencies import get_db

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

@app.get("/")
def home():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "Running Successfully 🚀"
    }

@app.get("/db-test")
def database_test(db: Session = Depends(get_db)):
    return {
        "message": "Database session created successfully!"
    }