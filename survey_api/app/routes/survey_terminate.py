from flask import Blueprint, jsonify
from pydantic import UUID4

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.survey_service import get_survey_by_id, terminate_survey

survey_terminate_blueprint = Blueprint("survey_terminate_routes", __name__)


@validate_token
@survey_terminate_blueprint.route(
    "/surveys/<uuid:survey_id>/terminate", methods=["POST"]
)
def terminate_survey_route(survey_id: UUID4):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey, error_response = get_survey_by_id(survey_id, user_id)
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    if survey.status == "CLOSED":
        return jsonify({"error": "Survey is already closed"}), 400

    terminate_survey(survey)

    return jsonify({"message": "Survey terminated"}), 200


__all__ = ["survey_terminate_blueprint"]
