from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class Habit(Base, BaseModel, UserOwnedModel):

    __tablename__ = "habits"

    title = Column(
        String(100),
        nullable=False
    )

    description = Column(
        String(255)
    )

    habit_type = Column(
        String(50)
    )

    target_value = Column(
        Integer
    )

    unit = Column(
        String(20)
    )

    frequency = Column(
        String(20)
    )

    is_active = Column(
        Boolean,
        default=True
    )

    user = relationship(
        "User",
        back_populates="habits"
    )