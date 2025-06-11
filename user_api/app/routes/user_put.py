from flask import Blueprint, request, jsonify
from pydantic import ValidationError, EmailStr, UUID4, Field
from werkzeug.security import generate_password_hash

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.models import User
from ..core.pydantic import PydanticBaseModel

user_put_blueprint = Blueprint("user_put_routes", __name__)


class PutUserRequest(PydanticBaseModel):
    firstName: str = Field(min_length=3)
    lastName: str = Field(min_length=3)
    address: str = Field(min_length=3)
    city: str = Field(min_length=3)
    country: str = Field(min_length=3)
    phone: str = Field(min_length=3)
    password: str | None = None


@validate_token
@user_put_blueprint.route("/user", methods=["PUT"])
def put():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    try:
        data = PutUserRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    user.first_name = data.firstName
    user.last_name = data.lastName
    user.address = data.address
    user.city = data.city
    user.country = data.country
    user.phone = data.phone
    if data.password:
        user.password = generate_password_hash(data.password)
    db.session.commit()

    return jsonify({"message": "Profile updated"}), 200


__all__ = ["user_put_blueprint"]
