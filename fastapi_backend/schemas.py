from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefreshRequest(BaseModel):
    refresh_token: str


# Habit Schemas
class HabitBase(BaseModel):
    title: str
    description: Optional[str] = ""
    habit_type: Optional[str] = "health"
    target_value: Optional[int] = 1
    unit: Optional[str] = "times"
    frequency: Optional[str] = "daily"
    is_active: Optional[bool] = True

class HabitCreate(HabitBase):
    pass

class HabitResponse(HabitBase):
    id: int
    user_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


# WaterLog Schemas
class WaterLogBase(BaseModel):
    quantity_ml: int
    logged_at: Optional[datetime.datetime] = None

class WaterLogCreate(WaterLogBase):
    pass

class WaterLogResponse(WaterLogBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# WorkoutLog Schemas
class WorkoutLogBase(BaseModel):
    workout_name: str
    duration_minutes: Optional[int] = 0
    calories_burned: Optional[int] = 0
    workout_date: Optional[datetime.datetime] = None
    notes: Optional[str] = ""

class WorkoutLogCreate(WorkoutLogBase):
    pass

class WorkoutLogResponse(WorkoutLogBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# Meal Schemas
class MealBase(BaseModel):
    meal_name: str
    meal_type: str
    calories: Optional[float] = 0.0
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fat: Optional[float] = 0.0
    meal_time: Optional[datetime.datetime] = None
    notes: Optional[str] = ""

class MealCreate(MealBase):
    pass

class MealResponse(MealBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# DailyScore Schemas
class DailyScoreBase(BaseModel):
    water_score: Optional[int] = 0
    nutrition_score: Optional[int] = 0
    activity_score: Optional[int] = 0
    sleep_score: Optional[int] = 0
    overall_score: Optional[int] = 0
    score_date: Optional[datetime.date] = None

class DailyScoreCreate(DailyScoreBase):
    pass

class DailyScoreResponse(DailyScoreBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# Password Reset Schemas
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
