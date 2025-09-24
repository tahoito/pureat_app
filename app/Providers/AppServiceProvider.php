<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;  

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // まずHTTPSを強制（先に呼んでOK）
        URL::forceScheme('https');

        // Viteの自動プリフェッチ（必要なければ一旦コメントアウトして切り分け可）
        Vite::prefetch(concurrency: 3);
    }
}
