#!/bin/sh

# Start MailHog in the background
MailHog &

# Start Flask app
flask --app=app.app run --host=0.0.0.0
