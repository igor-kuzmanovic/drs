import requests
from flask import Blueprint, jsonify, request, current_app
from pydantic import ValidationError, EmailStr, SecretStr, Field
from werkzeug.security import check_password_hash

from .jwt import generate_jwt
from ..core.db import db
from ..core.models import User
from ..core.pydantic import PydanticBaseModel

auth_blueprint = Blueprint("auth_routes", __name__)


class LoginRequest(PydanticBaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)


class LoginResponse(PydanticBaseModel):
    token: str


@auth_blueprint.route("/login", methods=["POST"])
def login():
    # Validate the incoming data
    try:
        data = LoginRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    # Check if the user exists and the password is correct
    user = db.session.query(User).filter_by(email=data.email).first()
    if user is None or not check_password_hash(user.password, data.password.get_secret_value()):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate a JWT token
    token = generate_jwt(str(user.id))

    # Create a response object
    try:
        response = LoginResponse(token=token).model_dump_json()
    except ValidationError:
        return jsonify({"error": "Internal server error"}), 500

    # TODO Remove this, just testing the email API
    try:
        email_api_response = requests.post(
            f"{current_app.config.get("EMAIL_API_URL")}/api/send",
            json={
                "from": "api@surveymaster.com",
                "to": "email.api@surveymaster.com",
                "subject": "New login",
                "body": f"The user <b>{user.first_name} {user.last_name}</b> logged in."
            },
            headers={
                "Authorization": f"Bearer {current_app.config.get("EMAIL_API_KEY")}"
            })
        email_api_response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

    return response, 200


__all__ = ["auth_blueprint"]
