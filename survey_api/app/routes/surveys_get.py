from datetime import datetime
from typing import List

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
    surveys = (
        query.order_by(Survey.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    result = []
    email_adapter = TypeAdapter(List[EmailStr])
    for survey in surveys:
        recipients = survey.recipients.split(",") if survey.recipients else []
        try:
            recipient_emails = email_adapter.validate_python(recipients)
        except Exception:
            recipient_emails = []

        # Aggregate results for this survey
        results = {
            SurveyAnswer.YES.value: 0,
            SurveyAnswer.NO.value: 0,
            SurveyAnswer.CANT_ANSWER.value: 0,
        }
        for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
            answer = response.answer.value
            if answer in results:
                results[answer] += 1

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
