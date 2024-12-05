<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\EInvoiceController;


Route::prefix('admin')->group(function () {
    Route::controller(EInvoiceController::class)->group(function () {
        Route::get('vendor', 'index')->name('admin.vendor.index');
    });
});
