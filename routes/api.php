<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\Admin\API\UserController;
use App\Http\Controllers\Admin\API\EInvoiceController;
use App\Http\Controllers\Admin\API\OrchartApprovalController;
use App\Http\Controllers\API\ProjectController;
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
        Route::controller(UserController::class)->group(function () {
            Route::get('user', 'index');
            Route::post('user', 'store');
            Route::post('user/{id}', 'update');
            Route::get('user/check-username', 'checkUsername');
            Route::delete('user/{id}/destroy', 'destroy');
        });
        Route::controller(OrchartApprovalController::class)->group(function () {
            Route::get('orchart-approval', 'index');
            Route::post('orchart-approval', 'store');
            Route::post('orchart-approval/{id}', 'update');
            Route::delete('orchart-approval/{id}/destroy', 'destroy');
        });

    });

    Route::prefix('ami')->group(function () {

        Route::controller(ProjectController::class)->group(function () {
            Route::get('project', 'index');
            Route::post('project', 'store');
            Route::post('project/{id}', 'update');
            Route::delete('project/{id}/destroy', 'destroy');

            Route::get('project/{id}/worksheet-project', 'worksheetIndex');
            Route::delete('project/{id}/worksheet-project/destroy', 'worksheetDestroy');
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
