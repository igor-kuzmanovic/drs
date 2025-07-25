import smtplib
import sys
import logging
import random

from email.mime.text import MIMEText

from flask import Flask, Request, jsonify, request, current_app

# Probability that an email will be sent successfully (1.0 = always succeed, 0.0 = always fail)
EMAIL_SEND_SUCCESS_PROBABILITY: float = 1.0

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env()

# Configure logger to log to stdout
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)  # Or DEBUG, etc.
formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")
handler.setFormatter(formatter)

# Clear default handlers and use the new one
app.logger.handlers = []
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)


def authenticate(req: Request):
    auth_header = req.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return False

    token = auth_header.split(" ")[1]

    return token == app.config.get("API_KEY")


@app.route("/")
def index():
    return "OK", 200


@app.route("/api/send", methods=["POST"])
def send_email():
    if not authenticate(request):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        if current_app.debug and random.random() > EMAIL_SEND_SUCCESS_PROBABILITY:
            raise Exception("Simulated email sending failure")

        message = MIMEText(data["body"], "html")
        message["Subject"] = data["subject"]
        message["From"] = data["from"]
        message["To"] = data["to"]

        with smtplib.SMTP("localhost", 1025) as server:
            server.send_message(message)

        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health/live", methods=["GET"])
def health_live():
    return jsonify({"status": "alive"}), 200


@app.route("/health/ready", methods=["GET"])
def health_ready():
    return jsonify({"status": "ready"}), 200


if __name__ == "__main__":
    app.run()

__all__ = []
