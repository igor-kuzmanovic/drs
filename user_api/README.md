# Survey Master - User API

Flask-based API for user management.

## Requirements

- [Docker](https://www.docker.com/)

## Local Development

1. Copy `.env.example` to `.env` and adjust as needed.
2. Build and run with Docker Compose from the project root:

   ```sh
   docker compose up --build user_api
   ```

3. The API will be available at `http://localhost:5000`.

## Database Migrations

- Initialize:  
  `docker compose exec user_api flask --app app.app db init`
- Migrate:  
  `docker compose exec user_api flask --app app.app db migrate -m "Message"`
- Upgrade:  
  `docker compose exec user_api flask --app app.app db upgrade`

## Adding Dependencies

- Add to `requirements.in`
- Run:  
  `docker compose exec user_api pip-compile`

## Production

- See `DEPLOY_EXAMPLE.md`
