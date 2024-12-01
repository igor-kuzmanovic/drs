from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.route("/", methods=["GET"])
def hello():
	return "Hello, World!"


@app.route("/api/login", methods=["POST"])
def login():
	return jsonify({"token": "eyJ...initial"})


@app.route("/api/refresh", methods=["POST"])
def refresh():
	return jsonify({"token": "eyJ...refreshed"})


@app.route("/api/register", methods=["POST"])
def register():
	return jsonify({})


if __name__ == "__main__":
	app.run()
