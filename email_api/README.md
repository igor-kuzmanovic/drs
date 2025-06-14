# Survey Master - Email API

Flask-based API for sending emails.

## Requirements

- [Docker](https://www.docker.com/)

## Local Development

1. Copy `.env.example` to `.env` and adjust as needed.
2. Build and run with Docker Compose from the project root:

   ```sh
   docker compose up --build email_api
   ```

3. The API will be available at `http://localhost:5000`.

## Adding Dependencies

- Add to `requirements.in`
- Run:  
  `docker compose exec email_api pip-compile`

## Production

- Deploy using Docker or to Heroku (see `DEPLOY.md`).
