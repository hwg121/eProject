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
        // Update articles table - change enum to include 'archived'
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published'");
        
        // Update videos table - change enum to include 'archived'
        DB::statement("ALTER TABLE videos MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published'");
        
        // Products table already has archived status (check migration 2025_01_01_000006)
        // But we'll ensure it's correct just in case
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum without 'archived'
        // WARNING: This will change any 'archived' status back to 'draft'
        DB::statement("UPDATE articles SET status = 'draft' WHERE status = 'archived'");
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'published') DEFAULT 'published'");
        
        DB::statement("UPDATE videos SET status = 'draft' WHERE status = 'archived'");
        DB::statement("ALTER TABLE videos MODIFY COLUMN status ENUM('draft', 'published') DEFAULT 'published'");
        
        DB::statement("UPDATE products SET status = 'draft' WHERE status = 'archived'");
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('draft', 'published') DEFAULT 'published'");
    }
};
