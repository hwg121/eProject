# 🚀 Hướng Dẫn Cài Đặt Green Groves

## 📋 Yêu Cầu Hệ Thống

### Backend (Laravel)
- PHP >= 8.1
- Composer
- MySQL >= 5.7
- Node.js (cho Vite)

### Frontend (React)
- Node.js >= 16.0
- npm >= 8.0

## ⚙️ Cài Đặt Dự Án

### 1. Clone Repository
```bash
git clone https://github.com/GreenGroves-Team/green-groves.git
cd green-groves
```

### 2. Cài Đặt Dependencies
```bash
# Cài đặt tất cả dependencies
npm run setup

# Hoặc cài đặt riêng lẻ:
npm run backend:install
npm run frontend:install
```

### 3. Cấu Hình Database

#### Tạo Database MySQL
```sql
CREATE DATABASE green_groves;
```

#### Cấu hình .env cho Backend
```bash
cd backend
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=green_groves
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Chạy Migrations và Seeders
```bash
npm run backend:migrate
npm run backend:seed
```

### 4. Cấu Hình Frontend

#### Tạo file .env.local
```bash
cd frontend
cp .env.local.example .env.local
```

Chỉnh sửa file `.env.local`:
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_API_BASE_URL=http://localhost:8000
```

## 🚀 Chạy Dự Án

### Chạy Cả Frontend và Backend
```bash
npm run dev
```

### Chạy Riêng Lẻ

#### Backend (Laravel API)
```bash
npm run backend:serve
# Hoặc
cd backend && php artisan serve --port=8000
```

#### Frontend (React)
```bash
npm run frontend:start
# Hoặc
cd frontend && npm start
```

## 🌐 Truy Cập Ứng Dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:3000/admin

## 📁 Cấu Trúc Dự Án

```
green-groves/
├── frontend/                 # React.js SPA
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── common/       # Header, Footer, Navigation
│   │   │   ├── pages/        # Home, Articles, Tools, etc.
│   │   │   ├── admin/        # Admin Panel Components
│   │   │   └── ui/           # Reusable UI Components
│   │   ├── services/         # API Services
│   │   ├── context/          # React Context
│   │   ├── hooks/            # Custom Hooks
│   │   └── utils/            # Helper Functions
│   └── package.json
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Http/Resources/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
├── docs/                     # Documentation
├── package.json              # Root package.json
└── README.md
```

## 🔧 Scripts Có Sẵn

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy cả frontend và backend |
| `npm run backend:serve` | Chạy Laravel API server |
| `npm run frontend:start` | Chạy React development server |
| `npm run backend:install` | Cài đặt Laravel dependencies |
| `npm run frontend:install` | Cài đặt React dependencies |
| `npm run backend:migrate` | Chạy database migrations |
| `npm run backend:seed` | Chạy database seeders |
| `npm run setup` | Cài đặt toàn bộ dự án |
| `npm run build` | Build React app cho production |

## 🐛 Troubleshooting

### Lỗi Database Connection
- Kiểm tra MySQL service đang chạy
- Kiểm tra thông tin database trong `.env`
- Đảm bảo database `green_groves` đã được tạo

### Lỗi CORS
- Kiểm tra cấu hình CORS trong `backend/config/cors.php`
- Đảm bảo frontend URL được thêm vào `allowed_origins`

### Lỗi Port Already in Use
- Thay đổi port trong script hoặc kill process đang sử dụng port
- Backend: `php artisan serve --port=8001`
- Frontend: `PORT=3001 npm start`

## 📚 Tài Liệu Tham Khảo

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Hỗ Trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ team Green Groves.

---

**🌱 Chúc bạn có trải nghiệm phát triển tuyệt vời! 🌱**
