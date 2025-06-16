from datetime import datetime
from typing import Optional, Dict, Any, Union, Tuple

from flask import jsonify
from pydantic import EmailStr, UUID4, Field, ValidationError, SecretStr
from werkzeug.security import generate_password_hash, check_password_hash

from .db import db
from .models import User
from .pydantic import PydanticBaseModel


class UserBaseModel(PydanticBaseModel):
    firstName: str = Field(min_length=3)
    lastName: str = Field(min_length=3)
    address: str = Field(min_length=3)
    city: str = Field(min_length=3)
    country: str = Field(min_length=3)
    phone: str = Field(min_length=3)


class UserResponseModel(UserBaseModel):
    id: UUID4
    email: EmailStr
    createdAt: datetime
    updatedAt: datetime


def user_to_response_dict(user: User) -> Dict[str, Any]:
    try:
        return UserResponseModel(
            id=user.id,
            email=user.email,
            firstName=user.first_name,
            lastName=user.last_name,
            address=user.address,
            city=user.city,
            country=user.country,
            phone=user.phone,
            createdAt=user.created_at,
            updatedAt=user.updated_at,
        ).model_dump()
    except ValidationError:
        raise ValueError("Failed to convert user model to response")


def get_user_by_id(user_id: UUID4) -> Tuple[Optional[User], Optional[Tuple[Dict, int]]]:
    user = db.session.get(User, user_id)
    if user is None:
        return None, ({"error": "User not found"}, 404)
    return user, None


def handle_validation_error(error: ValidationError) -> Tuple[Dict, int]:
    return {"error": "Validation error", "messages": error.errors()}, 400


def update_user_from_dict(user: User, data: Dict[str, Any]) -> None:
    if 'firstName' in data:
        user.first_name = data['firstName']
    if 'lastName' in data:
        user.last_name = data['lastName']
    if 'address' in data:
        user.address = data['address']
    if 'city' in data:
        user.city = data['city']
    if 'country' in data:
        user.country = data['country']
    if 'phone' in data:
        user.phone = data['phone']
    if 'password' in data and data['password']:
        if isinstance(data['password'], SecretStr):
            user.password = generate_password_hash(data['password'].get_secret_value())
        else:
            user.password = generate_password_hash(data['password'])


def check_user_credentials(email: str, password: str) -> Tuple[Optional[User], Optional[Tuple[Dict, int]]]:
    user = db.session.query(User).filter_by(email=email).first()
    if user is None or not check_password_hash(user.password, password):
        return None, ({"error": "Invalid email or password"}, 401)
    return user, None

__all__ = [
    "UserBaseModel",
    "UserResponseModel",
    "user_to_response_dict",
    "get_user_by_id",
    "handle_validation_error",
    "update_user_from_dict",
    "check_user_credentials",
]
