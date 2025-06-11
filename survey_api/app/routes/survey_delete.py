from flask import Blueprint, jsonify
from pydantic import UUID4

from ..auth.jwt import validate_token, get_user_id_from_token
from ..core.db import db
from ..core.models import Survey

survey_delete_blueprint = Blueprint("survey_delete_routes", __name__)


@validate_token
@survey_delete_blueprint.route("/surveys/<uuid:survey_id>", methods=["DELETE"])
def delete_survey(survey_id: UUID4):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    db.session.delete(survey)
    db.session.commit()
    return jsonify({"message": "Survey deleted"}), 200


__all__ = ["survey_delete_blueprint"]
