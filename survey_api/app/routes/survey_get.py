from datetime import datetime
from typing import List, Optional

from flask import Blueprint, jsonify
from pydantic import UUID4, EmailStr

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey
from ..core.pydantic import PydanticBaseModel
from ..core.survey_service import EmailTaskInfo, get_survey_results, get_email_tasks_info, check_and_update_survey_status

survey_get_blueprint = Blueprint("survey_get_routes", __name__)


class GetSurveyResponse(PydanticBaseModel):
    id: UUID4
    name: str
    question: str
    endDate: datetime
    isAnonymous: bool
    recipients: List[EmailStr]
    status: str
    createdAt: datetime
    updatedAt: datetime
    results: dict
    respondentEmails: Optional[List[EmailStr]]
    emailStatus: List[EmailTaskInfo]


class GetSurveyPublicResponse(PydanticBaseModel):
    id: UUID4
    name: str
    question: str
    endDate: datetime
    isAnonymous: bool
    status: str
    createdAt: datetime
    updatedAt: datetime


@survey_get_blueprint.route("/surveys/<uuid:survey_id>", methods=["GET"])
@validate_token
def get_survey(survey_id: UUID4):
    user_id = get_user_id_from_token()
    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    email_status = get_email_tasks_info(survey_id)
    recipient_emails = [r.email for r in survey.recipients_list]

    results, respondent_emails = get_survey_results(survey)

    response_data = GetSurveyResponse(
        id=survey.id,
        name=survey.name,
        question=survey.question,
        endDate=survey.end_date,
        isAnonymous=survey.is_anonymous,
        recipients=recipient_emails,
        status=survey.status.value,
        createdAt=survey.created_at,
        updatedAt=survey.updated_at,
        results=results,
        respondentEmails=respondent_emails if not survey.is_anonymous else None,
        emailStatus=email_status,
    )

    return jsonify(response_data.model_dump()), 200


@survey_get_blueprint.route("/surveys/<uuid:survey_id>/public", methods=["GET"])
def get_survey_public(survey_id):
    survey: Optional[Survey] = Survey.query.filter_by(id=survey_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    check_and_update_survey_status(survey)

    response_data = GetSurveyPublicResponse(
        id=survey.id,
        name=survey.name,
        question=survey.question,
        endDate=survey.end_date,
        isAnonymous=survey.is_anonymous,
        status=survey.status,
        createdAt=survey.created_at,
        updatedAt=survey.updated_at,
    )

    return jsonify(response_data.model_dump()), 200


__all__ = ["survey_get_blueprint"]
