<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\{Cache, DB};

class IpBan extends Command
{
    protected $signature = 'ip:ban {ip : The IP address to ban} {reason=Manually banned by administrator : Reason for ban} {hours=0 : Ban duration in hours (0 for permanent)}';
    protected $description = 'Ban an IP address from accessing the system';

    public function handle()
    {
        $ip = trim($this->argument('ip'));
        $reason = trim($this->argument('reason'));
        $hours = (int)$this->argument('hours');

        $bannedUntil = $hours > 0 ? now()->addHours($hours) : null;

        DB::table('banned_ips')->updateOrInsert(
            ['ip' => $ip],
            [
                'reason' => $reason,
                'failed_attempts' => 5,
                'banned_by' => 'CLI Admin',
                'is_banned' => 1,
                'banned_until' => $bannedUntil,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        Cache::forget('active_banned_ips_map');

        $durationMsg = $hours > 0 ? "for {$hours} hours" : "permanently";
        $this->info("✓ IP address [{$ip}] has been banned {$durationMsg}. Reason: [{$reason}].");
        return Command::SUCCESS;
    }
}
