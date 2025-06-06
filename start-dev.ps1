# Start databases in Docker
docker compose up -d user_postgres survey_postgres email_api
if ($LASTEXITCODE -ne 0) {
    Write-Host "docker compose up failed. Aborting startup." -ForegroundColor Red
    exit 1
}

# Start user_api in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd user_api; .\.venv\Scripts\Activate.ps1; flask --app app.app run --port=5001"

# Start survey_api in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd survey_api; .\.venv\Scripts\Activate.ps1; flask --app app.app run --port=5002"

# Start Next.js frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"