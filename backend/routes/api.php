<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    TestController,
    SimpleController,
    ContactController,
    SettingController,
    VisitorController,
    GeolocationController,
    AboutUsController,
    ArticleController,
    VideoController,
    ProductController,
    UploadController,
    ImageController,
    SimpleImageController,
    InteractionController,
    UserController,
    AuthController,
    HeroSectionController,
    StaffMemberController,
    MapSettingController,
    ContactSettingController,
    CampaignSettingController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['cors'])->group(function () {
    // Authentication routes (public)
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::post('/auth/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');

    // Public GET routes
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/about-us', [AboutUsController::class, 'index']);
    Route::get('/about-us/active', [AboutUsController::class, 'active']);
    Route::get('/about-us/{id}', [AboutUsController::class, 'show']);
    
    // About Us - New structure (Public)
    Route::get('/hero-sections/active', [HeroSectionController::class, 'getActive']);
    Route::get('/staff-members/active', [StaffMemberController::class, 'getActive']);
    Route::get('/map-settings/active', [MapSettingController::class, 'getActive']);
    Route::get('/contact-settings/active', [ContactSettingController::class, 'getActive']);
    
    // Products routes (unified)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
    Route::get('/products/featured', [ProductController::class, 'getFeatured']);
    
    // Admin CRUD routes for products (Admin and Moderator can manage)
    Route::middleware(['auth:sanctum', 'check.banned', 'check.role:admin,moderator'])->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::post('/products/{id}', [ProductController::class, 'update']); // Support POST with _method=PUT for FormData
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        // Admin routes (same as Articles)
        Route::put('/admin/products/{id}', [ProductController::class, 'update']);
        Route::post('/admin/products/{id}', [ProductController::class, 'update']); // Support POST with _method=PUT
        
        // Legacy routes support
        Route::post('/tools/{id}', [ProductController::class, 'update']);
        Route::post('/books/{id}', [ProductController::class, 'update']);
        Route::post('/pots/{id}', [ProductController::class, 'update']);
        Route::post('/accessories/{id}', [ProductController::class, 'update']);
        Route::post('/suggestions/{id}', [ProductController::class, 'update']);
        Route::post('/essentials/{id}', [ProductController::class, 'update']);
    });
    
    // Backward compatibility routes - call ProductController directly
    Route::get('/tools', [ProductController::class, 'index'])->defaults('category', 'tool');
    Route::get('/books', [ProductController::class, 'index'])->defaults('category', 'book');
    Route::get('/pots', [ProductController::class, 'index'])->defaults('category', 'pot');
    Route::get('/accessories', [ProductController::class, 'index'])->defaults('category', 'accessory');
    Route::get('/suggestions', [ProductController::class, 'index'])->defaults('category', 'suggestion');
    Route::get('/essentials', [ProductController::class, 'index'])->defaults('category', 'tool'); // Essentials now use tool category

    // Contact (public + admin)
    Route::post('/contact', [ContactController::class, 'store']);
    Route::middleware(['auth:sanctum', 'check.banned', 'check.role:admin,moderator'])->group(function () {
        Route::get('/contact-messages', [ContactController::class, 'index']);
        Route::get('/contact-messages/{id}', [ContactController::class, 'show']);
        Route::put('/contact-messages/{id}', [ContactController::class, 'update']);
        Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy']);
    });

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);

    // Visitor Counter
    Route::post('/visitor-counter', [VisitorController::class, 'increment']);
    Route::get('/visitor-stats', [VisitorController::class, 'getStats']);


    // Geolocation
    Route::get('/geolocation', [GeolocationController::class, 'getLocation']);

    // User Interactions (Public)
    Route::post('/interactions/like', [InteractionController::class, 'toggleLike']);
    Route::post('/interactions/rating', [InteractionController::class, 'submitRating']);
    Route::post('/interactions/view', [InteractionController::class, 'trackView']);
    Route::get('/interactions/user', [InteractionController::class, 'getUserInteractions']);
    Route::get('/interactions/stats', [InteractionController::class, 'getContentStats']);

    // User Management (Admin only - with banned check)
    Route::middleware(['auth:sanctum', 'check.banned', 'check.role:admin'])->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);  // Also checks security password in controller
        Route::get('/admin/users/{id}', [UserController::class, 'show']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']); // Also checks security password in controller
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
        Route::post('/admin/users/upload-avatar', [UserController::class, 'uploadAvatar']);
        
        // Security password management
        Route::put('/admin/security-password', [UserController::class, 'updateSecurityPassword']);
    });

    // File Upload (Protected - Admin and Moderator)
    Route::middleware(['auth:sanctum', 'check.banned', 'check.role:admin,moderator'])->group(function () {
        Route::post('/admin/upload', [UploadController::class, 'upload']);
        Route::delete('/admin/upload', [UploadController::class, 'delete']);
    });
    
    // Image Upload Routes - SIMPLE VERSION (Admin and Moderator)
    Route::middleware(['auth:sanctum', 'check.banned', 'check.role:admin,moderator'])->group(function () {
        Route::post('/admin/upload/image', [ImageController::class, 'upload']);
        Route::delete('/admin/upload/image', [ImageController::class, 'delete']);
        Route::get('/admin/upload/image/url', [ImageController::class, 'getUrl']);
    });

    // Content & Product Management (Admin + Moderator - with banned check)
    Route::middleware(['auth:sanctum', 'check.banned', 'check.role:admin,moderator'])->group(function () {
        // Articles
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{id}', [ArticleController::class, 'update']);
        Route::post('/articles/{id}', [ArticleController::class, 'update']); // Support POST with _method=PUT
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

        // Videos
        Route::post('/videos', [VideoController::class, 'store']);
        Route::put('/videos/{id}', [VideoController::class, 'update']);
        Route::post('/videos/{id}', [VideoController::class, 'update']); // Support POST with _method=PUT
        Route::delete('/videos/{id}', [VideoController::class, 'destroy']);
        
        // Admin routes with /admin prefix for frontend compatibility
        // Articles Admin
        Route::get('/admin/articles', [ArticleController::class, 'index']);
        Route::get('/admin/articles/{id}', [ArticleController::class, 'show']);
        Route::post('/admin/articles', [ArticleController::class, 'store']);
        Route::put('/admin/articles/{id}', [ArticleController::class, 'update']);
        Route::post('/admin/articles/{id}', [ArticleController::class, 'update']); // Support POST with _method=PUT
        Route::delete('/admin/articles/{id}', [ArticleController::class, 'destroy']);

        // Videos Admin
        Route::get('/admin/videos', [VideoController::class, 'index']);
        Route::get('/admin/videos/{id}', [VideoController::class, 'show']);
        Route::post('/admin/videos', [VideoController::class, 'store']);
        Route::put('/admin/videos/{id}', [VideoController::class, 'update']);
        Route::post('/admin/videos/{id}', [VideoController::class, 'update']); // For _method=PUT
        Route::delete('/admin/videos/{id}', [VideoController::class, 'destroy']);

        // About Us
        Route::post('/about-us', [AboutUsController::class, 'store']);
        Route::put('/about-us/{id}', [AboutUsController::class, 'update']);
        Route::delete('/about-us/{id}', [AboutUsController::class, 'destroy']);
        
        // About Us - New structure (Admin)
        // Hero Section
        Route::get('/admin/hero-sections', [HeroSectionController::class, 'index']);
        Route::post('/admin/hero-sections', [HeroSectionController::class, 'store']);
        Route::get('/admin/hero-sections/{id}', [HeroSectionController::class, 'show']);
        Route::put('/admin/hero-sections/{id}', [HeroSectionController::class, 'update']);
        Route::delete('/admin/hero-sections/{id}', [HeroSectionController::class, 'destroy']);
        
        // Staff Members
        Route::get('/admin/staff-members', [StaffMemberController::class, 'index']);
        Route::post('/admin/staff-members', [StaffMemberController::class, 'store']);
        Route::get('/admin/staff-members/{id}', [StaffMemberController::class, 'show']);
        Route::put('/admin/staff-members/{id}', [StaffMemberController::class, 'update']);
        Route::post('/admin/staff-members/{id}', [StaffMemberController::class, 'update']); // For multipart/form-data with _method=PUT
        Route::delete('/admin/staff-members/{id}', [StaffMemberController::class, 'destroy']);
        Route::post('/admin/staff-members/reorder', [StaffMemberController::class, 'reorder']);
        
        // Map Settings
        Route::get('/admin/map-settings', [MapSettingController::class, 'index']);
        Route::post('/admin/map-settings', [MapSettingController::class, 'store']);
        Route::get('/admin/map-settings/{id}', [MapSettingController::class, 'show']);
        Route::put('/admin/map-settings/{id}', [MapSettingController::class, 'update']);
        Route::delete('/admin/map-settings/{id}', [MapSettingController::class, 'destroy']);
        
        // Contact Settings
        Route::get('/admin/contact-settings', [ContactSettingController::class, 'index']);
        Route::post('/admin/contact-settings', [ContactSettingController::class, 'store']);
        Route::get('/admin/contact-settings/{id}', [ContactSettingController::class, 'show']);
        Route::put('/admin/contact-settings/{id}', [ContactSettingController::class, 'update']);
        Route::delete('/admin/contact-settings/{id}', [ContactSettingController::class, 'destroy']);
        
        // Campaign Settings
        Route::get('/admin/campaign-settings', [CampaignSettingController::class, 'index']);
        Route::get('/admin/campaign-settings/{metric}', [CampaignSettingController::class, 'show']);
        Route::put('/admin/campaign-settings/{metric}', [CampaignSettingController::class, 'update']);
        Route::get('/admin/stats/overview', [CampaignSettingController::class, 'getStatsOverview']);

        // Product Management (admin routes) - REMOVED DUPLICATE (already defined at lines 69-80)
        
        // Admin Settings
        Route::get('/admin/settings', [SettingController::class, 'index']);
        Route::put('/admin/settings', [SettingController::class, 'update']);
        
        // Activity Logs
        Route::get('/admin/activity-logs', [App\Http\Controllers\Api\ActivityLogController::class, 'index']);
        Route::get('/admin/activity-logs/public', [App\Http\Controllers\Api\ActivityLogController::class, 'getPublicActivities']);
        Route::get('/admin/activity-logs/security', [App\Http\Controllers\Api\ActivityLogController::class, 'getSecurityActivities']);
        Route::get('/admin/activity-logs/recent', [App\Http\Controllers\Api\ActivityLogController::class, 'getRecentActivities']);
        Route::delete('/admin/activity-logs/clear', [App\Http\Controllers\Api\ActivityLogController::class, 'clearOldLogs']);
        
        // Admin Dashboard Stats
        Route::get('/admin/dashboard/stats', function() {
            return response()->json([
                'success' => true,
                'data' => [
                    'totalUsers' => 150,
                    'totalViews' => 1250,
                    'totalArticles' => 25,
                    'totalVideos' => 15,
                    'avgRating' => 4.5,
                    'monthlyGrowth' => 12.5
                ]
            ]);
        });
        
        // Admin Analytics
        Route::get('/admin/analytics', function(Request $request) {
            $range = $request->get('range', '30d');
            return response()->json([
                'success' => true,
                'data' => [
                    'pageViews' => [
                        'total' => 1250,
                        'growth' => 12.5,
                        'chart' => [
                            ['date' => '2025-01-01', 'views' => 45],
                            ['date' => '2025-01-02', 'views' => 52],
                            ['date' => '2025-01-03', 'views' => 38],
                            ['date' => '2025-01-04', 'views' => 61],
                            ['date' => '2025-01-05', 'views' => 55]
                        ]
                    ],
                    'users' => [
                        'total' => 150,
                        'growth' => 8.2,
                        'chart' => [
                            ['date' => '2025-01-01', 'users' => 12],
                            ['date' => '2025-01-02', 'users' => 15],
                            ['date' => '2025-01-03', 'users' => 9],
                            ['date' => '2025-01-04', 'users' => 18],
                            ['date' => '2025-01-05', 'users' => 14]
                        ]
                    ],
                    'content' => [
                        'articles' => 25,
                        'videos' => 15,
                        'products' => 120
                    ]
                ]
            ]);
        });
    });

    // User Management (Admin only)
    Route::middleware(['auth:sanctum', 'admin.auth'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // User Profile (Admin + Moderator - own profile only)
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/user/profile', [UserController::class, 'profile']);
        Route::put('/user/profile', [UserController::class, 'updateProfile']);
        Route::post('/user/profile/test', [UserController::class, 'testProfile']); // Test endpoint
        Route::get('/user/profile/logs', [UserController::class, 'getLogs']); // Get logs
    });
});

// Simple upload routes - NO fopen() usage
Route::middleware(['cors'])->group(function () {
    
    // Simple Image Upload Routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/simple/upload/image', [SimpleImageController::class, 'upload']);
    });
});
