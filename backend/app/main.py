# from fastapi import FastAPI, Depends
# from sqlalchemy.orm import Session

# from app.core.config import settings
# from app.db.dependencies import get_db

# app = FastAPI(
#     title=settings.APP_NAME,
#     version=settings.APP_VERSION
# )

# @app.get("/")
# def home():
#     return {
#         "application": settings.APP_NAME,
#         "version": settings.APP_VERSION,
#         "status": "Running Successfully 🚀"
#     }

# @app.get("/db-test")
# def database_test(db: Session = Depends(get_db)):
#     return {
#         "message": "Database session created successfully!"
#     }

from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.core.config import settings
from app.api.user import router as user_router
from app.core.logger import logger

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

logger.info("LifePulse API started successfully.")

app.include_router(auth_router)
app.include_router(user_router)

@app.get("/")
def home():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "Running Successfully 🚀"
    }


@app.get("/db-test")
def db_test():
    return {
        "message": "Database session created successfully!"
    }





# print(app.routes)