# Script simple para iniciar AppControl
Write-Host "🚀 Iniciando AppControl..." -ForegroundColor Green

# Terminar procesos en puertos específicos
Write-Host "Limpiando puertos..." -ForegroundColor Yellow

# Buscar procesos en puerto 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    foreach ($conn in $port3000) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "Proceso en puerto 3000 terminado" -ForegroundColor Green
    }
}

# Buscar procesos en puerto 5000
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    foreach ($conn in $port5000) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "Proceso en puerto 5000 terminado" -ForegroundColor Green
    }
}

# Esperar un momento
Start-Sleep -Seconds 2

Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""

# Iniciar aplicación
npm run dev