from datetime import datetime
from typing import List, Optional

from flask import Blueprint, jsonify, request
from pydantic import UUID4, EmailStr, TypeAdapter, ValidationError

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey, SurveyResponse
from ..core.pydantic import PydanticBaseModel

survey_get_blueprint = Blueprint("survey_get_routes", __name__)

class GetSurveyDetailResponse(PydanticBaseModel):
    id: UUID4
    name: str
    question: str
    endDate: datetime
    isAnonymous: bool
    recipients: List[EmailStr]
    status: str
    createdAt: datetime
    updatedAt: datetime
    results: Optional[dict]  # e.g. {"YES": 10, "NO": 5, "CANT_ANSWER": 2}
    respondentEmails: Optional[List[EmailStr]]  # Only if not anonymous

@validate_token
@survey_get_blueprint.route("/surveys/<uuid:survey_id>", methods=["GET"])
def get_survey(survey_id):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    # Parse recipients
    recipients = survey.recipients.split(",") if survey.recipients else []
    email_adapter = TypeAdapter(List[EmailStr])
    try:
        recipient_emails = email_adapter.validate_python(recipients)
    except Exception:
        recipient_emails = []

    # Aggregate results
    results = {"YES": 0, "NO": 0, "CANT_ANSWER": 0}
    respondent_emails = []
    for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
        answer = getattr(response, "answer", None)
        if answer in results:
            results[answer] += 1
        if not survey.is_anonymous:
            respondent_emails.append(response.recipient_email)

    response_data = GetSurveyDetailResponse(
        id=survey.id,
        name=survey.name,
        question=survey.question,
        endDate=survey.end_date,
        isAnonymous=survey.is_anonymous,
        recipients=recipient_emails,
        status=survey.status.value if hasattr(survey.status, "value") else str(survey.status),
        createdAt=survey.created_at,
        updatedAt=survey.updated_at,
        results=results,
        respondentEmails=respondent_emails if not survey.is_anonymous else None,
    )

    return jsonify(response_data.model_dump()), 200

__all__ = ["survey_get_blueprint"]