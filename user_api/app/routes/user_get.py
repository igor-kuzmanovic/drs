from datetime import datetime

from flask import Blueprint, jsonify
from pydantic import EmailStr, UUID4, Field, ValidationError

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.models import User
from ..core.pydantic import PydanticBaseModel

user_get_blueprint = Blueprint("user_get_routes", __name__)


class GetUserResponse(PydanticBaseModel):
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


@validate_token
@user_get_blueprint.route("/user", methods=["GET"])
def get():
    # Get the user ID from the token
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    # Get the user from the database
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    # Create a response object
    try:
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
    except ValidationError:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(response), 200


__all__ = ["user_get_blueprint"]
