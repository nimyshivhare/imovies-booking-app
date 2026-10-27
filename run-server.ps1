$env:PATH = "C:\Users\Dell\nodejs;" + $env:PATH
Set-Location "C:\Users\Dell\Downloads\antigravity\server"
Write-Host "Starting IMovies Backend Server..."
& "C:\Users\Dell\nodejs\node.exe" server.js
