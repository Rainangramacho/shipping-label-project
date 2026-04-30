<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ShippingLabel\ShippingLabelController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::group(['prefix' => 'shipping-labels'], function () {
        Route::get('/', [ShippingLabelController::class, 'index']);
        Route::post('/', [ShippingLabelController::class, 'store']);
        Route::get('/{id}', [ShippingLabelController::class, 'show']);
    });
});