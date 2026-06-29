import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict

from config import settings
from database import engine, Base, get_db
import models
import schemas
import auth

# Auto-create all tables on app startup for maximum simplicity
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend services for LifePulse health optimizer. Integrated with PostgreSQL / SQLite.",
    version="1.0.0"
)

# Loose CORS configuration to support local development (Flutter web, simulator, physical phone)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "LifePulse FastAPI Backend",
        "message": "Welcome! Use /docs for interactive Swagger API testing. 🚀"
    }


@app.get("/db-test")
def test_database(db: Session = Depends(get_db)):
    """
    Diagnostic heartbeat ping ensuring SQLAlchemy and SQLite/PostgreSQL are active.
    """
    try:
        # Evaluate connection with simple SELECT 1 statement
        db.execute(text("SELECT 1"))
        return {
            "success": True,
            "message": "Connected to FastAPI & database successfully! 🚀"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Database Connection Failure: {str(e)}"
        }


# --- AUTHENTICATION ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email is already taken
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account is already registered with this email address."
        )
    
    # Hash password and store user
    hashed_password = auth.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # Look up user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate secure access and refresh tokens
    access_token = auth.create_access_token(data={"sub": user.email})
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@app.post("/auth/refresh", response_model=schemas.Token)
def refresh_token(payload: schemas.TokenRefreshRequest, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token.",
    )
    try:
        decoded_payload = auth.jwt.decode(
            payload.refresh_token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        email: str = decoded_payload.get("sub")
        token_type: str = decoded_payload.get("type")
        
        if email is None or token_type != "refresh":
            raise credentials_exception
    except auth.JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
        
    new_access = auth.create_access_token(data={"sub": user.email})
    new_refresh = auth.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer"
    }


@app.post("/auth/logout")
def logout():
    # Simple stateless success notification
    return {"message": "Logged out successfully from session state."}


@app.post("/auth/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        # Return generic success to prevent account enumeration scanning
        return {"message": "If the email exists, a password reset link has been sent to your inbox."}
    
    # Create simple mock recovery token
    demo_token = f"DEMO_RESET_{user.id}_SECRET"
    return {
        "message": "If the email exists, a password reset link has been sent to your inbox.",
        "debug_demo_token": demo_token  # Helper for developer convenience
    }


@app.post("/auth/reset-password")
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    # Parse mock recovery token format
    if not payload.token.startswith("DEMO_RESET_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )
        
    try:
        user_id_str = payload.token.split("_")[2]
        user_id = int(user_id_str)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Malformed password reset token."
        )
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with this token could not be found."
        )
        
    # Update password
    user.hashed_password = auth.get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password successfully updated in your database! Please login."}


# --- USER PROFILE & CORE SYNC ENDPOINTS ---

@app.get("/users/me", response_model=schemas.UserResponse)
def get_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.post("/habits", response_model=schemas.HabitResponse)
def create_habit(
    habit: schemas.HabitCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    new_habit = models.Habit(
        user_id=current_user.id,
        title=habit.title,
        description=habit.description,
        habit_type=habit.habit_type,
        target_value=habit.target_value,
        unit=habit.unit,
        frequency=habit.frequency,
        is_active=habit.is_active
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit


@app.get("/habits", response_model=List[schemas.HabitResponse])
def get_habits(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    return db.query(models.Habit).filter(models.Habit.user_id == current_user.id).all()


@app.post("/water-logs", response_model=schemas.WaterLogResponse)
def log_water(
    log: schemas.WaterLogCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    logged_time = log.logged_at or datetime.datetime.utcnow()
    new_log = models.WaterLog(
        user_id=current_user.id,
        quantity_ml=log.quantity_ml,
        logged_at=logged_time
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@app.get("/water-logs", response_model=List[schemas.WaterLogResponse])
def get_water_logs(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    return db.query(models.WaterLog).filter(models.WaterLog.user_id == current_user.id).order_by(models.WaterLog.logged_at.desc()).all()


@app.post("/workout-logs", response_model=schemas.WorkoutLogResponse)
def log_workout(
    log: schemas.WorkoutLogCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    workout_date = log.workout_date or datetime.datetime.utcnow()
    new_log = models.WorkoutLog(
        user_id=current_user.id,
        workout_name=log.workout_name,
        duration_minutes=log.duration_minutes,
        calories_burned=log.calories_burned,
        workout_date=workout_date,
        notes=log.notes
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@app.get("/workout-logs", response_model=List[schemas.WorkoutLogResponse])
def get_workout_logs(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    return db.query(models.WorkoutLog).filter(models.WorkoutLog.user_id == current_user.id).order_by(models.WorkoutLog.workout_date.desc()).all()


@app.post("/meals", response_model=schemas.MealResponse)
def create_meal(
    meal: schemas.MealCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    meal_time = meal.meal_time or datetime.datetime.utcnow()
    new_meal = models.Meal(
        user_id=current_user.id,
        meal_name=meal.meal_name,
        meal_type=meal.meal_type,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat,
        meal_time=meal_time,
        notes=meal.notes
    )
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    return new_meal


@app.get("/meals", response_model=List[schemas.MealResponse])
def get_meals(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    return db.query(models.Meal).filter(models.Meal.user_id == current_user.id).order_by(models.Meal.meal_time.desc()).all()


@app.post("/daily-scores", response_model=schemas.DailyScoreResponse)
def create_daily_score(
    score: schemas.DailyScoreCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    score_date = score.score_date or datetime.date.today()
    
    # Upsert score_date so we only have 1 overall score entry per day per user
    existing_score = db.query(models.DailyScore).filter(
        models.DailyScore.user_id == current_user.id,
        models.DailyScore.score_date == score_date
    ).first()
    
    if existing_score:
        existing_score.water_score = score.water_score
        existing_score.nutrition_score = score.nutrition_score
        existing_score.activity_score = score.activity_score
        existing_score.sleep_score = score.sleep_score
        existing_score.overall_score = score.overall_score
        db.commit()
        db.refresh(existing_score)
        return existing_score
        
    new_score = models.DailyScore(
        user_id=current_user.id,
        water_score=score.water_score,
        nutrition_score=score.nutrition_score,
        activity_score=score.activity_score,
        sleep_score=score.sleep_score,
        overall_score=score.overall_score,
        score_date=score_date
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score


@app.get("/daily-scores", response_model=List[schemas.DailyScoreResponse])
def get_daily_scores(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    return db.query(models.DailyScore).filter(models.DailyScore.user_id == current_user.id).order_by(models.DailyScore.score_date.desc()).all()
