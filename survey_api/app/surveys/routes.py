from datetime import datetime
from typing import Self

from flask import Blueprint, request, jsonify
from pydantic import ValidationError, EmailStr, UUID4, SecretStr, Field, model_validator
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from ..auth.jwt import validate_token
from ..core.db import db
from ..core.models import Survey
from ..core.pydantic import PydanticBaseModel

surveys_blueprint = Blueprint("surveys_routes", __name__)


class PostSurveyRequest(PydanticBaseModel):
    pass


class PostSurveyResponse(PydanticBaseModel):
    id: UUID4
    createdAt: datetime
    updatedAt: datetime


@validate_token
@surveys_blueprint.route("", methods=["POST"])
def post():
    # Validate the incoming data
    try:
        data = PostSurveyRequest.model_validate(request.json)
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.errors()}), 400

    # Create a new survey object
    survey = Survey()

    # Add the survey to the session and commit
    db.session.add(survey)
    db.session.commit()

    # Create a response object
    try:
        response = PostSurveyResponse(
            id=survey.id,
            createdAt=survey.created_at,
            updatedAt=survey.updated_at,
        ).model_dump_json()
    except ValidationError:
        return jsonify({"error": "Internal server error"}), 500

    return response, 201


__all__ = ["surveys_blueprint"]
