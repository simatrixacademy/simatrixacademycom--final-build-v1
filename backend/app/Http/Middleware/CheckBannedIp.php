<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache, DB};

class CheckBannedIp
{
    public function handle(Request $request, Closure $next)
    {
        $ip = $request->ip();

        // 0. Safe bypass: Allow admin unban requests to proceed
        if ($request->is('api/admin/banned_ips*')) {
            return $next($request);
        }

        // 1. Ultra-fast in-memory/cache check: O(1) lookup, 0 DB queries for normal visitors
        $bannedMap = Cache::remember('active_banned_ips_map', 300, function () {
            $map = [];
            foreach (DB::table('banned_ips')->where('is_banned', 1)->get(['ip', 'banned_until']) as $row) {
                $map[$row->ip] = $row->banned_until ?: 'permanent';
            }
            return $map;
        });

        // 2. If IP is not banned, continue immediately with zero overhead
        if (!isset($bannedMap[$ip])) {
            return $next($request);
        }

        $bannedUntil = $bannedMap[$ip] === 'permanent' ? null : $bannedMap[$ip];

        // 3. Auto-lift ban if temporary duration has expired
        if ($bannedUntil && strtotime($bannedUntil) <= time()) {
            DB::table('banned_ips')->where('ip', $ip)->delete();
            Cache::forget('active_banned_ips_map');
            return $next($request);
        }

        // 4. Client is banned:
        // If client requests HTML directly in browser, output clean page with <h2>You are banned</h2>
        $accept = $request->header('Accept', '');
        if (!$request->expectsJson() && (str_contains($accept, 'text/html') || !$accept)) {
            $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 1.5rem;
    }
    .card {
      text-align: center;
      max-width: 420px;
      width: 100%;
    }
    h2 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #f43f5e;
      margin: 0 0 0.5rem;
      letter-spacing: -0.025em;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }
    .ip {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      background: #1e293b;
      font-family: monospace;
      font-size: 0.8rem;
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>You are banned</h2>
    <p>Your IP address has been blocked from accessing this system by an administrator.</p>
    <div class="ip">IP: $ip</div>
  </div>
</body>
</html>
HTML;
            return response($html, 403)->header('Content-Type', 'text/html');
        }

        // Return JSON with message "You are banned" and code "ip_banned"
        return response()->json([
            'status' => 0,
            'message' => 'You are banned',
            'code' => 'ip_banned',
            'ip' => $ip,
            'banned_until' => $bannedUntil,
        ], 403);
    }
}
