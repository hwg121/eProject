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
        // First, sync status based on is_published
        // If is_published = 0, set status to 'archived'
        // If is_published = 1, set status to 'published'
        DB::statement("
            UPDATE products 
            SET status = CASE 
                WHEN is_published = 0 THEN 'archived'
                WHEN is_published = 1 THEN 'published'
                ELSE status
            END
        ");

        // Update articles: convert 'draft' to 'archived'
        DB::statement("UPDATE articles SET status = 'archived' WHERE status = 'draft'");
        
        // Update videos: convert 'draft' to 'archived'
        DB::statement("UPDATE videos SET status = 'archived' WHERE status = 'draft'");
        
        // Update products: convert 'draft' to 'archived'
        DB::statement("UPDATE products SET status = 'archived' WHERE status = 'draft'");

        // Drop the is_published column from products
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
            $table->dropColumn('is_published');
        });

        // Modify ENUM to only have 'published' and 'archived' for all tables
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE videos MODIFY COLUMN status ENUM('published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('published', 'archived') DEFAULT 'published'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore ENUM with 'draft', 'published', 'archived'
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE videos MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published'");
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published'");

        // Re-add the is_published column to products
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_published')->default(true)->after('status');
            $table->index('is_published');
        });

        // Sync is_published based on status
        DB::statement("
            UPDATE products 
            SET is_published = CASE 
                WHEN status = 'published' THEN 1
                ELSE 0
            END
        ");
    }
};

