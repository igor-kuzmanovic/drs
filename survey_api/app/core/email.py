from datetime import datetime, timezone
from typing import List, Optional
import requests
from flask import current_app
from urllib.parse import urlencode
import time

from .db import db
from .models import EmailTask, EmailTaskStatus, Recipient, Survey, SurveyAnswer, SurveyStatus


# Artificial delay (in seconds) for sending each email, for local development/testing
EMAIL_SEND_ARTIFICIAL_DELAY: float = 0.0


def send_email(recipient_email, subject, body):
    if current_app.debug and EMAIL_SEND_ARTIFICIAL_DELAY > 0:
        current_app.logger.info(
            f"Artificial delay of {EMAIL_SEND_ARTIFICIAL_DELAY}s before sending email to {recipient_email}"
        )
        time.sleep(EMAIL_SEND_ARTIFICIAL_DELAY)
    current_app.logger.info(f"Sending email to {recipient_email} with subject '{subject}'")
    response = requests.post(
        f"{current_app.config.get('EMAIL_API_URL')}/api/send",
        json={
            "from": "noreply@yourapp.com",
            "to": recipient_email,
            "subject": subject,
            "body": body,
        },
        headers={"Authorization": f"Bearer {current_app.config.get('EMAIL_API_KEY')}"},
    )
    current_app.logger.info(f"Email send response status: {response.status_code} for {recipient_email}")
    response.raise_for_status()


def generate_answer_link(survey_id, response_token, answer):
    base_url = current_app.config.get("WEB_ORIGIN")
    params = urlencode({"token": response_token, "answer": answer})
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


def send_survey_emails(survey_id):
    from datetime import datetime

    with current_app.app_context():
        survey: Optional[Survey] = Survey.query.get(survey_id)
        if not survey:
            current_app.logger.warning(f"Survey {survey_id} not found.")
            return
        if survey.status == SurveyStatus.CLOSED.value:
            current_app.logger.info(f"Survey {survey_id} is CLOSED. No emails will be sent.")
            return
        failed_tasks = EmailTask.query.filter(
            EmailTask.survey_id == survey_id,
            EmailTask.status == EmailTaskStatus.FAILED
        ).all()
        for task in failed_tasks:
            task.status = EmailTaskStatus.PENDING
        if failed_tasks:
            db.session.commit()
        tasks_to_send: List[EmailTask] = EmailTask.query.filter(
            EmailTask.survey_id == survey_id,
            EmailTask.status.in_([EmailTaskStatus.PENDING])
        ).all()
        current_app.logger.info(f"Found {len(tasks_to_send)} email tasks (pending) for survey {survey_id}")
        for task in tasks_to_send:
            recipient: Optional[Recipient] = Recipient.query.filter_by(
                survey_id=survey_id, email=task.recipient_email
            ).first()
            if not recipient:
                current_app.logger.info(f"Recipient {task.recipient_email} not found for survey {survey_id}")
                continue
            subject = SURVEY_INVITE_EMAIL_SUBJECT.format(survey_name=survey.name)
            yes_link = generate_answer_link(survey_id, recipient.response_token, SurveyAnswer.YES.value)
            no_link = generate_answer_link(survey_id, recipient.response_token, SurveyAnswer.NO.value)
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
            current_app.logger.info(f"Preparing to send invitation email to {task.recipient_email} for survey {survey_id}")
            try:
                send_email(task.recipient_email, subject, body)
                task.status = EmailTaskStatus.SENT
                task.sent_at = datetime.now(timezone.utc)
                current_app.logger.info(f"Marked email as SENT for {task.recipient_email} in survey {survey_id}")
            except Exception as e:
                task.status = EmailTaskStatus.FAILED
                current_app.logger.warning(f"Failed to send email to {task.recipient_email} for survey {survey_id}: {e}")
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


def send_survey_ended_email(survey_id: str):
    from datetime import datetime

    with current_app.app_context():
        survey = Survey.query.get(survey_id)
        if not survey:
            current_app.logger.warning(f"Survey {survey_id} not found.")
            return
        if not survey.status == SurveyStatus.CLOSED.value:
            current_app.logger.info(f"Survey {survey_id} is not CLOSED. No ended emails will be sent.")
            return
        recipients: List[Recipient] = Recipient.query.filter_by(survey_id=survey.id).all()
        current_app.logger.info(f"Sending survey ended emails to {len(recipients)} recipients for survey {survey.id}")
        subject = SURVEY_ENDED_EMAIL_SUBJECT.format(survey_name=survey.name)
        body = SURVEY_ENDED_EMAIL_TEMPLATE.format(
            survey_name=survey.name,
            year=datetime.now().year,
        )
        for recipient in recipients:
            current_app.logger.info(f"Sending survey ended email to {recipient.email} for survey {survey.id}")
            try:
                send_email(recipient.email, subject, body)
                current_app.logger.info(f"Survey ended email sent to {recipient.email} for survey {survey.id}")
            except Exception as e:
                current_app.logger.warning(f"Failed to send survey ended email to {recipient.email} for survey {survey.id}: {e}")
