from datetime import datetime
from typing import Self

from flask import Blueprint, request, jsonify
from pydantic import ValidationError, EmailStr, SecretStr, Field, model_validator
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from ..core.db import db
from ..core.models import User
from ..core.pydantic import PydanticBaseModel
from ..core.user_service import UserBaseModel, user_to_response_dict, handle_validation_error

user_post_blueprint = Blueprint("user_post_routes", __name__)


class UserPostRequest(UserBaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)
    passwordConfirm: SecretStr = Field(min_length=8)

    @model_validator(mode="after")
    def check_passwords_match(self) -> Self:
        if (
            self.password is not None
            and self.passwordConfirm is not None
            and self.password.get_secret_value()
            != self.passwordConfirm.get_secret_value()
        ):
            raise ValueError("passwords do not match")
        return self


@user_post_blueprint.route("/users", methods=["POST"])
def user_post():
    try:
        data = UserPostRequest.model_validate(request.json)
    except ValidationError as e:
        error_response = handle_validation_error(e)
        return jsonify(error_response[0]), error_response[1]

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

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "User with this email already exists"}), 400

    try:
        response = user_to_response_dict(user)
    except ValueError:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(response), 201


__all__ = ["user_post_blueprint"]
