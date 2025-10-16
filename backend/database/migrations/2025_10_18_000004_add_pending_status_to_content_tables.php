<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify Products status enum to include 'pending'
        DB::statement("ALTER TABLE products MODIFY status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'pending'");
        
        // Modify Articles status enum to include 'pending' and 'archived'
        DB::statement("ALTER TABLE articles MODIFY status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'pending'");
        
        // Modify Videos status enum to include 'pending' and 'archived'
        DB::statement("ALTER TABLE videos MODIFY status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to old enum values
        DB::statement("ALTER TABLE products MODIFY status ENUM('draft', 'published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE articles MODIFY status ENUM('draft', 'published') DEFAULT 'published'");
        DB::statement("ALTER TABLE videos MODIFY status ENUM('draft', 'published') DEFAULT 'published'");
    }
};

