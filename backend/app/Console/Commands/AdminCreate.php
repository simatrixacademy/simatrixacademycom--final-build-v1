<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminCreate extends Command
{
    protected $signature = 'admin:create 
                            {email? : The admin email address} 
                            {--password= : The admin password (omit to prompt securely)} 
                            {--name=Administrator : The display name} 
                            {--role=super_admin : The admin role}';

    protected $description = 'Create or update an administrator account securely with Bcrypt password hashing';

    public function handle()
    {
        $email = $this->argument('email') ?: $this->ask('Enter admin email address');
        $email = strtolower(trim($email));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error("Invalid email format: {$email}");
            return Command::FAILURE;
        }

        $password = $this->option('password');
        if (!$password) {
            $password = $this->secret('Enter admin password (hidden)');
            $confirm = $this->secret('Confirm password');
            if ($password !== $confirm) {
                $this->error('Passwords do not match.');
                return Command::FAILURE;
            }
        }

        if (strlen($password) < 8) {
            $this->error('Password must be at least 8 characters long.');
            return Command::FAILURE;
        }

        $name = $this->option('name') ?: 'Administrator';
        $role = $this->option('role') ?: 'super_admin';

        DB::table('admins')->updateOrInsert(
            ['email' => $email],
            [
                'name' => $name,
                'password_hash' => Hash::make($password),
                'role' => $role,
                'created_at' => now(),
            ]
        );

        $this->info("✓ Admin account [{$email}] created / updated successfully.");
        return Command::SUCCESS;
    }
}
