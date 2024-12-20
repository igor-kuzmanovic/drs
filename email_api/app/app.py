import smtplib
from email.mime.text import MIMEText

from flask import Flask, Request, jsonify, request

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env("EMAIL_API_FLASK")


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
        message = MIMEText(data["body"], "html")
        message["Subject"] = data["subject"]
        message["From"] = data["from"]
        message["To"] = data["to"]

        with smtplib.SMTP("localhost", 1025) as server:
            server.send_message(message)

        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()

__all__ = []
