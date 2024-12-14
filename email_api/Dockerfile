FROM python:3.12-alpine

# Copy MailPit binary
COPY --from=axllent/mailpit /mailpit /mailpit

# Set up working directory
WORKDIR /app

# Copy requirements file
COPY ./requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install -U pip
RUN pip install -U pip-tools
RUN pip-sync

# Copy application code
COPY . /app

# Copy the startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Environment variables for Flask
ENV EMAIL_API_FLASK_ENV=production
ENV EMAIL_API_FLASK_DEBUG=0

# Expose Flask port and MailPit Web UI port
EXPOSE 5000 8025

# Run the startup script
CMD ["/app/start.sh"]
