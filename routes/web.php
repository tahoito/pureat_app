<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\SeasoningController;   // ★ 追加
use Illuminate\Foundation\Application;
use App\Http\Controllers\ShoppingListController;  
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\SeasoningController as AdminSeasoningController;



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
    Route::get('/recipes/{recipe}', [RecipeController::class, 'show'])->can('view', 'recipe')->name('recipes.show');
    Route::get('/recipes/{recipe}/edit', [RecipeController::class, 'edit'])->can('update', 'recipe')->name('recipes.edit');
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update'])->can('update', 'recipe')->name('recipes.update');

    
    // 調味料リスト
    Route::get('seasonings', [SeasoningController::class, 'index'])->name('seasonings.index');
    Route::get('/seasonings/{seasoning:slug}', [SeasoningController::class,'show'])->name('seasonings.show');

    // お気に入り
    Route::post('/recipes/{recipe}/favorite', [FavoriteController::class,'toggle'])
        ->name('recipes.favorite.toggle');
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');

    Route::post('/shopping-list/add',[ShoppingListController::class, 'add'])->name('shopping-list.add');
    Route::put('/shopping-list/{id}/toggle',[ShoppingListController::class,'toggle'])->name('shopping-list.toggle');
    Route::get('/shopping-list',[ShoppingListController::class,'index'])->name('shopping-list.index');
    Route::delete('/shopping-list/clear',[ShoppingListController::class,'clear'])->name('shopping-list.clear');

    // ダッシュボード
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // プロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'can:manage-seasonings'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/seasonings', [AdminSeasoningController::class, 'index'])->name('seasonings.index');
        Route::get('/seasonings/create', [AdminSeasoningController::class, 'create'])->name('seasonings.create');
        Route::post('/seasonings', [AdminSeasoningController::class, 'store'])->name('seasonings.store');
        Route::get('/seasonings/{seasoning}/edit', [AdminSeasoningController::class, 'edit'])->name('seasonings.edit');
        Route::put('/seasonings/{seasoning}', [AdminSeasoningController::class, 'update'])->name('seasonings.update');
        Route::delete('/seasonings/{seasoning}', [AdminSeasoningController::class, 'destroy'])->name('seasonings.destroy');
    });

require __DIR__.'/auth.php';
