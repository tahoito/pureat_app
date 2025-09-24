<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;  
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $appUrl = config('app.url');

        // APP_URL が https のときだけ強制
        if ($appUrl && Str::startsWith($appUrl, 'https://')) {
            URL::forceScheme('https');
        }

        // Viteの自動プリフェッチ
        Vite::prefetch(concurrency: 3);
    }
}