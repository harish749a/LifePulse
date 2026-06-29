from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class WaterLog(Base, BaseModel, UserOwnedModel):

    __tablename__ = "water_logs"

    quantity_ml = Column(
        Integer,
        nullable=False
    )

    logged_at = Column(
        DateTime,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="water_logs"
    )