from flask import Blueprint, request, jsonify
from pydantic import EmailStr, ValidationError, Field
from datetime import datetime, timezone

from ..core.db import db
from ..core.models import Survey, SurveyResponse, SurveyStatus, Recipient
from ..core.pydantic import PydanticBaseModel

survey_respond_blueprint = Blueprint("survey_respond_routes", __name__)


class SurveyRespondRequest(PydanticBaseModel):
    token: str | None = None
    email: EmailStr | None = None
    answer: str = Field(pattern="^(YES|NO|CANT_ANSWER)$")


@survey_respond_blueprint.route("/surveys/<uuid:survey_id>/respond", methods=["POST"])
def respond(survey_id):
    try:
        data = SurveyRespondRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    survey = Survey.query.filter_by(id=survey_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404
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
        # Allow any email, not just listed recipients
        recipient_email = data.email
    else:
        return jsonify({"error": "Token or email required"}), 400

    # Check if already responded
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


__all__ = ["survey_respond_blueprint"]
