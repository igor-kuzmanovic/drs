FROM python:3.12-slim

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install -U pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 5000

ENV FLASK_APP=survey_master.app:app
ENV FLASK_ENV=development

CMD ["python", "flask", "run", "--host=0.0.0.0"]
