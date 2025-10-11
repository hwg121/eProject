@echo off
:: Green Groves - Cleanup Console Logs (Batch Script for CMD)
:: This script removes console.log and alert statements from frontend files

echo.
echo ========================================
echo   Green Groves - Console Cleanup
echo ========================================
echo.

:: Set paths
set "FRONTEND_SRC=frontend\src"

echo [1/3] Creating backups...
echo.

:: List of files to clean
set files=^
pages\AboutUs.tsx ^
pages\admin\AdminStaffManagement.tsx ^
pages\admin\AdminHeroSection.tsx ^
pages\admin\AdminMapSettings.tsx ^
pages\admin\AdminContactSettings.tsx ^
pages\admin\AdminContactMessages.tsx ^
pages\Videos.tsx ^
pages\Tools.tsx ^
pages\Books.tsx ^
pages\Techniques.tsx ^
pages\Pots.tsx ^
pages\Accessories.tsx ^
pages\Suggestions.tsx ^
pages\Login.tsx ^
pages\TechniqueDetail.tsx ^
pages\VideoDetail.tsx ^
pages\ArticleDetail.tsx ^
pages\EssentialDetail.tsx ^
pages\AdminAboutUs.tsx ^
components\admin\ContentForm.tsx ^
components\admin\UserEditForm.tsx ^
components\admin\UserProfileComponent.tsx ^
components\admin\UserCreate.tsx ^
components\Layout\Header.tsx ^
components\Layout\Footer.tsx ^
components\UI\DetailPage.tsx ^
components\ImageUpload.tsx ^
services\visitorService.ts ^
services\contactSettingService.ts ^
hooks\useGeolocation.ts ^
main-simple.tsx

set count=0

:: Clean each file
for %%f in (%files%) do (
    if exist "%FRONTEND_SRC%\%%f" (
        :: Create backup
        copy /Y "%FRONTEND_SRC%\%%f" "%FRONTEND_SRC%\%%f.backup" >nul 2>&1
        
        :: Use PowerShell to remove console.log lines
        powershell -NoProfile -Command ^
        "$content = Get-Content '%FRONTEND_SRC%\%%f' -Raw; ^
        $content = $content -replace '(?m)^\s*console\.log\(.*?\);?\s*$[\r\n]*', ''; ^
        $content = $content -replace '(?m)^\s*alert\(.*?\);?\s*$[\r\n]*', ''; ^
        $content = $content -replace '(?m)^\s*debugger;?\s*$[\r\n]*', ''; ^
        Set-Content -Path '%FRONTEND_SRC%\%%f' -Value $content -NoNewline"
        
        echo   [OK] %%f
        set /a count+=1
    ) else (
        echo   [SKIP] %%f - not found
    )
)

echo.
echo [2/3] Cleanup complete!
echo   Cleaned %count% files
echo.

echo [3/3] Next steps:
echo.
echo   1. cd frontend
echo   2. npm run build
echo   3. Test the application
echo   4. If OK, delete backups manually or keep them
echo.
echo ========================================
echo   DONE! Files cleaned successfully
echo ========================================
echo.
echo Backups saved with .backup extension
echo To delete backups: del /s frontend\src\*.backup
echo.
pause

