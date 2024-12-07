import os

WEB_ORIGIN = os.getenv('WEB_ORIGIN', "http://localhost:5173")
SECRET_KEY = os.getenv("SECRET_KEY", "s3cR3t_k3y")
TOKEN_ISSUER = os.getenv("TOKEN_ISSUER", "survey_master")

POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "surveymasterdb")

__all__ = [
    'WEB_ORIGIN',
    'SECRET_KEY',
    'TOKEN_ISSUER',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DB',
]
