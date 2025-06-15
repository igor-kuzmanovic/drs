from flask import Blueprint, jsonify, current_app
from pydantic import UUID4

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.models import Survey, SurveyStatus
from ..core.utils import run_concurrent_email_task
from ..core.email import send_survey_emails

survey_retry_failed_emails_blueprint = Blueprint("survey_retry_failed_emails_routes", __name__)


@validate_token
@survey_retry_failed_emails_blueprint.route(
    "/surveys/<uuid:survey_id>/retry-failed-emails", methods=["POST"]
)
def retry_failed_emails(survey_id: UUID4):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    if survey.status == SurveyStatus.CLOSED.value:
        return jsonify({"error": "Survey is closed"}), 400

    run_concurrent_email_task(send_survey_emails, survey_id)

    return jsonify({"message": "Retry started"}), 200

__all__ = ["survey_retry_failed_emails_blueprint"]
