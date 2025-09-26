# Deploy All to VPS Windows Server
# Run this script on the VPS server

Write-Host "🚀 Starting Full Deployment..." -ForegroundColor Green

# Deploy Backend
Write-Host "📡 Deploying Backend..." -ForegroundColor Yellow
& ".\deploy-backend.ps1"

# Deploy Frontend
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
& ".\deploy-frontend.ps1"

# Test deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow

# Test backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://103.252.93.249:8080/api/test" -Method GET
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend is running!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://103.252.93.249:80" -Method GET
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Backend: http://103.252.93.249:8080" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://103.252.93.249:80" -ForegroundColor Cyan
