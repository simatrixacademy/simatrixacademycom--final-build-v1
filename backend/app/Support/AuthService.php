<?php

namespace App\Support;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Cookie;

final class AuthService
{
    const ACCESS_TOKEN_MINUTES = 15;        // 15 minutes
    const REFRESH_TOKEN_DAYS = 7;           // 7 days

    /**
     * Issue an access JWT and a cryptographically secure refresh token
     */
    public static function issueTokens($admin, Request $request): array
    {
        $accessToken = Jwt::issueAccess($admin->id, self::ACCESS_TOKEN_MINUTES * 60);

        // Generate cryptographically secure 64-character random token
        $plainRefreshToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $plainRefreshToken);

        DB::table('refresh_tokens')->insert([
            'admin_id' => $admin->id,
            'token_hash' => $tokenHash,
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
            'expires_at' => now()->addDays(self::REFRESH_TOKEN_DAYS),
            'revoked_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $plainRefreshToken,
            'access_expires_in' => self::ACCESS_TOKEN_MINUTES * 60,
        ];
    }

    /**
     * Attach HttpOnly, SameSite=Lax cookies to a JsonResponse
     */
    public static function attachTokenCookies(JsonResponse $response, array $tokens, Request $request): JsonResponse
    {
        // Only require Secure flag if running on HTTPS or production
        $isSecure = $request->isSecure() || app()->isProduction() || env('FORCE_COOKIE_SECURE', false);

        // Access token cookie (15 mins)
        $accessCookie = cookie(
            name: 'simatrix_access_token',
            value: $tokens['access_token'],
            minutes: self::ACCESS_TOKEN_MINUTES,
            path: '/',
            domain: null,
            secure: $isSecure,
            httpOnly: true,
            raw: false,
            sameSite: 'lax'
        );

        // Refresh token cookie (7 days)
        $refreshCookie = cookie(
            name: 'simatrix_refresh_token',
            value: $tokens['refresh_token'],
            minutes: self::REFRESH_TOKEN_DAYS * 24 * 60,
            path: '/',
            domain: null,
            secure: $isSecure,
            httpOnly: true,
            raw: false,
            sameSite: 'lax'
        );

        return $response->cookie($accessCookie)->cookie($refreshCookie);
    }

    /**
     * Clear auth cookies on logout
     */
    public static function clearTokenCookies(JsonResponse $response, Request $request): JsonResponse
    {
        $isSecure = $request->isSecure() || app()->isProduction() || env('FORCE_COOKIE_SECURE', false);

        $clearAccess = cookie(
            name: 'simatrix_access_token',
            value: '',
            minutes: -2628000,
            path: '/',
            domain: null,
            secure: $isSecure,
            httpOnly: true,
            raw: false,
            sameSite: 'lax'
        );

        $clearRefresh = cookie(
            name: 'simatrix_refresh_token',
            value: '',
            minutes: -2628000,
            path: '/',
            domain: null,
            secure: $isSecure,
            httpOnly: true,
            raw: false,
            sameSite: 'lax'
        );

        return $response->cookie($clearAccess)->cookie($clearRefresh);
    }

    /**
     * Validate and rotate a refresh token.
     * Includes automatic Reuse Detection (RFC 6749 / OWASP best practice).
     */
    public static function rotateRefreshToken(?string $plainRefreshToken, Request $request): ?array
    {
        if (!$plainRefreshToken) {
            return null;
        }

        $hash = hash('sha256', $plainRefreshToken);
        $record = DB::table('refresh_tokens')->where('token_hash', $hash)->first();

        if (!$record) {
            return null;
        }

        // If the token is already expired
        if (strtotime($record->expires_at) < time()) {
            return null;
        }

        // REUSE DETECTION: If this token was ALREADY revoked, an attacker or compromised party
        // is attempting a replay attack. Revoke ALL active sessions for this admin immediately!
        if ($record->revoked_at !== null) {
            DB::table('refresh_tokens')
                ->where('admin_id', $record->admin_id)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now(), 'updated_at' => now()]);

            DB::table('admins')
                ->where('id', $record->admin_id)
                ->update(['tokens_valid_after' => now()]);

            return null;
        }

        // Token is valid! Revoke current token
        DB::table('refresh_tokens')
            ->where('id', $record->id)
            ->update(['revoked_at' => now(), 'updated_at' => now()]);

        // Find Admin
        $admin = Admin::find($record->admin_id);
        if (!$admin) {
            return null;
        }

        // Check if admin sessions were invalidated after this token was created
        if ($admin->tokens_valid_after && strtotime($admin->tokens_valid_after) > strtotime($record->created_at)) {
            return null;
        }

        // Issue new pair of tokens
        $newTokens = self::issueTokens($admin, $request);

        return [
            'admin' => $admin,
            'tokens' => $newTokens,
        ];
    }

    /**
     * Revoke single refresh token by plaintext value
     */
    public static function revokeRefreshToken(?string $plainRefreshToken): void
    {
        if (!$plainRefreshToken) {
            return;
        }
        $hash = hash('sha256', $plainRefreshToken);
        DB::table('refresh_tokens')
            ->where('token_hash', $hash)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now(), 'updated_at' => now()]);
    }

    /**
     * Invalidate all sessions for an admin
     */
    public static function revokeAllSessions(int $adminId): void
    {
        DB::table('refresh_tokens')
            ->where('admin_id', $adminId)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now(), 'updated_at' => now()]);

        DB::table('admins')
            ->where('id', $adminId)
            ->update(['tokens_valid_after' => now()]);
    }
}
