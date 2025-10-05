# AppControl - Script de Inicializacion Automatica
# Este script configura todo el proyecto AppControl desde cero

Write-Host "Iniciando configuracion de AppControl..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray

# Verificar si Node.js esta instalado
Write-Host "Verificando prerequisitos..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js no esta instalado. Por favor instalalo desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar si npm esta disponible
try {
    $npmVersion = npm --version
    Write-Host "npm detectado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm no esta disponible" -ForegroundColor Red
    exit 1
}

# Verificar si MongoDB esta ejecutandose (opcional)
Write-Host "Verificando MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "MongoDB esta ejecutandose" -ForegroundColor Green
    } else {
        Write-Host "MongoDB no detectado. Asegurate de tenerlo instalado y ejecutandose" -ForegroundColor Yellow
        Write-Host "Puedes usar MongoDB Atlas como alternativa en la nube" -ForegroundColor Gray
    }
} catch {
    Write-Host "No se pudo verificar MongoDB" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

# Instalar dependencias del proyecto raiz
Write-Host "Instalando dependencias principales..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "Dependencias principales instaladas" -ForegroundColor Green
} catch {
    Write-Host "Error instalando dependencias principales" -ForegroundColor Red
    exit 1
}

# Instalar dependencias del servidor
Write-Host "Instalando dependencias del servidor..." -ForegroundColor Cyan
try {
    Set-Location server
    npm install
    Write-Host "Dependencias del servidor instaladas" -ForegroundColor Green
} catch {
    Write-Host "Error instalando dependencias del servidor" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Volver al directorio raiz
Set-Location ..

# Instalar dependencias del cliente
Write-Host "Instalando dependencias del cliente..." -ForegroundColor Cyan
try {
    Set-Location client
    npm install
    Write-Host "Dependencias del cliente instaladas" -ForegroundColor Green
} catch {
    Write-Host "Error instalando dependencias del cliente" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Volver al directorio raiz
Set-Location ..

Write-Host ""
Write-Host "Configurando archivos de entorno..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

# Copiar archivos .env si no existen
if (-not (Test-Path "server\.env")) {
    Write-Host "Creando archivo de configuracion del servidor..." -ForegroundColor Cyan
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "Archivo server\.env creado desde .env.example" -ForegroundColor Green
} else {
    Write-Host "El archivo server\.env ya existe" -ForegroundColor Blue
}

if (-not (Test-Path "client\.env")) {
    Write-Host "Creando archivo de configuracion del cliente..." -ForegroundColor Cyan
    Copy-Item "client\.env.example" "client\.env"
    Write-Host "Archivo client\.env creado desde .env.example" -ForegroundColor Green
} else {
    Write-Host "El archivo client\.env ya existe" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Inicializando base de datos..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

# Ejecutar seed de la base de datos
Write-Host "Ejecutando seed de la base de datos..." -ForegroundColor Cyan
try {
    Set-Location server
    npm run seed
    Write-Host "Base de datos inicializada con datos de ejemplo" -ForegroundColor Green
} catch {
    Write-Host "Error al inicializar la base de datos" -ForegroundColor Red
    Write-Host "Verifica que MongoDB este ejecutandose" -ForegroundColor Gray
    Set-Location ..
    exit 1
}

# Volver al directorio raiz
Set-Location ..

Write-Host ""
Write-Host "Configuracion completada exitosamente!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Gray

# Mostrar informacion de usuarios de demostracion
Write-Host ""
Write-Host "Usuarios de demostracion creados:" -ForegroundColor Yellow
Write-Host "ADMIN:   admin@appcontrol.com   / Admin123!" -ForegroundColor Magenta
Write-Host "EDITOR:  editor@appcontrol.com  / Editor123!" -ForegroundColor Cyan
Write-Host "USUARIO: usuario@appcontrol.com / User123!" -ForegroundColor Blue

# Mostrar informacion de ejecucion
Write-Host ""
Write-Host "Para ejecutar el proyecto:" -ForegroundColor Yellow
Write-Host "Ambos servicios:    npm run dev" -ForegroundColor White
Write-Host "Solo servidor:      npm run server" -ForegroundColor White
Write-Host "Solo cliente:       npm run client" -ForegroundColor White

Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor Yellow
Write-Host "Frontend:   http://localhost:3000" -ForegroundColor White
Write-Host "Backend:    http://localhost:5000/api" -ForegroundColor White
Write-Host "Health:     http://localhost:5000/api/health" -ForegroundColor White

Write-Host ""
Write-Host "Archivos importantes:" -ForegroundColor Yellow
Write-Host "README.md - Documentacion completa" -ForegroundColor Gray
Write-Host "IMPLEMENTATION_SUMMARY.md - Resumen de implementacion" -ForegroundColor Gray
Write-Host "server\.env - Configuracion del servidor" -ForegroundColor Gray
Write-Host "client\.env - Configuracion del cliente" -ForegroundColor Gray

Write-Host ""
Write-Host "Inicia el proyecto ahora con: npm run dev" -ForegroundColor Green -BackgroundColor Black

# Preguntar si desea ejecutar el proyecto inmediatamente
Write-Host ""
$runNow = Read-Host "Deseas ejecutar el proyecto ahora? (s/N)"
if ($runNow -eq "s" -or $runNow -eq "S" -or $runNow -eq "y" -or $runNow -eq "Y") {
    Write-Host ""
    Write-Host "Iniciando AppControl..." -ForegroundColor Green
    Write-Host "Presiona Ctrl+C para detener los servicios" -ForegroundColor Gray
    Write-Host ""
    
    # Ejecutar el proyecto
    npm run dev
} else {
    Write-Host ""
    Write-Host "Proyecto listo. Ejecuta npm run dev cuando quieras iniciarlo." -ForegroundColor Cyan
}