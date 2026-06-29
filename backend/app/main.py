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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LifePulse API")

# Configure CORS Middleware
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://ais-dev-tnldsraq7ylueah4c53rim-750828073918.asia-southeast1.run.app", # Your Dev App
    "https://ais-pre-tnldsraq7ylueah4c53rim-750828073918.asia-southeast1.run.app", # Your Shared App
    "*" # Set to "*" during development to allow all connections
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
