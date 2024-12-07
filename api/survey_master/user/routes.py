from datetime import datetime

from flask import Blueprint, jsonify
from pydantic import field_serializer

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db_session
from ..core.models import PydanticBaseModel, User

user_blueprint = Blueprint("user_routes", __name__)


class GetUserResponse(PydanticBaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    address: str
    city: str
    country: str
    phone: str
    createdAt: datetime
    updatedAt: datetime

    @field_serializer("createdAt", "updatedAt", when_used="unless-none")
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()


@validate_token
@user_blueprint.route("", methods=["GET"])
def get():
    # Get the user ID from the token
    if not (user_id := get_user_id_from_token()):
        return {"error": "Invalid token."}, 401

    # Get the user from the database
    session = db_session()
    user = session.query(User).get(user_id)
    session.close()
    if not user:
        return {"error": "User not found."}, 404

    # Create a response object
    response = GetUserResponse(
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

    return jsonify(response), 200


__all__ = [
    'user_blueprint'
]
