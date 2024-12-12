from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
migrate = Migrate()


def setup_db(app: Flask) -> None:
    # Set up the database
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize the database
    db.init_app(app)

    # Initialize the migration engine
    migrate.init_app(app, db)


__all__ = [
    "Base",
    "db",
    "setup_db",
]
