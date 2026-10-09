<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Support\AuthService;
use App\Support\BotDefense;
use App\Support\Jwt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache, DB, Hash};
use Illuminate\Support\Str;

class ApiController
{
    private function ok($d = null, $m = 'Success', $c = 200)
    {
        $p = ['status' => 1, 'message' => $m];
        if ($d !== null) $p['data'] = $d;
        return response()->json($p, $c);
    }

    private function no($m, $c = 400, $code = null)
    {
        $payload = ['status' => 0, 'message' => $m];
        if ($code) $payload['code'] = $code;
        return response()->json($payload, $c);
    }

    private array $map = [
        'categories' => ['course_categories', 'name'],
        'courses' => ['courses', 'title'],
        'branches' => ['branches', 'name'],
        'testimonials' => ['testimonials', 'name'],
        'features' => ['features', 'title'],
        'enquiries' => ['enquiries', 'name'],
        'blog' => ['blog_posts', 'title'],
        'gallery' => ['gallery_images', 'image'],
        'awards' => ['awards', 'title'],
        'banned_ips' => ['banned_ips', 'ip'],
    ];

    function health()
    {
        return ['status' => 1, 'message' => 'Simatrix Academy API running'];
    }

    private function handleFailedLogin(string $ip)
    {
        $row = DB::table('banned_ips')->where('ip', $ip)->first();
        $attempts = ($row ? (int)$row->failed_attempts : 0) + 1;
        $maxAttempts = 5;

        if ($attempts >= $maxAttempts) {
            $bannedUntil = now()->addHours(24);
            DB::table('banned_ips')->updateOrInsert(
                ['ip' => $ip],
                [
                    'reason' => 'Too many failed login attempts (Brute force protection)',
                    'failed_attempts' => $attempts,
                    'banned_by' => 'system',
                    'is_banned' => 1,
                    'banned_until' => $bannedUntil,
                    'created_at' => $row->created_at ?? now(),
                    'updated_at' => now(),
                ]
            );

            Cache::forget('active_banned_ips_map');

            // Audit log
            DB::table('activity_logs')->insert([
                'admin_id' => null,
                'admin_name' => 'System Defense',
                'action' => "Automatically banned IP {$ip} for 24 hours after 5 failed login attempts",
                'entity' => 'security',
                'created_at' => now(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => "Your IP address ({$ip}) has been banned for 24 hours due to 5 consecutive failed login attempts. Contact an administrator to remove this ban.",
                'code' => 'ip_banned',
                'ip' => $ip,
                'remaining_minutes' => 1440,
                'banned_until' => $bannedUntil,
            ], 403);
        }

        // Under 5 attempts: increment counter in banned_ips (not yet banned)
        DB::table('banned_ips')->updateOrInsert(
            ['ip' => $ip],
            [
                'reason' => 'Failed login attempt',
                'failed_attempts' => $attempts,
                'banned_by' => 'system',
                'is_banned' => 0,
                'banned_until' => null,
                'created_at' => $row->created_at ?? now(),
                'updated_at' => now(),
            ]
        );

        $remaining = $maxAttempts - $attempts;
        return response()->json([
            'status' => 0,
            'message' => "Invalid email or password. {$remaining} attempt(s) remaining for your IP address before it is banned.",
            'code' => 'invalid_credentials',
            'remaining_attempts' => $remaining,
        ], 401);
    }

    function login(Request $r)
    {
        if (!$r->email || !$r->password) {
            return $this->no('Missing field: ' . (!$r->email ? 'email' : 'password'));
        }

        $clientIp = $r->ip();

        // 1. IP Ban check (active ban check with auto-expiry)
        $ban = DB::table('banned_ips')->where('ip', $clientIp)->where('is_banned', 1)->first();
        if ($ban) {
            if ($ban->banned_until && strtotime($ban->banned_until) <= time()) {
                // Ban expired, remove it automatically
                DB::table('banned_ips')->where('id', $ban->id)->delete();
            } else {
                $rem = '';
                if ($ban->banned_until) {
                    $mins = max(1, ceil((strtotime($ban->banned_until) - time()) / 60));
                    $rem = " Try again in {$mins} minute(s).";
                }
                return response()->json([
                    'status' => 0,
                    'message' => "Access denied. Your IP address ({$clientIp}) has been banned. Reason: {$ban->reason}.{$rem}",
                    'code' => 'ip_banned',
                    'ip' => $clientIp,
                    'reason' => $ban->reason,
                    'banned_until' => $ban->banned_until,
                ], 403);
            }
        }

        // 2. Bot Honeypot Check
        if (BotDefense::isBot($r)) {
            usleep(300000); // 300ms artificial delay
            return $this->no('Invalid email or password', 401, 'invalid_credentials');
        }

        $loginInput = strtolower(trim($r->email));
        $a = Admin::where('email', $loginInput)
            ->orWhereRaw('LOWER(name) = ?', [$loginInput])
            ->first();

        // 3. Timing attack defense against user enumeration & IP failure tracking
        if (!$a) {
            Hash::check($r->password, '$2y$12$e8vK1Nl/tS4k3c90m8Qv7.x9vQv2w8B2l4m6n8p0q2r4s6t8u0v2w');
            return $this->handleFailedLogin($clientIp);
        }

        // 4. Verify password
        if (!Hash::check($r->password, $a->password_hash)) {
            return $this->handleFailedLogin($clientIp);
        }

        // 5. Successful login: Reset un-banned attempts for this IP & update audit info
        DB::table('banned_ips')->where('ip', $clientIp)->where('is_banned', 0)->delete();

        $a->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => $clientIp,
        ]);

        $tokens = AuthService::issueTokens($a, $r);
        $response = $this->ok([
            'admin' => $a->fresh(),
            'token' => $tokens['access_token'],
            'expires_in' => $tokens['access_expires_in'],
        ], 'Login successful');

        return AuthService::attachTokenCookies($response, $tokens, $r);
    }

    function refresh(Request $r)
    {
        $token = $r->cookie('simatrix_refresh_token') ?: $r->input('refresh_token');
        if (!$token) return $this->no('Refresh token is required', 401);

        $res = AuthService::rotateRefreshToken($token, $r);
        if (!$res) {
            $response = $this->no('Invalid, expired, or reused session. Please sign in again.', 401, 'session_expired');
            return AuthService::clearTokenCookies($response, $r);
        }

        $tokens = $res['tokens'];
        $response = $this->ok([
            'admin' => $res['admin'],
            'token' => $tokens['access_token'],
            'expires_in' => $tokens['access_expires_in'],
        ], 'Session refreshed');

        return AuthService::attachTokenCookies($response, $tokens, $r);
    }

    function logout(Request $r)
    {
        $token = $r->cookie('simatrix_refresh_token') ?: $r->input('refresh_token');
        if ($token) AuthService::revokeRefreshToken($token);
        $response = $this->ok(null, 'Logged out successfully');
        return AuthService::clearTokenCookies($response, $r);
    }

    function me(Request $r)
    {
        return $this->ok($r->attributes->get('admin'));
    }

    function site()
    {
        return $this->ok([
            'features' => DB::table('features')->orderBy('order')->get(),
            'categories' => $this->cats(),
            'branches' => $this->branchesData(),
            'testimonials' => DB::table('testimonials')->where('is_active', 1)->orderBy('order')->get(),
            'settings' => $this->settingsData(),
            'hero_slides' => json_decode($this->settingsData()['hero_slides'] ?? '[]', true) ?: [],
        ]);
    }

    private function cats()
    {
        return DB::table('course_categories')->orderBy('order')->get()->map(function ($c) {
            $c->courses = DB::table('courses')->where('category_id', $c->id)->where('is_active', 1)->orderBy('order')->get()->map(fn($x) => $this->jsonCourse($x));
            return $c;
        });
    }

    function categories()
    {
        return $this->ok($this->cats());
    }

    private function jsonCourse($x)
    {
        foreach (['syllabus', 'roadmap', 'designations', 'quiz'] as $f) {
            $x->$f = json_decode($x->$f ?? '[]', true) ?: [];
        }
        return $x;
    }

    function courses(Request $r)
    {
        $q = DB::table('courses')->where('is_active', 1);
        if ($r->category) {
            $c = DB::table('course_categories')->where('slug', $r->category)->first();
            if (!$c) return $this->no('Category not found', 404);
            $q->where('category_id', $c->id);
        }
        return $this->ok($q->orderBy('order')->get()->map(fn($x) => $this->jsonCourse($x)));
    }

    function course($slug)
    {
        $x = DB::table('courses')->where('slug', $slug)->first();
        return $x ? $this->ok($this->jsonCourse($x)) : $this->no('Course not found', 404);
    }

    private function branchesData()
    {
        return DB::table('branches')->orderByDesc('is_primary')->orderBy('order')->get()->map(function ($b) {
            $b->map_src = $b->map_embed ?: 'https://maps.google.com/maps?q=' . rawurlencode($b->address ?: "$b->name, $b->city, Tamil Nadu, India") . '&z=15&output=embed';
            return $b;
        });
    }

    function branches()
    {
        return $this->ok($this->branchesData());
    }

    function listPublic($r)
    {
        [$t] = $this->map[$r];
        $q = DB::table($t);
        if ($r === 'blog') $q->where('is_published', 1)->orderByDesc('created_at');
        elseif ($r === 'testimonials') $q->where('is_active', 1)->orderBy('order');
        else $q->orderBy('order');
        return $this->ok($q->get());
    }

    function detailBlog($s)
    {
        $x = DB::table('blog_posts')->where(['slug' => $s, 'is_published' => 1])->first();
        return $x ? $this->ok($x) : $this->no('Article not found', 404);
    }

    function review(Request $r)
    {
        // Bot & Spam check
        if (BotDefense::isBot($r) || BotDefense::containsSpam($r->content ?? '')) {
            // Return deceptive success to bot without saving anything
            return $this->ok(['id' => 999999, 'name' => trim($r->name ?: 'Guest')], 'Thank you! Your review is now live.', 201);
        }

        if (!$r->name || strlen(trim($r->content ?? '')) < 10) {
            return $this->no(!$r->name ? 'Missing field: name' : 'Please write a little more about your experience (min 10 characters).');
        }

        $id = DB::table('testimonials')->insertGetId([
            'name' => trim($r->name),
            'role' => $r->role ? substr(trim($r->role), 0, 100) : null,
            'content' => trim($r->content),
            'rating' => max(1, min(5, (int)($r->rating ?: 5))),
            'is_active' => 1,
            'order' => 0,
        ]);

        return $this->ok(DB::table('testimonials')->find($id), 'Thank you! Your review is now live.', 201);
    }

    function enquiry(Request $r)
    {
        // Bot & Spam check
        if (BotDefense::isBot($r) || BotDefense::containsSpam(($r->name ?? '') . ' ' . ($r->message ?? ''))) {
            // Return deceptive success to bot without saving to DB
            return $this->ok(['id' => 999999], 'Thank you! Our team will reach out to you shortly.', 201);
        }

        if (!$r->name || !$r->phone) {
            return $this->no('Missing field: ' . (!$r->name ? 'name' : 'phone'));
        }

        $cleanPhone = preg_replace('/[^\d+]/', '', (string)$r->phone);
        if (strlen($cleanPhone) < 7 || strlen($cleanPhone) > 16) {
            return $this->no('Please provide a valid contact phone number.');
        }

        $typeMap = [
            'internship' => 'govt_intern',
            'career-guidance' => 'career_guidance',
            'guidance' => 'career_guidance',
        ];
        $type = $typeMap[$r->program ?? $r->type] ?? ($r->type ?: 'contact');
        foreach (in_array($type, ['govt_intern']) ? ['email', 'college', 'degree'] : [] as $f) {
            if (!$r->$f) return $this->no("Missing field: $f");
        }

        $d = $r->only(['name', 'email', 'phone', 'course_id', 'branch_id', 'message', 'college', 'address', 'degree']);
        $d['phone'] = $cleanPhone;
        $d += ['type' => $type, 'status' => 'new', 'created_at' => now()];

        $id = DB::table('enquiries')->insertGetId($d);
        return $this->ok(DB::table('enquiries')->find($id), 'Thank you! Our team will reach out to you shortly.', 201);
    }

    function adminList($r)
    {
        if ($r === 'admins') return $this->ok(Admin::all());
        if ($r === 'activity') return $this->ok(DB::table('activity_logs')->orderByDesc('created_at')->limit(100)->get());
        if ($r === 'banned_ips') {
            $ips = DB::table('banned_ips')->orderByDesc('updated_at')->orderByDesc('created_at')->get();
            return response()->json([
                'status' => 1,
                'message' => 'Success',
                'data' => $ips,
                'current_ip' => request()->ip(),
            ]);
        }
        if (!isset($this->map[$r])) return $this->no('Resource not found', 404);
        return $this->ok(DB::table($this->map[$r][0])->orderBy($r === 'enquiries' ? 'created_at' : 'order', 'desc')->get()->map(fn($x) => $r === 'courses' ? $this->jsonCourse($x) : $x));
    }

    function create(Request $q, $r)
    {
        if ($r === 'banned_ips') {
            $ip = trim($q->ip);
            if (!$ip) return $this->no('IP address is required');
            if (!filter_var($ip, FILTER_VALIDATE_IP)) {
                return $this->no('Please provide a valid IPv4 or IPv6 address.');
            }
            if ($ip === $q->ip()) {
                return $this->no("You cannot ban your current IP address ({$ip}).");
            }
            $admin = $q->attributes->get('admin');
            $adminName = $admin ? $admin->name : 'Admin';
            $hours = (int)($q->hours ?? 0);
            $bannedUntil = $hours > 0 ? now()->addHours($hours) : null;
            $reason = trim($q->reason ?: 'Manually banned by administrator');

            DB::table('banned_ips')->updateOrInsert(
                ['ip' => $ip],
                [
                    'reason' => $reason,
                    'failed_attempts' => 5,
                    'banned_by' => $adminName,
                    'is_banned' => 1,
                    'banned_until' => $bannedUntil,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            Cache::forget('active_banned_ips_map');

            DB::table('activity_logs')->insert([
                'admin_id' => $admin ? $admin->id : null,
                'admin_name' => $adminName,
                'action' => "Banned IP {$ip}." . ($hours ? " Duration: {$hours}h." : " Permanent ban."),
                'entity' => 'security',
                'created_at' => now(),
            ]);

            return $this->ok(DB::table('banned_ips')->where('ip', $ip)->first(), "IP [{$ip}] has been banned successfully.", 201);
        }

        if (!isset($this->map[$r])) return $this->no('Resource not found', 404);
        [$t, $need] = $this->map[$r];
        if (!$q->filled($need)) return $this->no("Missing field: $need");
        $d = $q->all();
        if (in_array($r, ['categories', 'courses', 'blog'])) $d['slug'] = Str::slug($d['slug'] ?? $d[$need]);
        foreach (['syllabus', 'roadmap', 'designations', 'quiz'] as $f) {
            if (isset($d[$f]) && is_array($d[$f])) $d[$f] = json_encode($d[$f]);
        }
        $id = DB::table($t)->insertGetId($d);
        return $this->ok(DB::table($t)->find($id), 'Created successfully', 201);
    }

    function update(Request $q, $r, $id)
    {
        if ($r === 'banned_ips') {
            $row = DB::table('banned_ips')->where('id', $id)->orWhere('ip', $id)->first();
            if (!$row) return $this->no('Banned IP record not found', 404);
            $fields = ['updated_at' => now()];
            if ($q->has('reason')) $fields['reason'] = trim($q->reason);
            if ($q->has('is_banned')) $fields['is_banned'] = (int)$q->is_banned;
            if ($q->has('hours')) {
                $hours = (int)$q->hours;
                $fields['banned_until'] = $hours > 0 ? now()->addHours($hours) : null;
            }
            DB::table('banned_ips')->where('id', $row->id)->update($fields);
            Cache::forget('active_banned_ips_map');
            return $this->ok(DB::table('banned_ips')->find($row->id), 'IP record updated successfully');
        }

        if (!isset($this->map[$r])) return $this->no('Resource not found', 404);
        $t = $this->map[$r][0];
        if (!DB::table($t)->find($id)) return $this->no('Resource not found', 404);
        $d = $q->all();
        foreach (['syllabus', 'roadmap', 'designations', 'quiz'] as $f) {
            if (isset($d[$f]) && is_array($d[$f])) $d[$f] = json_encode($d[$f]);
        }
        DB::table($t)->where('id', $id)->update($d);
        return $this->ok(DB::table($t)->find($id));
    }

    function delete($r, $id)
    {
        if ($r === 'banned_ips') {
            $row = DB::table('banned_ips')->where('id', $id)->orWhere('ip', $id)->first();
            if (!$row) return $this->no('Banned IP record not found', 404);
            DB::table('banned_ips')->where('id', $row->id)->delete();
            Cache::forget('active_banned_ips_map');

            $admin = request()->attributes->get('admin');
            $adminName = $admin ? $admin->name : 'Admin';
            DB::table('activity_logs')->insert([
                'admin_id' => $admin ? $admin->id : null,
                'admin_name' => $adminName,
                'action' => "Unbanned IP {$row->ip}",
                'entity' => 'security',
                'created_at' => now(),
            ]);

            return $this->ok(null, "IP [{$row->ip}] has been unbanned successfully.");
        }

        if (!isset($this->map[$r])) return $this->no('Resource not found', 404);
        DB::table($this->map[$r][0])->where('id', $id)->delete();
        return $this->ok(null, 'Deleted successfully');
    }

    private function settingsData()
    {
        return array_merge([
            'contact_phone' => '+91 93637 93954',
            'contact_phone2' => '+91 93637 93954',
            'contact_email' => 'info@simatrixacademy.com',
            'contact_address' => '1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001',
            'whatsapp' => '919363793954',
            'hero_slides' => '[]',
        ], DB::table('settings')->pluck('value', 'key')->all());
    }

    function settings()
    {
        return $this->ok($this->settingsData());
    }

    function saveSettings(Request $r)
    {
        foreach ($r->all() as $k => $v) {
            DB::table('settings')->updateOrInsert(['key' => $k], ['value' => is_scalar($v) ? $v : json_encode($v)]);
        }
        return $this->ok($this->settingsData(), 'Settings saved');
    }

    function upload(Request $r)
    {
        if (!$r->hasFile('file')) return $this->no('No file provided');
        $r->validate(['file' => 'file|max:5120|mimes:png,jpg,jpeg,gif,webp,svg']);
        $f = $r->file('file');
        $n = Str::slug(pathinfo($f->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . Str::random(10) . '.' . $f->extension();
        $f->move(public_path('src/assets'), $n);
        return $this->ok(['url' => "/src/assets/$n", 'filename' => $n], 'Created successfully', 201);
    }

    function notes($id)
    {
        return $this->ok(DB::table('enquiry_notes')->where('enquiry_id', $id)->orderByDesc('created_at')->get());
    }

    function addNote(Request $r, $id)
    {
        if (!$r->body) return $this->no('Note cannot be empty');
        $a = $r->attributes->get('admin');
        $nid = DB::table('enquiry_notes')->insertGetId([
            'enquiry_id' => $id,
            'admin_id' => $a->id,
            'admin_name' => $a->name,
            'body' => trim($r->body),
            'created_at' => now(),
        ]);
        return $this->ok(DB::table('enquiry_notes')->find($nid), 'Created successfully', 201);
    }
}