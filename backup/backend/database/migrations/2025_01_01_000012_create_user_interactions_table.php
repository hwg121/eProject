<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_interactions', function (Blueprint $table) {
            $table->id();
            $table->string('user_ip')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('content_type'); // 'article', 'video', 'book', 'tool', 'pot', 'accessory', 'suggestion'
            $table->unsignedBigInteger('content_id');
            $table->enum('interaction_type', ['like', 'view', 'rating', 'bookmark']);
            $table->integer('value')->nullable(); // For likes (1) and ratings (1-5)
            $table->decimal('rating_value', 3, 1)->nullable();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['content_type', 'content_id']);
            $table->index(['user_ip', 'content_type', 'content_id']);
            $table->index(['user_id', 'content_type', 'content_id']);
            // Remove the unique constraint as we need to allow multiple interactions per user/IP for different types
            // We'll handle duplicates in the application logic instead
        });
        
        // Add foreign key constraints after table creation
        Schema::table('user_interactions', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_interactions');
    }
};
