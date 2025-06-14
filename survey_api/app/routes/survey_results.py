from flask import Blueprint, jsonify
from pydantic import UUID4, EmailStr, TypeAdapter
from datetime import datetime

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.models import Survey, SurveyResponse, SurveyAnswer
from ..core.pydantic import PydanticBaseModel

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

    results = {SurveyAnswer.YES.value: 0, SurveyAnswer.NO.value: 0, SurveyAnswer.CANT_ANSWER.value: 0}
    responses = []
    for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
        print(response, response.answer, flush=True)
        answer = response.answer.value
        if answer in results:
            print(results, answer, flush=True)
            results[answer] += 1
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
