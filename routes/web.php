<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ここから認証後の画面
Route::middleware(['auth', 'verified'])->group(function () {
    // 探す（ホーム）
    Route::get('/', [HomeController::class, 'index'])->name('explore');

    // 追加ページ（見た目だけならこれでOK）
    Route::get('/add', fn () => Inertia::render('Add/Index'))->name('recipes.add');

    // ダッシュボード（必要なら）
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // プロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
