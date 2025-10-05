# Script para iniciar AppControl limpiando puertos ocupados
Write-Host "🧹 Limpiando puertos ocupados..." -ForegroundColor Yellow

# Función para terminar procesos en un puerto específico
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $connections = netstat -ano | findstr ":$Port "
    if ($connections) {
        Write-Host "Puerto $Port está ocupado. Terminando procesos..." -ForegroundColor Yellow
        
        # Extraer PIDs de las conexiones
        $pids = $connections | ForEach-Object {
            $parts = $_ -split '\s+' | Where-Object { $_ -ne '' }
            if ($parts.Length -ge 5 -and $parts[4] -match '^\d+$' -and $parts[4] -ne '0') {
                $parts[4]
            }
        } | Sort-Object -Unique
        
        foreach ($pid in $pids) {
            try {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "  ✓ Proceso $pid terminado" -ForegroundColor Green
            }
            catch {
                Write-Host "  ⚠ No se pudo terminar proceso $pid" -ForegroundColor Yellow
            }
        }
        
        # Esperar un momento para que se liberen los puertos
        Start-Sleep -Seconds 2
    }
}

# Limpiar puertos 3000 y 5000
Stop-ProcessOnPort -Port 3000
Stop-ProcessOnPort -Port 5000

# Verificar que los puertos estén libres
Write-Host "🔍 Verificando puertos..." -ForegroundColor Cyan

# Iniciar la aplicación
Write-Host "🚀 Iniciando AppControl..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener los servicios" -ForegroundColor Yellow
Write-Host ""

npm run dev