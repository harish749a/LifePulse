from pydantic import BaseModel, EmailStr
from pydantic import BaseModel

class UserCreate(BaseModel):

    first_name: str

    last_name: str | None = None

    email: EmailStr

    password: str

    phone: str | None = None

# Response Schema
class UserResponse(BaseModel):

    id: int

    first_name: str

    last_name: str | None = None

    email: EmailStr

    phone: str | None = None

    is_active: bool

    class Config:
        from_attributes = True

# Login Schema

class LoginRequest(BaseModel):

    email: EmailStr

    password: str

# JWT Response

# class Token(BaseModel):

#     access_token: str

#     token_type: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class LogoutRequest(BaseModel):
    token: str

from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# class LogoutRequest(BaseModel):
#     token: str


# class RefreshTokenRequest(BaseModel):
#     refresh_token: str
