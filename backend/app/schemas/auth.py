from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):

    username: str
    email: EmailStr
    password: str = Field(
        ...,
        min_length=6,
        max_length=72,
        description="Password must be 6-72 characters for bcrypt compatibility"
    )


class LoginRequest(BaseModel):

    email: EmailStr
    password: str = Field(
        ...,
        min_length=6,
        max_length=72
    )


class UserResponse(BaseModel):

    id: int
    username: str
    email: EmailStr
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class TokenResponse(BaseModel):

    access_token: str
    token_type: str