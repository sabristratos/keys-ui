<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('demo_users', function (Blueprint $table) {
            $table->id();

            // Basic information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->date('birth_date');

            // Profile information
            $table->string('avatar_path')->nullable();
            $table->string('department');
            $table->string('role');
            $table->string('salary_range');

            // JSON fields for arrays
            $table->json('skills')->nullable();
            $table->json('preferences')->nullable();

            // Status and settings
            $table->string('status')->default('active');
            $table->text('bio')->nullable();
            $table->boolean('is_remote')->default(false);
            $table->boolean('notifications_enabled')->default(true);
            $table->string('priority_level')->default('medium');

            // Work information
            $table->date('start_date');
            $table->string('contract_type');
            $table->integer('experience_level')->default(0); // 0-10 years

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demo_users');
    }
};
