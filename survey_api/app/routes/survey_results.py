from flask import Blueprint, jsonify
from pydantic import UUID4, EmailStr, TypeAdapter
from datetime import datetime

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey, SurveyResponse, SurveyAnswer
from ..core.pydantic import PydanticBaseModel

survey_results_blueprint = Blueprint("survey_results_routes", __name__)

class SurveyResponseInfo(PydanticBaseModel):
    respondentEmail: EmailStr
    answer: str
    answeredAt: datetime

class GetSurveyResultsResponse(PydanticBaseModel):
    surveyId: UUID4
    results: dict  # e.g. {"YES": 10, "NO": 5, "CANT_ANSWER": 2}
    totalResponses: int
    responses: list[SurveyResponseInfo]  # List of all responses (if not anonymous)

@validate_token
@survey_results_blueprint.route("/surveys/<uuid:survey_id>/results", methods=["GET"])
def get_survey_results(survey_id):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    results = {"YES": 0, "NO": 0, "CANT_ANSWER": 0}
    responses = []
    for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
        answer = getattr(response, "answer", None)
        if answer in results:
            results[answer] += 1
        # Include as much info as possible, but respect anonymity
        if survey.is_anonymous:
            responses.append({
                "respondentEmail": None,
                "answer": answer,
                "answeredAt": response.answered_at,
            })
        else:
            responses.append({
                "respondentEmail": response.recipient_email,
                "answer": answer,
                "answeredAt": response.answered_at,
            })

    total_responses = sum(results.values())

    response_data = GetSurveyResultsResponse(
        surveyId=survey.id,
        results=results,
        totalResponses=total_responses,
        responses=responses
    )

    return jsonify(response_data.model_dump()), 200

__all__ = ["survey_results_blueprint"]
