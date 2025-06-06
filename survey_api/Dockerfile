FROM python:3.13-slim

# Set up working directory
WORKDIR /app

# Copy requirements file
COPY ./requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install -U pip
RUN pip install -U pip-tools
RUN pip-sync

# Copy the application code
COPY . /app

# Expose Flask port
EXPOSE 5000

# Environment variables for Flask
ENV SURVEY_API_FLASK_ENV=production
ENV SURVEY_API_FLASK_DEBUG=0

# Run Flask
CMD ["flask", "--app=app.app", "run", "--host=0.0.0.0"]
