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
        // Create article_tag pivot table
        Schema::create('article_tag', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('article_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('article_id')
                  ->references('id')
                  ->on('articles')
                  ->onDelete('cascade');
            
            $table->foreign('tag_id')
                  ->references('id')
                  ->on('tags')
                  ->onDelete('cascade');

            // Prevent duplicate entries
            $table->unique(['article_id', 'tag_id']);

            // Indexes for performance
            $table->index('article_id');
            $table->index('tag_id');
        });

        // Create tag_video pivot table (alphabetical order: tag < video)
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

        // Create product_tag pivot table
        Schema::create('product_tag', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->onDelete('cascade');
            
            $table->foreign('tag_id')
                  ->references('id')
                  ->on('tags')
                  ->onDelete('cascade');

            // Prevent duplicate entries
            $table->unique(['product_id', 'tag_id']);

            // Indexes for performance
            $table->index('product_id');
            $table->index('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_tag');
        Schema::dropIfExists('tag_video');
        Schema::dropIfExists('article_tag');
    }
};

