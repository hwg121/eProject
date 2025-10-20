<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration populates created_by and updated_by columns
     * for existing records that were created before audit tracking was added.
     */
    public function up(): void
    {
        // Update products table
        if (Schema::hasColumn('products', 'created_by') && Schema::hasColumn('products', 'author_id')) {
            // Set created_by and updated_by to author_id for records where they are NULL
            DB::table('products')
                ->whereNull('created_by')
                ->whereNotNull('author_id')
                ->update([
                    'created_by' => DB::raw('author_id'),
                    'updated_by' => DB::raw('author_id')
                ]);
            
            echo "Updated " . DB::table('products')->whereNotNull('created_by')->count() . " products\n";
        }

        // Update articles table
        if (Schema::hasColumn('articles', 'created_by') && Schema::hasColumn('articles', 'author_id')) {
            DB::table('articles')
                ->whereNull('created_by')
                ->whereNotNull('author_id')
                ->update([
                    'created_by' => DB::raw('author_id'),
                    'updated_by' => DB::raw('author_id')
                ]);
            
            echo "Updated " . DB::table('articles')->whereNotNull('created_by')->count() . " articles\n";
        }

        // Update videos table
        if (Schema::hasColumn('videos', 'created_by') && Schema::hasColumn('videos', 'author_id')) {
            DB::table('videos')
                ->whereNull('created_by')
                ->whereNotNull('author_id')
                ->update([
                    'created_by' => DB::raw('author_id'),
                    'updated_by' => DB::raw('author_id')
                ]);
            
            echo "Updated " . DB::table('videos')->whereNotNull('created_by')->count() . " videos\n";
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set back to NULL for products
        if (Schema::hasColumn('products', 'created_by')) {
            DB::table('products')->update([
                'created_by' => null,
                'updated_by' => null
            ]);
        }

        // Set back to NULL for articles
        if (Schema::hasColumn('articles', 'created_by')) {
            DB::table('articles')->update([
                'created_by' => null,
                'updated_by' => null
            ]);
        }

        // Set back to NULL for videos
        if (Schema::hasColumn('videos', 'created_by')) {
            DB::table('videos')->update([
                'created_by' => null,
                'updated_by' => null
            ]);
        }
    }
};

