import sys
import logging

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from .core.cors import setup_cors
from .core.db import setup_db
from .core.error import setup_error_handlers
from .routes.auth_login import auth_login_blueprint
from .routes.health import health_blueprint
from .routes.user_get import user_get_blueprint
from .routes.user_post import user_post_blueprint
from .routes.user_put import user_put_blueprint

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
app.register_blueprint(auth_login_blueprint, url_prefix="/api")
app.register_blueprint(user_get_blueprint, url_prefix="/api")
app.register_blueprint(user_post_blueprint, url_prefix="/api")
app.register_blueprint(user_put_blueprint, url_prefix="/api")

# Set up error handling
setup_error_handlers(app)

# Set up the database
setup_db(app)

if __name__ == "__main__":
    app.run()
