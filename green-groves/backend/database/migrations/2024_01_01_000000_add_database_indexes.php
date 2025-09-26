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
        // Articles table indexes
        Schema::table('articles', function (Blueprint $table) {
            $table->index(['status', 'published_at'], 'articles_status_published_index');
            $table->index(['category_id', 'status'], 'articles_category_status_index');
            $table->index('author_id', 'articles_author_index');
            $table->fullText(['title', 'excerpt', 'body'], 'articles_fulltext_index');
        });

        // Suggestions table indexes
        Schema::table('suggestions', function (Blueprint $table) {
            $table->index(['is_published', 'is_featured'], 'suggestions_published_featured_index');
            $table->index(['category', 'is_published'], 'suggestions_category_published_index');
            $table->index(['difficulty_level', 'is_published'], 'suggestions_difficulty_published_index');
            $table->index(['season', 'is_published'], 'suggestions_season_published_index');
            $table->index(['plant_type', 'is_published'], 'suggestions_plant_type_published_index');
            $table->index(['rating', 'views'], 'suggestions_rating_views_index');
            $table->fullText(['title', 'description', 'content'], 'suggestions_fulltext_index');
        });

        // Pots table indexes
        Schema::table('pots', function (Blueprint $table) {
            $table->index('material', 'pots_material_index');
            $table->index(['is_featured', 'rating'], 'pots_featured_rating_index');
            $table->fullText(['title', 'description'], 'pots_fulltext_index');
        });

        // Books table indexes
        Schema::table('books', function (Blueprint $table) {
            $table->index(['is_featured', 'rating'], 'books_featured_rating_index');
            $table->fullText(['title', 'description'], 'books_fulltext_index');
        });

        // Tools table indexes
        Schema::table('tools', function (Blueprint $table) {
            $table->index(['is_featured', 'rating'], 'tools_featured_rating_index');
            $table->fullText(['title', 'description'], 'tools_fulltext_index');
        });

        // Accessories table indexes
        Schema::table('accessories', function (Blueprint $table) {
            $table->index(['is_featured', 'rating'], 'accessories_featured_rating_index');
            $table->fullText(['title', 'description'], 'accessories_fulltext_index');
        });

        // Essentials table indexes
        Schema::table('essentials', function (Blueprint $table) {
            $table->index(['is_featured', 'rating'], 'essentials_featured_rating_index');
            $table->fullText(['title', 'description'], 'essentials_fulltext_index');
        });

        // Videos table indexes
        Schema::table('videos', function (Blueprint $table) {
            $table->index(['is_featured', 'rating'], 'videos_featured_rating_index');
            $table->fullText(['title', 'description'], 'videos_fulltext_index');
        });

        // Categories table indexes
        Schema::table('categories', function (Blueprint $table) {
            $table->index('parent_id', 'categories_parent_index');
            $table->index('slug', 'categories_slug_index');
        });

        // Cache table index
        Schema::table('cache', function (Blueprint $table) {
            $table->index('expires_at', 'cache_expires_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex('articles_status_published_index');
            $table->dropIndex('articles_category_status_index');
            $table->dropIndex('articles_author_index');
            $table->dropFullText('articles_fulltext_index');
        });

        Schema::table('suggestions', function (Blueprint $table) {
            $table->dropIndex('suggestions_published_featured_index');
            $table->dropIndex('suggestions_category_published_index');
            $table->dropIndex('suggestions_difficulty_published_index');
            $table->dropIndex('suggestions_season_published_index');
            $table->dropIndex('suggestions_plant_type_published_index');
            $table->dropIndex('suggestions_rating_views_index');
            $table->dropFullText('suggestions_fulltext_index');
        });

        Schema::table('pots', function (Blueprint $table) {
            $table->dropIndex('pots_material_index');
            $table->dropIndex('pots_featured_rating_index');
            $table->dropFullText('pots_fulltext_index');
        });

        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex('books_featured_rating_index');
            $table->dropFullText('books_fulltext_index');
        });

        Schema::table('tools', function (Blueprint $table) {
            $table->dropIndex('tools_featured_rating_index');
            $table->dropFullText('tools_fulltext_index');
        });

        Schema::table('accessories', function (Blueprint $table) {
            $table->dropIndex('accessories_featured_rating_index');
            $table->dropFullText('accessories_fulltext_index');
        });

        Schema::table('essentials', function (Blueprint $table) {
            $table->dropIndex('essentials_featured_rating_index');
            $table->dropFullText('essentials_fulltext_index');
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->dropIndex('videos_featured_rating_index');
            $table->dropFullText('videos_fulltext_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_parent_index');
            $table->dropIndex('categories_slug_index');
        });

        Schema::table('cache', function (Blueprint $table) {
            $table->dropIndex('cache_expires_index');
        });
    }
};
