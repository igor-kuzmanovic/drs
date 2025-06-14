from datetime import datetime, timezone
import multiprocessing
import threading
from .models import Survey, SurveyStatus
from .db import db
from .email import send_survey_ended_email

CONCURRENCY_MODE = "process"  # "process", "thread", or None


def run_concurrent_email_task(email_func, *args):
    if CONCURRENCY_MODE == "process":
        p = multiprocessing.Process(target=email_func, args=args)
        p.start()
    elif CONCURRENCY_MODE == "thread":
        t = threading.Thread(target=email_func, args=args)
        t.start()
    else:
        email_func(*args)


def close_expired_survey(survey: Survey) -> bool:
    now = datetime.now(timezone.utc)

    if survey.status == SurveyStatus.ACTIVE and survey.end_date <= now:
        survey.status = SurveyStatus.CLOSED

        db.session.commit()

        run_concurrent_email_task(send_survey_ended_email, survey)

        return True

    return False
