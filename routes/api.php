<?php

use App\Http\Controllers\Admin\API\EInvoiceController;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('login', [AuthenticatedSessionController::class, 'store']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('user', [AuthenticatedSessionController::class, 'me']);
    Route::post('logout', [AuthenticatedSessionController::class, 'logout']);
});

Route::middleware(['jwt.auth'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::controller(EInvoiceController::class)->group(function () {
            Route::get('vendor', 'index');
        });
    });
});

Route::get('/validate-token', function () {
    try {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json(['message' => 'Token is valid'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Invalid token'], 401);
    }
})->middleware(['jwt.auth'])->name('validate-token');
