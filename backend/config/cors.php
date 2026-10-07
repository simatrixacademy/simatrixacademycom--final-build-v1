<?php

$defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://simatrixacademy.com',
    'https://www.simatrixacademy.com',
    'http://simatrixacademy.com',
    'http://www.simatrixacademy.com',
];

$rawOrigins = env('CORS_ALLOWED_ORIGINS', '');
if ($rawOrigins && $rawOrigins !== '*') {
    $parsed = array_values(array_filter(array_map('trim', explode(',', $rawOrigins))));
    $allowedOrigins = array_values(array_unique(array_merge($defaultOrigins, $parsed)));
} else {
    $allowedOrigins = $defaultOrigins;
}

return [
    'paths' => ['api/*', 'src/assets/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $allowedOrigins,
    'allowed_origins_patterns' => [
        '#^https?://localhost(:\d+)?$#',
        '#^https?://127\.0\.0\.1(:\d+)?$#',
        '#^https?://(.*\.)?simatrixacademy\.com$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Set-Cookie'],
    'max_age' => 0,
    'supports_credentials' => true,
];

