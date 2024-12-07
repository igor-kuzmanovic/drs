from uuid import uuid4

from flask import Blueprint, jsonify, request

from .jwt import generate_jwt
from ..core.models import PydanticBaseModel

auth_blueprint = Blueprint("auth_routes", __name__)


class LoginRequest(PydanticBaseModel):
    email: str
    password: str


class LoginResponse(PydanticBaseModel):
    token: str


@auth_blueprint.route("/login", methods=["POST"])
def login():
    # Validate the incoming data
    data = LoginRequest.model_validate(request.json)

    # Here we would validate the user's credentials
    user_id = str(uuid4())

    # Generate a JWT token
    token = generate_jwt(user_id)

    # Create a response object
    response = LoginResponse(
        token=token
    ).model_dump()

    return jsonify(response), 200


__all__ = [
    'auth_blueprint'
]
