from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import LoginRequest, Token
from app.utils.jwt_handler import create_access_token
from app.db.dependencies import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.schemas.password import (
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.utils.jwt_handler import (
    create_access_token,
    create_refresh_token,
    verify_token
)
from app.schemas.user import (
    UserCreate,
    UserResponse,
    LoginRequest,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    LogoutRequest,
    RefreshTokenRequest,
)
from app.schemas.user import LogoutRequest
from app.repositories.token_repository import TokenRepository


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    try:
        return AuthService.register(db, user)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.post(
    "/login",
    response_model=Token
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = AuthService.login(
        db,
        login_data
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # token = create_access_token(
    #     {
    #         "sub": user.email,
    #         "user_id": user.id
    #     }
    # )
    access_token = create_access_token(
        {
            "sub": user.email,
            "user_id": user.id
        }
    )

    refresh_token = create_refresh_token(
        {
            "sub": user.email,
            "user_id": user.id
        }
    )

    # return {
    #     "access_token": token,
    #     "token_type": "bearer"
    # }
    return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer"
    }  

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    AuthService.forgot_password(
        db,
        request.email
    )

    return {
        "message":
        "If the email exists, a password reset link has been sent."
    }

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    try:

        AuthService.reset_password(
            db,
            request.token,
            request.new_password
        )

        return {
            "message":
            "Password reset successful."
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post(
    "/refresh",
    response_model=Token
)
def refresh_token(
    request: RefreshTokenRequest
):
    payload = verify_token(
        request.refresh_token
    )

    access_token = create_access_token(
        {
            "sub": payload["sub"],
            "user_id": payload["user_id"]
        }
    )

    refresh_token = create_refresh_token(
        {
            "sub": payload["sub"],
            "user_id": payload["user_id"]
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(
    request: LogoutRequest,
    db: Session = Depends(get_db)
):
    TokenRepository.blacklist(
        db,
        request.token
    )

    return {
        "message": "Logged out successfully."
    }