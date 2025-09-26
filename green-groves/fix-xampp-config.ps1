# Fix XAMPP Configuration Script
# This script fixes the XAMPP configuration to restore phpMyAdmin access

Write-Host "🔧 Fixing XAMPP Configuration..." -ForegroundColor Yellow

# Stop Apache
Write-Host "⏹️ Stopping Apache..." -ForegroundColor Blue
& "C:\xampp\apache\bin\httpd.exe" -k stop

# Wait a moment
Start-Sleep -Seconds 3

# Copy configuration files
Write-Host "📋 Copying configuration files..." -ForegroundColor Blue

# Copy httpd.conf
Copy-Item "xampp-config\httpd.conf" "C:\xampp\apache\conf\httpd.conf" -Force
Write-Host "✅ httpd.conf copied" -ForegroundColor Green

# Copy httpd-vhosts.conf
Copy-Item "xampp-config\httpd-vhosts.conf" "C:\xampp\apache\conf\extra\httpd-vhosts.conf" -Force
Write-Host "✅ httpd-vhosts.conf copied" -ForegroundColor Green

# Start Apache
Write-Host "▶️ Starting Apache..." -ForegroundColor Blue
& "C:\xampp\apache\bin\httpd.exe" -k start

# Wait for Apache to start
Start-Sleep -Seconds 5

# Test configuration
Write-Host "🧪 Testing configuration..." -ForegroundColor Blue

# Test localhost (should show XAMPP dashboard)
Write-Host "Testing localhost:80 (should show XAMPP dashboard)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ localhost:80 working - XAMPP dashboard accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ localhost:80 failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test phpMyAdmin
Write-Host "Testing phpMyAdmin..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost/phpmyadmin" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ phpMyAdmin accessible at http://localhost/phpmyadmin" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ phpMyAdmin failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend on port 3000
Write-Host "Testing frontend on port 3000..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend accessible at http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend on port 3000 failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backend on port 8080
Write-Host "Testing backend on port 8080..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/simple-test" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API accessible at http://localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Configuration Summary:" -ForegroundColor Yellow
Write-Host "• localhost:80 - XAMPP Dashboard (phpMyAdmin, etc.)" -ForegroundColor White
Write-Host "• localhost:3000 - Frontend React App" -ForegroundColor White
Write-Host "• localhost:8080 - Backend Laravel API" -ForegroundColor White
Write-Host "• 103.252.93.249:80 - Frontend (public access)" -ForegroundColor White
Write-Host "• 103.252.93.249:8080 - Backend API (public access)" -ForegroundColor White

Write-Host "`n✅ XAMPP configuration fixed!" -ForegroundColor Green
Write-Host "Now you can access phpMyAdmin at: http://localhost/phpmyadmin" -ForegroundColor Cyan
