from flask import Blueprint, jsonify, current_app
from sqlalchemy import text

from ..core.db import db

health_blueprint = Blueprint("health_routes", __name__)

@health_blueprint.route("/health/live", methods=["GET"])
def health_live():
    return jsonify({"status": "alive"}), 200

@health_blueprint.route("/health/ready", methods=["GET"])
def health_ready():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "ready"}), 200
    except Exception as e:
        current_app.logger.error(f"Database connection error: {e}")

        return jsonify({"status": "db unreachable"}), 503
