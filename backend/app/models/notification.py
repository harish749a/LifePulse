from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class Notification(Base, BaseModel, UserOwnedModel):

    __tablename__ = "notifications"

    title = Column(String(150), nullable=False)

    message = Column(String(500), nullable=False)

    notification_type = Column(String(50))

    is_read = Column(Boolean, default=False)

    user = relationship(
        "User",
        back_populates="notifications"
    )