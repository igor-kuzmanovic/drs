from flask import Flask, jsonify
from flask_cors import CORS

APP_ORIGIN = "http://localhost:5173"

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": APP_ORIGIN}})


@app.route("/api/auth/login", methods=["POST"])
def login():
	return jsonify({"token": "eyJ...initial"})


@app.route("/api/auth/refresh", methods=["POST"])
def refresh():
	return jsonify({"token": "eyJ...refreshed"})


@app.route("/api/users", methods=["POST"])
def register():
	return jsonify({"id": "1"})


if __name__ == "__main__":
	app.run()
