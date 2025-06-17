from flask import Flask
from flask_cors import CORS


def setup_cors(app: Flask) -> None:
    CORS(
        app,
        resources={r"/*": {"origins": app.config.get("WEB_ORIGIN")}},
        supports_credentials=True,
        max_age=60 * 60 * 24,
    )


__all__ = ["setup_cors"]
