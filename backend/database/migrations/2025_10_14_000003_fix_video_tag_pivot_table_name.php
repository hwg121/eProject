<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Fix: Laravel convention requires alphabetical order for pivot tables.
     * The correct name is 'tag_video' not 'video_tag'.
     */
    public function up(): void
    {
        // Drop the incorrectly named table if it exists
        if (Schema::hasTable('video_tag')) {
            Schema::dropIfExists('video_tag');
        }
        
        // Create the correctly named table (tag comes before video alphabetically)
        if (!Schema::hasTable('tag_video')) {
            Schema::create('tag_video', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('tag_id');
                $table->unsignedBigInteger('video_id');
                $table->timestamps();

                // Foreign key constraints
                $table->foreign('tag_id')
                      ->references('id')
                      ->on('tags')
                      ->onDelete('cascade');
                
                $table->foreign('video_id')
                      ->references('id')
                      ->on('videos')
                      ->onDelete('cascade');

                // Prevent duplicate entries
                $table->unique(['tag_id', 'video_id']);

                // Indexes for performance
                $table->index('tag_id');
                $table->index('video_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tag_video');
        
        // Recreate the old incorrect table name for rollback
        Schema::create('video_tag', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('video_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();

            $table->foreign('video_id')
                  ->references('id')
                  ->on('videos')
                  ->onDelete('cascade');
            
            $table->foreign('tag_id')
                  ->references('id')
                  ->on('tags')
                  ->onDelete('cascade');

            $table->unique(['video_id', 'tag_id']);
            $table->index('video_id');
            $table->index('tag_id');
        });
    }
};


