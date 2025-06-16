from datetime import datetime
from typing import List, Optional, Dict, Tuple, Any, Union

from pydantic import UUID4, EmailStr, ValidationError

from .db import db
from .models import (
    Survey,
    SurveyResponse,
    SurveyAnswer,
    EmailTask,
    EmailTaskStatus,
    SurveyStatus,
)
from .pydantic import PydanticBaseModel
from .utils import close_expired_survey, run_concurrent_email_task
from .email import send_survey_emails, send_survey_ended_email


class EmailTaskInfo(PydanticBaseModel):
    recipient: EmailStr
    status: str
    sentAt: Optional[datetime]


class EmailStatusSummary(PydanticBaseModel):
    sent: int
    pending: int
    failed: int
    total: int


def get_email_status_summary(survey_id: UUID4) -> EmailStatusSummary:
    email_tasks = EmailTask.query.filter_by(survey_id=survey_id).all()
    sent = sum(
        1 for email_task in email_tasks if email_task.status == EmailTaskStatus.SENT
    )
    pending = sum(
        1 for email_task in email_tasks if email_task.status == EmailTaskStatus.PENDING
    )
    failed = sum(
        1 for email_task in email_tasks if email_task.status == EmailTaskStatus.FAILED
    )

    return EmailStatusSummary(
        sent=sent,
        pending=pending,
        failed=failed,
        total=len(email_tasks),
    )


def get_email_tasks_info(survey_id: UUID4) -> List[EmailTaskInfo]:
    email_tasks = EmailTask.query.filter_by(survey_id=survey_id).all()
    return [
        EmailTaskInfo(
            recipient=email_task.recipient_email,
            status=email_task.status,
            sentAt=email_task.sent_at,
        )
        for email_task in email_tasks
    ]


def get_survey_results(survey: Survey) -> Tuple[Dict[str, int], List[str]]:
    results = {
        SurveyAnswer.YES.value: 0,
        SurveyAnswer.NO.value: 0,
        SurveyAnswer.CANT_ANSWER.value: 0,
    }
    respondent_emails = []

    for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
        answer = response.answer.value
        if answer in results:
            results[answer] += 1
        if not survey.is_anonymous:
            respondent_emails.append(response.recipient_email)

    return results, respondent_emails


def get_detailed_responses(survey: Survey) -> List[Dict]:
    responses = []
    for response in SurveyResponse.query.filter_by(survey_id=survey.id).all():
        answer = response.answer.value
        if survey.is_anonymous:
            responses.append(
                {
                    "respondentEmail": None,
                    "answer": answer,
                    "answeredAt": response.answered_at,
                }
            )
        else:
            responses.append(
                {
                    "respondentEmail": response.recipient_email,
                    "answer": answer,
                    "answeredAt": response.answered_at,
                }
            )
    return responses


def check_and_update_survey_status(survey: Survey) -> None:
    close_expired_survey(survey)


def get_survey_by_id(
    survey_id: UUID4, user_id: UUID4
) -> Tuple[Optional[Survey], Optional[Tuple[Dict, int]]]:
    survey = Survey.query.filter_by(id=survey_id, owner_id=user_id).first()
    if survey is None:
        return None, ({"error": "Survey not found"}, 404)
    return survey, None


def get_survey_by_id_public(
    survey_id: UUID4,
) -> Tuple[Optional[Survey], Optional[Tuple[Dict, int]]]:
    survey = Survey.query.filter_by(id=survey_id).first()
    if survey is None:
        return None, ({"error": "Survey not found"}, 404)
    return survey, None


def handle_validation_error(error: ValidationError) -> Tuple[Dict, int]:
    return {"error": "Validation error", "messages": error.errors()}, 400


def terminate_survey(survey: Survey) -> None:
    if survey.status != SurveyStatus.CLOSED:
        survey.status = SurveyStatus.CLOSED
        db.session.commit()
        run_concurrent_email_task(send_survey_ended_email, survey.id)


def retry_failed_survey_emails(survey_id: UUID4) -> None:
    run_concurrent_email_task(send_survey_emails, survey_id)


__all__ = [
    "EmailTaskInfo",
    "EmailStatusSummary",
    "get_email_status_summary",
    "get_email_tasks_info",
    "get_survey_results",
    "get_detailed_responses",
    "check_and_update_survey_status",
    "get_survey_by_id",
    "get_survey_by_id_public",
    "handle_validation_error",
    "terminate_survey",
    "retry_failed_survey_emails",
]
