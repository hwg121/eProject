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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // User who performed the action
            $table->string('user_name')->nullable(); // Cache user name for deleted users
            $table->string('user_ip', 45)->nullable(); // IP address for security tracking (45 chars for IPv6)
            $table->string('activity_type', 20); // 'public' or 'security'
            $table->string('action', 50); // 'created', 'updated', 'deleted', 'login', etc.
            $table->string('entity_type', 50)->nullable(); // 'article', 'video', 'product', 'user', etc.
            $table->unsignedBigInteger('entity_id')->nullable(); // ID of the affected entity
            $table->string('entity_name', 500)->nullable(); // Name/title of the entity
            $table->text('description')->nullable(); // Human-readable description
            $table->json('metadata')->nullable(); // Additional data (old values, changes, etc.)
            $table->timestamps();
            
            // Add foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            
            // Add indexes for better performance
            $table->index(['user_id', 'created_at'], 'idx_activity_user_created');
            $table->index(['activity_type', 'created_at'], 'idx_activity_type_created');
            $table->index(['entity_type', 'entity_id'], 'idx_activity_entity');
            $table->index('created_at', 'idx_activity_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};

