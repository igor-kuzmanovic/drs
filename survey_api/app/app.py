import sys
import logging

from flask import Flask

from .core.cors import setup_cors
from .core.db import setup_db
from .core.error import setup_error_handlers
from .routes.survey_delete import survey_delete_blueprint
from .routes.survey_get import survey_get_blueprint
from .routes.survey_post import survey_post_blueprint
from .routes.survey_respond import survey_respond_blueprint
from .routes.survey_terminate import survey_terminate_blueprint
from .routes.survey_results import survey_results_blueprint
from .routes.surveys_get import surveys_get_blueprint

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env()

# Configure logger to log to stdout
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)  # Or DEBUG, etc.
formatter = logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)
handler.setFormatter(formatter)

# Clear default handlers and use the new one
app.logger.handlers = []
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

# Set up CORS to allow requests from our Web app
setup_cors(app)

# Register blueprints
app.register_blueprint(survey_delete_blueprint, url_prefix="/api")
app.register_blueprint(survey_get_blueprint, url_prefix="/api")
app.register_blueprint(survey_post_blueprint, url_prefix="/api")
app.register_blueprint(survey_respond_blueprint, url_prefix="/api")
app.register_blueprint(survey_terminate_blueprint, url_prefix="/api")
app.register_blueprint(survey_results_blueprint, url_prefix="/api")
app.register_blueprint(surveys_get_blueprint, url_prefix="/api")

# Set up error handling
setup_error_handlers(app)

# Set up the database
setup_db(app)

if __name__ == "__main__":
    app.run()
