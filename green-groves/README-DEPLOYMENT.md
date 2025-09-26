# Green Groves Deployment Guide for XAMPP

## VPS Configuration
- **Frontend**: http://103.252.93.249
- **Backend**: http://103.252.93.249/green-groves-backend
- **API**: http://103.252.93.249/green-groves-backend/api

## Prerequisites
1. Windows Server with XAMPP
2. PHP 8.2+ (included in XAMPP)
3. MySQL 8.0+ (included in XAMPP)
4. Apache (included in XAMPP)
5. Node.js 18+
6. Composer

## Deployment Steps

### 1. Setup VPS
```powershell
# Run as Administrator
.\setup-vps.ps1
```

### 2. Deploy Backend
```powershell
.\deploy-backend.ps1
```

### 3. Deploy Frontend
```powershell
.\deploy-frontend.ps1
```

### 4. Deploy All
```powershell
.\deploy-all.ps1
```

## Environment Files
- Backend: `env.production.vps` → `.env`
- Frontend: `env.production.vps` → `.env`

## CORS Configuration
- Backend CORS allows: http://103.252.93.249, https://103.252.93.249
- Frontend API: http://103.252.93.249/green-groves-backend/api

## Testing
- Backend: http://103.252.93.249/green-groves-backend/api/test
- Frontend: http://103.252.93.249

## XAMPP Configuration
1. Enable mod_rewrite in Apache
2. Start Apache and MySQL services
3. Create database: `green_groves`
4. Set proper file permissions

## Troubleshooting
1. Check Apache logs: `C:\xampp\apache\logs\`
2. Check PHP logs: `C:\xampp\php\logs\`
3. Check Laravel logs: `storage\logs\laravel.log`
4. Verify database connection
5. Check file permissions
6. Ensure mod_rewrite is enabled
