<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Redirect admin/settings to profile by default
    Route::redirect('settings', '/admin/settings/profile');

    // Profile settings
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('settings.profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('settings.profile.destroy');

    // Password settings
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('settings.password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('settings.password.update');

    // Appearance settings
    Route::get('settings/appearance', function () {
        return Inertia::render('admin/settings/appearance');
    })->name('settings.appearance');

    // User management routes
    Route::get('users/{userId}/edit', [ProfileController::class, 'editUser'])->name('users.edit');
    Route::patch('users/{userId}', [ProfileController::class, 'updateUser'])->name('users.update');
});
