# Setup XAMPP for Green Groves
# Run this script as Administrator

Write-Host "🚀 Setting up XAMPP for Green Groves..." -ForegroundColor Green

# XAMPP paths
$XAMPP_ROOT = "C:\xampp"
$APACHE_CONF = "$XAMPP_ROOT\apache\conf"
$HTDOCS = "$XAMPP_ROOT\htdocs"

# Check if XAMPP exists
if (!(Test-Path $XAMPP_ROOT)) {
    Write-Host "❌ XAMPP not found at $XAMPP_ROOT" -ForegroundColor Red
    Write-Host "Please install XAMPP first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ XAMPP found at $XAMPP_ROOT" -ForegroundColor Green

# Backup original configs
Write-Host "📦 Backing up original configurations..." -ForegroundColor Yellow
if (Test-Path "$APACHE_CONF\httpd.conf") {
    Copy-Item "$APACHE_CONF\httpd.conf" "$APACHE_CONF\httpd.conf.backup" -Force
}
if (Test-Path "$APACHE_CONF\extra\httpd-vhosts.conf") {
    Copy-Item "$APACHE_CONF\extra\httpd-vhosts.conf" "$APACHE_CONF\extra\httpd-vhosts.conf.backup" -Force
}

# Copy new configs
Write-Host "📝 Installing new configurations..." -ForegroundColor Yellow
Copy-Item "xampp-config\httpd.conf" "$APACHE_CONF\httpd.conf" -Force
Copy-Item "xampp-config\httpd-vhosts.conf" "$APACHE_CONF\extra\httpd-vhosts.conf" -Force

# Create directories
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
$directories = @(
    "$HTDOCS\frontend",
    "$HTDOCS\backend",
    "$HTDOCS\backend\public"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created: $dir" -ForegroundColor Cyan
    }
}

# Copy .htaccess files
Write-Host "📄 Installing .htaccess files..." -ForegroundColor Yellow
Copy-Item "xampp-config\frontend.htaccess" "$HTDOCS\frontend\.htaccess" -Force
Copy-Item "xampp-config\backend.htaccess" "$HTDOCS\backend\public\.htaccess" -Force

# Set permissions
Write-Host "🔐 Setting permissions..." -ForegroundColor Yellow
icacls "$HTDOCS\frontend" /grant "Everyone:(OI)(CI)F" /T
icacls "$HTDOCS\backend" /grant "Everyone:(OI)(CI)F" /T

# Test Apache configuration
Write-Host "🧪 Testing Apache configuration..." -ForegroundColor Yellow
& "$XAMPP_ROOT\apache\bin\httpd.exe" -t
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Apache configuration is valid!" -ForegroundColor Green
} else {
    Write-Host "❌ Apache configuration has errors!" -ForegroundColor Red
    Write-Host "Please check the configuration files." -ForegroundColor Yellow
}

Write-Host "🎉 XAMPP setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start XAMPP Control Panel" -ForegroundColor White
Write-Host "2. Start Apache service" -ForegroundColor White
Write-Host "3. Deploy your applications:" -ForegroundColor White
Write-Host "   - Frontend: C:\xampp\htdocs\frontend" -ForegroundColor White
Write-Host "   - Backend: C:\xampp\htdocs\backend" -ForegroundColor White
Write-Host "4. Test URLs:" -ForegroundColor White
Write-Host "   - Frontend: http://103.252.93.249:80" -ForegroundColor White
Write-Host "   - Backend: http://103.252.93.249:8080" -ForegroundColor White
Write-Host "   - API: http://103.252.93.249:8080/api" -ForegroundColor White
