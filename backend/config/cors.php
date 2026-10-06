<?php

$rawOrigins = env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173');
$origins = array_values(array_filter(array_map('trim', explode(',', $rawOrigins))));

return [
    'paths' => ['api/*', 'src/assets/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => in_array('*', $origins, true) ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : $origins,
    'allowed_origins_patterns' => [
        '#^https?://localhost(:\d+)?$#',
        '#^https?://127\.0\.0\.1(:\d+)?$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Set-Cookie'],
    'max_age' => 0,
    'supports_credentials' => true,
];
