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
        // Fix NULL status values in articles table
        DB::statement("UPDATE articles SET status = 'archived' WHERE status IS NULL OR status = ''");
        
        // Fix NULL status values in videos table
        DB::statement("UPDATE videos SET status = 'archived' WHERE status IS NULL OR status = ''");
        
        // Fix NULL status values in products table
        DB::statement("UPDATE products SET status = 'archived' WHERE status IS NULL OR status = ''");
        
        // Ensure all status columns are NOT NULL
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('published', 'archived') NOT NULL DEFAULT 'published'");
        DB::statement("ALTER TABLE videos MODIFY COLUMN status ENUM('published', 'archived') NOT NULL DEFAULT 'published'");
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('published', 'archived') NOT NULL DEFAULT 'published'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Allow NULL again
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE videos MODIFY COLUMN status ENUM('published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('published', 'archived') DEFAULT 'published'");
    }
};

