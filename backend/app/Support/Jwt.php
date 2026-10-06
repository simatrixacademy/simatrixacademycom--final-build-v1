<?php

namespace App\Support;

final class Jwt
{
    private static function b(string $v): string
    {
        return rtrim(strtr(base64_encode($v), '+/', '-_'), '=');
    }

    /**
     * Issue a short-lived access JWT (default 15 minutes = 900 seconds)
     */
    public static function issueAccess(int $userId, int $seconds = 900): string
    {
        $now = time();
        $header = self::b(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = self::b(json_encode([
            'user_id' => $userId,
            'type' => 'access',
            'iat' => $now,
            'exp' => $now + $seconds,
        ]));
        $secret = config('services.jwt.secret', env('JWT_SECRET', 'simatrix-secret-key'));
        $signature = self::b(hash_hmac('sha256', "{$header}.{$payload}", $secret, true));

        return "{$header}.{$payload}.{$signature}";
    }

    /**
     * Backward-compatible alias
     */
    public static function issue(int $userId): string
    {
        return self::issueAccess($userId);
    }

    /**
     * Read and verify a JWT signature and expiration
     */
    public static function read(?string $token): ?array
    {
        if (!$token) {
            return null;
        }

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $decoded = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
        if (!is_array($decoded)) {
            return null;
        }

        $secret = config('services.jwt.secret', env('JWT_SECRET', 'simatrix-secret-key'));
        $expected = self::b(hash_hmac('sha256', "{$header}.{$payload}", $secret, true));

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        if (($decoded['exp'] ?? 0) < time()) {
            return null;
        }

        return $decoded;
    }
}
