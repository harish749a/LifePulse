from sqlalchemy import Column, String, Boolean

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    first_name = Column(String(100), nullable=False)

    last_name = Column(String(100), nullable=True)

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password = Column(String(255), nullable=False)

    phone = Column(
        String(20),
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )