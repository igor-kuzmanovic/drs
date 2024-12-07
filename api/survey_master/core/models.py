import uuid
from datetime import datetime, UTC

from pydantic import BaseModel
from sqlalchemy import Column, String, DateTime, UUID

from .db import Base


class PydanticBaseModel(BaseModel):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False)


__all__ = [
    'PydanticBaseModel',
    'User',
]
