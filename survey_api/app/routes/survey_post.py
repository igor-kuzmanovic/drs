from datetime import datetime
from typing import List

from flask import Blueprint, request, jsonify
from pydantic import ValidationError, UUID4, EmailStr, Field, conlist, TypeAdapter

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.models import Survey, SurveyStatus, Recipient, EmailTask
from ..core.pydantic import PydanticBaseModel

survey_post_blueprint = Blueprint("survey_post_routes", __name__)


class PostSurveyRequest(PydanticBaseModel):
    name: str = Field(min_length=1, max_length=255)
    question: str = Field(min_length=1)
    endDate: datetime
    isAnonymous: bool = False
    recipients: conlist(EmailStr, min_length=1, max_length=50)


class PostSurveyResponse(PydanticBaseModel):
    id: UUID4
    name: str
    question: str
    endDate: datetime
    isAnonymous: bool
    recipients: conlist(EmailStr, min_length=1)
    status: str
    createdAt: datetime
    updatedAt: datetime


@validate_token
@survey_post_blueprint.route("/surveys", methods=["POST"])
def post():
    # Validate the incoming data
    try:
        data = PostSurveyRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    # Get the user ID from the token
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    # Create a new survey object
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

    # Create recipient records
    for email in data.recipients:
        recipient = Recipient(survey_id=survey.id, email=email)
        db.session.add(recipient)

        # Create an email task for each recipient
        email_task = EmailTask(survey_id=survey.id, recipient_email=email)
        db.session.add(email_task)

    db.session.commit()

    # Prepare recipients for response
    recipient_emails = [r.email for r in survey.recipients_list]

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
