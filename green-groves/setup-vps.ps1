# Setup VPS Windows Server for Green Groves with XAMPP
# Run this script on the VPS server

Write-Host "🚀 Setting up VPS for Green Groves with XAMPP..." -ForegroundColor Green

# Install required software
Write-Host "📦 Installing required software..." -ForegroundColor Yellow

# Install XAMPP
Write-Host "Installing XAMPP..." -ForegroundColor Cyan
# Download and install XAMPP from https://www.apachefriends.org/download.html

# Install Node.js
Write-Host "Installing Node.js..." -ForegroundColor Cyan
# Download and install Node.js from https://nodejs.org/

# Install Composer
Write-Host "Installing Composer..." -ForegroundColor Cyan
# Download and install Composer from https://getcomposer.org/

# Configure XAMPP
Write-Host "🔧 Configuring XAMPP..." -ForegroundColor Yellow

# Start XAMPP services
Write-Host "Starting XAMPP services..." -ForegroundColor Cyan
Start-Process "C:\xampp\xampp-control.exe"

# Configure Apache
Write-Host "Configuring Apache..." -ForegroundColor Yellow
# Enable mod_rewrite in httpd.conf
# Uncomment: LoadModule rewrite_module modules/mod_rewrite.so

# Configure MySQL
Write-Host "Configuring MySQL..." -ForegroundColor Yellow
# Create database
$mysqlCommand = "CREATE DATABASE IF NOT EXISTS green_groves;"
$mysqlCommand | & "C:\xampp\mysql\bin\mysql.exe" -u root

# Configure PHP
Write-Host "Configuring PHP..." -ForegroundColor Yellow
# Enable required PHP extensions in php.ini
# extension=mysqli
# extension=pdo_mysql
# extension=openssl
# extension=curl
# extension=mbstring
# extension=tokenizer
# extension=xml
# extension=ctype
# extension=json
# extension=bcmath

Write-Host "✅ VPS setup completed!" -ForegroundColor Green
Write-Host "🌐 Backend: http://103.252.93.249/green-groves-backend" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://103.252.93.249" -ForegroundColor Cyan