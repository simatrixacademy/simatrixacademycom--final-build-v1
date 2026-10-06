<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', [ApiController::class, 'health']);

// Authentication with Brute-Force & DoS rate limiting
Route::post('/auth/login', [ApiController::class, 'login'])->middleware('throttle:5,1');
Route::post('/auth/refresh', [ApiController::class, 'refresh'])->middleware('throttle:15,1');
Route::post('/auth/logout', [ApiController::class, 'logout']);

// Public catalog & content routes
Route::get('/site', [ApiController::class, 'site']);
Route::get('/categories', [ApiController::class, 'categories']);
Route::get('/courses', [ApiController::class, 'courses']);
Route::get('/courses/{slug}', [ApiController::class, 'course']);
Route::get('/branches', [ApiController::class, 'branches']);

foreach (['blog', 'gallery', 'awards', 'testimonials'] as $r) {
    Route::get("/$r", fn(ApiController $c) => $c->listPublic($r));
}

Route::get('/blog/{slug}', [ApiController::class, 'detailBlog']);
Route::get('/reviews', fn(ApiController $c) => $c->listPublic('testimonials'));

// Rate-limited public user submissions
Route::post('/reviews', [ApiController::class, 'review'])->middleware('throttle:5,60');
Route::post('/enquiries', [ApiController::class, 'enquiry'])->middleware('throttle:6,60');

// Authenticated Admin API (JWT + HTTP-Only Cookie protected)
Route::middleware('jwt')->group(function () {
    Route::get('/auth/me', [ApiController::class, 'me']);

    Route::prefix('admin')->group(function () {
        Route::post('/upload', [ApiController::class, 'upload'])->middleware('throttle:30,1');
        Route::get('/settings', [ApiController::class, 'settings']);
        Route::put('/settings', [ApiController::class, 'saveSettings']);
        Route::get('/enquiries/{id}/notes', [ApiController::class, 'notes']);
        Route::post('/enquiries/{id}/notes', [ApiController::class, 'addNote']);
        Route::get('/{resource}', [ApiController::class, 'adminList']);
        Route::post('/{resource}', [ApiController::class, 'create']);
        Route::put('/{resource}/{id}', [ApiController::class, 'update']);
        Route::delete('/{resource}/{id}', [ApiController::class, 'delete']);
    });
});
