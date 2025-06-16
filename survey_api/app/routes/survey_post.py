from datetime import datetime
from flask import Blueprint, request, jsonify
from pydantic import ValidationError, UUID4, EmailStr, Field
from typing import List

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.models import Survey, SurveyStatus, Recipient, EmailTask
from ..core.pydantic import PydanticBaseModel
from ..core.survey_service import handle_validation_error, retry_failed_survey_emails

survey_post_blueprint = Blueprint("survey_post_routes", __name__)


class PostSurveyRequest(PydanticBaseModel):
    name: str = Field(min_length=1, max_length=255)
    question: str = Field(min_length=1)
    endDate: datetime
    isAnonymous: bool = False
    recipients: List[EmailStr] = Field(min_length=1, max_items=50)


class PostSurveyResponse(PydanticBaseModel):
    id: UUID4
    name: str
    question: str
    endDate: datetime
    isAnonymous: bool
    recipients: List[EmailStr]
    status: str
    createdAt: datetime
    updatedAt: datetime


@validate_token
@survey_post_blueprint.route("/surveys", methods=["POST"])
def post():
    try:
        data = PostSurveyRequest.model_validate(request.json)
    except ValidationError as e:
        error_response = handle_validation_error(e)
        return jsonify(error_response[0]), error_response[1]

    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey = Survey(
        name=data.name,
        question=data.question,
        end_date=data.endDate,
        is_anonymous=data.isAnonymous,
        owner_id=user_id,
        status=SurveyStatus.ACTIVE.value,
    )

    db.session.add(survey)
    db.session.commit()

    for email in data.recipients:
        recipient = Recipient(survey_id=survey.id, email=email)
        db.session.add(recipient)

        email_task = EmailTask(survey_id=survey.id, recipient_email=email)
        db.session.add(email_task)

    db.session.commit()

    recipient_emails = [r.email for r in survey.recipients_list]

    retry_failed_survey_emails(survey.id)

    response = PostSurveyResponse(
        id=survey.id,
        name=survey.name,
        question=survey.question,
        endDate=survey.end_date,
        isAnonymous=survey.is_anonymous,
        recipients=recipient_emails,
        status=survey.status.value,
        createdAt=survey.created_at,
        updatedAt=survey.updated_at,
    ).model_dump()

    return jsonify(response), 201


__all__ = ["survey_post_blueprint"]
