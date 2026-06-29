from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date, ForeignKey, func
from sqlalchemy.orm import relationship
import datetime

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    habits = relationship("Habit", back_populates="owner", cascade="all, delete-orphan")
    water_logs = relationship("WaterLog", back_populates="owner", cascade="all, delete-orphan")
    workout_logs = relationship("WorkoutLog", back_populates="owner", cascade="all, delete-orphan")
    meals = relationship("Meal", back_populates="owner", cascade="all, delete-orphan")
    daily_scores = relationship("DailyScore", back_populates="owner", cascade="all, delete-orphan")


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    habit_type = Column(String, default="health")  # e.g. health, tech, mindfulness
    target_value = Column(Integer, default=1)
    unit = Column(String, default="times")
    frequency = Column(String, default="daily")  # e.g. Mon,Tue,Wed
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    owner = relationship("User", back_populates="habits")


class WaterLog(Base):
    __tablename__ = "water_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quantity_ml = Column(Integer, nullable=False)
    logged_at = Column(DateTime, default=func.now())

    owner = relationship("User", back_populates="water_logs")


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    workout_name = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=0)
    calories_burned = Column(Integer, default=0)
    workout_date = Column(DateTime, default=func.now())
    notes = Column(String, default="")

    owner = relationship("User", back_populates="workout_logs")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    meal_name = Column(String, nullable=False)
    meal_type = Column(String, nullable=False)  # e.g. breakfast, lunch, dinner
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    meal_time = Column(DateTime, default=func.now())
    notes = Column(String, default="")

    owner = relationship("User", back_populates="meals")


class DailyScore(Base):
    __tablename__ = "daily_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    water_score = Column(Integer, default=0)
    nutrition_score = Column(Integer, default=0)
    activity_score = Column(Integer, default=0)
    sleep_score = Column(Integer, default=0)
    overall_score = Column(Integer, default=0)
    score_date = Column(Date, default=datetime.date.today, unique=True)

    owner = relationship("User", back_populates="daily_scores")
