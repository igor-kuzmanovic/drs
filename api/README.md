# Survey Master - API

## Libraries used

- [Flask](https://flask.palletsprojects.com/en/stable/)
- [Flask CORS](https://flask-cors.readthedocs.io/)
- [Flask Migrate](https://flask-migrate.readthedocs.io/)
- [Flask SQLAlchemy](https://flask-sqlalchemy.readthedocs.io/)
- [PyJWT](https://pyjwt.readthedocs.io/)
- [Python Dotenv](https://github.com/theskumar/python-dotenv/)


## Development

### Requirements

- [Docker](https://www.docker.com/)
- [Python 3.12](https://www.python.org/)
- [pip-tools](https://github.com/jazzband/pip-tools/)

### Setup

- Create a virtual environment `python -m venv venv`
- Activate the virtual environment `.\.venv\Scripts\Activate.ps1`
- Make sure virtual environment is activated `Get-Command python`
- Install pip tools `pip install pip-tools`
- Install requirements `pip-sync`
- When adding new dependencies add them to `requirements.in` and run `pip-compile` 

### Server

- Use the PyCharm `Flask` script

or

- Start the PostgreSQL service using `docker compose --env-file ..\.env -f ..\compose.yaml -p drs up -d postgres`
- Run `python -m flask run`

### Database

- Initialize the database `python -m flask --app survey_master.app db init`
- Migrate the database `python -m flask --app survey_master.app db upgrade`
- When the database schema changes, generate a new migration `python -m flask --app survey_master.app db migrate -m "Message."`

### Adding dependencies

- Add dependencies to `requirements.in`
- Compile `requirements.txt` with `pip-compile`
