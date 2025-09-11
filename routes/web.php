<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\FavoriteController;
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
    Route::get('/',[HomeController::class,'index'])->name('home.index');

    // 追加ページ（見た目だけならこれでOK）
    Route::get('/add', [RecipeController::class,'create'])->name('recipes.add');
    Route::post('/recipes',[RecipeController::class,'store'])->name('recipes.store');
    Route::get('/recipes/{recipe}',[RecipeController::class,'show'])->name('recipes.show');
    Route::get('/recipes/{recipe}/edit',[RecipeController::class,'edit'])->name('recipe.edit');
    Route::put('/recipes/{recipe}',[RecipeController::class,'update'])->name('recipe.update');

    Route::post('/recipes/{recipe}/favorite',[FavoriteController::class,'toggle'])->name('recipes.favorite.toggle');
    Route::get('/favorites',[FavoriteController::class,'index'])->name('favorites.index');

    // ダッシュボード（必要なら）
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // プロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
