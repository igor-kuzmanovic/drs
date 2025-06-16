from flask import Blueprint, jsonify
from pydantic import UUID4, EmailStr
from datetime import datetime

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey, SurveyAnswer
from ..core.pydantic import PydanticBaseModel
from ..core.survey_service import get_detailed_responses

survey_results_blueprint = Blueprint("survey_results_routes", __name__)


class SurveyResponseInfo(PydanticBaseModel):
    respondentEmail: EmailStr | None = None
    answer: str
    answeredAt: datetime


class GetSurveyResultsResponse(PydanticBaseModel):
    surveyId: UUID4
    results: dict
    totalResponses: int
    responses: list[SurveyResponseInfo]


@validate_token
@survey_results_blueprint.route("/surveys/<uuid:survey_id>/results", methods=["GET"])
def get_survey_results(survey_id):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    results = {
        SurveyAnswer.YES.value: 0,
        SurveyAnswer.NO.value: 0,
        SurveyAnswer.CANT_ANSWER.value: 0,
    }

    responses = get_detailed_responses(survey)

    for response_info in responses:
        answer = response_info["answer"]
        if answer in results:
            results[answer] += 1

    total_responses = sum(results.values())

    response_data = GetSurveyResultsResponse(
        surveyId=survey.id,
        results=results,
        totalResponses=total_responses,
        responses=responses,
    )

    return jsonify(response_data.model_dump()), 200


__all__ = ["survey_results_blueprint"]
