# Survey Master

Monorepo for the Survey Master system, including:

- User API (`user_api`)
- Survey API (`survey_api`)
- Email API (`email_api`)
- Web frontend (`web`)

## Requirements

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en) (for local frontend development)
- [Python](https://www.python.org/) (for local API development)

## Local Development

Each service is containerized. You can run all services together:

```sh
docker compose up --build
```

- Environment variables are managed via `.env` files. Copy `.env.example` or `.env.docker.example` as needed.

## Production Deployment

- Each service can be deployed individually to Heroku or another container platform.

## Adding Dependencies

- For Python APIs: Add to `requirements.in` and run `pip-compile` (inside the container).
- For the frontend: Use `npm install <package>` in the `web` directory.

## Useful Commands

- Build and start all services: `docker compose up --build`
- Stop all services: `docker compose down`
