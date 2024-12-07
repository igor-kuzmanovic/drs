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

### Server

- Run `python -m flask --app survey_master.app run`

### Adding dependencies

- Add dependencies to `requirements.in`
- Compile `requirements.txt` with `pip-compile`
