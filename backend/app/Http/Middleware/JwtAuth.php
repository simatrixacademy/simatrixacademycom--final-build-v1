<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Support\Jwt;
use Closure;
use Illuminate\Http\Request;

class JwtAuth
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Check HTTP-Only Cookie first, fallback to Bearer token
        $token = $request->cookie('simatrix_access_token') ?: $request->bearerToken();

        if (!$token) {
            return response()->json([
                'status' => 0,
                'error' => 'Authentication required',
                'code' => 'unauthenticated',
            ], 401);
        }

        $payload = Jwt::read($token);
        if (!$payload || ($payload['type'] ?? '') !== 'access') {
            return response()->json([
                'status' => 0,
                'error' => 'Access token has expired or is invalid',
                'code' => 'token_expired',
            ], 401);
        }

        $admin = Admin::find($payload['user_id'] ?? null);
        if (!$admin) {
            return response()->json([
                'status' => 0,
                'error' => 'User not found',
                'code' => 'unauthenticated',
            ], 401);
        }

        // Check if admin sessions were invalidated
        if ($admin->tokens_valid_after && isset($payload['iat'])) {
            $validAfter = strtotime($admin->tokens_valid_after);
            if ($payload['iat'] < $validAfter) {
                return response()->json([
                    'status' => 0,
                    'error' => 'Session has been invalidated. Please sign in again.',
                    'code' => 'session_revoked',
                ], 401);
            }
        }

        $request->attributes->set('admin', $admin);
        return $next($request);
    }
}
