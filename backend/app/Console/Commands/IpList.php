<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class IpList extends Command
{
    protected $signature = 'ip:list';
    protected $description = 'List all currently banned IP addresses';

    public function handle()
    {
        $banned = DB::table('banned_ips')->orderByDesc('created_at')->get();

        if ($banned->isEmpty()) {
            $this->info("No IP addresses are currently banned.");
            return Command::SUCCESS;
        }

        $headers = ['ID', 'IP Address', 'Reason', 'Attempts', 'Banned By', 'Banned Until', 'Created At'];
        $rows = $banned->map(function ($row) {
            return [
                $row->id,
                $row->ip,
                $row->reason,
                $row->failed_attempts,
                $row->banned_by,
                $row->banned_until ?? 'Permanent',
                $row->created_at,
            ];
        });

        $this->table($headers, $rows);
        return Command::SUCCESS;
    }
}
