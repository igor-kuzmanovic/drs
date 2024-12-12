import os

def _get_env_var(name: str) -> str:
    value = os.getenv(name)
    
    if value is None:
        raise RuntimeError(f"Environment variable '{name}' is not set")
    
    return value

WEB_ORIGIN = _get_env_var("WEB_ORIGIN")
SECRET_KEY = _get_env_var("SECRET_KEY")
TOKEN_ISSUER = _get_env_var("TOKEN_ISSUER")

POSTGRES_USER = _get_env_var("POSTGRES_USER")
POSTGRES_PASSWORD = _get_env_var("POSTGRES_PASSWORD")
POSTGRES_HOST = _get_env_var("POSTGRES_HOST")
POSTGRES_PORT = _get_env_var("POSTGRES_PORT")
POSTGRES_DB = _get_env_var("POSTGRES_DB")

SQLALCHEMY_DATABASE_URI = (
    f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

__all__ = [
    "WEB_ORIGIN",
    "SECRET_KEY",
    "TOKEN_ISSUER",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_DB",
    "SQLALCHEMY_DATABASE_URI",
]
