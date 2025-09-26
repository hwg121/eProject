# Deploy Backend to VPS Windows Server with XAMPP
# Run this script on the VPS server

Write-Host "🚀 Starting Backend Deployment for XAMPP..." -ForegroundColor Green

# Set variables
$BackendPath = "C:\xampp\htdocs\green-groves-backend"
$BackendSource = "D:\eProject\green-groves\backend"

Write-Host "📁 Backend Path: $BackendPath" -ForegroundColor Yellow

# Create directory if not exists
if (!(Test-Path $BackendPath)) {
    New-Item -ItemType Directory -Path $BackendPath -Force
    Write-Host "✅ Created backend directory" -ForegroundColor Green
}

# Copy files
Write-Host "📋 Copying backend files..." -ForegroundColor Yellow
Copy-Item -Path "$BackendSource\*" -Destination $BackendPath -Recurse -Force

# Set permissions for XAMPP
Write-Host "🔐 Setting permissions..." -ForegroundColor Yellow
icacls $BackendPath /grant "Everyone:(OI)(CI)F" /T
icacls "$BackendPath\storage" /grant "Everyone:(OI)(CI)F" /T
icacls "$BackendPath\bootstrap\cache" /grant "Everyone:(OI)(CI)F" /T

# Copy production environment file
Write-Host "⚙️ Setting up environment..." -ForegroundColor Yellow
Copy-Item -Path "$BackendSource\env.production.vps" -Destination "$BackendPath\.env" -Force

# Generate application key
Write-Host "🔑 Generating application key..." -ForegroundColor Yellow
Set-Location $BackendPath
php artisan key:generate --force

# Run migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
php artisan migrate --force

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
php artisan db:seed --force

# Install/Update Composer dependencies with optimizations
Write-Host "📦 Installing Composer dependencies..." -ForegroundColor Yellow
composer install --optimize-autoloader --no-dev --prefer-dist

# Clear and optimize caches
Write-Host "🧹 Optimizing caches..." -ForegroundColor Yellow
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Optimize autoloader
Write-Host "⚡ Optimizing autoloader..." -ForegroundColor Yellow
composer dump-autoload --optimize --classmap-authoritative

# Create storage link if not exists
Write-Host "🔗 Creating storage link..." -ForegroundColor Yellow
php artisan storage:link

# Run database optimizations
Write-Host "🗄️ Optimizing database..." -ForegroundColor Yellow
php artisan migrate --force
php artisan db:seed --force

# Optimize database tables
Write-Host "📊 Running database optimization..." -ForegroundColor Yellow
# This will be handled by the new migration we created

Write-Host "✅ Backend deployment completed!" -ForegroundColor Green
Write-Host "🌐 Backend URL: http://103.252.93.249:8080" -ForegroundColor Cyan
Write-Host "🌐 API URL: http://103.252.93.249:8080/api" -ForegroundColor Cyan
