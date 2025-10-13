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
        // Add Cloudinary public_id fields to videos table
        Schema::table('videos', function (Blueprint $table) {
            $table->string('featured_image_public_id')->nullable()->comment('Cloudinary public_id for featured image');
            $table->string('thumbnail_public_id')->nullable()->comment('Cloudinary public_id for thumbnail');
            $table->string('cover_public_id')->nullable()->comment('Cloudinary public_id for cover image');
        });

        // Add Cloudinary public_id fields to articles table
        Schema::table('articles', function (Blueprint $table) {
            $table->string('featured_image_public_id')->nullable()->comment('Cloudinary public_id for featured image');
            $table->string('cover_public_id')->nullable()->comment('Cloudinary public_id for cover image');
        });

        // Add indexes for better performance
        Schema::table('videos', function (Blueprint $table) {
            $table->index('featured_image_public_id');
            $table->index('thumbnail_public_id');
            $table->index('cover_public_id');
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->index('featured_image_public_id');
            $table->index('cover_public_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes first
        Schema::table('videos', function (Blueprint $table) {
            $table->dropIndex(['featured_image_public_id']);
            $table->dropIndex(['thumbnail_public_id']);
            $table->dropIndex(['cover_public_id']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['featured_image_public_id']);
            $table->dropIndex(['cover_public_id']);
        });

        // Remove columns
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['featured_image_public_id', 'thumbnail_public_id', 'cover_public_id']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['featured_image_public_id', 'cover_public_id']);
        });
    }
};
