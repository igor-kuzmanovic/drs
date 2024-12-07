from flask import Flask
from flask_cors import CORS

from .config import WEB_ORIGIN


def setup_cors(app: Flask) -> None:
    CORS(app, resources={
        r"/api/*": {
            "origins": WEB_ORIGIN,
        }
    })

__all__ = [
    "setup_cors"
]
