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
        // Add public_id fields to articles table if not exists
        if (!Schema::hasColumn('articles', 'featured_image_public_id')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->string('featured_image_public_id')->nullable()
                      ->after('featured_image')
                      ->comment('Cloudinary public_id for featured image');
            });
        }

        if (!Schema::hasColumn('articles', 'cover_public_id')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->string('cover_public_id')->nullable()
                      ->after('cover')
                      ->comment('Cloudinary public_id for cover image');
            });
        }

        // Add public_id fields to videos table if not exists
        if (!Schema::hasColumn('videos', 'featured_image_public_id')) {
            Schema::table('videos', function (Blueprint $table) {
                $table->string('featured_image_public_id')->nullable()
                      ->after('featured_image')
                      ->comment('Cloudinary public_id for featured image');
            });
        }

        // Add indexes if not exists
        $articlesIndexes = DB::select("SHOW INDEX FROM articles WHERE Key_name = 'articles_featured_image_public_id_index'");
        if (empty($articlesIndexes)) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('featured_image_public_id');
            });
        }

        $articlesIndexes2 = DB::select("SHOW INDEX FROM articles WHERE Key_name = 'articles_cover_public_id_index'");
        if (empty($articlesIndexes2)) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('cover_public_id');
            });
        }

        $videosIndexes = DB::select("SHOW INDEX FROM videos WHERE Key_name = 'videos_featured_image_public_id_index'");
        if (empty($videosIndexes)) {
            Schema::table('videos', function (Blueprint $table) {
                $table->index('featured_image_public_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes first
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['featured_image_public_id']);
            $table->dropIndex(['cover_public_id']);
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->dropIndex(['featured_image_public_id']);
        });

        // Remove columns
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['featured_image_public_id', 'cover_public_id']);
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn('featured_image_public_id');
        });
    }
};


