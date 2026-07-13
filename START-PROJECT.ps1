# NCS Project Startup Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting NCS Project..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing processes on ports
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting Backend Server (Port 8080)..." -ForegroundColor Green
$backendJob = Start-Process PowerShell -ArgumentList {
    Set-Location "f:\ncs-main (3)\ncs-main\server"
    npm start
} -PassThru -NoNewWindow
Write-Host "Backend PID: $($backendJob.Id)" -ForegroundColor Green

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Client (Port 3000)..." -ForegroundColor Green
$frontendJob = Start-Process PowerShell -ArgumentList {
    Set-Location "f:\ncs-main (3)\ncs-main\client"
    npm start
} -PassThru -NoNewWindow
Write-Host "Frontend PID: $($frontendJob.Id)" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Servers Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop servers" -ForegroundColor Magenta
Write-Host ""

# Keep the window open
Read-Host "Press Enter to continue"
