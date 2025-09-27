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
        // Articles table performance indexes
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                // Composite indexes for common queries
                if (!Schema::hasColumn('articles', 'views')) {
                    $table->integer('views')->default(0)->after('published_at');
                }
                if (!Schema::hasColumn('articles', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                
                // Performance indexes
                $table->index(['status', 'published_at', 'featured'], 'articles_status_published_featured_index');
                $table->index(['category_id', 'status', 'published_at'], 'articles_category_status_published_index');
                $table->index(['author_id', 'status'], 'articles_author_status_index');
                $table->index(['views', 'published_at'], 'articles_views_published_index');
                $table->index(['featured', 'published_at'], 'articles_featured_published_index');
            });
        }

        // Tools table performance indexes
        if (Schema::hasTable('tools')) {
            Schema::table('tools', function (Blueprint $table) {
                if (!Schema::hasColumn('tools', 'views')) {
                    $table->integer('views')->default(0)->after('images_json');
                }
                if (!Schema::hasColumn('tools', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                if (!Schema::hasColumn('tools', 'rating')) {
                    $table->decimal('rating', 3, 1)->default(0)->after('featured');
                }
                
                $table->index(['featured', 'rating'], 'tools_featured_rating_index');
                $table->index(['views', 'created_at'], 'tools_views_created_index');
                $table->index(['name', 'featured'], 'tools_name_featured_index');
            });
        }

        // Videos table performance indexes
        if (Schema::hasTable('videos')) {
            Schema::table('videos', function (Blueprint $table) {
                if (!Schema::hasColumn('videos', 'views')) {
                    $table->integer('views')->default(0)->after('thumbnail');
                }
                if (!Schema::hasColumn('videos', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                if (!Schema::hasColumn('videos', 'duration')) {
                    $table->integer('duration')->nullable()->after('featured');
                }
                
                $table->index(['featured', 'views'], 'videos_featured_views_index');
                $table->index(['views', 'created_at'], 'videos_views_created_index');
                $table->index(['title', 'featured'], 'videos_title_featured_index');
            });
        }

        // Books table performance indexes
        if (Schema::hasTable('books')) {
            Schema::table('books', function (Blueprint $table) {
                if (!Schema::hasColumn('books', 'views')) {
                    $table->integer('views')->default(0)->after('rating');
                }
                if (!Schema::hasColumn('books', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                
                $table->index(['featured', 'rating'], 'books_featured_rating_index');
                $table->index(['views', 'created_at'], 'books_views_created_index');
                $table->index(['category', 'featured'], 'books_category_featured_index');
            });
        }

        // Pots table performance indexes
        if (Schema::hasTable('pots')) {
            Schema::table('pots', function (Blueprint $table) {
                if (!Schema::hasColumn('pots', 'views')) {
                    $table->integer('views')->default(0)->after('brand');
                }
                if (!Schema::hasColumn('pots', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                if (!Schema::hasColumn('pots', 'rating')) {
                    $table->decimal('rating', 3, 1)->default(0)->after('featured');
                }
                
                $table->index(['featured', 'rating'], 'pots_featured_rating_index');
                $table->index(['views', 'created_at'], 'pots_views_created_index');
                $table->index(['material', 'featured'], 'pots_material_featured_index');
                $table->index(['brand', 'featured'], 'pots_brand_featured_index');
            });
        }

        // Accessories table performance indexes
        if (Schema::hasTable('accessories')) {
            Schema::table('accessories', function (Blueprint $table) {
                if (!Schema::hasColumn('accessories', 'views')) {
                    $table->integer('views')->default(0)->after('is_durable');
                }
                if (!Schema::hasColumn('accessories', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                if (!Schema::hasColumn('accessories', 'rating')) {
                    $table->decimal('rating', 3, 1)->default(0)->after('featured');
                }
                
                $table->index(['featured', 'rating'], 'accessories_featured_rating_index');
                $table->index(['views', 'created_at'], 'accessories_views_created_index');
                $table->index(['category', 'featured'], 'accessories_category_featured_index');
                $table->index(['brand', 'featured'], 'accessories_brand_featured_index');
            });
        }

        // Essentials table performance indexes
        if (Schema::hasTable('essentials')) {
            Schema::table('essentials', function (Blueprint $table) {
                if (!Schema::hasColumn('essentials', 'views')) {
                    $table->integer('views')->default(0)->after('season');
                }
                if (!Schema::hasColumn('essentials', 'featured')) {
                    $table->boolean('featured')->default(false)->after('views');
                }
                if (!Schema::hasColumn('essentials', 'rating')) {
                    $table->decimal('rating', 3, 1)->default(0)->after('featured');
                }
                
                $table->index(['featured', 'rating'], 'essentials_featured_rating_index');
                $table->index(['views', 'created_at'], 'essentials_views_created_index');
                $table->index(['type', 'featured'], 'essentials_type_featured_index');
                $table->index(['season', 'featured'], 'essentials_season_featured_index');
            });
        }

        // Suggestions table performance indexes
        if (Schema::hasTable('suggestions')) {
            Schema::table('suggestions', function (Blueprint $table) {
                $table->index(['is_published', 'is_featured', 'views'], 'suggestions_published_featured_views_index');
                $table->index(['category', 'is_published', 'views'], 'suggestions_category_published_views_index');
                $table->index(['difficulty_level', 'is_published', 'views'], 'suggestions_difficulty_published_views_index');
                $table->index(['plant_type', 'is_published', 'views'], 'suggestions_plant_type_published_views_index');
                $table->index(['rating', 'views', 'created_at'], 'suggestions_rating_views_created_index');
            });
        }

        // Categories table performance indexes
        if (Schema::hasTable('categories')) {
            Schema::table('categories', function (Blueprint $table) {
                if (!Schema::hasColumn('categories', 'sort_order')) {
                    $table->integer('sort_order')->default(0)->after('slug');
                }
                if (!Schema::hasColumn('categories', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('sort_order');
                }
                
                $table->index(['is_active', 'sort_order'], 'categories_active_sort_index');
                $table->index(['parent_id', 'is_active'], 'categories_parent_active_index');
            });
        }

        // Users table performance indexes
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index(['email_verified_at'], 'users_email_verified_index');
                $table->index(['created_at'], 'users_created_index');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Articles table
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->dropIndex('articles_status_published_featured_index');
                $table->dropIndex('articles_category_status_published_index');
                $table->dropIndex('articles_author_status_index');
                $table->dropIndex('articles_views_published_index');
                $table->dropIndex('articles_featured_published_index');
            });
        }

        // Tools table
        if (Schema::hasTable('tools')) {
            Schema::table('tools', function (Blueprint $table) {
                $table->dropIndex('tools_featured_rating_index');
                $table->dropIndex('tools_views_created_index');
                $table->dropIndex('tools_name_featured_index');
            });
        }

        // Videos table
        if (Schema::hasTable('videos')) {
            Schema::table('videos', function (Blueprint $table) {
                $table->dropIndex('videos_featured_views_index');
                $table->dropIndex('videos_views_created_index');
                $table->dropIndex('videos_title_featured_index');
            });
        }

        // Books table
        if (Schema::hasTable('books')) {
            Schema::table('books', function (Blueprint $table) {
                $table->dropIndex('books_featured_rating_index');
                $table->dropIndex('books_views_created_index');
                $table->dropIndex('books_category_featured_index');
            });
        }

        // Pots table
        if (Schema::hasTable('pots')) {
            Schema::table('pots', function (Blueprint $table) {
                $table->dropIndex('pots_featured_rating_index');
                $table->dropIndex('pots_views_created_index');
                $table->dropIndex('pots_material_featured_index');
                $table->dropIndex('pots_brand_featured_index');
            });
        }

        // Accessories table
        if (Schema::hasTable('accessories')) {
            Schema::table('accessories', function (Blueprint $table) {
                $table->dropIndex('accessories_featured_rating_index');
                $table->dropIndex('accessories_views_created_index');
                $table->dropIndex('accessories_category_featured_index');
                $table->dropIndex('accessories_brand_featured_index');
            });
        }

        // Essentials table
        if (Schema::hasTable('essentials')) {
            Schema::table('essentials', function (Blueprint $table) {
                $table->dropIndex('essentials_featured_rating_index');
                $table->dropIndex('essentials_views_created_index');
                $table->dropIndex('essentials_type_featured_index');
                $table->dropIndex('essentials_season_featured_index');
            });
        }

        // Suggestions table
        if (Schema::hasTable('suggestions')) {
            Schema::table('suggestions', function (Blueprint $table) {
                $table->dropIndex('suggestions_published_featured_views_index');
                $table->dropIndex('suggestions_category_published_views_index');
                $table->dropIndex('suggestions_difficulty_published_views_index');
                $table->dropIndex('suggestions_plant_type_published_views_index');
                $table->dropIndex('suggestions_rating_views_created_index');
            });
        }

        // Categories table
        if (Schema::hasTable('categories')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropIndex('categories_active_sort_index');
                $table->dropIndex('categories_parent_active_index');
            });
        }

        // Users table
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex('users_email_verified_index');
                $table->dropIndex('users_created_index');
            });
        }
    }
};