<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * 信頼するプロキシ
     * ngrok越しで確実に動かすなら '*' でOK
     */
    protected $proxies = '*';

    /**
     * Forwarded ヘッダの扱い
     * HTTPS判定に必要な X-Forwarded-Proto を読む
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST;
}
