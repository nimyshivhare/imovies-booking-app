$env:PATH = "C:\Users\Dell\nodejs;" + $env:PATH
Set-Location "C:\Users\Dell\Downloads\antigravity\client"
Write-Host "Starting IMovies Vite Frontend Client on Port 3000..."
& "C:\Users\Dell\nodejs\npm.cmd" start
