# 🐳 Green Groves - Docker Setup

## ✅ Cài Đặt Hoàn Tất!

### 🌐 Truy Cập Ứng Dụng

| Service | URL | Mô Tả |
|---------|-----|-------|
| **Frontend** | http://localhost:5173 | React + Vite App |
| **Backend API** | http://localhost:8000 | Laravel REST API |
| **phpMyAdmin** | http://localhost:8080 | Database Management |

### 🔐 Thông Tin Đăng Nhập

#### Admin Portal
- **Email**: `admin@greengroves.com`
- **Password**: `admin123`

#### Moderator
- **Email**: `moderator@greengroves.com`
- **Password**: `moderator123`

#### Database (phpMyAdmin)
- **Server**: `database`
- **Username**: `greengroves_user` (hoặc `root`)
- **Password**: `user_password_123` (hoặc `root_password_123`)
- **Database**: `green_groves`

---

## 🚀 Lệnh Docker Thường Dùng

### Khởi Động / Dừng

```bash
# Khởi động tất cả containers
docker-compose up -d

# Dừng tất cả containers
docker-compose down

# Restart containers
docker-compose restart

# Rebuild và khởi động lại
docker-compose up -d --build
```

### Xem Logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs frontend
docker-compose logs -f frontend

# Xem logs backend
docker-compose logs -f backend nginx
```

### Quản Lý Backend (Laravel)

```bash
# Chạy artisan commands
docker-compose exec backend php artisan [command]

# Ví dụ:
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan cache:clear

# Vào shell của backend container
docker-compose exec backend sh

# Composer install/update
docker-compose exec backend composer install
docker-compose exec backend composer update [package-name]
```

### Quản Lý Frontend (React)

```bash
# Vào shell của frontend container
docker-compose exec frontend sh

# Install npm packages
docker-compose exec frontend npm install [package-name]

# Build production
docker-compose exec frontend npm run build
```

### Quản Lý Database

```bash
# Vào MariaDB shell
docker-compose exec database mysql -u greengroves_user -p
# Password: user_password_123

# Hoặc dùng root
docker-compose exec database mysql -u root -p
# Password: root_password_123

# Reset database
docker-compose exec backend php artisan migrate:fresh --seed
```

---

## 🔧 Troubleshooting

### Port Bị Xung Đột
Nếu port đã được sử dụng, sửa trong `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "5174:5173"  # Thay 5173 → 5174
  nginx:
    ports:
      - "8001:80"    # Thay 8000 → 8001
  phpmyadmin:
    ports:
      - "8081:80"    # Thay 8080 → 8081
```

### Database Connection Error
```bash
# Kiểm tra database container
docker-compose ps database

# Xem logs database
docker-compose logs database

# Restart database
docker-compose restart database
```

### Frontend Không Kết Nối API
Kiểm tra file `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api
```

### Clear Tất Cả và Rebuild
```bash
# Dừng và xóa tất cả (bao gồm volumes)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Khởi động lại
./setup-docker.sh
```

---

## 📦 Cấu Trúc Docker

### Containers
- **greengroves_frontend** - React development server (Vite)
- **greengroves_backend** - Laravel PHP-FPM
- **greengroves_nginx** - Web server cho Laravel API
- **greengroves_database** - MariaDB database
- **greengroves_phpmyadmin** - Database management UI

### Volumes
- **db_data** - Database persistent storage
- **backend_vendor** - Laravel vendor dependencies
- **frontend_node_modules** - Node.js dependencies

### Network
- **greengroves_network** - Bridge network kết nối tất cả services

---

## 🔄 Development Workflow

1. **Code Changes**: 
   - Code changes tự động sync vào containers
   - Frontend: Hot reload (Vite HMR)
   - Backend: Thay đổi code → refresh browser

2. **Database Migrations**:
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

4. **View Logs**:
   ```bash
   docker-compose logs -f [service-name]
   ```

---

## 📝 Notes

- ✅ Data trong database sẽ persist khi restart containers
- ✅ Code changes tự động reflect nhờ volume mounting
- ✅ Để reset hoàn toàn: `docker-compose down -v`
- ⚠️ **Quan trọng**: Đổi password admin sau khi login lần đầu!

---

## 🆘 Cần Hỗ Trợ?

1. Kiểm tra containers: `docker-compose ps`
2. Xem logs: `docker-compose logs [service-name]`
3. Restart container: `docker-compose restart [service-name]`
4. Đọc chi tiết: [DOCKER_SETUP.md](./DOCKER_SETUP.md)

