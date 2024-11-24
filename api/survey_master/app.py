from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.route("/", methods=["GET"])
def hello():
    return "Hello, World!"


@app.route("/api/_ping", methods=["POST"])
def ping():
    return jsonify("pong")


if __name__ == "__main__":
    app.run()
