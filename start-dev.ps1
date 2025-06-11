# Start databases in Docker in a new window and show all logs
Start-Process powershell -ArgumentList "-NoExit", "-Command", "docker compose up"

# Start Next.js frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"