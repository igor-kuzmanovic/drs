# Survey Master - User API

## Libraries used

- [Flask](https://flask.palletsprojects.com/en/stable/)
- [Flask CORS](https://flask-cors.readthedocs.io/)
- [Flask Migrate](https://flask-migrate.readthedocs.io/)
- [Flask SQLAlchemy](https://flask-sqlalchemy.readthedocs.io/)
- [PyJWT](https://pyjwt.readthedocs.io/)

## Development

### Requirements

- [Docker](https://www.docker.com/)

### Setup

- When adding new dependencies add them to `requirements.in` and run `docker compose exec user_api pip-compile`

### Server

- Start the services using `docker compose -f ..\compose.yaml up`

### Database

- Initialize the database `docker compose exec user_api flask --app app.app db init`
- Migrate the database `docker compose exec user_api flask --app app.app db upgrade`
- When the database schema changes, generate a new migration `docker compose exec user_api flask --app app.app db migrate -m "Message."`

### Adding dependencies

- Add dependencies to `requirements.in`
- Compile `requirements.txt` with `pip-compile`
