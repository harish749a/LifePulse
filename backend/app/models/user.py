from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    habits = relationship(
    "Habit",
    back_populates="user",
    cascade="all, delete-orphan"
    )

    meals = relationship(
        "Meal",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    water_logs = relationship(
        "WaterLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    workout_logs = relationship(
        "WorkoutLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    sleep_logs = relationship(
        "SleepLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    subscriptions = relationship(
        "Subscription",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    daily_scores = relationship(
        "DailyScore",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    settings = relationship(
        "UserSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    reminder_history = relationship(
        "ReminderHistory",
        back_populates="user",
        cascade="all, delete-orphan"
    ) 
    
    first_name = Column(String(100), nullable=False)

    last_name = Column(String(100), nullable=True)

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password = Column(String(255), nullable=False)

    phone = Column(
        String(20),
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )