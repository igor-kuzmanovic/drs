from flask import Flask

from .auth.routes import auth_blueprint
from .core.cors import setup_cors
from .core.db import setup_db
from .core.error import setup_error_handlers
from .user.routes import user_blueprint
from .users.routes import users_blueprint

# Create a Flask app
app = Flask(__name__)
app.config.from_prefixed_env("USER_API_FLASK")

# Set up CORS to allow requests from our Web app
setup_cors(app)

# Register blueprints
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
app.register_blueprint(user_blueprint, url_prefix="/api/user")
app.register_blueprint(users_blueprint, url_prefix="/api/users")

# Set up error handling
setup_error_handlers(app)

# Set up the database
setup_db(app)

if __name__ == "__main__":
    app.run()
