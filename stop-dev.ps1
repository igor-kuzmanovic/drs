# Stop Docker Compose services
docker compose down

# Kill all Next.js dev server processes (node running in web directory)
Get-Process | Where-Object { $_.Path -like "*node.exe" -and $_.StartInfo.WorkingDirectory -like "*web*" } | Stop-Process -Force

# Optionally, kill any orphaned PowerShell windows started by start-dev.ps1
Get-Process powershell | Where-Object { $_.MainWindowTitle -match "docker compose up|npm run dev" } | Stop-Process -Force