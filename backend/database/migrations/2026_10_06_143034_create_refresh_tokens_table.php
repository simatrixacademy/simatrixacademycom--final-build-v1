<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('admins')->cascadeOnDelete();
            $table->string('token_hash', 64)->unique();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->dateTime('expires_at');
            $table->dateTime('revoked_at')->nullable();
            $table->timestamps();
            $table->index(['admin_id', 'expires_at']);
        });

        if (!Schema::hasColumn('admins', 'tokens_valid_after')) {
            Schema::table('admins', function (Blueprint $table) {
                $table->dateTime('tokens_valid_after')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('refresh_tokens');
        if (Schema::hasColumn('admins', 'tokens_valid_after')) {
            Schema::table('admins', function (Blueprint $table) {
                $table->dropColumn('tokens_valid_after');
            });
        }
    }
};
