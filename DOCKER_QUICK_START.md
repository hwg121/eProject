# 🚀 Docker Quick Start - Green Groves

## ⚡ Khởi Động Nhanh

### Lần Đầu Setup (đã hoàn thành ✅)
```bash
./setup-docker.sh
```

### Lần Sau Chỉ Cần
```bash
docker-compose up -d
```

---

## 🌐 URLs Quan Trọng

```
Frontend:    http://localhost:5173
Backend API: http://localhost:8000
phpMyAdmin:  http://localhost:8080
```

---

## 🔐 Login

**Admin:**
- Email: `admin@greengroves.com`
- Pass: `admin123`

**Database:**
- User: `greengroves_user`
- Pass: `user_password_123`

---

## 📝 Lệnh Hay Dùng

```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose down

# Xem logs
docker-compose logs -f

# Laravel commands
docker-compose exec backend php artisan [command]

# NPM commands
docker-compose exec frontend npm [command]

# Reset database
docker-compose exec backend php artisan migrate:fresh --seed
```

---

## ⚠️ Lưu Ý

- Containers sẽ tự động start khi Docker Desktop chạy
- Data database sẽ được lưu trong volumes
- Code changes tự động reload
- Để xóa hoàn toàn: `docker-compose down -v`

---

Xem chi tiết: [README_DOCKER.md](./README_DOCKER.md) | [DOCKER_SETUP.md](./DOCKER_SETUP.md)

