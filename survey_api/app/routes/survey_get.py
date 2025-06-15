from datetime import datetime
from typing import List, Optional

from flask import Blueprint, jsonify
from pydantic import UUID4, EmailStr

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey, EmailTask, SurveyAnswer, SurveyResponse
from ..core.pydantic import PydanticBaseModel
from ..core.utils import close_expired_survey

survey_get_blueprint = Blueprint("survey_get_routes", __name__)


class EmailTaskInfo(PydanticBaseModel):
    recipient: EmailStr
    status: str
    sentAt: Optional[datetime]


class EmailStatusSummary(PydanticBaseModel):
    sent: int
    pending: int
    failed: int
    total: int


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

    email_tasks = EmailTask.query.filter_by(survey_id=survey_id).all()
    email_status = [
        EmailTaskInfo(
            recipient=email_task.recipient_email,
            status=email_task.status,
            sentAt=email_task.sent_at,
        )
        for email_task in email_tasks
    ]

    recipient_emails = [r.email for r in survey.recipients_list]

    # Aggregate results
    results = {
        SurveyAnswer.YES.value: 0,
        SurveyAnswer.NO.value: 0,
        SurveyAnswer.CANT_ANSWER.value: 0,
    }
    respondent_emails = []
    for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
        answer = response.answer.value
        if answer in results:
            results[answer] += 1
        if not survey.is_anonymous:
            respondent_emails.append(response.recipient_email)

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

    # Check and close if expired
    close_expired_survey(survey)

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
