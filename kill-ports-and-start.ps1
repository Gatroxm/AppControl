# Script simple para limpiar puertos e iniciar AppControl
Write-Host "🧹 Limpiando puertos ocupados..." -ForegroundColor Yellow

# Buscar y terminar procesos Node.js en puertos 3000 y 5000
$processes3000 = netstat -ano | findstr ":3000.*LISTENING"
$processes5000 = netstat -ano | findstr ":5000.*LISTENING"

if ($processes3000) {
    Write-Host "Terminando procesos en puerto 3000..." -ForegroundColor Yellow
    $processes3000 | ForEach-Object {
        $processId = ($_ -split '\s+')[-1]
        if ($processId -match '^\d+$' -and $processId -ne '0') {
            try {
                taskkill /PID $processId /F 2>$null
                Write-Host "  ✓ Proceso $processId terminado" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠ No se pudo terminar proceso $processId" -ForegroundColor Yellow
            }
        }
    }
}

if ($processes5000) {
    Write-Host "Terminando procesos en puerto 5000..." -ForegroundColor Yellow
    $processes5000 | ForEach-Object {
        $processId = ($_ -split '\s+')[-1]
        if ($processId -match '^\d+$' -and $processId -ne '0') {
            try {
                taskkill /PID $processId /F 2>$null
                Write-Host "  ✓ Proceso $processId terminado" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠ No se pudo terminar proceso $processId" -ForegroundColor Yellow
            }
        }
    }
}

# Esperar un momento para que se liberen los puertos
Start-Sleep -Seconds 3

# Iniciar la aplicación
Write-Host "🚀 Iniciando AppControl..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener los servicios" -ForegroundColor Yellow
Write-Host ""

npm run dev