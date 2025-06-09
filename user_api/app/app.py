from flask import Flask

from .core.cors import setup_cors
from .core.db import setup_db
from .core.error import setup_error_handlers
from .routes.auth_login_post import auth_login_post_blueprint
from .routes.user_get import user_get_blueprint
from .routes.user_post import user_post_blueprint

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env("USER_API_FLASK")

# Set up CORS to allow requests from our Web app
setup_cors(app)

# Register blueprints
app.register_blueprint(auth_login_post_blueprint, url_prefix="/api")
app.register_blueprint(user_get_blueprint, url_prefix="/api")
app.register_blueprint(user_post_blueprint, url_prefix="/api")

# Set up error handling
setup_error_handlers(app)

# Set up the database
setup_db(app)

if __name__ == "__main__":
    app.run()
