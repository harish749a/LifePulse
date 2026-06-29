from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class UserSettings(Base, BaseModel, UserOwnedModel):

    __tablename__ = "user_settings"

    language = Column(String(20), default="English")

    theme = Column(String(20), default="Light")

    timezone = Column(String(50), default="Asia/Kolkata")

    notification_enabled = Column(Boolean, default=True)

    user = relationship(
        "User",
        back_populates="settings"
    )