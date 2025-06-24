from flask import Blueprint, request, jsonify
from pydantic import EmailStr, ValidationError, Field
from datetime import datetime, timezone

from ..core.db import db
from ..core.models import SurveyResponse, SurveyStatus, Recipient
from ..core.pydantic import PydanticBaseModel
from ..core.survey_service import get_survey_by_id_public, handle_validation_error

survey_response_post_blueprint = Blueprint("survey_response_post_routes", __name__)


class SurveyResponseRequest(PydanticBaseModel):
    token: str | None = None
    email: EmailStr | None = None
    answer: str = Field(pattern="^(YES|NO|CANT_ANSWER)$")


@survey_response_post_blueprint.route("/surveys/<uuid:survey_id>/response", methods=["POST"])
def response(survey_id):
    try:
        data = SurveyResponseRequest.model_validate(request.json)
    except ValidationError as e:
        error_response = handle_validation_error(e)
        return jsonify(error_response[0]), error_response[1]

    survey, error_response = get_survey_by_id_public(survey_id)
    if error_response:
        return jsonify(error_response[0]), error_response[1]

    if survey.status != SurveyStatus.ACTIVE:
        return jsonify({"error": "Survey is closed"}), 400

    if data.token:
        recipient = Recipient.query.filter_by(
            survey_id=survey_id, response_token=data.token
        ).first()
        if not recipient:
            return jsonify({"error": "Invalid or expired token"}), 400
        recipient_email = recipient.email
    elif data.email:
        recipient_email = data.email
    else:
        return jsonify({"error": "Token or email required"}), 400

    existing = SurveyResponse.query.filter_by(
        survey_id=survey_id, recipient_email=recipient_email
    ).first()
    if existing:
        return jsonify({"error": "Already responded"}), 400

    response = SurveyResponse(
        survey_id=survey_id,
        recipient_email=recipient_email,
        answer=data.answer,
        answered_at=datetime.now(timezone.utc),
    )
    db.session.add(response)
    db.session.commit()
    return jsonify({"message": "Response recorded"}), 201


__all__ = ["survey_response_post_blueprint"]
