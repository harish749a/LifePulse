from dotenv import load_dotenv
import os

load_dotenv()


class Settings:

    # ==========================================
    # Application
    # ==========================================
    APP_NAME = os.getenv("APP_NAME")
    APP_VERSION = os.getenv("APP_VERSION")

    # ==========================================
    # Database
    # ==========================================
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    # ==========================================
    # JWT
    # ==========================================
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    # ==========================================
    # Email
    # ==========================================
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_FROM = os.getenv("MAIL_FROM")
    MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True") == "True"
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False") == "True"

    # ===============Token expiry==============
    REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7")
)


settings = Settings()