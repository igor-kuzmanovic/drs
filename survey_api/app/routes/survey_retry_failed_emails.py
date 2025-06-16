from flask import Blueprint, jsonify
from pydantic import UUID4

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import SurveyStatus
from ..core.survey_service import get_survey_by_id, retry_failed_survey_emails

survey_retry_failed_emails_blueprint = Blueprint("survey_retry_failed_emails_routes", __name__)


@validate_token
@survey_retry_failed_emails_blueprint.route(
    "/surveys/<uuid:survey_id>/retry-failed-emails", methods=["POST"]
)
def retry_failed_emails(survey_id: UUID4):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey, error_response = get_survey_by_id(survey_id, user_id)
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    if survey.status == SurveyStatus.CLOSED.value:
        return jsonify({"error": "Survey is closed"}), 400

    retry_failed_survey_emails(survey_id)

    return jsonify({"message": "Retry started"}), 200


__all__ = ["survey_retry_failed_emails_blueprint"]
