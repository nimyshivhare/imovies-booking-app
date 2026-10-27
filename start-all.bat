@echo off
title IMovies Full-Stack Launcher
set "PATH=C:\Users\Dell\nodejs;%PATH%"

echo ====================================================
echo Starting IMovies Full-Stack Application...
echo ====================================================

start "IMovies Backend Server (Port 5000)" powershell -ExecutionPolicy Bypass -NoExit -File "%~dp0run-server.ps1"
timeout /t 3 /nobreak >nul

start "IMovies Frontend Client (Port 3000)" powershell -ExecutionPolicy Bypass -NoExit -File "%~dp0run-client.ps1"

echo Both services launched!
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:3000
