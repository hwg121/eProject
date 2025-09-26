# XAMPP Setup Guide for Green Groves

## 🚀 Quick Setup

### 1. Prerequisites
- Windows Server with XAMPP installed
- Administrator privileges
- Green Groves project cloned

### 2. Run Setup Script
```powershell
# Run as Administrator
.\setup-xampp.ps1
```

### 3. Manual Setup (if script fails)

#### A. Backup Original Configs
```bash
# Backup original Apache configs
copy C:\xampp\apache\conf\httpd.conf C:\xampp\apache\conf\httpd.conf.backup
copy C:\xampp\apache\conf\extra\httpd-vhosts.conf C:\xampp\apache\conf\extra\httpd-vhosts.conf.backup
```

#### B. Copy New Configs
```bash
# Copy new configurations
copy xampp-config\httpd.conf C:\xampp\apache\conf\httpd.conf
copy xampp-config\httpd-vhosts.conf C:\xampp\apache\conf\extra\httpd-vhosts.conf
```

#### C. Create Directories
```bash
# Create project directories
mkdir C:\xampp\htdocs\green-groves-frontend
mkdir C:\xampp\htdocs\green-groves-backend
mkdir C:\xampp\htdocs\green-groves-backend\public
```

#### D. Copy .htaccess Files
```bash
# Copy .htaccess files
copy xampp-config\frontend.htaccess C:\xampp\htdocs\green-groves-frontend\.htaccess
copy xampp-config\backend.htaccess C:\xampp\htdocs\green-groves-backend\public\.htaccess
```

## 🔧 Configuration Details

### Apache Configuration
- **Frontend**: Port 80 (http://103.252.93.249:80)
- **Backend**: Port 8080 (http://103.252.93.249:8080)
- **CORS**: Enabled for all origins
- **Virtual Hosts**: Configured for both services

### CORS Headers
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN
Access-Control-Allow-Credentials: true
```

### Directory Structure
```
C:\xampp\htdocs\
├── green-groves-frontend\     # Frontend (Port 80)
│   ├── .htaccess
│   └── [build files]
└── green-groves-backend\      # Backend (Port 8080)
    └── public\
        ├── .htaccess
        └── [Laravel files]
```

## 🧪 Testing

### 1. Test Apache Configuration
```bash
C:\xampp\apache\bin\httpd.exe -t
```

### 2. Test URLs
- Frontend: http://103.252.93.249:80
- Backend: http://103.252.93.249:8080
- API Test: http://103.252.93.249:8080/api/cors-test

### 3. Test CORS
Open `frontend/test-cors.html` in browser and click "Test CORS"

## 🚀 Deployment

### 1. Deploy Frontend
```powershell
.\deploy-frontend.ps1
```

### 2. Deploy Backend
```powershell
.\deploy-backend.ps1
```

### 3. Deploy All
```powershell
.\deploy-all.ps1
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Apache Won't Start
- Check if ports 80 and 8080 are free
- Run `netstat -an | findstr :80`
- Run `netstat -an | findstr :8080`

#### 2. CORS Still Blocked
- Check .htaccess files are in correct locations
- Verify Apache modules are loaded (mod_headers, mod_rewrite)
- Check browser console for specific errors

#### 3. 404 Errors
- Verify virtual host configuration
- Check DocumentRoot paths
- Ensure files are in correct directories

#### 4. PHP Errors
- Check PHP error logs
- Verify Laravel .env file
- Run `php artisan config:clear`

## 📋 Checklist

- [ ] XAMPP installed
- [ ] Apache configs updated
- [ ] Directories created
- [ ] .htaccess files copied
- [ ] Apache restarted
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] CORS tested
- [ ] All URLs working

## 🎯 Final URLs

- **Frontend**: http://103.252.93.249:80
- **Backend**: http://103.252.93.249:8080
- **API**: http://103.252.93.249:8080/api
- **CORS Test**: http://103.252.93.249:8080/api/cors-test
