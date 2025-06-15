import enum
import uuid
import secrets
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, UUID, Boolean, Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import db


class SurveyStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"


class SurveyAnswer(enum.Enum):
    YES = "YES"
    NO = "NO"
    CANT_ANSWER = "CANT_ANSWER"


class Survey(db.Model):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    owner_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    status: Mapped[SurveyStatus] = mapped_column(
        Enum(SurveyStatus), default=SurveyStatus.ACTIVE.value, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False
    )
    responses = relationship(
        "SurveyResponse", back_populates="survey", cascade="all, delete-orphan"
    )
    recipients_list = relationship(
        "Recipient", back_populates="survey", cascade="all, delete-orphan"
    )
    email_tasks = relationship(
        "EmailTask", back_populates="survey", cascade="all, delete-orphan"
    )


class SurveyResponse(db.Model):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    survey_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("survey.id"), nullable=False
    )
    recipient_email: Mapped[str] = mapped_column(String(255), nullable=False)
    answer: Mapped[SurveyAnswer] = mapped_column(Enum(SurveyAnswer), nullable=False)
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
    survey = relationship("Survey", back_populates="responses")


class Recipient(db.Model):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    survey_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("survey.id"), nullable=False
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    response_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        default=lambda: secrets.token_urlsafe(32),
    )
    survey = relationship("Survey", back_populates="recipients_list")


class EmailTaskStatus(enum.Enum):
    PENDING = "PENDING"
    SENT = "SENT"
    FAILED = "FAILED"


class EmailTask(db.Model):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    survey_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("survey.id"), nullable=False
    )
    recipient_email: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[EmailTaskStatus] = mapped_column(
        Enum(EmailTaskStatus), default=EmailTaskStatus.PENDING, nullable=False
    )
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    survey = relationship("Survey", back_populates="email_tasks")


__all__ = [
    "Survey",
    "SurveyStatus",
    "SurveyResponse",
    "SurveyAnswer",
    "Recipient",
    "EmailTask",
    "EmailTaskStatus",
]
