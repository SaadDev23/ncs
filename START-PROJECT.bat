@echo off
echo ========================================
echo Starting NCS Project...
echo ========================================
echo.

REM Check if ports are in use and kill if necessary
for /f "tokens=5" %%a in ('netstat -ano ^| find ":8080"') do taskkill /F /PID %%a 2>nul
timeout /t 1 /nobreak

REM Start Backend Server in a new window
echo Starting Backend Server (Port 8080)...
start "Backend Server" cmd /k "cd /d f:\ncs-main (3)\ncs-main\server && npm start"
timeout /t 3 /nobreak

REM Start Frontend Client in a new window
echo Starting Frontend Client (Port 3000)...
start "Frontend Client" cmd /k "cd /d f:\ncs-main (3)\ncs-main\client && npm start"

echo.
echo ========================================
echo Servers starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo ========================================
echo.
pause
