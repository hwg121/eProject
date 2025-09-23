# 🌱 Green Groves - SPA React.js + Laravel API

## 📋 Tổng Quan Dự Án

**Green Groves** là một website cung cấp thông tin, hướng dẫn và tài nguyên toàn diện về làm vườn quy mô nhỏ. Dự án được xây dựng với kiến trúc SPA (Single Page Application) sử dụng React.js cho frontend và Laravel API cho backend.

### 🎯 Mục Đích Chính
- Kỹ thuật và mẹo làm vườn
- Dụng cụ và thiết bị cần thiết  
- Đất, phân bón, thuốc trừ sâu
- Chậu cây và phụ kiện
- Video hướng dẫn và sách tham khảo
- Gợi ý mua sắm sản phẩm

### 🏗️ Kiến Trúc Dự Án

```
green-groves/
├── frontend/          # React.js SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Header, Footer, Navigation
│   │   │   ├── pages/      # Home, Articles, Tools, etc.
│   │   │   ├── admin/      # Admin Panel Components
│   │   │   └── ui/         # Reusable UI Components
│   │   ├── services/       # API Services
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom Hooks
│   │   └── utils/          # Helper Functions
│   └── package.json
├── backend/           # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Http/Resources/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
└── docs/             # Documentation
```

### 🛠️ Công Nghệ Sử Dụng

#### Frontend (React.js)
- **React 18+** với React Router DOM
- **Tailwind CSS** + Headless UI cho styling
- **Axios** cho API calls
- **Framer Motion** cho animations
- **React Hook Form** cho form handling

#### Backend (Laravel)
- **Laravel 10+** với PHP 8.1+
- **Laravel Sanctum** cho authentication
- **MySQL** database với Eloquent ORM
- **CORS** configuration cho SPA

### 🚀 Cài Đặt & Chạy Dự Án

#### 1. Clone Repository
```bash
git clone https://github.com/GreenGroves-Team/green-groves.git
cd green-groves
```

#### 2. Backend Setup (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

#### 3. Frontend Setup (React.js)
```bash
cd frontend
npm install
npm start
```

### 📊 Tính Năng Chính

#### 🌐 Frontend Features
- **Trang Chủ**: Logo, banner carousel, bài viết nổi bật
- **Kỹ Thuật Làm Vườn**: Bài viết có danh mục, tag, hình ảnh, video
- **Dụng Cụ Làm Vườn**: Danh sách, mô tả, video demo
- **Vật Liệu Cần Thiết**: Đất, phân bón, thuốc trừ sâu, hạt giống
- **Chậu & Phụ Kiện**: Hướng dẫn chọn lựa, hình ảnh, gợi ý sản phẩm
- **Video Giáo Dục**: Thumbnail tải nhanh + trình phát video
- **Liên Hệ**: Bản đồ vị trí và form liên hệ
- **Responsive Design**: Hoạt động trên mobile/tablet/desktop

#### 🔐 Admin Panel (CMS)
- **Xác thực quản trị viên** với Laravel Sanctum
- **Quản lý bài viết** với WYSIWYG editor
- **Quản lý dụng cụ** với upload hình ảnh/video
- **Quản lý vật liệu** với phân loại theo mùa
- **Quản lý chậu & phụ kiện** với specifications
- **Quản lý video & sách** với metadata
- **Cài đặt website** và ticker
- **Analytics dashboard** với thống kê khách truy cập

### 👥 Thành Viên Nhóm

- **Hiếu (Leader)** - Backend Laravel API & Quản lý repo
- **Hưng** - Frontend React.js & UI/UX Design  
- **Bảo** - Backend APIs đặc biệt (Geolocation, Visitor Counter)
- **Khang** - Content Management & Database Seeding
- **Tài** - Frontend Integration & Routing

### 📅 Kế Hoạch Phát Triển

#### Tuần 1: Khởi Tạo & Phát Triển Cốt Lõi
- Setup Laravel API với authentication
- Tạo React app với routing cơ bản
- Thiết kế UI/UX trên Figma
- Tạo database migrations và seeders

#### Tuần 2: Hoàn Thiện & Tối Ưu
- Implement admin panel đầy đủ chức năng
- Tích hợp Google Maps và YouTube API
- Responsive optimization
- Production deployment

### 🔧 API Endpoints

#### Public APIs
```
GET  /api/v1/articles          # Danh sách bài viết
GET  /api/v1/articles/{id}     # Chi tiết bài viết
GET  /api/v1/tools             # Danh sách dụng cụ
GET  /api/v1/essentials        # Danh sách vật liệu
GET  /api/v1/pots              # Danh sách chậu cây
GET  /api/v1/videos            # Danh sách video
GET  /api/v1/books             # Danh sách sách
POST /api/v1/contact           # Gửi liên hệ
```

#### Admin APIs (Protected)
```
POST   /api/v1/admin/login     # Đăng nhập admin
GET    /api/v1/admin/dashboard # Dashboard thống kê
GET    /api/v1/admin/articles  # CRUD bài viết
GET    /api/v1/admin/tools     # CRUD dụng cụ
GET    /api/v1/admin/essentials # CRUD vật liệu
PUT    /api/v1/admin/settings  # Cài đặt website
```

### 📱 Responsive Breakpoints

- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

### 🎨 Design System

#### Colors
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Green (#22c55e)
- **Neutral**: Gray scale

#### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **Headings**: Font weight 600-700
- **Body**: Font weight 400

### 📚 Tài Liệu Tham Khảo

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Headless UI Documentation](https://headlessui.com/)

### 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add new feature'`
4. Push branch: `git push origin feature/your-feature`
5. Tạo Pull Request

### 📄 License

Dự án này được phát triển bởi nhóm Green Groves cho mục đích học tập.

---

**🌱 Chúc bạn có trải nghiệm làm vườn tuyệt vời! 🌱**
