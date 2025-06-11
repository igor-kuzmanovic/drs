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

# Copy the startup script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Environment variables for Flask
ENV FLASK_ENV=production
ENV FLASK_DEBUG=0

# Expose Flask port
EXPOSE 5000

# Run the startup script
CMD ["/app/entrypoint.sh"]
