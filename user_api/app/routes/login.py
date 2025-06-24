from flask import Blueprint, jsonify, request
from pydantic import ValidationError, EmailStr, SecretStr, Field

from ..auth.jwt import generate_jwt
from ..core.pydantic import PydanticBaseModel
from ..core.user_service import check_user_credentials, handle_validation_error

login_blueprint = Blueprint("login_routes", __name__)


class LoginRequest(PydanticBaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)


class LoginResponse(PydanticBaseModel):
    token: str


@login_blueprint.route("/login", methods=["POST"])
def login():
    try:
        data = LoginRequest.model_validate(request.json)
    except ValidationError as e:
        error_response = handle_validation_error(e)
        return jsonify(error_response[0]), error_response[1]

    user, error_response = check_user_credentials(
        data.email, data.password.get_secret_value()
    )
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    token = generate_jwt(str(user.id))

    try:
        response = LoginResponse(token=token).model_dump()
    except ValidationError:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(response), 200


__all__ = ["login_blueprint"]
