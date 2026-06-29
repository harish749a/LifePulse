from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class WorkoutLog(Base, BaseModel, UserOwnedModel):

    __tablename__ = "workout_logs"

    workout_name = Column(
        String(100),
        nullable=False
    )

    duration_minutes = Column(
        Integer,
        nullable=False
    )

    calories_burned = Column(
        Integer,
        default=0
    )

    workout_date = Column(
        DateTime,
        nullable=False
    )

    notes = Column(
        String(255)
    )

    user = relationship(
        "User",
        back_populates="workout_logs"
    )