from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class ReminderHistory(Base, BaseModel, UserOwnedModel):

    __tablename__ = "reminder_history"

    reminder_type = Column(String(50))

    status = Column(String(30))

    sent_at = Column(DateTime)

    user = relationship(
        "User",
        back_populates="reminder_history"
    )