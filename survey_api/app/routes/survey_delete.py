from flask import Blueprint, jsonify
from pydantic import UUID4

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.survey_service import get_survey_by_id

survey_delete_blueprint = Blueprint("survey_delete_routes", __name__)


@validate_token
@survey_delete_blueprint.route("/surveys/<uuid:survey_id>", methods=["DELETE"])
def survey_delete(survey_id: UUID4):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey, error_response = get_survey_by_id(survey_id, user_id)
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    db.session.delete(survey)
    db.session.commit()
    return jsonify({"message": "Survey deleted"}), 200


__all__ = ["survey_delete_blueprint"]
