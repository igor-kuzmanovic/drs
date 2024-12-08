# Survey Master - API

## Libraries used

- [Flask](https://flask.palletsprojects.com/en/stable/)

## Development

### Requirements

- [Docker](https://www.docker.com/)
- [Python 3.12](https://www.python.org/)
- [pip-tools](https://github.com/jazzband/pip-tools/)

### Setup

- Install Python
- Create a virtual environment `python -m venv .venv`
- Activate the virtual environment `.\.venv\Scripts\Activate.ps1`
- Make sure virtual environment is activated 'Get-Command python'
- Install pip tools `pip install pip-tools`
- Install requirements `pip-sync`
- When adding new dependencies add them to `requirements.in` and run `pip-compile` 

### Server

- Run `python -m flask --app survey_master.app run`

### Database

- Initialize the database `python -m flask --app survey_master.app db init`
- Migrate the database `python -m flask --app survey_master.app db upgrade`
- When the database schema changes, generate a new migration `python -m flask --app survey_master.app db migrate -m "Message."`

### Adding dependencies

- Add dependencies to `requirements.in`
- Compile `requirements.txt` with `pip-compile`
