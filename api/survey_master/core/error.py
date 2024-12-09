from flask import Flask, jsonify
from pydantic import ValidationError


def setup_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return jsonify({"error": "Validation error", "messages": error.errors()}), 400

    @app.errorhandler(500)
    def handle_server_error(error):
        response = {"error": "Internal server error"}

        # Only return the error message in debug mode
        if app.debug:
            response["message"] = str(error)

        return jsonify(response), 500


__all__ = ["setup_error_handlers"]