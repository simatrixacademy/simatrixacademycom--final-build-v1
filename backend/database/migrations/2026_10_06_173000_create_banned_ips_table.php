<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banned_ips', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->unique();
            $table->string('reason', 255)->default('Repeated failed login attempts');
            $table->integer('failed_attempts')->default(1);
            $table->string('banned_by', 100)->default('system');
            $table->boolean('is_banned')->default(true);
            $table->dateTime('banned_until')->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banned_ips');
    }
};
