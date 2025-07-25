import sys
import logging

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from .core.cors import setup_cors
from .core.db import setup_db
from .core.error import setup_error_handlers
from .routes.health import health_blueprint
from .routes.survey_delete import survey_delete_blueprint
from .routes.survey_get import survey_get_blueprint
from .routes.survey_post import survey_post_blueprint
from .routes.survey_response_post import survey_response_post_blueprint
from .routes.survey_results_get import survey_results_get_blueprint
from .routes.survey_retry_failed_emails_post import survey_retry_failed_emails_post_blueprint
from .routes.survey_terminate_post import survey_terminate_post_blueprint
from .routes.surveys_get import surveys_get_blueprint

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env()

# Set up proxy handling
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1, x_prefix=1)

# Configure logger to log to stdout
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)  # Or DEBUG, etc.
formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")
handler.setFormatter(formatter)

# Clear default handlers and use the new one
app.logger.handlers = []
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

# Set up CORS to allow requests from our Web app
setup_cors(app)

# Register blueprints
app.register_blueprint(health_blueprint)
app.register_blueprint(survey_delete_blueprint, url_prefix="/api")
app.register_blueprint(survey_get_blueprint, url_prefix="/api")
app.register_blueprint(survey_post_blueprint, url_prefix="/api")
app.register_blueprint(survey_response_post_blueprint, url_prefix="/api")
app.register_blueprint(survey_results_get_blueprint, url_prefix="/api")
app.register_blueprint(survey_retry_failed_emails_post_blueprint, url_prefix="/api")
app.register_blueprint(survey_terminate_post_blueprint, url_prefix="/api")
app.register_blueprint(surveys_get_blueprint, url_prefix="/api")

# Set up error handling
setup_error_handlers(app)

# Set up the database
setup_db(app)

if __name__ == "__main__":
    app.run()
