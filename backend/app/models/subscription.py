from sqlalchemy import Column, String, Float, Date
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel
from app.models.user_owned_model import UserOwnedModel


class Subscription(Base, BaseModel, UserOwnedModel):

    __tablename__ = "subscriptions"

    plan_name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    status = Column(String(20), default="ACTIVE")

    user = relationship("User", back_populates="subscriptions")

    bills = relationship(
        "Bill",
        back_populates="subscription",
        cascade="all, delete-orphan"
    )