import uuid
from datetime import datetime, UTC

from sqlalchemy import String, DateTime, UUID
from sqlalchemy.orm import Mapped, mapped_column

from .db import db


class Survey(db.Model):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False
    )


__all__ = [
    "Survey",
]
