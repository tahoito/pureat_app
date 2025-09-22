<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HistoryController;   // ★ 追加
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

Route::middleware(['auth', 'verified'])->group(function () {
    // ホーム
    Route::get('/', [HomeController::class, 'index'])->name('home.index');

    // レシピ CRUD
    Route::get('/add', [RecipeController::class, 'create'])->name('recipes.add');
    Route::post('/recipes', [RecipeController::class, 'store'])->name('recipes.store');
    Route::get('/recipes/{recipe}', [RecipeController::class, 'show'])->name('recipes.show');
    Route::get('/recipes/{recipe}/edit', [RecipeController::class, 'edit'])->name('recipes.edit');     // ★ 統一
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update'])->name('recipes.update');      // ★ 統一

    // 閲覧履歴
    Route::get('history', [HistoryController::class, 'index'])->name('history.index');
    Route::delete('history/clear', [HistoryController::class, 'clear'])->name('history.clear');
    Route::delete('history/{recipe}', [HistoryController::class, 'destroy'])->name('history.destroy'); // ★ name 追加

    // お気に入り
    Route::post('/recipes/{recipe}/favorite', [FavoriteController::class,'toggle'])
        ->name('recipes.favorite.toggle');
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');


    // ダッシュボード
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // プロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
