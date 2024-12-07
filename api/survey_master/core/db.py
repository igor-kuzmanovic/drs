from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base

from .config import POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB

DATABASE_URL = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


def setup_db(app: Flask) -> None:
    # Create tables
    Base.metadata.create_all(engine)

    # Teardown session
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()


__all__ = [
    "DATABASE_URL",
    "db_session",
    "Base",
    "setup_db",
]
