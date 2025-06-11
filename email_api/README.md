# Survey Master - Email API

## Libraries used

- [Flask](https://flask.palletsprojects.com/en/stable/)

## Development

### Requirements

- [Docker](https://www.docker.com/)

### Setup

- When adding new dependencies add them to `requirements.in` and run `docker compose exec email_api pip-compile`

### Server

- Start the services using `docker compose -f ..\compose.yaml up`

### Adding dependencies

- Add dependencies to `requirements.in`
- Compile `requirements.txt` with `pip-compile`
