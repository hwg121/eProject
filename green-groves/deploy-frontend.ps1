# Deploy Frontend to VPS Windows Server with XAMPP
# Run this script on the VPS server

Write-Host "🚀 Starting Frontend Deployment for XAMPP..." -ForegroundColor Green

# Set variables
$FrontendPath = "C:\xampp\htdocs\green-groves-frontend"
$FrontendSource = "D:\eProject\green-groves\frontend"

Write-Host "📁 Frontend Path: $FrontendPath" -ForegroundColor Yellow

# Create directory if not exists
if (!(Test-Path $FrontendPath)) {
    New-Item -ItemType Directory -Path $FrontendPath -Force
    Write-Host "✅ Created frontend directory" -ForegroundColor Green
}

# Copy source files
Write-Host "📋 Copying frontend source files..." -ForegroundColor Yellow
Copy-Item -Path "$FrontendSource\*" -Destination $FrontendPath -Recurse -Force

# Copy production environment file
Write-Host "⚙️ Setting up environment..." -ForegroundColor Yellow
Copy-Item -Path "$FrontendSource\env.production.vps" -Destination "$FrontendPath\.env" -Force

# Install dependencies with optimizations
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location $FrontendPath
npm ci --production --silent

# Clear npm cache
Write-Host "🧹 Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Build for production with optimizations
Write-Host "🔨 Building for production..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

# Analyze bundle size
Write-Host "📊 Analyzing bundle size..." -ForegroundColor Yellow
if (Test-Path "dist/assets") {
    $bundleSize = (Get-ChildItem -Path "dist/assets" -Recurse | Measure-Object -Property Length -Sum).Sum
    $bundleSizeMB = [math]::Round($bundleSize / 1MB, 2)
    Write-Host "📦 Total bundle size: $bundleSizeMB MB" -ForegroundColor Cyan
}

# Copy built files to web root
Write-Host "📁 Copying built files..." -ForegroundColor Yellow
$WebRoot = "C:\xampp\htdocs\green-groves"
if (!(Test-Path $WebRoot)) {
    New-Item -ItemType Directory -Path $WebRoot -Force
}

# Copy dist contents to web root
Copy-Item -Path "$FrontendPath\dist\*" -Destination $WebRoot -Recurse -Force

# Copy .htaccess for Apache
Write-Host "📄 Creating .htaccess for Apache..." -ForegroundColor Yellow
$htaccess = @"
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
"@
$htaccess | Out-File -FilePath "$WebRoot\.htaccess" -Encoding UTF8

# Set permissions for XAMPP
Write-Host "🔐 Setting permissions..." -ForegroundColor Yellow
icacls $WebRoot /grant "Everyone:(OI)(CI)F" /T

Write-Host "✅ Frontend deployment completed!" -ForegroundColor Green
Write-Host "🌐 Frontend URL: http://103.252.93.249" -ForegroundColor Cyan
