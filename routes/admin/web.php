<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\EInvoiceController;
use App\Http\Controllers\Admin\UserController;

Route::prefix('admin')->group(function () {
    Route::controller(EInvoiceController::class)->group(function () {
        Route::get('vendor', 'index')->name('admin.vendor.index');
    });

    Route::controller(UserController::class)->group(function () {
        Route::get('user', 'index')->name('admin.user.index');
    });
});
