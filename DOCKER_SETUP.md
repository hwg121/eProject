# 🐳 Hướng Dẫn Chạy Green Groves với Docker Desktop

## 📋 Yêu Cầu Hệ Thống

- Docker Desktop đã được cài đặt và chạy
- Git (để clone project)
- Ít nhất 4GB RAM cho Docker

## 🚀 Hướng Dẫn Setup

### Bước 1: Chuẩn Bị File .env

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Sau đó, mở file `backend/.env` và kiểm tra các cấu hình. File đã được config sẵn cho Docker.

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Kiểm tra file `frontend/.env` - đã được cấu hình để kết nối với backend qua Docker.

### Bước 2: Khởi Động Docker Containers

Từ thư mục gốc của project (eProject), chạy:

```bash
docker-compose up -d
```

Lệnh này sẽ:
- ✅ Build image cho Backend (Laravel)
- ✅ Build image cho Frontend (React)
- ✅ Khởi động MariaDB database
- ✅ Khởi động Nginx web server
- ✅ Khởi động phpMyAdmin

**Lưu ý**: Lần đầu tiên sẽ mất 5-10 phút để build images.

### Bước 3: Cài Đặt Backend

Sau khi containers đã chạy, cần setup Laravel:

```bash
# Generate application key
docker-compose exec backend php artisan key:generate

# Chạy migrations
docker-compose exec backend php artisan migrate

# Seed database (nếu có)
docker-compose exec backend php artisan db:seed

# Clear cache
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan cache:clear
```

### Bước 4: Kiểm Tra Ứng Dụng

Mở trình duyệt và truy cập:

- **Frontend (React)**: http://localhost:5173
- **Backend API (Laravel)**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080
  - Server: `database`
  - Username: `greengroves_user`
  - Password: `user_password_123`
  - Database: `green_groves`

## 🛠️ Các Lệnh Docker Hữu Ích

### Xem logs của containers
```bash
# Tất cả containers
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

### Dừng containers
```bash
docker-compose down
```

### Dừng và xóa volumes (database sẽ bị xóa)
```bash
docker-compose down -v
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Chạy lệnh trong container

#### Backend (Laravel)
```bash
# Chạy artisan commands
docker-compose exec backend php artisan [command]

# Vào shell của backend
docker-compose exec backend sh

# Composer install/update
docker-compose exec backend composer install
docker-compose exec backend composer update
```

#### Frontend (React)
```bash
# Vào shell của frontend
docker-compose exec frontend sh

# Install packages
docker-compose exec frontend npm install [package-name]
```

#### Database
```bash
# Vào MariaDB shell
docker-compose exec database mysql -u greengroves_user -p
# Password: user_password_123
```

### Xem trạng thái containers
```bash
docker-compose ps
```

## 🔧 Troubleshooting

### Lỗi "Port already in use"
Nếu port đã được sử dụng, sửa file `docker-compose.yml`:
- Frontend: Đổi `5173:5173` thành `5174:5173`
- Backend: Đổi `8000:80` thành `8001:80`
- phpMyAdmin: Đổi `8080:80` thành `8081:80`

### Backend không kết nối được database
```bash
# Kiểm tra database đã sẵn sàng chưa
docker-compose exec database mysqladmin ping -h localhost

# Xem logs database
docker-compose logs database
```

### Frontend không gọi được API
- Kiểm tra file `frontend/.env` có `VITE_API_URL=http://localhost:8000`
- Restart frontend container: `docker-compose restart frontend`

### Clear cache và rebuild
```bash
# Dừng tất cả
docker-compose down

# Xóa volumes
docker volume prune

# Xóa images cũ
docker-compose build --no-cache

# Khởi động lại
docker-compose up -d
```

## 📊 Cấu Trúc Services

| Service | Container Name | Port | Mô Tả |
|---------|---------------|------|-------|
| frontend | greengroves_frontend | 5173 | React + Vite |
| nginx | greengroves_nginx | 8000 | Web Server cho Laravel |
| backend | greengroves_backend | 9000 (internal) | Laravel PHP-FPM |
| database | greengroves_database | 3307→3306 | MariaDB |
| phpmyadmin | greengroves_phpmyadmin | 8080 | Database Management |

## 🔒 Database Credentials

**Root User:**
- Username: `root`
- Password: `root_password_123`

**Application User:**
- Username: `greengroves_user`
- Password: `user_password_123`
- Database: `green_groves`

## ⚙️ Cấu Hình Nâng Cao

### Thay đổi PHP configuration
Tạo file `backend/php.ini` và thêm vào Dockerfile:
```dockerfile
COPY php.ini /usr/local/etc/php/php.ini
```

### Thay đổi Nginx configuration
Sửa file `backend/nginx.conf` rồi restart:
```bash
docker-compose restart nginx
```

## 🎯 Development Workflow

1. **Code Changes**:
   - Backend: Thay đổi tự động sync vào container
   - Frontend: Hot reload tự động (Vite HMR)

2. **Database Changes**:
   ```bash
   docker-compose exec backend php artisan make:migration [name]
   docker-compose exec backend php artisan migrate
   ```

3. **Install Dependencies**:
   ```bash
   # Backend
   docker-compose exec backend composer require [package]
   
   # Frontend
   docker-compose exec frontend npm install [package]
   ```

## 📝 Notes

- Volumes được tạo để persist data (database, node_modules, vendor)
- Code changes sẽ tự động reflect nhờ volume mounting
- Database data sẽ không bị mất khi restart containers
- Để reset hoàn toàn: `docker-compose down -v && docker-compose up -d`

## 🆘 Support

Nếu gặp vấn đề, kiểm tra:
1. Docker Desktop đã chạy chưa
2. Ports có bị conflict không
3. Logs của container: `docker-compose logs [service-name]`
4. Container status: `docker-compose ps`

