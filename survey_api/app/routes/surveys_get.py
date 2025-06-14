from datetime import datetime
from typing import List

from ..core.utils import close_expired_survey
from flask import Blueprint, jsonify, request
from pydantic import UUID4, EmailStr, TypeAdapter

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey, SurveyAnswer, SurveyResponse
from ..core.pydantic import PydanticBaseModel

surveys_get_blueprint = Blueprint("surveys_get_routes", __name__)


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


@validate_token
@surveys_get_blueprint.route("/surveys", methods=["GET"])
def get_surveys():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    name = request.args.get("name", "")
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("pageSize", 20))

    query = Survey.query.filter_by(owner_id=user_id)
    if name:
        query = query.filter(Survey.name.ilike(f"%{name}%"))

    total = query.count()
    surveys: List[Survey] = (
        query.order_by(Survey.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    result = []
    for survey in surveys:
        # Check and close if expired
        close_expired_survey(survey)

        recipient_emails = [r.email for r in survey.recipients_list]

        # Aggregate results for this survey
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

        survey_response = GetSurveyResponse(
            id=survey.id,
            name=survey.name,
            question=survey.question,
            endDate=survey.end_date,
            isAnonymous=survey.is_anonymous,
            recipients=recipient_emails,
            status=(
                survey.status.value
                if hasattr(survey.status, "value")
                else str(survey.status)
            ),
            createdAt=survey.created_at,
            updatedAt=survey.updated_at,
        )
        survey_dict = survey_response.model_dump()
        survey_dict["results"] = results
        if not survey.is_anonymous:
            survey_dict["respondentEmails"] = respondent_emails
        result.append(survey_dict)

    return jsonify(
        {
            "items": result,
            "total": total,
            "page": page,
            "pageSize": page_size,
        }
    ), 200


__all__ = ["surveys_get_blueprint"]
