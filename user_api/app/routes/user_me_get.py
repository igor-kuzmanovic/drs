from flask import Blueprint, jsonify

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.user_service import get_user_by_id, user_to_response_dict

user_me_get_blueprint = Blueprint("user_me_get_routes", __name__)


@validate_token
@user_me_get_blueprint.route("/users/me", methods=["GET"])
def user_me_get():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    user, error_response = get_user_by_id(user_id)
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    try:
        response = user_to_response_dict(user)
    except ValueError:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(response), 200


__all__ = ["user_me_get_blueprint"]
