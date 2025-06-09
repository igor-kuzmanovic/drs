from flask import Flask

from .core.cors import setup_cors
from .core.db import setup_db
from .core.error import setup_error_handlers
from .routes.survey_post import survey_post_blueprint

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env("SURVEY_API_FLASK")

# Set up CORS to allow requests from our Web app
setup_cors(app)

# Register blueprints
app.register_blueprint(survey_post_blueprint, url_prefix="/api")

# Set up error handling
setup_error_handlers(app)

# Set up the database
setup_db(app)

if __name__ == "__main__":
    app.run()
