# Green Groves - Cleanup Remaining Console Logs (PowerShell)
# This script removes console.log and alert statements from frontend files
# while preserving console.error and console.warn for production debugging

Write-Host "🧹 Starting frontend console cleanup..." -ForegroundColor Cyan
Write-Host ""

# Count before cleanup
$before = (Select-String -Path "frontend\src\**\*.ts*" -Pattern "console\.log|alert\(" -SimpleMatch:$false | Measure-Object).Count
Write-Host "📊 Found $before console.log/alert statements" -ForegroundColor Yellow
Write-Host ""

# Files to clean
$filesToClean = @(
    "frontend\src\pages\AboutUs.tsx",
    "frontend\src\pages\admin\AdminStaffManagement.tsx",
    "frontend\src\pages\admin\AdminHeroSection.tsx",
    "frontend\src\pages\admin\AdminMapSettings.tsx",
    "frontend\src\pages\admin\AdminContactSettings.tsx",
    "frontend\src\pages\admin\AdminContactMessages.tsx",
    "frontend\src\pages\Videos.tsx",
    "frontend\src\pages\Tools.tsx",
    "frontend\src\pages\Books.tsx",
    "frontend\src\pages\Techniques.tsx",
    "frontend\src\pages\Pots.tsx",
    "frontend\src\pages\Accessories.tsx",
    "frontend\src\pages\Suggestions.tsx",
    "frontend\src\pages\Login.tsx",
    "frontend\src\pages\TechniqueDetail.tsx",
    "frontend\src\pages\VideoDetail.tsx",
    "frontend\src\pages\ArticleDetail.tsx",
    "frontend\src\pages\EssentialDetail.tsx",
    "frontend\src\pages\AdminAboutUs.tsx",
    "frontend\src\components\admin\ContentForm.tsx",
    "frontend\src\components\admin\UserEditForm.tsx",
    "frontend\src\components\admin\UserProfileComponent.tsx",
    "frontend\src\components\admin\UserCreate.tsx",
    "frontend\src\components\Layout\Header.tsx",
    "frontend\src\components\Layout\Footer.tsx",
    "frontend\src\components\UI\DetailPage.tsx",
    "frontend\src\components\ImageUpload.tsx",
    "frontend\src\services\visitorService.ts",
    "frontend\src\services\contactSettingService.ts",
    "frontend\src\hooks\useGeolocation.ts",
    "frontend\src\main-simple.tsx"
)

Write-Host "🔧 Cleaning files..." -ForegroundColor Cyan
$cleanedCount = 0

foreach ($file in $filesToClean) {
    if (Test-Path $file) {
        # Create backup
        Copy-Item $file "$file.backup" -Force
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Remove console.log lines (but keep console.error and console.warn)
        $content = $content -replace '(?m)^\s*console\.log\(.*?\);?\s*$[\r\n]*', ''
        
        # Remove alert() statements
        $content = $content -replace '(?m)^\s*alert\(.*?\);?\s*$[\r\n]*', ''
        
        # Remove debugger statements  
        $content = $content -replace '(?m)^\s*debugger;?\s*$[\r\n]*', ''
        
        # Save cleaned content
        Set-Content -Path $file -Value $content -NoNewline
        
        Write-Host "  ✓ Cleaned: $file" -ForegroundColor Green
        $cleanedCount++
    }
    else {
        Write-Host "  ⚠ Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Cleaned $cleanedCount files" -ForegroundColor Green
Write-Host ""

# Count after cleanup
$after = (Select-String -Path "frontend\src\**\*.ts*" -Pattern "console\.log|alert\(" -SimpleMatch:$false | Measure-Object).Count
$removed = $before - $after

Write-Host "📊 Results:" -ForegroundColor Cyan
Write-Host "  Before:  $before statements" -ForegroundColor White
Write-Host "  After:   $after statements" -ForegroundColor White
Write-Host "  Removed: $removed statements" -ForegroundColor Green
Write-Host ""

if ($after -eq 0) {
    Write-Host "🎉 SUCCESS! All console.log and alert statements removed!" -ForegroundColor Green
}
else {
    Write-Host "⚠ Still $after statements remaining. Review manually:" -ForegroundColor Yellow
    Select-String -Path "frontend\src\**\*.ts*" -Pattern "console\.log|alert\(" | Select-Object Path, LineNumber, Line
}

Write-Host ""
Write-Host "💡 Backups created with .backup extension" -ForegroundColor Cyan
Write-Host "   To restore: Get-ChildItem -Recurse -Filter *.backup | Remove-Item" -ForegroundColor Gray
Write-Host ""
Write-Host "🔨 Next steps:" -ForegroundColor Cyan
Write-Host "   1. cd frontend" -ForegroundColor White
Write-Host "   2. npm run build" -ForegroundColor White
Write-Host "   3. Test the application" -ForegroundColor White
Write-Host "   4. If OK, delete backups: Get-ChildItem frontend\src -Recurse -Filter *.backup | Remove-Item" -ForegroundColor White
Write-Host "   5. Commit changes: git add . && git commit -m 'Clean up debug code'" -ForegroundColor White
Write-Host ""
Write-Host "✨ Cleanup complete!" -ForegroundColor Green

