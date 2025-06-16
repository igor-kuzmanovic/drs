from abc import ABC, abstractmethod

from flask import current_app
import requests
from typing import Dict, Any, Optional
import time


class EmailSender(ABC):
    @abstractmethod
    def send_email(self, recipient_email: str, subject: str, body: str) -> None:
        pass


class LocalEmailSender(EmailSender):
    # Artificial delay (in seconds) for sending each email, for local development/testing
    EMAIL_SEND_ARTIFICIAL_DELAY: float = 0.0

    def send_email(self, recipient_email: str, subject: str, body: str) -> None:
        api_url: str = current_app.config.get("EMAIL_API_URL")
        api_key: str = current_app.config.get("EMAIL_API_KEY")

        if current_app.debug and self.EMAIL_SEND_ARTIFICIAL_DELAY > 0:
            current_app.logger.info(
                f"Artificial delay of {self.EMAIL_SEND_ARTIFICIAL_DELAY}s before sending email to {recipient_email}"
            )
            time.sleep(self.EMAIL_SEND_ARTIFICIAL_DELAY)

        current_app.logger.info(
            f"Sending email to {recipient_email} with subject '{subject}'"
        )

        payload: Dict[str, Any] = {
            "from": "noreply@yourapp.com",
            "to": recipient_email,
            "subject": subject,
            "body": body,
        }

        headers: Dict[str, str] = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        response = requests.post(api_url, json=payload, headers=headers)
        current_app.logger.info(
            f"Email send response status: {response.status_code} for {recipient_email}"
        )
        response.raise_for_status()


class SendGridEmailSender(EmailSender):
    def send_email(self, recipient_email: str, subject: str, body: str) -> None:
        api_url: str = current_app.config.get("EMAIL_API_URL")
        api_key: str = current_app.config.get("EMAIL_API_KEY")

        sandbox_recipient = current_app.config.get("EMAIL_SANDBOX_RECIPIENT")
        if sandbox_recipient:
            current_app.logger.info(
                f"[SendGrid] Sandbox mode active. Overriding recipient {recipient_email} -> {sandbox_recipient}"
            )
            recipient_email = sandbox_recipient

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        data = {
            "personalizations": [{"to": [{"email": recipient_email}]}],
            "from": {"email": "noreply@yourapp.com"},
            "subject": subject,
            "content": [{"type": "text/html", "value": body}],
        }

        response = requests.post(api_url, headers=headers, json=data)

        current_app.logger.info(
            f"[SendGrid] Sent email to {recipient_email}, status: {response.status_code}"
        )
        response.raise_for_status()


class MailgunEmailSender(EmailSender):
    def send_email(self, recipient_email: str, subject: str, body: str) -> None:
        api_url: str = current_app.config.get("EMAIL_API_URL")
        api_key: str = current_app.config.get("EMAIL_API_KEY")

        sandbox_recipient: Optional[str] = current_app.config.get(
            "EMAIL_SANDBOX_RECIPIENT"
        )
        if sandbox_recipient:
            current_app.logger.info(
                f"[Mailgun] Sandbox mode active. Overriding recipient {recipient_email} -> {sandbox_recipient}"
            )
            recipient_email = sandbox_recipient

        auth = ("api", api_key)
        data = {
            "from": "noreply@yourapp.com",
            "to": recipient_email,
            "subject": subject,
            "html": body,
        }

        response = requests.post(api_url, auth=auth, data=data)
        current_app.logger.info(
            f"[Mailgun] Sent email to {recipient_email}, status: {response.status_code}"
        )
        response.raise_for_status()


class PostmarkEmailSender(EmailSender):
    def send_email(self, recipient_email: str, subject: str, body: str) -> None:
        api_url: str = current_app.config.get("EMAIL_API_URL")
        api_key: str = current_app.config.get("EMAIL_API_KEY")

        sandbox_recipient: Optional[str] = current_app.config.get(
            "EMAIL_SANDBOX_RECIPIENT"
        )
        if sandbox_recipient:
            current_app.logger.info(
                f"[Postmark] Sandbox mode active. Overriding recipient {recipient_email} -> {sandbox_recipient}"
            )
            recipient_email = sandbox_recipient

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": api_key,
        }

        payload = {
            "From": "noreply@yourapp.com",
            "To": recipient_email,
            "Subject": subject,
            "HtmlBody": body,
        }

        response = requests.post(api_url, headers=headers, json=payload)
        current_app.logger.info(
            f"[Postmark] Sent email to {recipient_email}, status: {response.status_code}"
        )
        response.raise_for_status()


def get_email_sender() -> EmailSender:
    email_provider: str = current_app.config.get("EMAIL_PROVIDER").lower()

    if email_provider == "sendgrid":
        return SendGridEmailSender()
    elif email_provider == "mailgun":
        return MailgunEmailSender()
    elif email_provider == "postmark":
        return PostmarkEmailSender()
    else:
        return LocalEmailSender()


__all__ = [
    "EmailSender",
    "get_email_sender",
]
