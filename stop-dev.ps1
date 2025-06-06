# Stop Docker Compose services
docker compose down

# Kill Flask and Next.js dev servers
Get-Process | Where-Object { $_.Path -like "*flask.exe" -or $_.Path -like "*node.exe" } | Stop-Process -Force