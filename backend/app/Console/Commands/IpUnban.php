<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\{Cache, DB};

class IpUnban extends Command
{
    protected $signature = 'ip:unban {ip : The IP address to unban, or "all" to unban all IPs}';
    protected $description = 'Unban an IP address or all banned IP addresses';

    public function handle()
    {
        $ip = trim($this->argument('ip'));

        if (strtolower($ip) === 'all') {
            $count = DB::table('banned_ips')->count();
            DB::table('banned_ips')->delete();
            Cache::forget('active_banned_ips_map');
            $this->info("✓ Successfully unbanned all ({$count}) IP addresses.");
            return Command::SUCCESS;
        }

        $ban = DB::table('banned_ips')->where('ip', $ip)->first();

        if (!$ban) {
            $this->warn("IP address [{$ip}] is not currently banned.");
            return Command::SUCCESS;
        }

        DB::table('banned_ips')->where('id', $ban->id)->delete();
        Cache::forget('active_banned_ips_map');
        $this->info("✓ IP address [{$ip}] has been successfully unbanned.");
        return Command::SUCCESS;
    }
}
