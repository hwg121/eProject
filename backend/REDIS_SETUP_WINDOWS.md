# Redis Cache Setup Guide - Windows Server

## 🪟 HƯỚNG DẪN CÀI ĐẶT REDIS TRÊN WINDOWS SERVER

---

## **⚠️ LƯU Ý QUAN TRỌNG**

Redis **KHÔNG** có phiên bản chính thức cho Windows. Có 3 lựa chọn:

### **Option 1: Memurai (Recommended) ⭐**
- Port của Redis cho Windows
- Miễn phí cho development
- Hoạt động giống Redis 100%
- Dễ cài đặt nhất

### **Option 2: WSL2 + Redis**
- Dùng Windows Subsystem for Linux
- Chạy Redis Linux trong Windows
- Performance tốt

### **Option 3: Redis trên Docker**
- Cần cài Docker Desktop for Windows
- Portable và dễ quản lý

---

## **🎯 OPTION 1: MEMURAI (RECOMMENDED)**

### **Bước 1: Download & Cài Đặt Memurai**

```powershell
# Download từ trang chính thức
# Link: https://www.memurai.com/get-memurai

# Hoặc dùng Chocolatey (nếu đã cài)
choco install memurai-developer -y
```

**Manual Installation:**
1. Truy cập: https://www.memurai.com/get-memurai
2. Download **Memurai Developer Edition** (FREE)
3. Chạy file `.msi` installer
4. Next → Next → Install
5. Memurai sẽ tự động chạy như Windows Service

### **Bước 2: Kiểm Tra Memurai**

```powershell
# Mở PowerShell/CMD
memurai-cli ping

# Output mong đợi: PONG
```

### **Bước 3: Cài PHP Redis Extension**

**Cách 1: Download DLL thủ công (Recommended)**

```powershell
# 1. Kiểm tra PHP version và architecture
php -v
php -i | findstr "Architecture"

# Output ví dụ:
# PHP 8.2.12 (cli)
# Architecture => x64
```

**Download php_redis.dll:**
- Truy cập: https://pecl.php.net/package/redis
- Hoặc: https://github.com/phpredis/phpredis/releases
- Chọn version phù hợp:
  - PHP 8.2 → redis-5.3.7-8.2-ts-vs16-x64.zip (hoặc nts nếu non-thread-safe)
  - PHP 8.1 → redis-5.3.7-8.1-ts-vs16-x64.zip

**Cài đặt:**

```powershell
# 1. Giải nén và copy php_redis.dll vào:
# Ví dụ: C:\php\ext\php_redis.dll
# Hoặc: C:\xampp\php\ext\php_redis.dll

# 2. Mở file php.ini
# Ví dụ: C:\php\php.ini

# 3. Thêm dòng này vào phần [Extensions]:
extension=redis

# 4. Restart IIS hoặc PHP-CGI
iisreset

# 5. Kiểm tra
php -m | findstr redis
# Output: redis
```

**Cách 2: Dùng PECL (nếu có Cygwin)**

```bash
pecl install redis
```

### **Bước 4: Cài Predis Package**

```powershell
# Di chuyển vào thư mục backend
cd F:\xampp\htdocs\eProject\backend

# Cài Predis qua Composer
composer require predis/predis
```

### **Bước 5: Cấu Hình Laravel**

**Tạo/Sửa file `.env` trên server:**

```env
# Cache Configuration
CACHE_STORE=redis

# Redis Configuration (Memurai uses port 6379 by default)
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1

# Optional: Queue
QUEUE_CONNECTION=redis
```

### **Bước 6: Clear Cache**

```powershell
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

### **Bước 7: Test Redis**

```powershell
# Test bằng script
php test_redis.php

# Hoặc test thủ công với Memurai CLI
memurai-cli
> PING
> SET test "Hello Redis"
> GET test
> exit
```

---

## **🎯 OPTION 2: WSL2 + REDIS**

### **Bước 1: Cài WSL2**

```powershell
# Chạy PowerShell as Administrator
wsl --install

# Restart Windows

# Sau khi restart, cài Ubuntu
wsl --install -d Ubuntu-22.04
```

### **Bước 2: Cài Redis trong WSL**

```bash
# Mở WSL Ubuntu terminal
wsl

# Update & cài Redis
sudo apt update
sudo apt install redis-server -y

# Start Redis
sudo service redis-server start

# Test
redis-cli ping
# Output: PONG
```

### **Bước 3: Expose Redis từ WSL ra Windows**

Redis trong WSL sẽ accessible từ Windows qua `localhost:6379`

### **Bước 4: Auto-start Redis**

**Tạo file `/etc/init.d/redis-autostart`:**

```bash
sudo nano /etc/init.d/redis-autostart
```

```bash
#!/bin/bash
sudo service redis-server start
```

```bash
sudo chmod +x /etc/init.d/redis-autostart
```

**Windows Startup Script (run_wsl_redis.bat):**

```batch
@echo off
wsl sudo service redis-server start
```

Đặt file này vào **Startup folder**:
`C:\Users\YourUser\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

### **Bước 5: Cài PHP Extension & Predis**

Giống như **Option 1**, bước 3-7

---

## **🎯 OPTION 3: DOCKER DESKTOP**

### **Bước 1: Cài Docker Desktop**

1. Download: https://www.docker.com/products/docker-desktop
2. Cài đặt Docker Desktop for Windows
3. Enable WSL2 backend (nếu có)
4. Restart Windows

### **Bước 2: Chạy Redis Container**

```powershell
# Pull Redis image
docker pull redis:alpine

# Run Redis container
docker run -d `
  --name redis-cache `
  -p 6379:6379 `
  --restart always `
  redis:alpine

# Test
docker exec -it redis-cache redis-cli ping
# Output: PONG
```

### **Bước 3: Auto-start Container**

Docker Desktop sẽ tự động start container với flag `--restart always`

### **Bước 4: Cài PHP Extension & Predis**

Giống như **Option 1**, bước 3-7

---

## **⚙️ CẤU HÌNH WINDOWS SERVICE (CHO MEMURAI)**

### **Kiểm Tra Service**

```powershell
# Mở Services (services.msc)
# Tìm "Memurai" trong danh sách

# Hoặc dùng PowerShell
Get-Service Memurai

# Start/Stop service
Start-Service Memurai
Stop-Service Memurai
Restart-Service Memurai
```

### **Cấu Hình Memurai**

File config: `C:\Program Files\Memurai\memurai.conf`

```conf
# Bind to localhost only (secure)
bind 127.0.0.1

# Port
port 6379

# Max memory (ví dụ: 1GB)
maxmemory 1gb
maxmemory-policy allkeys-lru

# Persistence (optional)
save 900 1
save 300 10
save 60 10000

# Log
logfile "C:\Program Files\Memurai\logs\memurai.log"
loglevel notice
```

**Restart service sau khi sửa config:**

```powershell
Restart-Service Memurai
```

---

## **🔥 FIREWALL CONFIGURATION**

Nếu cần remote access (không khuyến khích):

```powershell
# Mở Windows Firewall
# Tạo Inbound Rule cho port 6379

# Hoặc dùng PowerShell
New-NetFirewallRule `
  -DisplayName "Redis/Memurai" `
  -Direction Inbound `
  -LocalPort 6379 `
  -Protocol TCP `
  -Action Allow

# ⚠️ CẢNH BÁO: Chỉ làm nếu thực sự cần!
# Redis không có authentication mặc định!
```

---

## **🧪 TESTING & MONITORING**

### **Test Connection**

```powershell
# Test bằng script PHP
php test_redis.php

# Test bằng Memurai CLI
memurai-cli
> INFO
> DBSIZE
> KEYS *
> exit
```

### **Monitor Real-time**

```powershell
memurai-cli MONITOR
```

### **Check Memory Usage**

```powershell
memurai-cli INFO memory
```

### **Performance Test**

```powershell
# Benchmark tool
memurai-cli --intrinsic-latency 100

# Hoặc
redis-benchmark -h 127.0.0.1 -p 6379 -n 10000 -c 10
```

---

## **📊 IIS CONFIGURATION (NẾU DÙNG IIS)**

### **FastCGI Settings**

1. Mở **IIS Manager**
2. Chọn server → **FastCGI Settings**
3. Edit PHP configuration
4. Add Environment Variable:
   - Name: `REDIS_HOST`
   - Value: `127.0.0.1`
5. Restart IIS: `iisreset`

### **Application Pool**

```powershell
# Restart application pool
Restart-WebAppPool -Name "YourAppPoolName"

# Recycle
Recycle-WebAppPool -Name "YourAppPoolName"
```

---

## **🔧 TROUBLESHOOTING (WINDOWS)**

### **Lỗi: "Connection refused"**

```powershell
# Check service status
Get-Service Memurai

# Check if port is listening
netstat -ano | findstr 6379

# Restart service
Restart-Service Memurai
```

### **Lỗi: "php_redis.dll is not a valid Win32 application"**

→ DLL file không khớp với PHP architecture
- PHP x64 → cần redis x64
- PHP x86 → cần redis x86
- Thread-safe vs Non-thread-safe phải match

### **Lỗi: "Class 'Redis' not found"**

```powershell
# Kiểm tra extension đã load
php -m | findstr redis

# Nếu không có, check php.ini
php --ini

# Đảm bảo có dòng: extension=redis
# Restart IIS/Apache
iisreset
```

### **Memurai không start**

```powershell
# Check Windows Event Viewer
eventvwr

# Check Memurai logs
type "C:\Program Files\Memurai\logs\memurai.log"

# Reinstall service
cd "C:\Program Files\Memurai"
.\memurai-service.exe --service-uninstall
.\memurai-service.exe --service-install
Start-Service Memurai
```

---

## **💰 LICENSING (MEMURAI)**

### **Developer Edition (FREE):**
- ✅ Unlimited use for development
- ✅ Single instance
- ✅ No production use

### **Professional Edition (PAID):**
- 💰 $500/year per instance
- ✅ Production use
- ✅ Multiple instances
- ✅ Clustering support
- ✅ Support & updates

**Cho production:** Cân nhắc migrate sang Linux VPS (rẻ hơn và stable hơn)

---

## **📋 CHECKLIST CÀI ĐẶT**

```
[ ] 1. Download & cài Memurai Developer
[ ] 2. Memurai service đang chạy
[ ] 3. Download php_redis.dll đúng version
[ ] 4. Copy php_redis.dll vào ext folder
[ ] 5. Thêm extension=redis vào php.ini
[ ] 6. Restart IIS/Apache
[ ] 7. php -m | findstr redis → thấy "redis"
[ ] 8. composer require predis/predis
[ ] 9. Update .env: CACHE_STORE=redis
[ ] 10. php artisan config:clear
[ ] 11. php artisan cache:clear
[ ] 12. php test_redis.php → PASSED
```

---

## **🚀 EXPECTED RESULTS**

### **Before (Database Cache):**
```
Cache read:       50-100ms
Dashboard load:   500-800ms
DB queries:       High
```

### **After (Memurai/Redis):**
```
Cache read:       5-10ms    (10x faster)
Dashboard load:   200-400ms (2x faster)
DB queries:       -30% to -50%
```

---

## **💡 KHUYẾN NGHỊ**

### **Cho Development:**
✅ **Memurai Developer Edition** - Hoàn toàn miễn phí, dễ cài

### **Cho Production trên Windows:**
⚠️ **Cân nhắc migrate sang Linux VPS:**
- Redis chính thức chỉ support Linux
- Rẻ hơn (không tốn license Windows)
- Performance tốt hơn
- Stable hơn
- Community support lớn hơn

### **Alternative cho Production Windows:**
1. **Memurai Professional** ($500/year)
2. **Redis trên Docker** (free nhưng cần maintain)
3. **Managed Redis** (AWS ElastiCache, Azure Cache - $$$)

---

## **📞 SUPPORT**

- Memurai Docs: https://docs.memurai.com/
- Redis Docs: https://redis.io/docs/
- PHP Redis: https://github.com/phpredis/phpredis

---

**Created for Green Groves Project**
**Last Updated:** 2025-10-15

