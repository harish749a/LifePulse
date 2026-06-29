from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.repositories.user_repository import UserRepository
from app.repositories.token_repository import TokenRepository
from app.utils.jwt_handler import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Check whether token is blacklisted
    if TokenRepository.is_blacklisted(db, token):
        raise HTTPException(
            status_code=401,
            detail="Token has been revoked"
        )

    payload = decode_access_token(token)

    user_id = payload.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = UserRepository.get_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user