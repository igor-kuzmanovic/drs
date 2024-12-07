from datetime import datetime

from click import password_option
from flask import Blueprint, request, jsonify
from pydantic import field_serializer
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from ..core.db import db_session
from ..core.models import PydanticBaseModel, User

users_blueprint = Blueprint("users_routes", __name__)

class PostUserRequest(PydanticBaseModel):
    email: str
    password: str
    passwordConfirm: str
    firstName: str
    lastName: str
    address: str
    city: str
    country: str
    phone: str


class PostUserResponse(PydanticBaseModel):
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


@users_blueprint.route("", methods=["POST"])
def post():
    # Validate the incoming data
    data = PostUserRequest.model_validate(request.json)

    # Create a new user
    user = User(
        email=data.email,
        password=generate_password_hash(data.password), # TODO Do an actual hash
        first_name=data.firstName,
        last_name=data.lastName,
        address=data.address,
        city=data.city,
        country=data.country,
        phone=data.phone,
    )
    session = db_session()
    try:
        session.add(user)
        session.commit()
        session.refresh(user)
    except IntegrityError as e:
        session.rollback()

        return jsonify({"error": str(e)}), 400
    finally:
        session.close()

    # Create a response object
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
    ).model_dump()

    return jsonify(response), 201


__all__ = [
    'users_blueprint'
]
