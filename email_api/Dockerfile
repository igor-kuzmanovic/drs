# Stage 1: Build MailHog
FROM golang:1.18-alpine AS mailhog-builder

# Install MailHog
RUN apk --no-cache add --virtual build-dependencies \
    git \
  && mkdir -p /root/gocode \
  && export GOPATH=/root/gocode \
  && go install github.com/mailhog/MailHog@latest

# Stage 2: Python Flask app
FROM python:3.12-alpine

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

# Copy MailHog binary from the first stage
COPY --from=mailhog-builder /root/gocode/bin/MailHog /usr/local/bin/

# Copy the startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Environment variables for Flask
ENV EMAIL_API_FLASK_ENV=production
ENV EMAIL_API_FLASK_DEBUG=0

# Expose Flask port and MailHog ports
EXPOSE 5000 1025 8025

# Run the startup script
CMD ["/app/start.sh"]
