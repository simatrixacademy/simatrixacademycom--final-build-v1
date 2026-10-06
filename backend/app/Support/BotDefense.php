<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

final class BotDefense
{
    /**
     * Check if the incoming request exhibits automated bot behavior
     */
    public static function isBot(Request $request): bool
    {
        // 1. Honeypot traps: Bots auto-fill hidden inputs
        $honeypotFields = ['hp_website', 'bot_check', 'company_fax', 'website_url_hp'];
        foreach ($honeypotFields as $field) {
            if ($request->filled($field)) {
                return true;
            }
        }

        // 2. Submission speed check: Real users take at least 1.5 - 2 seconds
        $submissionTime = (int)$request->input('_submission_time');
        if ($submissionTime > 0) {
            $elapsedSeconds = time() - $submissionTime;
            if ($elapsedSeconds < 2) {
                return true;
            }
        }

        // 3. Optional Cloudflare Turnstile validation
        $turnstileSecret = env('TURNSTILE_SECRET_KEY');
        if ($turnstileSecret) {
            $token = $request->input('cf_turnstile_token') ?: $request->input('turnstile_token');
            if (!$token) {
                return true;
            }
            try {
                $response = Http::asForm()->timeout(4)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $turnstileSecret,
                    'response' => $token,
                    'remoteip' => $request->ip(),
                ]);
                $data = $response->json();
                if (!($data['success'] ?? false)) {
                    return true;
                }
            } catch (\Throwable $e) {
                // If Cloudflare is unreachable, fallback to honeypot
            }
        }

        return false;
    }

    /**
     * Check content for high-risk spam keywords
     */
    public static function containsSpam(string $text): bool
    {
        $spamPatterns = [
            '/\[url=/i',
            '/<a\s+href=/i',
            '/casino/i',
            '/viagra/i',
            '/crypto\s+giveaway/i',
            '/whatsapp\s+group\s+link/i',
            '/telegram\s+channel/i',
            '/make\s+money\s+fast/i',
        ];

        foreach ($spamPatterns as $pattern) {
            if (preg_match($pattern, $text)) {
                return true;
            }
        }

        return false;
    }
}
