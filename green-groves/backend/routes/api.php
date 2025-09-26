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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Public API Routes
Route::get('/articles', [App\Http\Controllers\Api\ArticleController::class, 'index']);
Route::get('/articles/{id}', [App\Http\Controllers\Api\ArticleController::class, 'show']);

// Tools
Route::get('/tools', [App\Http\Controllers\Api\ToolController::class, 'index']);
Route::get('/tools/{id}', [App\Http\Controllers\Api\ToolController::class, 'show']);

// Essentials
Route::get('/essentials', [App\Http\Controllers\Api\EssentialController::class, 'index']);
Route::get('/essentials/{id}', [App\Http\Controllers\Api\EssentialController::class, 'show']);

// Pots
Route::get('/pots', [App\Http\Controllers\Api\PotController::class, 'index']);
Route::get('/pots/{id}', [App\Http\Controllers\Api\PotController::class, 'show']);

// Videos
Route::get('/videos', [App\Http\Controllers\Api\VideoController::class, 'index']);
Route::get('/videos/{id}', [App\Http\Controllers\Api\VideoController::class, 'show']);

// Books
Route::get('/books', [App\Http\Controllers\Api\BookController::class, 'index']);
Route::get('/books/{id}', [App\Http\Controllers\Api\BookController::class, 'show']);

// Accessories
Route::get('/accessories', [App\Http\Controllers\Api\AccessoryController::class, 'index']);
Route::get('/accessories/{id}', [App\Http\Controllers\Api\AccessoryController::class, 'show']);

// Suggestions
Route::get('/suggestions', [App\Http\Controllers\Api\SuggestionController::class, 'index']);
Route::get('/suggestions/featured', [App\Http\Controllers\Api\SuggestionController::class, 'featured']);
Route::get('/suggestions/categories', [App\Http\Controllers\Api\SuggestionController::class, 'categories']);
Route::get('/suggestions/{id}', [App\Http\Controllers\Api\SuggestionController::class, 'show']);

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
