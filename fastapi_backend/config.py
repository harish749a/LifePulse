import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "LifePulse API"
    API_V1_STR: str = ""
    
    # Secret keys for secure JWT signing
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production-9a8b7c6d5e")
    ALGORITHM: str = "HS256"
    
    # Token expiration in minutes
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database Settings: Default is standard sqlite file in the backend folder
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./lifepulse.db"
    )

    class Config:
        case_sensitive = True

settings = Settings()
