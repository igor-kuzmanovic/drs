#!/bin/sh

# Start MailPit in the background
/mailpit &

# Start Flask app
flask --app=app.app run --host=0.0.0.0
