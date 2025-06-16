from flask import Blueprint, jsonify

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.user_service import get_user_by_id, user_to_response_dict

user_get_blueprint = Blueprint("user_get_routes", __name__)


@validate_token
@user_get_blueprint.route("/user", methods=["GET"])
def get():
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


__all__ = ["user_get_blueprint"]
