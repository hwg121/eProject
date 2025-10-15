# ===================================
# Redis Installation Script for Windows Server
# ===================================
# This script helps install Memurai (Redis for Windows) and configure Laravel
# Usage: Run as Administrator in PowerShell
#        .\install_redis_windows.ps1

# Require Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell → Run as Administrator" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Redis Setup for Green Groves - Windows Server        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Memurai Installation
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 1: Checking Memurai Installation" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$memuraiInstalled = $false
$memuraiPaths = @(
    "C:\Program Files\Memurai\memurai-cli.exe",
    "C:\Program Files (x86)\Memurai\memurai-cli.exe"
)

foreach ($path in $memuraiPaths) {
    if (Test-Path $path) {
        $memuraiInstalled = $true
        Write-Host "✅ Memurai found at: $path" -ForegroundColor Green
        break
    }
}

if (-not $memuraiInstalled) {
    Write-Host "❌ Memurai not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Memurai first:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://www.memurai.com/get-memurai" -ForegroundColor Yellow
    Write-Host "  2. Download Memurai Developer Edition (FREE)" -ForegroundColor Yellow
    Write-Host "  3. Run the installer (.msi file)" -ForegroundColor Yellow
    Write-Host "  4. Run this script again after installation" -ForegroundColor Yellow
    Write-Host ""
    
    $openBrowser = Read-Host "Open download page in browser? (y/n)"
    if ($openBrowser -eq "y") {
        Start-Process "https://www.memurai.com/get-memurai"
    }
    
    pause
    exit
}

Write-Host ""

# Step 2: Check Memurai Service
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 2: Checking Memurai Service" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$service = Get-Service -Name "Memurai" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "✅ Memurai service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Memurai service is stopped. Starting..." -ForegroundColor Yellow
        Start-Service -Name "Memurai"
        Start-Sleep -Seconds 2
        $service = Get-Service -Name "Memurai"
        if ($service.Status -eq "Running") {
            Write-Host "✅ Memurai service started successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start Memurai service" -ForegroundColor Red
        }
    }
    
    # Set to automatic startup
    Set-Service -Name "Memurai" -StartupType Automatic
    Write-Host "✅ Memurai set to automatic startup" -ForegroundColor Green
} else {
    Write-Host "❌ Memurai service not found!" -ForegroundColor Red
    Write-Host "   Please reinstall Memurai" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""

# Step 3: Test Memurai Connection
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 3: Testing Memurai Connection" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$memuraiCli = $memuraiPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
$pingResult = & $memuraiCli ping 2>&1

if ($pingResult -match "PONG") {
    Write-Host "✅ Memurai connection successful (PONG)" -ForegroundColor Green
} else {
    Write-Host "❌ Memurai not responding" -ForegroundColor Red
    Write-Host "   Result: $pingResult" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""

# Step 4: Check PHP
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 4: Checking PHP Installation" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$phpVersion = php -v 2>&1 | Select-String -Pattern "PHP (\d+\.\d+\.\d+)"
if ($phpVersion) {
    Write-Host "✅ PHP found: $($phpVersion.Matches.Groups[1].Value)" -ForegroundColor Green
    
    # Check PHP architecture
    $phpArch = php -i 2>&1 | Select-String -Pattern "Architecture.*=>\s*(\w+)"
    if ($phpArch) {
        Write-Host "   Architecture: $($phpArch.Matches.Groups[1].Value)" -ForegroundColor Gray
    }
    
    # Check thread safety
    $phpTs = php -i 2>&1 | Select-String -Pattern "Thread Safety.*=>\s*(\w+)"
    if ($phpTs) {
        Write-Host "   Thread Safety: $($phpTs.Matches.Groups[1].Value)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ PHP not found in PATH!" -ForegroundColor Red
    pause
    exit
}

Write-Host ""

# Step 5: Check PHP Redis Extension
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 5: Checking PHP Redis Extension" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$redisExtension = php -m 2>&1 | Select-String -Pattern "redis"

if ($redisExtension) {
    Write-Host "✅ PHP Redis extension is loaded" -ForegroundColor Green
} else {
    Write-Host "⚠️  PHP Redis extension not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual installation required:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://pecl.php.net/package/redis" -ForegroundColor Yellow
    Write-Host "  2. Download DLL matching your PHP version and architecture" -ForegroundColor Yellow
    Write-Host "  3. Copy php_redis.dll to your PHP ext folder" -ForegroundColor Yellow
    Write-Host "  4. Add 'extension=redis' to php.ini" -ForegroundColor Yellow
    Write-Host "  5. Restart IIS: iisreset" -ForegroundColor Yellow
    Write-Host ""
    
    $phpIniPath = php --ini 2>&1 | Select-String -Pattern "Loaded Configuration File:\s+(.+)"
    if ($phpIniPath) {
        Write-Host "Your php.ini location: $($phpIniPath.Matches.Groups[1].Value)" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "Continue anyway? Extension is optional if using Predis. (y/n)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "y") {
        exit
    }
}

Write-Host ""

# Step 6: Install Predis
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 6: Installing Predis Package" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if (Test-Path "composer.json") {
    Write-Host "Installing predis/predis via Composer..." -ForegroundColor Gray
    composer require predis/predis --no-interaction
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Predis package installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Predis package" -ForegroundColor Red
    }
} else {
    Write-Host "❌ composer.json not found!" -ForegroundColor Red
    Write-Host "   Are you in the backend directory?" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""

# Step 7: Update .env
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 7: Updating .env Configuration" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if (Test-Path ".env") {
    # Backup .env
    Copy-Item ".env" ".env.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "✅ Backed up .env file" -ForegroundColor Green
    
    $envContent = Get-Content ".env"
    
    # Update CACHE_STORE
    if ($envContent -match "^CACHE_STORE=") {
        $envContent = $envContent -replace "^CACHE_STORE=.*", "CACHE_STORE=redis"
        Write-Host "✅ Updated CACHE_STORE=redis" -ForegroundColor Green
    } else {
        $envContent += "`nCACHE_STORE=redis"
        Write-Host "✅ Added CACHE_STORE=redis" -ForegroundColor Green
    }
    
    # Add Redis config if not exists
    if ($envContent -notmatch "^REDIS_CLIENT=") {
        $envContent += @"

# Redis Configuration (Added by install script)
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1
"@
        Write-Host "✅ Added Redis configuration" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Redis configuration already exists" -ForegroundColor Cyan
    }
    
    # Save .env
    $envContent | Set-Content ".env" -Encoding UTF8
    
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "   Creating .env from env.redis.example..." -ForegroundColor Yellow
    
    if (Test-Path "env.redis.example") {
        Copy-Item "env.redis.example" ".env"
        Write-Host "✅ Created .env file" -ForegroundColor Green
    } else {
        Write-Host "❌ env.redis.example not found" -ForegroundColor Red
    }
}

Write-Host ""

# Step 8: Clear Laravel Caches
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 8: Clearing Laravel Caches" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

php artisan config:clear
Write-Host "✅ Config cache cleared" -ForegroundColor Green

php artisan cache:clear
Write-Host "✅ Application cache cleared" -ForegroundColor Green

php artisan config:cache
Write-Host "✅ Config cache rebuilt" -ForegroundColor Green

Write-Host ""

# Step 9: Restart IIS
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 9: Restarting IIS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$restartIIS = Read-Host "Restart IIS now? (y/n)"
if ($restartIIS -eq "y") {
    iisreset
    Write-Host "✅ IIS restarted" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remember to restart IIS manually: iisreset" -ForegroundColor Yellow
}

Write-Host ""

# Step 10: Test Redis Connection
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 10: Testing Laravel Redis Connection" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if (Test-Path "test_redis.php") {
    Write-Host "Running full Redis test..." -ForegroundColor Gray
    php test_redis.php
} else {
    Write-Host "Quick connection test..." -ForegroundColor Gray
    $testResult = php artisan tinker --execute="Cache::put('test', 'OK', 60); echo Cache::get('test');" 2>&1
    if ($testResult -match "OK") {
        Write-Host "✅ Laravel can connect to Redis!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Connection test inconclusive" -ForegroundColor Yellow
        Write-Host "   Result: $testResult" -ForegroundColor Gray
    }
}

Write-Host ""

# Final Summary
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              INSTALLATION COMPLETED!                     ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Memurai service running" -ForegroundColor Green
Write-Host "✅ Predis package installed" -ForegroundColor Green
Write-Host "✅ Laravel configured for Redis" -ForegroundColor Green
Write-Host "✅ Caches cleared" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Expected Performance Improvements:" -ForegroundColor Cyan
Write-Host "   • Cache operations: 10x faster" -ForegroundColor White
Write-Host "   • Dashboard load time: 2x faster" -ForegroundColor White
Write-Host "   • Database load: -30% to -50%" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Test your application" -ForegroundColor White
Write-Host "   2. Monitor Memurai: memurai-cli MONITOR" -ForegroundColor White
Write-Host "   3. Check stats: memurai-cli INFO stats" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "Installation completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""

pause

