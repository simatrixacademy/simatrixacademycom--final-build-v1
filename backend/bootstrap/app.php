<?php

use App\Http\Middleware\JwtAuth;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\{Exceptions, Middleware};

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->alias([
            'jwt' => JwtAuth::class,
            'check.ban' => \App\Http\Middleware\CheckBannedIp::class,
        ]);
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->append(SecurityHeaders::class);
    })
    ->withExceptions(fn(Exceptions $exceptions) => null)
    ->create();
