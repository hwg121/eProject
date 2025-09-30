# Green Groves - Gardening SPA Frontend

A beautiful, modern React frontend for the Green Groves gardening platform, designed to work seamlessly with a Laravel backend.

## 🌟 Features

### Frontend Features
- **Modern React 18** with TypeScript
- **Responsive Design** with Tailwind CSS
- **Smooth Animations** with Framer Motion
- **Admin Dashboard** with full CRUD operations
- **Authentication System** with Laravel Sanctum integration
- **File Upload** support for images and videos
- **Search & Filtering** with real-time updates
- **Sorting Capabilities** for all data tables
- **Mobile-First Design** with beautiful UI/UX

### Admin Dashboard
- **Dashboard Analytics** with real-time statistics
- **Article Management** (Create, Read, Update, Delete)
- **Video Management** with embed support
- **Site Settings** customization
- **User Management** and role-based access
- **File Upload** with drag & drop
- **Search & Sort** functionality
- **Responsive Admin Interface**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Laravel backend running on `http://localhost:8000`

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd green-groves-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
VITE_APP_NAME=Green Groves
```

5. **Start development server**
```bash
npm run dev
```

## 🔧 Laravel Backend Integration

### Required Laravel API Endpoints

#### Authentication
```php
POST /api/auth/login
POST /api/auth/logout  
GET  /api/auth/user
```

#### Admin Dashboard
```php
GET  /api/admin/dashboard/stats
GET  /api/admin/analytics?range={timeRange}
```

#### Articles CRUD
```php
GET    /api/admin/articles
GET    /api/admin/articles/{id}
POST   /api/admin/articles
PUT    /api/admin/articles/{id}
DELETE /api/admin/articles/{id}
```

#### Videos CRUD
```php
GET    /api/admin/videos
GET    /api/admin/videos/{id}
POST   /api/admin/videos
PUT    /api/admin/videos/{id}
DELETE /api/admin/videos/{id}
```

#### Site Settings
```php
GET /api/admin/settings
PUT /api/admin/settings
```

#### File Upload
```php
POST /api/admin/upload
```

#### Public Endpoints
```php
GET /api/articles
GET /api/videos
GET /api/tools
GET /api/books
GET /api/seeds
GET /api/pots
GET /api/accessories
```

### Laravel Setup Requirements

1. **Install Laravel Sanctum**
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

2. **Configure CORS** in `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

3. **API Routes** in `routes/api.php`:
```php
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('videos', VideoController::class);
    Route::get('settings', [SettingsController::class, 'show']);
    Route::put('settings', [SettingsController::class, 'update']);
    Route::post('upload', [UploadController::class, 'store']);
});
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── UI/
│   │   ├── Card.tsx
│   │   └── PageHeader.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useApi.ts
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── AdminDashboard.tsx
│   └── [other pages]
├── services/
│   └── api.ts
├── types/
│   └── api.ts
└── data/
    └── mockData.ts
```

## 🎨 Styling & Design

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Responsive Design** with mobile-first approach
- **Green/Emerald Color Scheme** for gardening theme
- **Modern Glassmorphism** effects and gradients

## 🔐 Authentication Flow

1. User enters credentials on `/login`
2. Frontend sends POST to `/api/auth/login`
3. Laravel returns user data + Sanctum token
4. Token stored in localStorage
5. All subsequent API calls include `Authorization: Bearer {token}`
6. Protected routes check authentication status
7. Admin routes verify user role

## 📊 Admin Dashboard Features

### Dashboard Analytics
- Real-time statistics display
- User growth metrics
- Content performance tracking
- Page view analytics

### Content Management
- **Articles**: Full CRUD with rich text editing
- **Videos**: Embed support for YouTube/Vimeo
- **Categories**: Organize content efficiently
- **Status Management**: Draft/Published states

### Site Customization
- Logo and branding settings
- Color scheme customization
- Contact information management
- Social media links
- SEO meta tags

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_BACKEND_URL=https://your-api-domain.com
VITE_APP_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Green Groves** - Growing knowledge, nurturing nature! 🌱