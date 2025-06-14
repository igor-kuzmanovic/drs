from datetime import datetime, timezone
import requests
from flask import current_app
from urllib.parse import urlencode

from .core.db import db
from .core.models import EmailTask, EmailTaskStatus, Recipient, Survey

def send_email(recipient_email, subject, body):
    response = requests.post(
        f"{current_app.config.get('EMAIL_API_URL')}/api/send",
        json={
            "from": "noreply@yourapp.com",
            "to": recipient_email,
            "subject": subject,
            "body": body,
        },
        headers={"Authorization": f"Bearer {current_app.config.get('EMAIL_API_KEY')}"}
    )
    response.raise_for_status()

def generate_answer_link(survey_id, response_token, answer):
    base_url = current_app.config.get("WEB_ORIGIN")
    params = urlencode({
        "token": response_token,
        "answer": answer
    })
    return f"{base_url}/respond/{survey_id}?{params}"

def send_survey_emails(survey_id):
    with current_app.app_context():
        survey = Survey.query.get(survey_id)
        if not survey:
            print(f"Survey {survey_id} not found.")
            return
        pending_tasks = EmailTask.query.filter_by(survey_id=survey_id, status=EmailTaskStatus.PENDING).all()
        for task in pending_tasks:
            # Find the recipient for this email task
            recipient = Recipient.query.filter_by(survey_id=survey_id, email=task.recipient_email).first()
            if not recipient:
                continue
            subject = f"Survey: {survey.name}"
            yes_link = generate_answer_link(survey_id, recipient.response_token, "YES")
            no_link = generate_answer_link(survey_id, recipient.response_token, "NO")
            cant_link = generate_answer_link(survey_id, recipient.response_token, "CANT_ANSWER")
            body = f"""
            <div style="font-family:sans-serif;max-width:600px;margin:auto;">
              <h2>{survey.name}</h2>
              <p>{survey.question}</p>
              <div style="margin:24px 0;">
                <a href="{yes_link}" style="padding:10px 20px;background:#22c55e;color:white;text-decoration:none;border-radius:4px;margin-right:10px;">Yes</a>
                <a href="{no_link}" style="padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:4px;margin-right:10px;">No</a>
                <a href="{cant_link}" style="padding:10px 20px;background:#64748b;color:white;text-decoration:none;border-radius:4px;">Can't answer</a>
              </div>
              <p>If the buttons above do not work, copy and paste the following link into your browser:</p>
              <p><a href="{yes_link}">{yes_link}</a></p>
            </div>
            """
            send_email(task.recipient_email, subject, body)
            task.status = EmailTaskStatus.SENT
            task.sent_at = datetime.now(timezone.utc)
            db.session.commit()
