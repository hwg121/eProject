# 🚀 Green Groves AWS EC2 Deployment Guide

## 📋 Prerequisites

- AWS EC2 instance running Ubuntu 20.04+ or 22.04+
- Public IP: `13.211.146.7`
- Security groups configured for ports 22, 80, 443
- SSH access to the instance

## 🔧 Step-by-Step Deployment

### 1. Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@13.211.146.7
```

### 2. Run Deployment Script

```bash
# Make script executable
chmod +x deploy-aws.sh

# Run deployment
./deploy-aws.sh
```

### 3. Manual Configuration (if needed)

#### Backend Configuration

```bash
# Navigate to backend directory
cd /var/www/green-groves/backend

# Copy production environment
cp production.env .env

# Generate application key
php artisan key:generate

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Set permissions
sudo chown -R www-data:www-data /var/www/green-groves/backend
sudo chmod -R 755 /var/www/green-groves/backend
```

#### Frontend Configuration

```bash
# Navigate to frontend directory
cd /var/www/green-groves/frontend

# Copy production environment
cp production.env .env

# Install dependencies
npm install

# Build for production
npm run build

# Set permissions
sudo chown -R www-data:www-data /var/www/green-groves/frontend
sudo chmod -R 755 /var/www/green-groves/frontend
```

#### Nginx Configuration

```bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/green-groves

# Enable site
sudo ln -s /etc/nginx/sites-available/green-groves /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Systemd Service

```bash
# Copy service file
sudo cp green-groves-backend.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable green-groves-backend
sudo systemctl start green-groves-backend

# Check status
sudo systemctl status green-groves-backend
```

## 🌐 Access URLs

- **Frontend**: http://13.211.146.7
- **Backend API**: http://13.211.146.7:8000/api
- **Admin Dashboard**: http://13.211.146.7/admin
- **Login**: admin@greengroves.com / admin123

## 🔧 Useful Commands

### Check Services

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Laravel backend
sudo systemctl status green-groves-backend

# Check logs
sudo journalctl -u green-groves-backend -f
```

### Restart Services

```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart Laravel backend
sudo systemctl restart green-groves-backend
```

### Update Application

```bash
# Pull latest changes
cd /var/www/green-groves
git pull origin main

# Update backend
cd backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Update frontend
cd ../frontend
npm install
npm run build

# Restart services
sudo systemctl restart green-groves-backend
sudo systemctl reload nginx
```

## 🔒 Security Considerations

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw --force enable
   ```

2. **SSL Certificate** (Optional)
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx

   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

3. **Database Backup**
   ```bash
   # Backup SQLite database
   cp /var/www/green-groves/backend/database/database.sqlite /var/backups/green-groves-$(date +%Y%m%d).sqlite
   ```

## 📊 Monitoring

### Log Files

- **Nginx Access**: `/var/log/nginx/green-groves.access.log`
- **Nginx Error**: `/var/log/nginx/green-groves.error.log`
- **Laravel Backend**: `sudo journalctl -u green-groves-backend`

### Health Checks

```bash
# Check if services are running
curl -I http://13.211.146.7
curl -I http://13.211.146.7:8000/api/test

# Check database
cd /var/www/green-groves/backend
php artisan tinker
>>> DB::connection()->getPdo();
```

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   sudo chown -R www-data:www-data /var/www/green-groves
   sudo chmod -R 755 /var/www/green-groves
   ```

2. **Port Already in Use**
   ```bash
   sudo lsof -i :8000
   sudo kill -9 <PID>
   ```

3. **Nginx Configuration Error**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Laravel Backend Not Starting**
   ```bash
   sudo journalctl -u green-groves-backend -f
   ```

## 📈 Performance Optimization

1. **Enable Gzip Compression** (Already configured in nginx.conf)
2. **Set up Redis** for caching (Optional)
3. **Configure CDN** for static assets (Optional)
4. **Set up monitoring** with tools like New Relic or DataDog (Optional)

## 🔄 Backup Strategy

1. **Database Backup**
   ```bash
   # Daily backup script
   #!/bin/bash
   cp /var/www/green-groves/backend/database/database.sqlite /var/backups/green-groves-$(date +%Y%m%d).sqlite
   find /var/backups -name "green-groves-*.sqlite" -mtime +7 -delete
   ```

2. **Application Backup**
   ```bash
   # Weekly backup script
   tar -czf /var/backups/green-groves-app-$(date +%Y%m%d).tar.gz /var/www/green-groves
   ```

## ✅ Deployment Checklist

- [ ] EC2 instance running Ubuntu 20.04+
- [ ] Security groups configured
- [ ] SSH access working
- [ ] Deployment script executed
- [ ] Backend service running
- [ ] Frontend accessible
- [ ] API endpoints working
- [ ] Admin dashboard accessible
- [ ] Database seeded
- [ ] Logs monitoring
- [ ] Backup strategy in place

## 🎉 Success!

Your Green Groves application should now be running on AWS EC2!

- **Frontend**: http://13.211.146.7
- **Admin**: http://13.211.146.7/admin
- **API**: http://13.211.146.7:8000/api
