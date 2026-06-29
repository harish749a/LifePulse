from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class SleepLog(Base, BaseModel, UserOwnedModel):

    __tablename__ = "sleep_logs"

    sleep_start = Column(
        DateTime,
        nullable=False
    )

    sleep_end = Column(
        DateTime,
        nullable=False
    )

    sleep_duration = Column(
        Integer,
        nullable=False
    )

    sleep_quality = Column(
        Integer
    )

    user = relationship(
        "User",
        back_populates="sleep_logs"
    )