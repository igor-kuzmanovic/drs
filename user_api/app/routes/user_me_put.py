from flask import Blueprint, request, jsonify
from pydantic import ValidationError

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.user_service import get_user_by_id, update_user_from_dict, UserBaseModel, handle_validation_error

user_me_put_blueprint = Blueprint("user_me_put_routes", __name__)


class UserMePutRequest(UserBaseModel):
    password: str | None = None


@validate_token
@user_me_put_blueprint.route("/users/me", methods=["PUT"])
def user_me_put():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    user, error_response = get_user_by_id(user_id)
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    try:
        data = UserMePutRequest.model_validate(request.json)
    except ValidationError as e:
        error_response = handle_validation_error(e)
        return jsonify(error_response[0]), error_response[1]

    update_user_from_dict(user, data.model_dump())
    db.session.commit()

    return jsonify({"message": "Profile updated"}), 200


__all__ = ["user_me_put_blueprint"]
