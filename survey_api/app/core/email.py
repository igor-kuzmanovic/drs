from datetime import datetime, timezone
import requests
from flask import current_app
from urllib.parse import urlencode

from .db import db
from .models import EmailTask, EmailTaskStatus, Recipient, Survey


def send_email(recipient_email, subject, body):
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
</div>
"""


def send_survey_emails(survey_id):
    from datetime import datetime

    with current_app.app_context():
        survey = Survey.query.get(survey_id)
        if not survey:
            current_app.logger.warning(f"Survey {survey_id} not found.")
            return
        pending_tasks = EmailTask.query.filter_by(
            survey_id=survey_id, status=EmailTaskStatus.PENDING
        ).all()
        for task in pending_tasks:
            recipient = Recipient.query.filter_by(
                survey_id=survey_id, email=task.recipient_email
            ).first()
            if not recipient:
                continue
            subject = SURVEY_INVITE_EMAIL_SUBJECT.format(survey_name=survey.name)
            yes_link = generate_answer_link(survey_id, recipient.response_token, "YES")
            no_link = generate_answer_link(survey_id, recipient.response_token, "NO")
            cant_link = generate_answer_link(
                survey_id, recipient.response_token, "CANT_ANSWER"
            )
            body = SURVEY_INVITE_EMAIL_TEMPLATE.format(
                survey_name=survey.name,
                survey_question=survey.question,
                yes_link=yes_link,
                no_link=no_link,
                cant_link=cant_link,
                year=datetime.now().year,
            )
            send_email(task.recipient_email, subject, body)
            task.status = EmailTaskStatus.SENT
            task.sent_at = datetime.now(timezone.utc)
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


def send_survey_ended_email(survey):
    from datetime import datetime

    recipients = Recipient.query.filter_by(survey_id=survey.id).all()
    subject = SURVEY_ENDED_EMAIL_SUBJECT.format(survey_name=survey.name)
    body = SURVEY_ENDED_EMAIL_TEMPLATE.format(
        survey_name=survey.name,
        year=datetime.now().year,
    )
    for recipient in recipients:
        send_email(recipient.email, subject, body)
