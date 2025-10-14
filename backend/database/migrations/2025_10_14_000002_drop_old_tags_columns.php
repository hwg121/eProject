<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Drop the old tags columns from videos and products tables
     * since we're now using pivot tables for many-to-many relationships.
     */
    public function up(): void
    {
        // Drop tags column from videos table (was TEXT, unused)
        if (Schema::hasColumn('videos', 'tags')) {
            Schema::table('videos', function (Blueprint $table) {
                $table->dropColumn('tags');
            });
        }

        // Drop tags column from products table (was JSON, unused)
        if (Schema::hasColumn('products', 'tags')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('tags');
            });
        }
    }

    /**
     * Reverse the migrations.
     * 
     * Restore the old tags columns if needed for rollback.
     */
    public function down(): void
    {
        // Restore tags column to videos table
        if (!Schema::hasColumn('videos', 'tags')) {
            Schema::table('videos', function (Blueprint $table) {
                $table->text('tags')->nullable()->after('category');
            });
        }

        // Restore tags column to products table
        if (!Schema::hasColumn('products', 'tags')) {
            Schema::table('products', function (Blueprint $table) {
                $table->json('tags')->nullable()->after('estimated_time');
            });
        }
    }
};

