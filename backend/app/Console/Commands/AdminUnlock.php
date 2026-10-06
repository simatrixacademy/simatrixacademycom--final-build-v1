<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AdminUnlock extends Command
{
    protected $signature = 'admin:unlock {email : The email address of the admin to unlock}';
    protected $description = 'Unlock an admin account locked by too many failed login attempts';

    public function handle()
    {
        $email = strtolower(trim($this->argument('email')));
        $admin = DB::table('admins')->where('email', $email)->first();

        if (!$admin) {
            $this->error("No admin found with email [{$email}].");
            return Command::FAILURE;
        }

        DB::table('admins')->where('id', $admin->id)->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);

        $this->info("✓ Admin account [{$email}] has been unlocked and failed login counter reset.");
        return Command::SUCCESS;
    }
}
