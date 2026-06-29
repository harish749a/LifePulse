from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base_model import BaseModel


class Bill(Base, BaseModel):

    __tablename__ = "bills"

    subscription_id = Column(
        Integer,
        ForeignKey("subscriptions.id"),
        nullable=False,
        index=True
    )

    amount = Column(Float, nullable=False)

    payment_status = Column(
        String(20),
        default="PENDING"
    )

    payment_date = Column(Date)

    invoice_number = Column(
        String(100),
        unique=True
    )

    subscription = relationship(
        "Subscription",
        back_populates="bills"
    )