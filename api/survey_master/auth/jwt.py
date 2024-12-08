from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from functools import wraps
from typing import Optional, Callable

import jwt
from flask import request, jsonify, current_app

from ..core.config import TOKEN_ISSUER, SECRET_KEY


def generate_jwt(user_id: str) -> str:
    payload = {
        "iss": TOKEN_ISSUER,
        "user_id": user_id,
        "iat": datetime.now(tz=timezone.utc),
        "exp": datetime.now(tz=timezone.utc) + timedelta(seconds=60 * 60 * 24),
    }

    with current_app.app_context():
        current_app.logger.debug(f"Generated a JWT for user {user_id}")

    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def validate_token(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Try to get the token from the request
        encoded_token = _get_token_from_request()
        if not encoded_token:
            return jsonify({"error": "No token provided"}), 401

        # Try to decode the token
        decoded_token = _decode_jwt(encoded_token)
        if not decoded_token.is_valid:
            return jsonify({"error": decoded_token.error}), 401

        with current_app.app_context():
            current_app.logger.debug(f"Validated the token for user {decoded_token.token['user_id']}")

        return func(*args, **kwargs)

    return wrapper


def get_user_id_from_token() -> Optional[str]:
    # Try to decode the token
    decoded = _decode_jwt(_get_token_from_request())
    if decoded.is_valid:
        with current_app.app_context():
            current_app.logger.debug(f"Got the user id from the token: {decoded.token.get('user_id')}")

        return decoded.token.get("user_id")

    with current_app.app_context():
        current_app.logger.debug(f"Failed to get the user id from the token: {decoded.error}")

    return None


def _get_token_from_request() -> Optional[str]:
    # Check if "Authorization" header exists
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        return None

    # Check if the "Authorization" header has the correct format: "Bearer ..."
    if not authorization_header.startswith("Bearer "):
        return None

    # Extract the token from the "Authorization" header
    return authorization_header.split(" ")[1]


@dataclass
class DecodedJWT:
    is_valid: bool
    token: Optional[dict] = None
    error: Optional[str] = None


def _decode_jwt(encoded_token: str) -> DecodedJWT:
    try:
        # Decode the token, allowing for a 10-second leeway
        token = jwt.decode(encoded_token, SECRET_KEY, algorithms=["HS256"], leeway=10)

        return DecodedJWT(is_valid=True, token=token)
    except jwt.InvalidTokenError as e:
        return DecodedJWT(is_valid=False, error=str(e))
    except Exception:
        return DecodedJWT(is_valid=False, error="Unknown token error")


__all__ = [
    "generate_jwt",
    "validate_token",
    "get_user_id_from_token",
]
