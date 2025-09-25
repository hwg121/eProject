# 🌱 Green Groves - Phân Tích Dự Án & User Stories
## Triển Khai SPA React.js + Laravel API (Ưu Tiên CMS)

---

## 📋 **Tổng Quan Dự Án**

### 🏷️ Thông Tin Cơ Bản
- **Tên Dự Án:** Green Groves
- **Nhóm Thực Hiện:** Green Groves (Trưởng nhóm: Hiếu)
- **Công Nghệ:** React.js (Frontend) + Laravel API (Backend), MySQL, Tailwind CSS, Axios
- **Kiến Trúc:** Single Page Application (SPA) với React Router và Laravel REST API
- **Đối Tượng Người Dùng:** 
  - Người yêu thích làm vườn quy mô nhỏ (ban công, sân thượng, vườn nhà)
  - Quản trị viên nội dung (giảng viên/biên tập viên)

### 🎯 Mục Đích Chính
Cung cấp thông tin, hướng dẫn và tài nguyên toàn diện về làm vườn quy mô nhỏ bao gồm:
- Kỹ thuật và mẹo làm vườn
- Dụng cụ và thiết bị cần thiết
- Đất, phân bón, thuốc trừ sâu
- Chậu cây và phụ kiện
- Video hướng dẫn và sách tham khảo
- Gợi ý mua sắm sản phẩm

---

## 🎯 **Phân Tích Yêu Cầu Chi Tiết**

### 📚 Nguồn Tài Liệu
Dựa trên đề bài chi tiết 'Green Groves' và bảng phân công nhóm để hoàn thiện phân tích.

### ⚙️ Yêu Cầu Cốt Lõi

#### 🏗️ Kiến Trúc & Công Nghệ
- **Frontend:** React.js 18+ với React Router cho SPA
- **Backend:** Laravel 10+ API với Sanctum authentication
- **Giao diện:** Tailwind CSS + Headless UI cho components
- **State Management:** React Context API hoặc Redux Toolkit
- **HTTP Client:** Axios cho API calls
- **Xác thực:** JWT tokens với Laravel Sanctum
- **Cơ sở dữ liệu:** MySQL với Eloquent ORM
- **APIs:** RESTful API cho tất cả operations
- **Định vị:** HTML5 Geolocation + Google Maps API
- **Video:** YouTube embed hoặc Vimeo

#### 🎨 Giao Diện & Trải Nghiệm
- Ticker cuộn liên tục (ngày, giờ, vị trí)
- Bộ đếm khách truy cập (góc trên bên phải)
- Hiệu ứng hover/click menu
- Animation fade-in/out mượt mà

### 🔧 Tính Năng Chính

1. **📊 CMS Admin** - Quản lý toàn bộ nội dung website
2. **🏠 Trang Chủ** - Logo, banner carousel, bài viết nổi bật, đếm khách truy cập
3. **📖 Kỹ Thuật Làm Vườn** - Bài viết có danh mục, tag, hình ảnh, video
4. **🔧 Dụng Cụ Làm Vườn** - Danh sách, mô tả, video demo
5. **🌱 Vật Liệu Cần Thiết** - Đất, phân bón, thuốc trừ sâu, hạt giống
6. **🪴 Chậu & Phụ Kiện** - Hướng dẫn chọn lựa, hình ảnh, gợi ý sản phẩm
7. **📚 Sản Phẩm & Sách** - Danh sách được tuyển chọn với link mua hàng
8. **🎥 Video Giáo Dục** - Thumbnail tải nhanh + trình phát video
9. **📞 Giới Thiệu & Liên Hệ** - Bản đồ vị trí và form liên hệ
10. **📈 Bảng Điều Khiển Analytics** - Thống kê khách truy cập, lượt xem nội dung

---

## 👥 **User Stories Chi Tiết**

### 🎯 Epic 0: Quản Trị CMS (BẮT BUỘC)
*Với tư cách là quản trị viên, tôi muốn có một hệ thống CMS toàn diện để quản lý tất cả nội dung website một cách dễ dàng.*

#### 🔐 User Stories Quản Trị Viên

**1. Xác Thực Quản Trị Viên**
- *Với tư cách là quản trị viên, tôi muốn đăng nhập vào bảng điều khiển quản trị để chỉ những người được ủy quyền mới có thể chỉnh sửa nội dung.*
- **Tiêu chí chấp nhận:** Quản trị viên có thể đăng nhập/đăng xuất; mật khẩu được mã hóa; middleware chặn các route quản trị cho người dùng không phải quản trị viên.

**2. Quản Lý Bài Viết (Kỹ Thuật & Mẹo Làm Vườn)**
- *Với tư cách là quản trị viên, tôi muốn tạo/đọc/cập nhật/xóa bài viết với tiêu đề, slug, nội dung, hình ảnh, danh mục và tag để có thể xuất bản hướng dẫn.*
- **Tiêu chí chấp nhận:** Trình soạn thảo WYSIWYG, tải lên hình ảnh, xác thực (tiêu đề bắt buộc, slug duy nhất), xem trước trước khi xuất bản.

**3. Quản Lý Dụng Cụ**
- *Với tư cách là quản trị viên, tôi muốn CRUD dụng cụ (tên, mô tả, hình ảnh, link video demo) để website hiển thị thông tin dụng cụ chính xác.*
- **Tiêu chí chấp nhận:** Trường nhúng video, thư viện hình ảnh, tìm kiếm/sắp xếp trong quản trị.

**4. Quản Lý Vật Liệu Cần Thiết (Đất/Phân Bón/Thuốc Trừ Sâu/Hạt Giống)**
- *Với tư cách là quản trị viên, tôi muốn quản lý dữ liệu có cấu trúc cho đất, phân bón, hạt giống và thuốc trừ sâu để giao diện người dùng có thể lọc và hiển thị chi tiết.*
- **Tiêu chí chấp nhận:** Mỗi mục có phân loại (loại, mùa trồng, ghi chú chăm sóc) và có thể nhập/xuất dưới dạng JSON.

**5. Quản Lý Chậu & Phụ Kiện**
- CRUD chậu, giá treo, móc treo, phụ kiện với hình ảnh và gợi ý.

**6. Quản Lý Video & Sách**
- Quản lý video (tiêu đề, mô tả, thumbnail, link nhúng) và sách (tiêu đề, tác giả, link mua).

**7. Cài Đặt Website & Ticker**
- Quản trị viên có thể thiết lập cài đặt toàn site (logo, hình banner, tần suất ticker, API keys cho bản đồ).

**8. Bảng Điều Khiển Analytics**
- Xem số lượng khách truy cập, lượt xem theo bài viết, phân bố địa lý (nếu có), và hoạt động gần đây.
- **Tiêu chí chấp nhận:** Top 10 trang có lượt xem cao nhất, bộ đếm khách truy cập hiển thị trên giao diện người dùng.

### 🌐 Epic 1: Trải Nghiệm Khách Truy Cập
*Với tư cách là khách truy cập, tôi muốn tìm hướng dẫn và dụng cụ nhanh chóng để có thể học hỏi và mua những gì cần thiết.*

**1. Duyệt Bài Viết**
- *Với tư cách là khách truy cập, tôi muốn xem bài viết được phân loại và có thể tìm kiếm để tìm kỹ thuật.*
- **Tiêu chí chấp nhận:** Bộ lọc danh mục, hộp tìm kiếm, phân trang.

**2. Xem Chi Tiết Dụng Cụ**
- *Với tư cách là khách truy cập, tôi muốn mở trang dụng cụ với mô tả và demo để học cách sử dụng.*

**3. Xem Video Giáo Dục**
- *Với tư cách là khách truy cập, tôi muốn phát video hướng dẫn tải nhanh.*

**4. Liên Hệ & Vị Trí**
- *Với tư cách là khách truy cập, tôi muốn xem thông tin liên hệ nhóm và vị trí của họ trên bản đồ.*

**5. Giao Diện Responsive & Tương Tác**
- *Với tư cách là người dùng mobile, tôi muốn website thích ứng và giữ điều hướng dễ tiếp cận.*

### ⚡ Epic 2: Tính Năng Nâng Cao

**1. Bộ Đếm Khách Truy Cập & Ticker**
- *Với tư cách là khách truy cập, tôi muốn thấy số lượng khách truy cập và ticker dưới cùng hiển thị ngày/giờ/vị trí hiện tại.*
- **Tiêu chí chấp nhận:** Ticker hiển thị ngày/giờ cập nhật mỗi giây; vị trí hiển thị thành phố qua định vị địa lý hoặc dự phòng.

**2. Gợi Ý Sản Phẩm**
- *Với tư cách là khách truy cập, tôi muốn có gợi ý sản phẩm được tuyển chọn với link.*

**3. Tải Xuống/Xuất Nội Dung**
- *Với tư cách là quản trị viên, tôi muốn xuất nội dung dưới dạng JSON/TXT để nộp bài.*

---

## 🗄️ **Thiết Kế Cơ Sở Dữ Liệu**

### 📊 Các Thực Thể Chính (Bảng)

#### 👥 Quản Lý Người Dùng
- **`users`** - Thông tin người dùng và quản trị viên
  - `id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`

#### 📝 Quản Lý Nội Dung
- **`articles`** - Bài viết kỹ thuật làm vườn
  - `id`, `title`, `slug`, `excerpt`, `body`, `category_id`, `author_id`, `published_at`, `status`, `created_at`, `updated_at`
- **`categories`** - Danh mục bài viết
  - `id`, `name`, `slug`, `parent_id`, `created_at`, `updated_at`
- **`tags`** - Thẻ phân loại
  - `id`, `name`, `slug`, `created_at`, `updated_at`
- **`article_tag`** - Liên kết bài viết và thẻ
  - `article_id`, `tag_id`

#### 🔧 Quản Lý Dụng Cụ & Vật Liệu
- **`tools`** - Dụng cụ làm vườn
  - `id`, `name`, `slug`, `description`, `video_url`, `images_json`, `created_at`, `updated_at`
- **`essentials`** - Vật liệu cần thiết (đất, phân bón, thuốc trừ sâu, hạt giống)
  - `id`, `type`, `name`, `details_json`, `season`, `created_at`, `updated_at`
- **`pots`** - Chậu cây
  - `id`, `name`, `description`, `dimensions`, `material`, `image`, `created_at`, `updated_at`
- **`accessories`** - Phụ kiện
  - `id`, `name`, `description`, `image`, `created_at`, `updated_at`

#### 🎥 Quản Lý Media & Sản Phẩm
- **`videos`** - Video hướng dẫn
  - `id`, `title`, `description`, `embed_url`, `thumbnail`, `created_at`, `updated_at`
- **`books`** - Sách tham khảo
  - `id`, `title`, `author`, `description`, `buy_link`, `created_at`, `updated_at`

#### ⚙️ Cài Đặt & Thống Kê
- **`site_settings`** - Cài đặt website
  - `id`, `key`, `value`, `created_at`, `updated_at`
- **`visitor_stats`** - Thống kê khách truy cập
  - `id`, `ip_hash`, `page`, `viewed_at`, `meta_json`

### 🔗 Mối Quan Hệ Giữa Các Bảng
- **users (1) → articles (n)** - Một người dùng có thể viết nhiều bài
- **articles (n) ↔ tags (n)** - Một bài viết có thể có nhiều thẻ, một thẻ có thể thuộc nhiều bài
- **categories (1) → articles (n)** - Một danh mục có thể chứa nhiều bài viết

---

## 🏗️ **Cấu Trúc Dự Án SPA**

### ⚛️ **Frontend React.js Structure**

#### 📁 **Thư Mục Components**
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navigation.jsx
│   │   ├── Ticker.jsx
│   │   └── VisitorCounter.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Articles/
│   │   │   ├── ArticleList.jsx
│   │   │   └── ArticleDetail.jsx
│   │   ├── Tools/
│   │   │   ├── ToolList.jsx
│   │   │   └── ToolDetail.jsx
│   │   ├── Essentials/
│   │   │   ├── EssentialList.jsx
│   │   │   └── EssentialDetail.jsx
│   │   ├── Pots/
│   │   │   ├── PotList.jsx
│   │   │   └── PotDetail.jsx
│   │   ├── Videos/
│   │   │   ├── VideoList.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── Books/
│   │   │   ├── BookList.jsx
│   │   │   └── BookDetail.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ArticleManagement.jsx
│   │   ├── ToolManagement.jsx
│   │   ├── EssentialManagement.jsx
│   │   └── Settings.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── Card.jsx
│       └── LoadingSpinner.jsx
├── services/
│   ├── api.js
│   ├── auth.js
│   └── geolocation.js
├── context/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useGeolocation.js
└── utils/
    ├── constants.js
    └── helpers.js
```

### 🔧 **Backend Laravel API Structure**

#### 📁 **API Controllers**
- **`Api\ArticleController`** - API endpoints cho bài viết
- **`Api\ToolController`** - API endpoints cho dụng cụ
- **`Api\EssentialController`** - API endpoints cho vật liệu
- **`Api\PotController`** - API endpoints cho chậu cây
- **`Api\VideoController`** - API endpoints cho video
- **`Api\BookController`** - API endpoints cho sách
- **`Api\ContactController`** - API endpoints cho liên hệ
- **`Api\Admin\DashboardController`** - API admin dashboard
- **`Api\Admin\ArticleController`** - API admin CRUD bài viết
- **`Api\Admin\ToolController`** - API admin CRUD dụng cụ
- **`Api\Admin\EssentialController`** - API admin CRUD vật liệu
- **`Api\Admin\PotController`** - API admin CRUD chậu cây
- **`Api\Admin\VideoController`** - API admin CRUD video
- **`Api\Admin\BookController`** - API admin CRUD sách
- **`Api\Admin\SettingController`** - API admin cài đặt

### 📦 **Laravel Models (Mô Hình Dữ Liệu)**
- **`User`** - Người dùng và quản trị viên
- **`Article`** - Bài viết
- **`Category`** - Danh mục
- **`Tag`** - Thẻ phân loại
- **`Tool`** - Dụng cụ
- **`Essential`** - Vật liệu cần thiết
- **`Pot`** - Chậu cây
- **`Accessory`** - Phụ kiện
- **`Video`** - Video
- **`Book`** - Sách
- **`SiteSetting`** - Cài đặt website
- **`VisitorStat`** - Thống kê khách truy cập

### 🛠️ **API Routes Structure**

#### 🌐 **Public API Routes**
```php
// routes/api.php
Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::get('/tools', [ToolController::class, 'index']);
    Route::get('/tools/{id}', [ToolController::class, 'show']);
    Route::get('/essentials', [EssentialController::class, 'index']);
    Route::get('/pots', [PotController::class, 'index']);
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store']);
    Route::get('/settings', [SettingController::class, 'index']);
});
```

#### 🔐 **Admin API Routes**
```php
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index']);
    Route::apiResource('articles', Admin\ArticleController::class);
    Route::apiResource('tools', Admin\ToolController::class);
    Route::apiResource('essentials', Admin\EssentialController::class);
    Route::apiResource('pots', Admin\PotController::class);
    Route::apiResource('videos', Admin\VideoController::class);
    Route::apiResource('books', Admin\BookController::class);
    Route::get('/settings', [Admin\SettingController::class, 'index']);
    Route::put('/settings', [Admin\SettingController::class, 'update']);
});
```

### ⚛️ **React Router Configuration**
```javascript
// App.jsx
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/articles" element={<ArticleList />} />
    <Route path="/articles/:id" element={<ArticleDetail />} />
    <Route path="/tools" element={<ToolList />} />
    <Route path="/tools/:id" element={<ToolDetail />} />
    <Route path="/essentials" element={<EssentialList />} />
    <Route path="/pots" element={<PotList />} />
    <Route path="/videos" element={<VideoList />} />
    <Route path="/books" element={<BookList />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="articles" element={<ArticleManagement />} />
      <Route path="tools" element={<ToolManagement />} />
      <Route path="essentials" element={<EssentialManagement />} />
      <Route path="pots" element={<PotManagement />} />
      <Route path="videos" element={<VideoManagement />} />
      <Route path="books" element={<BookManagement />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## ⚙️ **Cấu Hình Kỹ Thuật SPA**

### 🔧 **Laravel API Configuration**

#### **Cài Đặt Laravel Sanctum**
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

#### **Cấu Hình CORS**
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'], // React dev server
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

#### **API Resource Classes**
```php
// app/Http/Resources/ArticleResource.php
class ArticleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'category' => new CategoryResource($this->category),
            'tags' => TagResource::collection($this->tags),
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
        ];
    }
}
```

### ⚛️ **React App Configuration**

#### **Package.json Dependencies**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "tailwindcss": "^3.2.0",
    "@headlessui/react": "^1.7.0",
    "framer-motion": "^10.0.0",
    "react-hook-form": "^7.43.0",
    "react-query": "^3.39.0"
  }
}
```

#### **API Service Configuration**
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### **Environment Variables**
```bash
# .env.local (React)
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

### 🚀 **Development Setup**

#### **Laravel Backend**
```bash
# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

#### **React Frontend**
```bash
# Frontend setup
cd frontend
npm install
npm start # Runs on port 3000
```

#### **Production Build**
```bash
# Build React app
npm run build

# Serve Laravel API
php artisan serve --host=0.0.0.0 --port=8000
```

---

## 📅 **Kế Hoạch Triển Khai 2 Tuần (Chi Tiết Theo Thành Viên)**

### 🚀 **TUẦN 1: Khởi Tạo & Phát Triển Cốt Lõi (Ngày 1-7)**

#### 👨‍💻 **HIẾU (Trưởng nhóm) - Backend Laravel API**

**📋 TASK 1: Thiết lập dự án Laravel API**
- **Mô tả:** Tạo Laravel project, cấu hình database, setup Sanctum
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Tạo Laravel 10 project với `composer create-project`
  - Cấu hình MySQL database
  - Cài đặt Laravel Sanctum: `composer require laravel/sanctum`
  - Cấu hình CORS cho React frontend
  - Tạo migration cho bảng users
  - Setup .env và database connection

**📋 TASK 2: Tạo API Controllers cơ bản**
- **Mô tả:** Tạo API controllers cho Articles, Tools, Essentials, Pots
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Tạo ArticleController với CRUD operations
  - Tạo ToolController với CRUD operations
  - Tạo EssentialController với CRUD operations
  - Tạo PotController với CRUD operations
  - Implement API Resource classes
  - Tạo API routes trong routes/api.php

**📋 TASK 3: Authentication API**
- **Mô tả:** Implement login/logout API với Sanctum
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Tạo AuthController
  - Implement login API endpoint
  - Implement logout API endpoint
  - Tạo middleware cho admin routes
  - Test API với Postman

**📋 TASK 4: Database Migrations & Seeders**
- **Mô tả:** Tạo tất cả migrations và seeders cho dữ liệu mẫu
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Tạo migrations cho articles, categories, tags, tools, essentials, pots, videos, books
  - Tạo seeders với dữ liệu mẫu
  - Chạy migrations và seeders
  - Verify database structure

---

#### 🎨 **HƯNG - Frontend React.js & UI/UX**

**📋 TASK 1: Thiết lập React project**
- **Mô tả:** Tạo React app với Vite, cài đặt dependencies
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 3 giờ
- **Chi tiết:**
  - Tạo React project với `npm create vite@latest`
  - Cài đặt React Router DOM
  - Cài đặt Tailwind CSS
  - Cài đặt Axios, Headless UI
  - Cấu hình project structure

**📋 TASK 2: Thiết kế UI/UX trên Figma**
- **Mô tả:** Tạo wireframes và mockups cho tất cả trang
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:**  10 giờ
- **Chi tiết:**
  - Wireframe cho desktop (1920x1080)
  - Wireframe cho tablet (768x1024)
  - Wireframe cho mobile (375x667)
  - Mockup trang chủ với banner carousel
  - Mockup trang bài viết
  - Mockup trang dụng cụ
  - Mockup trang admin
  - Tạo bảng màu và typography

**📋 TASK 3: Tạo Layout components cơ bản**
- **Mô tả:** Tạo Header, Footer, Navigation components
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Header component với logo và navigation
  - Footer component với ticker
  - Navigation component responsive
  - Layout wrapper component
  - Responsive design với Tailwind CSS

**📋 TASK 4: Tạo Home page component**
- **Mô tả:** Implement trang chủ với banner và bài viết nổi bật
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Banner carousel component
  - Featured articles section
  - Visitor counter component
  - Responsive grid layout
  - Loading states

---

#### 🔧 **BẢO - Backend API & Tính năng đặc biệt**

**📋 TASK 1: Geolocation API**
- **Mô tả:** Implement API định vị địa lý và Google Maps
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 8 giờ
- **Chi tiết:**
  - Tạo GeolocationController
  - Integrate HTML5 Geolocation API
  - Tích hợp Google Maps API
  - Tạo endpoint để lấy vị trí hiện tại
  - Handle fallback khi không có định vị

**📋 TASK 2: Visitor Counter API**
- **Mô tả:** Tạo API đếm khách truy cập với IP tracking
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Tạo VisitorStat model và migration
  - Implement visitor tracking logic
  - Tạo API endpoint để tăng counter
  - Implement IP hashing để bảo mật
  - Rate limiting để tránh spam

**📋 TASK 3: File Upload API**
- **Mô tả:** Tạo API upload hình ảnh cho admin
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Cấu hình file storage
  - Tạo FileUploadController
  - Implement image validation
  - Tạo API endpoint upload
  - Handle file deletion

**📋 TASK 4: Contact Form API**
- **Mô tả:** Tạo API xử lý form liên hệ
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 3 giờ
- **Chi tiết:**
  - Tạo ContactController
  - Implement email sending
  - Validation form data
  - Tạo API endpoint submit contact
  - Error handling

---

#### 📝 **KHANG - Nội dung & Dữ liệu**

**📋 TASK 1: Thu thập nội dung mẫu**
- **Mô tả:** Tạo nội dung mẫu cho tất cả sections
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Viết 8 bài viết kỹ thuật làm vườn (500-800 từ mỗi bài)
  - Thu thập 20+ hình ảnh chất lượng cao
  - Tạo danh sách 25+ dụng cụ làm vườn với mô tả
  - Tạo danh sách 15+ video hướng dẫn YouTube
  - Tạo danh sách 12+ sách tham khảo

**📋 TASK 2: Tạo JSON data structure**
- **Mô tả:** Chuẩn bị dữ liệu JSON cho import vào database
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Tạo JSON files cho articles data
  - Tạo JSON files cho tools data
  - Tạo JSON files cho essentials data
  - Tạo JSON files cho pots data
  - Tạo JSON files cho videos data
  - Tạo JSON files cho books data

**📋 TASK 3: Database seeding**
- **Mô tả:** Tạo seeders để import dữ liệu mẫu
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Tạo ArticleSeeder với 8 bài viết
  - Tạo ToolSeeder với 25 dụng cụ
  - Tạo EssentialSeeder với 20 vật liệu
  - Tạo PotSeeder với 15 chậu cây
  - Tạo VideoSeeder với 15 video
  - Tạo BookSeeder với 12 sách

**📋 TASK 4: Content validation**
- **Mô tả:** Kiểm tra và chuẩn hóa nội dung
- **Độ khó:** ⭐ (Dễ)
- **Thời gian:** 3 giờ
- **Chi tiết:**
  - Proofread tất cả nội dung
  - Kiểm tra tính nhất quán
  - Optimize hình ảnh
  - Tạo metadata cho SEO

---

#### 🔗 **TÀI - Frontend Integration & Routing**

**📋 TASK 1: React Router setup**
- **Mô tả:** Cấu hình routing cho SPA
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Setup React Router DOM
  - Tạo route structure
  - Implement protected routes cho admin
  - Tạo navigation components
  - Handle 404 pages

**📋 TASK 2: API Integration service**
- **Mô tả:** Tạo service layer để gọi API
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Tạo API service với Axios
  - Implement authentication headers
  - Tạo hooks cho data fetching
  - Error handling cho API calls
  - Loading states management

**📋 TASK 3: Context API setup**
- **Mô tả:** Tạo context cho state management
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Tạo AuthContext cho authentication
  - Tạo AppContext cho global state
  - Implement context providers
  - Tạo custom hooks
  - State persistence với localStorage

**📋 TASK 4: Basic pages implementation**
- **Mô tả:** Tạo các trang cơ bản với API integration
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Tạo ArticleList component
  - Tạo ToolList component
  - Tạo EssentialList component
  - Tạo PotList component
  - Implement pagination
  - Implement search functionality

### 🎯 **TUẦN 2: Hoàn Thiện & Tối Ưu (Ngày 8-14)**

#### 👨‍💻 **HIẾU (Trưởng nhóm) - Admin Panel & Testing**

**📋 TASK 1: Admin Panel API**
- **Mô tả:** Tạo API endpoints cho admin panel
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Tạo Admin\ArticleController với full CRUD
  - Tạo Admin\ToolController với full CRUD
  - Tạo Admin\EssentialController với full CRUD
  - Tạo Admin\PotController với full CRUD
  - Implement admin middleware
  - Tạo dashboard statistics API

**📋 TASK 2: API Testing & Documentation**
- **Mô tả:** Test tất cả API endpoints và tạo documentation
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Test tất cả API endpoints với Postman
  - Tạo API documentation
  - Fix bugs phát hiện
  - Performance testing
  - Security testing

**📋 TASK 3: Production deployment**
- **Mô tả:** Deploy Laravel API lên production
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Setup production environment
  - Configure database production
  - Deploy lên Heroku/Railway
  - Setup domain và SSL
  - Test production API

**📋 TASK 4: Final review & bug fixes**
- **Mô tả:** Review toàn bộ code và fix bugs
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Code review toàn bộ project
  - Fix critical bugs
  - Performance optimization
  - Security audit
  - Final testing

---

#### 🎨 **HƯNG - Frontend Components & Styling**

**📋 TASK 1: Admin Panel Components**
- **Mô tả:** Tạo React components cho admin panel
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 8 giờ
- **Chi tiết:**
  - Tạo AdminLayout component
  - Tạo AdminDashboard component
  - Tạo ArticleManagement component với CRUD
  - Tạo ToolManagement component với CRUD
  - Tạo EssentialManagement component với CRUD
  - Tạo PotManagement component với CRUD

**📋 TASK 2: Advanced UI Components**
- **Mô tả:** Tạo các UI components nâng cao
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Tạo Modal component
  - Tạo Form components với validation
  - Tạo ImageUpload component
  - Tạo Pagination component
  - Tạo SearchFilter component
  - Tạo LoadingSpinner component

**📋 TASK 3: Animations & Effects**
- **Mô tả:** Thêm animations và effects cho UI
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Implement Framer Motion animations
  - Hover effects cho buttons và cards
  - Page transition animations
  - Loading animations
  - Scroll animations
  - Micro-interactions

**📋 TASK 4: Responsive optimization**
- **Mô tả:** Tối ưu responsive design cho tất cả devices
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Test trên mobile devices
  - Test trên tablet devices
  - Fix responsive issues
  - Optimize touch interactions
  - Cross-browser testing

---

#### 🔧 **BẢO - Advanced Features & Integration**

**📋 TASK 1: Video Integration**
- **Mô tả:** Tích hợp YouTube API và video player
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Tích hợp YouTube Data API
  - Tạo VideoPlayer component
  - Implement video thumbnail loading
  - Tạo video search functionality
  - Handle video metadata

**📋 TASK 2: Google Maps Integration**
- **Mô tả:** Tích hợp Google Maps cho trang liên hệ
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Setup Google Maps API
  - Tạo MapComponent
  - Implement geolocation display
  - Tạo marker cho vị trí nhóm
  - Responsive map design

**📋 TASK 3: Analytics & Statistics**
- **Mô tả:** Implement analytics tracking và statistics
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Implement page view tracking
  - Tạo visitor statistics API
  - Tạo analytics dashboard
  - Implement click tracking
  - Generate reports

**📋 TASK 4: Performance Optimization**
- **Mô tả:** Tối ưu performance cho frontend và backend
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Implement lazy loading
  - Optimize images
  - Minify CSS/JS
  - Database query optimization
  - Caching implementation

---

#### 📝 **KHANG - Content Management & Documentation**

**📋 TASK 1: Content Management System**
- **Mô tả:** Tạo CMS interface cho admin
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Tạo content editor interface
  - Implement WYSIWYG editor
  - Tạo media library
  - Implement content preview
  - Tạo content scheduling

**📋 TASK 2: SEO Optimization**
- **Mô tả:** Tối ưu SEO cho website
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Implement meta tags
  - Tạo sitemap
  - Optimize content cho SEO
  - Implement structured data
  - Tạo robots.txt

**📋 TASK 3: Documentation & User Guide**
- **Mô tả:** Tạo tài liệu hướng dẫn sử dụng
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Viết README.md chi tiết
  - Tạo hướng dẫn cài đặt
  - Tạo hướng dẫn sử dụng admin
  - Tạo API documentation
  - Tạo user manual

**📋 TASK 4: Content Quality Assurance**
- **Mô tả:** Kiểm tra và đảm bảo chất lượng nội dung
- **Độ khó:** ⭐⭐ (Trung bình)
- **Thời gian:** 3 giờ
- **Chi tiết:**
  - Final content review
  - Grammar và spelling check
  - Image optimization
  - Content consistency check
  - Final proofreading

---

#### 🔗 **TÀI - Frontend Integration & Testing**

**📋 TASK 1: Complete Frontend Integration**
- **Mô tả:** Hoàn thiện tích hợp frontend với backend
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 8 giờ
- **Chi tiết:**
  - Complete all page components
  - Implement all API integrations
  - Add error handling
  - Implement loading states
  - Add form validations

**📋 TASK 2: Advanced Features Implementation**
- **Mô tả:** Implement các tính năng nâng cao
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 6 giờ
- **Chi tiết:**
  - Implement search functionality
  - Add filtering và sorting
  - Implement infinite scroll
  - Add real-time updates
  - Implement offline support

**📋 TASK 3: Cross-browser Testing**
- **Mô tả:** Test trên tất cả trình duyệt và devices
- **Độ khó:** ⭐⭐⭐ (Khó)
- **Thời gian:** 4 giờ
- **Chi tiết:**
  - Test trên Chrome, Firefox, Safari, Edge
  - Test trên mobile devices
  - Test trên tablet devices
  - Fix cross-browser issues
  - Performance testing

**📋 TASK 4: Production Deployment**
- **Mô tả:** Deploy React app lên production
- **Độ khó:** ⭐⭐⭐⭐ (Rất khó)
- **Thời gian:** 5 giờ
- **Chi tiết:**
  - Build production version
  - Deploy lên Vercel/Netlify
  - Configure environment variables
  - Setup custom domain
  - Test production deployment

---

### 📊 **TỔNG KẾT THỜI GIAN THEO THÀNH VIÊN**

| Thành viên | Tuần 1 | Tuần 2 | Tổng cộng |
|------------|--------|--------|-----------|
| **Hiếu** | 19 giờ | 19 giờ | 38 giờ |
| **Hưng** | 22 giờ | 23 giờ | 45 giờ |
| **Bảo** | 17 giờ | 20 giờ | 37 giờ |
| **Khang** | 18 giờ | 18 giờ | 36 giờ |
| **Tài** | 19 giờ | 23 giờ | 42 giờ |
| **TỔNG** | 95 giờ | 103 giờ | 198 giờ |

### 🎯 **MILESTONE QUAN TRỌNG**

**Cuối Tuần 1:**
- ✅ Laravel API hoàn chỉnh với authentication
- ✅ React app cơ bản với routing
- ✅ Database với dữ liệu mẫu
- ✅ UI/UX design hoàn chỉnh

**Cuối Tuần 2:**
- ✅ Full-stack application hoàn chỉnh
- ✅ Admin panel đầy đủ chức năng
- ✅ Production deployment
- ✅ Documentation và testing hoàn tất

---

## ❓ **Câu Hỏi & Quyết Định Cần Xác Nhận**

### 🔧 Quyết Định Kỹ Thuật SPA
1. **Cơ sở dữ liệu:** MySQL với Eloquent ORM cho Laravel API *(Đã quyết định)*
2. **CSS Framework:** Tailwind CSS + Headless UI cho React components *(Đã quyết định)*
3. **State Management:** React Context API hay Redux Toolkit? *(Khuyến nghị: Context API cho dự án nhỏ)*
4. **Authentication:** Laravel Sanctum với JWT tokens *(Đã quyết định)*
5. **Video Hosting:** YouTube embed hay Vimeo? *(Khuyến nghị: YouTube để tải nhanh)*
6. **Deployment:** 
   - Frontend: Vercel/Netlify cho React app
   - Backend: Heroku/Railway cho Laravel API
   - Database: MySQL trên PlanetScale hoặc AWS RDS
7. **Monorepo:** Tách riêng frontend/backend hay monorepo? *(Khuyến nghị: Tách riêng để dễ deploy)*

---

## ✅ **Tiêu Chí Chấp Nhận (Tóm Tắt)**

### 🎯 Yêu Cầu Bắt Buộc
- ✅ **CMS Admin** tồn tại với xác thực bảo mật và CRUD cho tất cả loại nội dung
- ✅ **Trang chủ** với logo, banner, đếm khách truy cập (góc trên phải), ticker dưới cùng (ngày/giờ/vị trí)
- ✅ **Các trang nội dung:** Kỹ thuật làm vườn, Dụng cụ (có video), Vật liệu cần thiết, Chậu, Phụ kiện, Sản phẩm, Video, Sách, Giới thiệu & Liên hệ (có bản đồ)
- ✅ **Thiết kế responsive** hoạt động trên mobile/tablet/desktop
- ✅ **Nội dung có thể xuất** (JSON) và README có tài liệu + video demo

---

## 📝 **Ghi Chú & Bước Tiếp Theo**

### 🎯 Ưu Tiên Thực Hiện
- **Ưu tiên Epic 0 (CMS)** — tạo seed data và script import để điền nội dung nhanh chóng
- **Triển khai bộ đếm khách truy cập** như bộ thu thập thống kê nhẹ với IP hash và giới hạn tốc độ để tránh spam
- **Sử dụng cải tiến dần dần** cho ticker (fallback graceful nếu định vị địa lý bị từ chối)
- **Lưu mã thiết kế** trong bảng site_settings để có thể thay đổi giao diện từ quản trị

### 🔄 Cập Nhật Liên Tục
- Theo dõi tiến độ hàng tuần so với sản phẩm giao nộp
- Cập nhật tài liệu này khi nội dung/yêu cầu thay đổi

---

## 📌 **Checklist Hoàn Thành Chi Tiết**

### 🚀 **Giai Đoạn 1: Khởi Tạo & Thiết Kế (Tuần 1)**

#### 📋 **Thiết Lập Dự Án**
- [ ] Tạo repository GitHub/GitLab với monorepo structure
- [ ] Cài đặt Laravel 10.x API với PHP 8.1+
- [ ] Tạo React.js app với Vite
- [ ] Cấu hình môi trường phát triển (.env cho Laravel, .env.local cho React)
- [ ] Thiết lập cơ sở dữ liệu MySQL
- [ ] Cài đặt Laravel Sanctum cho authentication
- [ ] Cài đặt Tailwind CSS + Headless UI cho React
- [ ] Cài đặt Axios cho API calls
- [ ] Cài đặt React Router DOM cho routing

#### 🎨 **Thiết Kế UI/UX**
- [ ] Tạo bảng màu chính cho website
- [ ] Thiết kế logo Green Groves
- [ ] Wireframe cho desktop (1920x1080)
- [ ] Wireframe cho tablet (768x1024)
- [ ] Wireframe cho mobile (375x667)
- [ ] Mockup trang chủ
- [ ] Mockup trang bài viết
- [ ] Mockup trang dụng cụ
- [ ] Mockup trang quản trị

#### 📊 **Phân Tích & Lập Kế Hoạch**
- [ ] Biểu đồ Use Case hoàn chỉnh
- [ ] Biểu đồ DFD (Data Flow Diagram)
- [ ] Sơ đồ cơ sở dữ liệu ERD
- [ ] Bản đồ route chi tiết
- [ ] Flowchart quy trình đăng nhập admin

#### 📝 **Nội Dung Mẫu**
- [ ] 5-8 bài viết kỹ thuật làm vườn mẫu
- [ ] 10-15 hình ảnh chất lượng cao
- [ ] Danh sách 20+ dụng cụ làm vườn
- [ ] Danh sách 15+ video hướng dẫn
- [ ] Danh sách 10+ sách tham khảo
- [ ] File JSON mẫu cho tất cả dữ liệu

### 🏗️ **Giai Đoạn 2: Phát Triển Cốt Lõi (Tuần 2)**

#### 🔐 **Hệ Thống Xác Thực**
- [ ] Tạo bảng users với migration
- [ ] Cấu hình Laravel Sanctum
- [ ] Implement API đăng nhập/đăng xuất
- [ ] Tạo middleware bảo vệ API routes
- [ ] Hash mật khẩu với bcrypt
- [ ] Tạo AuthContext cho React
- [ ] Implement JWT token management

#### 🏠 **React App Structure**
- [ ] Tạo App.jsx với React Router
- [ ] Tạo Layout component chính
- [ ] Header component với navigation
- [ ] Footer component với ticker
- [ ] Home page component
- [ ] Responsive design với Tailwind CSS
- [ ] Loading states và error handling

#### ⚙️ **Laravel API Backend**
- [ ] Tạo API controllers cho tất cả resources
- [ ] Implement CRUD operations
- [ ] API validation và error handling
- [ ] File upload API endpoints
- [ ] CORS configuration
- [ ] API documentation với Postman/Swagger

#### 🌍 **Tính Năng Địa Lý**
- [ ] API định vị địa lý (HTML5 Geolocation)
- [ ] Tích hợp Google Maps
- [ ] Hiển thị vị trí trong ticker
- [ ] Fallback khi không có định vị

### 📄 **Giai Đoạn 3: Nội Dung & Tính Năng (Tuần 3)**

#### 📖 **React Components - Bài Viết**
- [ ] ArticleList component với API integration
- [ ] ArticleDetail component với dynamic routing
- [ ] Search và filter functionality
- [ ] Pagination component
- [ ] Category và tag filtering
- [ ] Related articles suggestion

#### 🔧 **React Components - Dụng Cụ**
- [ ] ToolList component với grid layout
- [ ] ToolDetail component với video player
- [ ] Image gallery component
- [ ] Search và filter functionality
- [ ] Tool comparison feature

#### 🌱 **React Components - Vật Liệu**
- [ ] EssentialList component
- [ ] EssentialDetail component
- [ ] Filter by type và season
- [ ] Usage guide component
- [ ] Product recommendation

#### 🪴 **React Components - Chậu & Phụ Kiện**
- [ ] PotList component với card layout
- [ ] PotDetail component với specifications
- [ ] Size guide component
- [ ] Accessory recommendations
- [ ] Comparison tool

#### 🎥 **React Components - Video & Sách**
- [ ] VideoList component với thumbnail grid
- [ ] VideoPlayer component với YouTube/Vimeo
- [ ] BookList component với cover images
- [ ] BookDetail component với buy links
- [ ] Search và category filtering

#### 📞 **React Components - Liên Hệ**
- [ ] ContactForm component với validation
- [ ] Google Maps integration
- [ ] Team information display
- [ ] Form submission với API

### 🎯 **Giai Đoạn 4: Hoàn Thiện & Tối Ưu (Tuần 4)**

#### ⚡ **Tối Ưu Hiệu Suất**
- [ ] Lazy loading hình ảnh
- [ ] Minify CSS/JS
- [ ] Cache database queries
- [ ] Optimize hình ảnh
- [ ] CDN cho static files

#### 📱 **Responsive & Cross-browser**
- [ ] Test trên Chrome (desktop/mobile)
- [ ] Test trên Firefox (desktop/mobile)
- [ ] Test trên Safari (desktop/mobile)
- [ ] Test trên Edge (desktop/mobile)
- [ ] Test trên các kích thước màn hình khác nhau

#### 🔧 **Tính Năng Nâng Cao**
- [ ] React SPA với client-side routing
- [ ] Framer Motion cho animations
- [ ] Hover effects với CSS transitions
- [ ] Smooth scrolling với react-scroll
- [ ] Loading spinners và skeleton screens
- [ ] Infinite scroll cho danh sách
- [ ] Real-time updates với WebSocket (optional)

#### 📊 **Analytics & Thống Kê**
- [ ] Tracking lượt xem trang
- [ ] Thống kê khách truy cập
- [ ] Top bài viết được xem nhiều
- [ ] Báo cáo theo thời gian

#### 📤 **Export & Backup**
- [ ] Export dữ liệu ra JSON
- [ ] Export dữ liệu ra TXT
- [ ] Backup cơ sở dữ liệu
- [ ] Script import dữ liệu mẫu

#### 📚 **Tài Liệu & Demo**
- [ ] README.md chi tiết
- [ ] Hướng dẫn cài đặt
- [ ] Hướng dẫn sử dụng admin
- [ ] Video demo 5-10 phút
- [ ] Screenshot các trang chính
- [ ] Báo cáo kỹ thuật

#### 🧪 **Testing & Debug**
- [ ] Test tất cả chức năng admin
- [ ] Test tất cả chức năng frontend
- [ ] Fix các bug phát hiện
- [ ] Test performance
- [ ] Test security

#### 🚀 **Deployment**
- [ ] Chuẩn bị hosting
- [ ] Upload source code
- [ ] Cấu hình database production
- [ ] Test trên môi trường thực
- [ ] Domain và SSL (nếu có)

### ✅ **Kiểm Tra Cuối Cùng**
- [ ] Tất cả tính năng hoạt động đúng
- [ ] Giao diện đẹp và responsive
- [ ] Tốc độ tải trang nhanh
- [ ] Không có lỗi JavaScript
- [ ] Không có lỗi PHP
- [ ] Dữ liệu mẫu đầy đủ
- [ ] Tài liệu hoàn chỉnh
- [ ] Video demo chất lượng

---

## 🎯 **Kết Luận**

*Tài liệu này được chuẩn bị để nộp cho nhóm Green Groves. Hãy theo dõi kế hoạch, đánh giá tiến độ hàng tuần so với sản phẩm giao nộp, và cập nhật tài liệu này khi nội dung/yêu cầu phát triển.*

**🌱 Chúc nhóm Green Groves thành công với dự án! 🌱**

