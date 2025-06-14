FROM python:3.13-slim

# Create a non-root user
RUN adduser --disabled-password --no-create-home appuser

WORKDIR /app

# Install system dependencies (if needed, e.g., for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev curl && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Copy and set permissions for entrypoint
RUN chmod +x /app/entrypoint.sh

# Set environment variables
ENV FLASK_ENV=production \
    FLASK_DEBUG=0 \
    PYTHONUNBUFFERED=1

# Expose Flask port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health/ready || exit 1

# Switch to non-root user
USER appuser

# Run the startup script
CMD ["/app/entrypoint.sh"]
