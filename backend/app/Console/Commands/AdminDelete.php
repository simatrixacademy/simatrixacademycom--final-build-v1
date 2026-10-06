<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AdminDelete extends Command
{
    protected $signature = 'admin:delete 
                            {email? : The admin email to delete} 
                            {--all : Delete all admin accounts}';

    protected $description = 'Delete one or all admin accounts';

    public function handle()
    {
        if ($this->option('all')) {
            $count = DB::table('admins')->count();
            if ($count === 0) {
                $this->info("No admin accounts exist to delete.");
                return Command::SUCCESS;
            }
            if ($this->confirm("Are you sure you want to delete ALL {$count} admin account(s)?", true)) {
                DB::table('admins')->delete();
                $this->info("✓ Deleted all {$count} admin account(s).");
                return Command::SUCCESS;
            }
            $this->warn("Aborted.");
            return Command::SUCCESS;
        }

        $email = $this->argument('email') ?: $this->ask('Enter admin email address to delete');
        $email = strtolower(trim($email));

        $deleted = DB::table('admins')->where('email', $email)->delete();
        if ($deleted) {
            $this->info("✓ Admin account [{$email}] deleted successfully.");
        } else {
            $this->warn("No admin found with email: {$email}");
        }

        return Command::SUCCESS;
    }
}
