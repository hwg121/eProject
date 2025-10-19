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
     * This migration populates published_at column for existing published records.
     * Sets published_at = created_at for records with status='published' and NULL published_at.
     */
    public function up(): void
    {
        // Update articles table
        if (Schema::hasColumn('articles', 'published_at')) {
            $articlesUpdated = DB::table('articles')
                ->where('status', 'published')
                ->whereNull('published_at')
                ->update([
                    'published_at' => DB::raw('created_at')
                ]);
            
            echo "Updated {$articlesUpdated} published articles\n";
        }

        // Update videos table
        if (Schema::hasColumn('videos', 'published_at')) {
            $videosUpdated = DB::table('videos')
                ->where('status', 'published')
                ->whereNull('published_at')
                ->update([
                    'published_at' => DB::raw('created_at')
                ]);
            
            echo "Updated {$videosUpdated} published videos\n";
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set back to NULL for articles
        if (Schema::hasColumn('articles', 'published_at')) {
            DB::table('articles')->update([
                'published_at' => null
            ]);
        }

        // Set back to NULL for videos
        if (Schema::hasColumn('videos', 'published_at')) {
            DB::table('videos')->update([
                'published_at' => null
            ]);
        }
    }
};


