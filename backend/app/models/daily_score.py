from sqlalchemy import Column, Integer, Date
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class DailyScore(Base, BaseModel, UserOwnedModel):

    __tablename__ = "daily_scores"

    water_score = Column(Integer, default=0)

    nutrition_score = Column(Integer, default=0)

    activity_score = Column(Integer, default=0)

    sleep_score = Column(Integer, default=0)

    overall_score = Column(Integer, default=0)

    score_date = Column(Date, nullable=False)

    user = relationship(
        "User",
        back_populates="daily_scores"
    )