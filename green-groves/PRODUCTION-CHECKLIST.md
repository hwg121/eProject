# 🚀 Production Deployment Checklist - Green Groves

## ✅ Đã hoàn thành

### Backend (Laravel)
- [x] Environment file production (.env.production.vps)
- [x] CORS configuration cho VPS IP
- [x] Database MySQL configuration
- [x] Debug mode = false
- [x] Log level = error
- [x] Web.config cho Windows Server
- [x] Deploy scripts PowerShell

### Frontend (React/Vite)
- [x] Environment file production
- [x] Vite production config với optimization
- [x] Web.config với URL rewriting
- [x] Security headers
- [x] Compression và caching
- [x] Build scripts

### Deploy Infrastructure
- [x] VPS setup script
- [x] Automated deployment scripts
- [x] Database migration scripts
- [x] Permission configuration

## ⚠️ Cần cải thiện trước khi deploy

### 1. Security Enhancements

#### Backend Security
```bash
# Cần thêm vào .env.production.vps
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict
SANCTUM_STATEFUL_DOMAINS=103.252.93.249
```

#### Database Security
- [ ] Tạo database user riêng thay vì dùng root
- [ ] Set password mạnh cho database
- [ ] Restrict database access chỉ từ localhost

### 2. Performance Optimization

#### Backend
- [ ] Enable OPcache trong PHP
- [ ] Configure Redis cho session/cache (optional)
- [ ] Set up proper logging rotation

#### Frontend  
- [ ] Add service worker cho PWA (optional)
- [ ] Optimize images và assets
- [ ] Add CDN configuration (optional)

### 3. Monitoring & Backup

#### Health Checks
- [ ] Add health check endpoints
- [ ] Set up basic monitoring
- [ ] Configure error reporting

#### Backup Strategy
- [ ] Database backup automation
- [ ] File backup strategy
- [ ] Recovery procedures

### 4. SSL/HTTPS Setup
- [ ] Install SSL certificate
- [ ] Update environment URLs to HTTPS
- [ ] Configure HTTP to HTTPS redirect

## 🔧 Immediate Actions Required

### 1. Update Environment Files

**Backend (.env.production.vps):**
```env
# Add these security settings
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict
SANCTUM_STATEFUL_DOMAINS=103.252.93.249

# Set strong database password
DB_PASSWORD=your_strong_password_here

# Configure proper mail settings
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
```

### 2. Database Security
```sql
-- Create dedicated database user
CREATE USER 'green_groves_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON green_groves.* TO 'green_groves_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. PHP Configuration (php.ini)
```ini
# Security settings
expose_php = Off
display_errors = Off
log_errors = On
error_log = /path/to/error.log

# Performance settings
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 2
```

### 4. Apache/IIS Security Headers
Add to .htaccess or web.config:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## 📋 Pre-Deployment Testing

### Local Testing
- [ ] Test build process
- [ ] Verify all API endpoints
- [ ] Check database connections
- [ ] Validate CORS settings

### Staging Environment
- [ ] Deploy to staging first
- [ ] Run full functionality tests
- [ ] Performance testing
- [ ] Security scanning

## 🚀 Deployment Steps

1. **Backup current production** (if exists)
2. **Run setup-vps.ps1** on server
3. **Execute deploy-all.ps1**
4. **Verify deployment**
5. **Run post-deployment tests**

## 📞 Support Contacts

- **Technical Issues**: [Your contact]
- **Server Access**: [VPS provider contact]
- **Emergency**: [Emergency contact]

---

**Deployment Date**: [To be filled]
**Deployed By**: [To be filled]
**Version**: [To be filled]
