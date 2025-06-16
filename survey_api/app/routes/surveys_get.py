from datetime import datetime
from typing import List, Optional

from flask import Blueprint, jsonify, request
from pydantic import EmailStr, UUID4

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey
from ..core.pydantic import PydanticBaseModel
from ..core.survey_service import (
    EmailStatusSummary,
    get_survey_results,
    get_email_status_summary,
    check_and_update_survey_status,
)

surveys_get_blueprint = Blueprint("surveys_get_routes", __name__)


class GetSurveysResponse(PydanticBaseModel):
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
    emailStatusSummary: EmailStatusSummary


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
        check_and_update_survey_status(survey)

        recipient_emails = [r.email for r in survey.recipients_list]

        results, respondent_emails = get_survey_results(survey)

        email_status_summary = get_email_status_summary(survey.id)

        survey_response = GetSurveysResponse(
            id=survey.id,
            name=survey.name,
            question=survey.question,
            endDate=survey.end_date,
            isAnonymous=survey.is_anonymous,
            recipients=recipient_emails,
            status=survey.status,
            createdAt=survey.created_at,
            updatedAt=survey.updated_at,
            results=results,
            respondentEmails=respondent_emails if not survey.is_anonymous else None,
            emailStatusSummary=email_status_summary,
        )
        result.append(survey_response.model_dump())

    return (
        jsonify(
            {
                "items": result,
                "total": total,
                "page": page,
                "pageSize": page_size,
            }
        ),
        200,
    )


__all__ = ["surveys_get_blueprint"]
