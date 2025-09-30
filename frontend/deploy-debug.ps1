# Deploy Debug Version to XAMPP
# Run this script to deploy debug version

Write-Host "🚀 Deploying Debug Version..." -ForegroundColor Green

# Set variables
$FrontendPath = "C:\xampp\htdocs\frontend"
$FrontendSource = "D:\eProject\green-groves\frontend"

Write-Host "📁 Frontend Path: $FrontendPath" -ForegroundColor Yellow

# Create directory if not exists
if (!(Test-Path $FrontendPath)) {
    New-Item -ItemType Directory -Path $FrontendPath -Force
    Write-Host "✅ Created frontend directory" -ForegroundColor Green
}

# Copy debug files
Write-Host "📋 Copying debug files..." -ForegroundColor Yellow

# Copy debug HTML
Copy-Item -Path "$FrontendSource\index-simple.html" -Destination "$FrontendPath\index.html" -Force
Write-Host "✅ Copied debug index.html" -ForegroundColor Green

# Copy debug files
Copy-Item -Path "$FrontendSource\debug.html" -Destination "$FrontendPath\debug.html" -Force
Write-Host "✅ Copied debug.html" -ForegroundColor Green

# Copy dist files
if (Test-Path "$FrontendSource\dist") {
    Copy-Item -Path "$FrontendSource\dist\*" -Destination $FrontendPath -Recurse -Force
    Write-Host "✅ Copied dist files" -ForegroundColor Green
}

# Copy .htaccess
if (Test-Path "$FrontendSource\..\xampp-config\frontend.htaccess") {
    Copy-Item -Path "$FrontendSource\..\xampp-config\frontend.htaccess" -Destination "$FrontendPath\.htaccess" -Force
    Write-Host "✅ Copied .htaccess" -ForegroundColor Green
}

Write-Host "🎉 Debug deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Test URLs:" -ForegroundColor Cyan
Write-Host "🌐 Main App: http://103.252.93.249:80" -ForegroundColor White
Write-Host "🔧 Debug Page: http://103.252.93.249:80/debug.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 If you see a blank page:" -ForegroundColor Yellow
Write-Host "1. Open browser console (F12)" -ForegroundColor White
Write-Host "2. Check for JavaScript errors" -ForegroundColor White
Write-Host "3. Visit debug page for more info" -ForegroundColor White
