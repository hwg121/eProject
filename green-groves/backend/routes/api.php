<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Add CORS headers to all API routes
Route::middleware(['cors'])->group(function () {
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working', 'timestamp' => now()]);
});

// Simple CORS test route
Route::options('/{any}', function () {
    return response('', 200);
})->where('any', '.*');

// Test controller routes
Route::get('/cors-test', [App\Http\Controllers\Api\TestController::class, 'test']);
Route::options('/cors-test', [App\Http\Controllers\Api\TestController::class, 'options']);

// Debug routes
Route::get('/debug', function () {
    return response()->json([
        'message' => 'API is working',
        'timestamp' => now(),
        'status' => 'ok'
    ]);
});

Route::get('/debug/database', function () {
    try {
        \DB::connection()->getPdo();
        return response()->json([
            'message' => 'Database connected',
            'status' => 'ok'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Database error',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

Route::get('/debug/tables', function () {
    try {
        $tables = \DB::select('SHOW TABLES');
        return response()->json([
            'message' => 'Tables found',
            'tables' => $tables,
            'status' => 'ok'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Tables error',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

Route::get('/debug/tools', function () {
    try {
        $tools = \App\Models\Tool::all();
        return response()->json([
            'message' => 'Tools endpoint working',
            'count' => $tools->count(),
            'tools' => $tools->take(3), // First 3 tools
            'status' => 'ok'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Tools endpoint error',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

// Simple test routes (no database dependency)
Route::get('/simple-test', [App\Http\Controllers\Api\SimpleController::class, 'test']);
Route::get('/simple-articles', [App\Http\Controllers\Api\SimpleController::class, 'articles']);
Route::get('/simple-tools', [App\Http\Controllers\Api\SimpleController::class, 'tools']);
Route::get('/simple-videos', [App\Http\Controllers\Api\SimpleController::class, 'videos']);
Route::get('/simple-books', [App\Http\Controllers\Api\SimpleController::class, 'books']);

        // Public API Routes (with real controllers)
        Route::get('/articles', [App\Http\Controllers\Api\ArticleController::class, 'index']);
        Route::get('/tools', [App\Http\Controllers\Api\ToolController::class, 'index']);
        Route::get('/videos', [App\Http\Controllers\Api\VideoController::class, 'index']);
        Route::get('/books', [App\Http\Controllers\Api\BookController::class, 'index']);
        Route::get('/essentials', [App\Http\Controllers\Api\EssentialController::class, 'index']);
        Route::get('/pots', [App\Http\Controllers\Api\PotController::class, 'index']);
        Route::get('/accessories', [App\Http\Controllers\Api\AccessoryController::class, 'index']);
        Route::get('/suggestions', [App\Http\Controllers\Api\SuggestionController::class, 'index']);
        Route::get('/about-us', [App\Http\Controllers\Api\AboutUsController::class, 'index']);
        Route::get('/contact-messages', [App\Http\Controllers\Api\ContactController::class, 'index']);

// Contact - Public routes
Route::post('/contact', [App\Http\Controllers\Api\ContactController::class, 'store']);

// Contact - Protected routes (Admin only)
Route::middleware(['api.auth', 'admin.auth'])->group(function () {
    Route::get('/contact-messages', [App\Http\Controllers\Api\ContactController::class, 'index']);
    Route::get('/contact-messages/{id}', [App\Http\Controllers\Api\ContactController::class, 'show']);
    Route::put('/contact-messages/{id}', [App\Http\Controllers\Api\ContactController::class, 'update']);
    Route::delete('/contact-messages/{id}', [App\Http\Controllers\Api\ContactController::class, 'destroy']);
});

// Settings
Route::get('/settings', [App\Http\Controllers\Api\SettingController::class, 'index']);

// Visitor Counter
Route::post('/visitor-counter', [App\Http\Controllers\Api\VisitorController::class, 'increment']);

// Geolocation
Route::get('/geolocation', [App\Http\Controllers\Api\GeolocationController::class, 'getLocation']);

// About Us - Public routes
Route::get('/about-us', [App\Http\Controllers\Api\AboutUsController::class, 'index']);
Route::get('/about-us/active', [App\Http\Controllers\Api\AboutUsController::class, 'active']);
Route::get('/about-us/{id}', [App\Http\Controllers\Api\AboutUsController::class, 'show']);

// About Us - Protected routes (Admin only)
Route::middleware(['api.auth', 'admin.auth'])->group(function () {
    Route::post('/about-us', [App\Http\Controllers\Api\AboutUsController::class, 'store']);
    Route::put('/about-us/{id}', [App\Http\Controllers\Api\AboutUsController::class, 'update']);
    Route::delete('/about-us/{id}', [App\Http\Controllers\Api\AboutUsController::class, 'destroy']);
});

// Admin CRUD routes for all content types
Route::middleware(['api.auth', 'admin.auth'])->group(function () {
    // Articles CRUD
    Route::post('/articles', [App\Http\Controllers\Api\ArticleController::class, 'store']);
    Route::put('/articles/{id}', [App\Http\Controllers\Api\ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [App\Http\Controllers\Api\ArticleController::class, 'destroy']);
    
    // Videos CRUD
    Route::post('/videos', [App\Http\Controllers\Api\VideoController::class, 'store']);
    Route::put('/videos/{id}', [App\Http\Controllers\Api\VideoController::class, 'update']);
    Route::delete('/videos/{id}', [App\Http\Controllers\Api\VideoController::class, 'destroy']);
    
    // Books CRUD
    Route::post('/books', [App\Http\Controllers\Api\BookController::class, 'store']);
    Route::put('/books/{id}', [App\Http\Controllers\Api\BookController::class, 'update']);
    Route::delete('/books/{id}', [App\Http\Controllers\Api\BookController::class, 'destroy']);
    
    // Tools CRUD
    Route::post('/tools', [App\Http\Controllers\Api\ToolController::class, 'store']);
    Route::put('/tools/{id}', [App\Http\Controllers\Api\ToolController::class, 'update']);
    Route::delete('/tools/{id}', [App\Http\Controllers\Api\ToolController::class, 'destroy']);
    
    // Essentials CRUD
    Route::post('/essentials', [App\Http\Controllers\Api\EssentialController::class, 'store']);
    Route::put('/essentials/{id}', [App\Http\Controllers\Api\EssentialController::class, 'update']);
    Route::delete('/essentials/{id}', [App\Http\Controllers\Api\EssentialController::class, 'destroy']);
    
    // Pots CRUD
    Route::post('/pots', [App\Http\Controllers\Api\PotController::class, 'store']);
    Route::put('/pots/{id}', [App\Http\Controllers\Api\PotController::class, 'update']);
    Route::delete('/pots/{id}', [App\Http\Controllers\Api\PotController::class, 'destroy']);
    
    // Accessories CRUD
    Route::post('/accessories', [App\Http\Controllers\Api\AccessoryController::class, 'store']);
    Route::put('/accessories/{id}', [App\Http\Controllers\Api\AccessoryController::class, 'update']);
    Route::delete('/accessories/{id}', [App\Http\Controllers\Api\AccessoryController::class, 'destroy']);
    
    // Suggestions CRUD
    Route::post('/suggestions', [App\Http\Controllers\Api\SuggestionController::class, 'store']);
    Route::put('/suggestions/{id}', [App\Http\Controllers\Api\SuggestionController::class, 'update']);
    Route::delete('/suggestions/{id}', [App\Http\Controllers\Api\SuggestionController::class, 'destroy']);
});

// Admin API Routes (Protected) - Commented out for now
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
//     // Auth
//     Route::post('/login', [App\Http\Controllers\Api\Admin\AuthController::class, 'login']);
//     Route::post('/logout', [App\Http\Controllers\Api\Admin\AuthController::class, 'logout']);
//     
//     // Dashboard
//     Route::get('/dashboard', [App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
//     
//     // Articles Management
//     Route::apiResource('articles', App\Http\Controllers\Api\Admin\ArticleController::class);
//     
//     // Tools Management
//     Route::apiResource('tools', App\Http\Controllers\Api\Admin\ToolController::class);
//     
//     // Essentials Management
//     Route::apiResource('essentials', App\Http\Controllers\Api\Admin\EssentialController::class);
//     
//     // Pots Management
//     Route::apiResource('pots', App\Http\Controllers\Api\Admin\PotController::class);
//     
//     // Videos Management
//     Route::apiResource('videos', App\Http\Controllers\Api\Admin\VideoController::class);
//     
//     // Books Management
//     Route::apiResource('books', App\Http\Controllers\Api\Admin\BookController::class);
//     
//     // Settings Management
//     Route::get('/settings', [App\Http\Controllers\Api\Admin\SettingController::class, 'index']);
//     Route::put('/settings', [App\Http\Controllers\Api\Admin\SettingController::class, 'update']);
//     
//     // File Upload
//     Route::post('/upload', [App\Http\Controllers\Api\Admin\FileUploadController::class, 'upload']);
// });
});
