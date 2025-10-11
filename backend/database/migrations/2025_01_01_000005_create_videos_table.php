<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('instructor')->nullable();
            $table->string('embed_url')->nullable();
            $table->string('video_url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('cover')->nullable();
            $table->longText('content')->nullable();
            $table->string('category')->default('Video');
            $table->enum('status', ['draft', 'published'])->default('published');
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->integer('duration')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
