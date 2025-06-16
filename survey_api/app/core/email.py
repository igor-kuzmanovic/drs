from datetime import datetime, timezone
from typing import List, Optional
from .email_sender import EmailSender, get_email_sender
from flask import current_app
from urllib.parse import urlencode

from .db import db
from .models import (
    EmailTask,
    EmailTaskStatus,
    Recipient,
    Survey,
    SurveyAnswer,
    SurveyStatus,
)


def send_email(recipient_email: str, subject: str, body: str) -> None:
    email_sender: EmailSender = get_email_sender()
    current_app.logger.info(
        f"Preparing to send email to {recipient_email} with subject '{subject}'"
    )
    return email_sender.send_email(recipient_email, subject, body)


def generate_answer_link(survey_id: str, response_token: str, answer: str) -> str:
    base_url: str = current_app.config.get("WEB_ORIGIN")
    params: str = urlencode({"token": response_token, "answer": answer})
    return f"{base_url}/respond/{survey_id}?{params}"


SURVEY_INVITE_EMAIL_SUBJECT = (
    "You're invited to participate in the survey: {survey_name}"
)
SURVEY_INVITE_EMAIL_TEMPLATE = """
<div style="font-family: 'Inter', sans-serif; background: #f8fafc; padding: 32px 0;">
  <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #2563eb; margin-bottom: 12px;">
      {survey_name}
    </h2>
    <p style="font-size: 1rem; color: #334155; margin-bottom: 16px;">
      {survey_question}
    </p>
    <div style="margin: 24px 0; display: flex; gap: 12px; justify-content: center;">
      <a href="{yes_link}" style="padding:10px 20px;background:#22c55e;color:white;text-decoration:none;border-radius:6px;font-weight:600;">Yes</a>
      <a href="{no_link}" style="padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;font-weight:600;">No</a>
      <a href="{cant_link}" style="padding:10px 20px;background:#64748b;color:white;text-decoration:none;border-radius:6px;font-weight:600;">Can't answer</a>
    </div>
    <p style="font-size:0.95rem; color:#64748b; margin-top: 24px;">
      If the buttons above do not work, copy and paste this link into your browser:<br>
      <a href="{yes_link}" style="color:#2563eb;">{yes_link}</a>
    </p>
  </div>
  <div style="text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 24px;">
    &copy; {year} Survey Master
  </div>
"""


def send_survey_emails(survey_id: str) -> None:
    with current_app.app_context():
        survey: Optional[Survey] = Survey.query.get(survey_id)
        if not survey:
            current_app.logger.warning(f"Survey {survey_id} not found.")
            return
        if survey.status == SurveyStatus.CLOSED.value:
            current_app.logger.info(
                f"Survey {survey_id} is CLOSED. No emails will be sent."
            )
            return

        # Reset failed tasks to pending
        failed_tasks = EmailTask.query.filter(
            EmailTask.survey_id == survey_id, EmailTask.status == EmailTaskStatus.FAILED
        ).all()
        for task in failed_tasks:
            task.status = EmailTaskStatus.PENDING
        if failed_tasks:
            db.session.commit()

        # Get all pending tasks
        tasks_to_send: List[EmailTask] = EmailTask.query.filter(
            EmailTask.survey_id == survey_id,
            EmailTask.status.in_([EmailTaskStatus.PENDING]),
        ).all()
        current_app.logger.info(
            f"Found {len(tasks_to_send)} email tasks (pending) for survey {survey_id}"
        )

        # Process each task
        for task in tasks_to_send:
            recipient: Optional[Recipient] = Recipient.query.filter_by(
                survey_id=survey_id, email=task.recipient_email
            ).first()
            if not recipient:
                current_app.logger.info(
                    f"Recipient {task.recipient_email} not found for survey {survey_id}"
                )
                continue

            # Prepare email content
            subject = SURVEY_INVITE_EMAIL_SUBJECT.format(survey_name=survey.name)
            yes_link = generate_answer_link(
                survey_id, recipient.response_token, SurveyAnswer.YES.value
            )
            no_link = generate_answer_link(
                survey_id, recipient.response_token, SurveyAnswer.NO.value
            )
            cant_link = generate_answer_link(
                survey_id, recipient.response_token, SurveyAnswer.CANT_ANSWER.value
            )
            body = SURVEY_INVITE_EMAIL_TEMPLATE.format(
                survey_name=survey.name,
                survey_question=survey.question,
                yes_link=yes_link,
                no_link=no_link,
                cant_link=cant_link,
                year=datetime.now().year,
            )

            # Send email
            current_app.logger.info(
                f"Preparing to send invitation email to {task.recipient_email} for survey {survey_id}"
            )
            try:
                send_email(task.recipient_email, subject, body)
                task.status = EmailTaskStatus.SENT
                task.sent_at = datetime.now(timezone.utc)
                current_app.logger.info(
                    f"Marked email as SENT for {task.recipient_email} in survey {survey_id}"
                )
            except Exception as e:
                task.status = EmailTaskStatus.FAILED
                current_app.logger.warning(
                    f"Failed to send email to {task.recipient_email} for survey {survey_id}: {e}"
                )
            finally:
                db.session.commit()


SURVEY_ENDED_EMAIL_SUBJECT = "Survey '{survey_name}' has ended"
SURVEY_ENDED_EMAIL_TEMPLATE = """
<div style="font-family: 'Inter', sans-serif; background: #f8fafc; padding: 32px 0;">
  <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #2563eb; margin-bottom: 12px;">
      {survey_name}
    </h2>
    <p style="font-size: 1rem; color: #334155; margin-bottom: 24px;">
      The survey has now ended. Thank you for your participation!
    </p>
    <div style="margin-top: 24px; text-align: center;">
      <span style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; border-radius: 6px; padding: 8px 20px; font-size: 1rem;">
        Survey Closed
      </span>
    </div>
  </div>
  <div style="text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 24px;">
    &copy; {year} Survey Master
  </div>
</div>
"""


def send_survey_ended_email(survey_id: str) -> None:
    with current_app.app_context():
        survey: Optional[Survey] = Survey.query.get(survey_id)
        if not survey:
            current_app.logger.warning(f"Survey {survey_id} not found.")
            return
        if not survey.status == SurveyStatus.CLOSED.value:
            current_app.logger.info(
                f"Survey {survey_id} is not CLOSED. No ended emails will be sent."
            )
            return

        # Get all recipients
        recipients: List[Recipient] = Recipient.query.filter_by(
            survey_id=survey.id
        ).all()
        current_app.logger.info(
            f"Sending survey ended emails to {len(recipients)} recipients for survey {survey.id}"
        )

        # Prepare email content
        subject = SURVEY_ENDED_EMAIL_SUBJECT.format(survey_name=survey.name)
        body = SURVEY_ENDED_EMAIL_TEMPLATE.format(
            survey_name=survey.name,
            year=datetime.now().year,
        )

        # Send emails to each recipient
        for recipient in recipients:
            current_app.logger.info(
                f"Sending survey ended email to {recipient.email} for survey {survey.id}"
            )
            try:
                send_email(recipient.email, subject, body)
                current_app.logger.info(
                    f"Survey ended email sent to {recipient.email} for survey {survey.id}"
                )
            except Exception as e:
                current_app.logger.warning(
                    f"Failed to send survey ended email to {recipient.email} for survey {survey.id}: {e}"
                )


__all__ = [
    "send_email",
    "send_survey_emails",
    "send_survey_ended_email",
    "generate_answer_link",
    "SURVEY_INVITE_EMAIL_SUBJECT",
    "SURVEY_INVITE_EMAIL_TEMPLATE",
    "SURVEY_ENDED_EMAIL_SUBJECT",
    "SURVEY_ENDED_EMAIL_TEMPLATE",
]
