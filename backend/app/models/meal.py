from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class Meal(Base, BaseModel, UserOwnedModel):

    __tablename__ = "meals"

    meal_name = Column(
        String(100),
        nullable=False
    )

    meal_type = Column(
        String(30),
        nullable=False
    )

    calories = Column(
        Float,
        default=0
    )

    protein = Column(
        Float,
        default=0
    )

    carbs = Column(
        Float,
        default=0
    )

    fat = Column(
        Float,
        default=0
    )

    meal_time = Column(
        DateTime,
        nullable=False
    )

    notes = Column(
        String(255)
    )

    user = relationship(
        "User",
        back_populates="meals"
    )