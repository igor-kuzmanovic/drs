from datetime import datetime
from typing import Self

from flask import Blueprint, request, jsonify
from pydantic import ValidationError, EmailStr, UUID4, SecretStr, Field, model_validator
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from ..core.db import db
from ..core.models import User
from ..core.pydantic import PydanticBaseModel

users_blueprint = Blueprint("users_routes", __name__)


class PostUserRequest(PydanticBaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)
    passwordConfirm: SecretStr = Field(min_length=8)
    firstName: str = Field(min_length=3)
    lastName: str = Field(min_length=3)
    address: str = Field(min_length=3)
    city: str = Field(min_length=3)
    country: str = Field(min_length=3)
    phone: str = Field(min_length=3)

    @model_validator(mode='after')
    def check_passwords_match(self) -> Self:
        if self.password is not None and self.passwordConfirm is not None and self.password.get_secret_value() != self.passwordConfirm.get_secret_value():
            raise ValueError('passwords do not match')
        return self


class PostUserResponse(PydanticBaseModel):
    id: UUID4
    email: EmailStr
    firstName: str = Field(min_length=3)
    lastName: str = Field(min_length=3)
    address: str = Field(min_length=3)
    city: str = Field(min_length=3)
    country: str = Field(min_length=3)
    phone: str = Field(min_length=3)
    createdAt: datetime
    updatedAt: datetime


@users_blueprint.route("", methods=["POST"])
def post():
    # Validate the incoming data
    try:
        data = PostUserRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    # Create a new user object
    user = User(
        email=data.email,
        password=generate_password_hash(data.password.get_secret_value()),
        first_name=data.firstName,
        last_name=data.lastName,
        address=data.address,
        city=data.city,
        country=data.country,
        phone=data.phone,
    )

    # Add the user to the session and commit
    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()

        return jsonify({"error": "User with this email already exists"}), 400

    # Create a response object
    try:
        response = PostUserResponse(
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
        ).model_dump_json()
    except ValidationError:
        return jsonify({"error": "Internal server error"}), 500

    return response, 201


__all__ = ["users_blueprint"]
