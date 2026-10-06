<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AdminList extends Command
{
    protected $signature = 'admin:list';
    protected $description = 'List all administrator accounts with security status';

    public function handle()
    {
        $admins = DB::table('admins')
            ->select('id', 'name', 'email', 'role', 'failed_login_attempts', 'locked_until', 'last_login_at', 'created_at')
            ->get();

        if ($admins->isEmpty()) {
            $this->warn('No admin accounts found in database.');
            return Command::SUCCESS;
        }

        $rows = $admins->map(function ($a) {
            $isLocked = $a->locked_until && strtotime($a->locked_until) > time();
            $status = $isLocked ? "LOCKED (until {$a->locked_until})" : 'Active';
            return [
                'ID' => $a->id,
                'Name' => $a->name,
                'Email' => $a->email,
                'Role' => $a->role,
                'Status' => $status,
                'Failed Attempts' => $a->failed_login_attempts ?? 0,
                'Last Login' => $a->last_login_at ?: 'Never',
            ];
        });

        $this->table(['ID', 'Name', 'Email', 'Role', 'Status', 'Failed Attempts', 'Last Login'], $rows);
        return Command::SUCCESS;
    }
}
