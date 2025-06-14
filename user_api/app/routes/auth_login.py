from .jwt import generate_jwt
from ..core.db import db
from ..core.models import User
from ..core.pydantic import PydanticBaseModel
from flask import Blueprint, jsonify, request
from pydantic import ValidationError, EmailStr, SecretStr, Field
from werkzeug.security import check_password_hash

auth_login_blueprint = Blueprint("auth_login_routes", __name__)


class LoginRequest(PydanticBaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)


class LoginResponse(PydanticBaseModel):
    token: str


@auth_login_blueprint.route("/auth/login", methods=["POST"])
def login():
    # Validate the incoming data
    try:
        data = LoginRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    # Check if the user exists and the password is correct
    user = db.session.query(User).filter_by(email=data.email).first()
    if user is None or not check_password_hash(
        user.password, data.password.get_secret_value()
    ):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate a JWT token
    token = generate_jwt(str(user.id))

    # Create a response object
    try:
        response = LoginResponse(token=token).model_dump()
    except ValidationError:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(response), 200


__all__ = ["auth_login_blueprint"]
