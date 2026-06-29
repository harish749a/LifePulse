from sqlalchemy.orm import Session

from app.utils.reset_token import (
    generate_reset_token,
    verify_reset_token
)

from app.services.email_service import send_reset_email

from app.utils.security import hash_password
import asyncio

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, LoginRequest
from app.utils.security import hash_password, verify_password


class AuthService:

    @staticmethod
    def register(db: Session, user_data: UserCreate):

        existing = UserRepository.get_by_email(
            db,
            user_data.email
        )

        if existing:
            raise ValueError("Email already registered")

        user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            password=hash_password(user_data.password),
            phone=user_data.phone,
            is_active=True
        )

        return UserRepository.create(db, user)

    @staticmethod
    def login(db: Session, login_data: LoginRequest):

        user = UserRepository.get_by_email(
            db,
            login_data.email
        )

        if not user:
            return None

        if not verify_password(
            login_data.password,
            user.password
        ):
            return None

        return user
    
    @staticmethod
    def forgot_password(db, email: str):

        user = UserRepository.get_by_email(
            db,
            email
        )

        if not user:
            return

        token = generate_reset_token(user.email)

        reset_link = (
            f"http://localhost:8000/reset-password?token={token}"
        )

        asyncio.run(
            send_reset_email(
                user.email,
                reset_link
            )
        )


    @staticmethod
    def reset_password(
        db,
        token: str,
        new_password: str
    ):

        email = verify_reset_token(token)

        user = UserRepository.get_by_email(
            db,
            email
        )

        if not user:
            raise ValueError("User not found")

        user.password = hash_password(
            new_password
        )

        db.commit()

        db.refresh(user)

        return user