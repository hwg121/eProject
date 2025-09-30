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
    BookController,
    ToolController,
    EssentialController,
    PotController,
    AccessoryController,
    SuggestionController,
    UploadController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['cors'])->group(function () {
    // Authenticated user (Sanctum)
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });

    // Debug
    Route::get('/debug', [TestController::class, 'debug']);
    Route::get('/debug/database', [TestController::class, 'database']);
    Route::get('/debug/tables', [TestController::class, 'tables']);
    Route::get('/debug/tools', [TestController::class, 'tools']);

    // Public GET routes
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/tools', [ToolController::class, 'index']);
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/essentials', [EssentialController::class, 'index']);
    Route::get('/pots', [PotController::class, 'index']);
    Route::get('/accessories', [AccessoryController::class, 'index']);
    Route::get('/suggestions', [SuggestionController::class, 'index']);
    Route::get('/about-us', [AboutUsController::class, 'index']);
    Route::get('/about-us/active', [AboutUsController::class, 'active']);
    Route::get('/about-us/{id}', [AboutUsController::class, 'show']);

    // Contact (public + admin)
    Route::post('/contact', [ContactController::class, 'store']);
    Route::middleware(['api.auth', 'admin.auth'])->group(function () {
        Route::get('/contact-messages', [ContactController::class, 'index']);
        Route::get('/contact-messages/{id}', [ContactController::class, 'show']);
        Route::put('/contact-messages/{id}', [ContactController::class, 'update']);
        Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy']);
    });

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);

    // Visitor Counter
    Route::post('/visitor-counter', [VisitorController::class, 'increment']);

    // Geolocation
    Route::get('/geolocation', [GeolocationController::class, 'getLocation']);

    // File Upload (Protected)
    Route::middleware(['api.auth', 'admin.auth'])->group(function () {
        Route::post('/admin/upload', [UploadController::class, 'upload']);
        Route::delete('/admin/upload', [UploadController::class, 'delete']);
    });

    // Admin CRUD (Protected)
    Route::middleware(['api.auth', 'admin.auth'])->group(function () {
        // Articles
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{id}', [ArticleController::class, 'update']);
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

        // Videos
        Route::post('/videos', [VideoController::class, 'store']);
        Route::put('/videos/{id}', [VideoController::class, 'update']);
        Route::delete('/videos/{id}', [VideoController::class, 'destroy']);

        // Books
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);

        // Tools
        Route::post('/tools', [ToolController::class, 'store']);
        Route::put('/tools/{id}', [ToolController::class, 'update']);
        Route::delete('/tools/{id}', [ToolController::class, 'destroy']);

        // Essentials
        Route::post('/essentials', [EssentialController::class, 'store']);
        Route::put('/essentials/{id}', [EssentialController::class, 'update']);
        Route::delete('/essentials/{id}', [EssentialController::class, 'destroy']);

        // Pots
        Route::post('/pots', [PotController::class, 'store']);
        Route::put('/pots/{id}', [PotController::class, 'update']);
        Route::delete('/pots/{id}', [PotController::class, 'destroy']);

        // Accessories
        Route::post('/accessories', [AccessoryController::class, 'store']);
        Route::put('/accessories/{id}', [AccessoryController::class, 'update']);
        Route::delete('/accessories/{id}', [AccessoryController::class, 'destroy']);

        // Suggestions
        Route::post('/suggestions', [SuggestionController::class, 'store']);
        Route::put('/suggestions/{id}', [SuggestionController::class, 'update']);
        Route::delete('/suggestions/{id}', [SuggestionController::class, 'destroy']);

        // About Us
        Route::post('/about-us', [AboutUsController::class, 'store']);
        Route::put('/about-us/{id}', [AboutUsController::class, 'update']);
        Route::delete('/about-us/{id}', [AboutUsController::class, 'destroy']);
    });
});
