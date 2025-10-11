<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update videos table
        Schema::table('videos', function (Blueprint $table) {
            // Add comments to indicate these fields now store Cloudinary URLs
            $table->string('featured_image')->nullable()->comment('Cloudinary URL for featured image')->change();
            $table->string('thumbnail')->nullable()->comment('Cloudinary URL for thumbnail')->change();
            $table->string('cover')->nullable()->comment('Cloudinary URL for cover image')->change();
        });

        // Update articles table
        Schema::table('articles', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->comment('Cloudinary URL for featured image')->change();
            $table->string('cover')->nullable()->comment('Cloudinary URL for cover image')->change();
        });

        // Update products table
        Schema::table('products', function (Blueprint $table) {
            $table->string('image')->nullable()->comment('Cloudinary URL for main product image')->change();
            $table->json('images_json')->nullable()->comment('JSON array of Cloudinary URLs for product images')->change();
        });

        // Update about_us table
        Schema::table('about_us', function (Blueprint $table) {
            $table->string('image')->nullable()->comment('Cloudinary URL for about us image')->change();
        });

        // Update existing data to use Cloudinary URLs if they exist
        $this->migrateExistingImages();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove comments
        Schema::table('videos', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->comment(null)->change();
            $table->string('thumbnail')->nullable()->comment(null)->change();
            $table->string('cover')->nullable()->comment(null)->change();
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->comment(null)->change();
            $table->string('cover')->nullable()->comment(null)->change();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('image')->nullable()->comment(null)->change();
            $table->json('images_json')->nullable()->comment(null)->change();
        });

        Schema::table('about_us', function (Blueprint $table) {
            $table->string('image')->nullable()->comment(null)->change();
        });
    }

    /**
     * Migrate existing local image paths to Cloudinary URLs
     */
    private function migrateExistingImages(): void
    {
        // Update videos table
        DB::table('videos')->whereNotNull('featured_image')
            ->where('featured_image', 'not like', 'https://%')
            ->where('featured_image', 'not like', 'http://%')
            ->update(['featured_image' => null]); // Clear local paths

        DB::table('videos')->whereNotNull('thumbnail')
            ->where('thumbnail', 'not like', 'https://%')
            ->where('thumbnail', 'not like', 'http://%')
            ->update(['thumbnail' => null]);

        DB::table('videos')->whereNotNull('cover')
            ->where('cover', 'not like', 'https://%')
            ->where('cover', 'not like', 'http://%')
            ->update(['cover' => null]);

        // Update articles table
        DB::table('articles')->whereNotNull('featured_image')
            ->where('featured_image', 'not like', 'https://%')
            ->where('featured_image', 'not like', 'http://%')
            ->update(['featured_image' => null]);

        DB::table('articles')->whereNotNull('cover')
            ->where('cover', 'not like', 'https://%')
            ->where('cover', 'not like', 'http://%')
            ->update(['cover' => null]);

        // Update products table
        DB::table('products')->whereNotNull('image')
            ->where('image', 'not like', 'https://%')
            ->where('image', 'not like', 'http://%')
            ->update(['image' => null]);

        // Update about_us table
        DB::table('about_us')->whereNotNull('image')
            ->where('image', 'not like', 'https://%')
            ->where('image', 'not like', 'http://%')
            ->update(['image' => null]);
    }
};
