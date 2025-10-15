# Redis Cache Setup Guide

## 🚀 Quick Setup Instructions

### Step 1: Install Redis on Server

#### On VPS (Ubuntu/Debian):
```bash
# Install Redis
sudo apt update
sudo apt install redis-server -y

# Start & enable Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Expected output: PONG
```

#### On Windows (Local with Docker):
```bash
# Run Redis container
docker run -d --name redis-cache -p 6379:6379 redis:alpine

# Test Redis
docker exec -it redis-cache redis-cli ping
```

---

### Step 2: Install PHP Redis Extension

#### On VPS:
```bash
# Install PHP Redis extension
sudo apt install php-redis -y

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm

# Verify
php -m | grep redis
```

#### On XAMPP Windows:
1. Download `php_redis.dll` from: https://pecl.php.net/package/redis
2. Copy to: `F:\xampp\php\ext\`
3. Edit `F:\xampp\php\php.ini`, add: `extension=redis`
4. Restart Apache
5. Verify: `php -m | findstr redis`

---

### Step 3: Install Predis Package

```bash
cd backend
composer require predis/predis
```

---

### Step 4: Update .env Configuration

Add these lines to your `.env` file on the server:

```env
# Cache Configuration
CACHE_STORE=redis

# Redis Configuration
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1

# Queue Configuration (Optional - for better performance)
QUEUE_CONNECTION=redis
```

---

### Step 5: Clear Configuration Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

---

### Step 6: Test Redis Connection

```bash
# Test Redis connection
php artisan tinker

# In tinker shell:
Cache::put('test', 'Hello Redis!', 60);
Cache::get('test');
# Expected output: "Hello Redis!"

# Check in Redis directly
redis-cli
> KEYS *
> GET laravel-cache-test
> exit
```

---

## 🔍 Troubleshooting

### Error: "Connection refused [tcp://127.0.0.1:6379]"
```bash
# Check if Redis is running
sudo systemctl status redis-server
# Or
redis-cli ping

# If not running, start it
sudo systemctl start redis-server
```

### Error: "Class 'Redis' not found"
```bash
# PHP Redis extension not installed
# Follow Step 2 again
php -m | grep redis
```

### Error: "Class 'Predis\Client' not found"
```bash
# Predis package not installed
composer require predis/predis
```

---

## 📊 Performance Verification

After setup, you should see:

### Before (Database Cache):
- Cache read: ~50-100ms
- Dashboard load: ~500-800ms
- Visitor tracking: ~200ms

### After (Redis Cache):
- Cache read: ~5-10ms (10x faster)
- Dashboard load: ~200-400ms (2x faster)
- Visitor tracking: ~50ms (4x faster)

---

## ⚡ Optional: Queue with Redis

For even better performance, use Redis for queues too:

```bash
# Update .env
QUEUE_CONNECTION=redis

# Create systemd service for queue worker
sudo nano /etc/systemd/system/laravel-worker.service
```

```ini
[Unit]
Description=Laravel Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/php /path/to/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start worker
sudo systemctl enable laravel-worker
sudo systemctl start laravel-worker
sudo systemctl status laravel-worker
```

---

## 🎯 Summary

✅ Redis installed and running
✅ PHP Redis extension enabled
✅ Predis package installed
✅ .env configured for Redis
✅ Cache cleared and tested

**Expected Result:** 5-10x faster cache performance! 🚀

