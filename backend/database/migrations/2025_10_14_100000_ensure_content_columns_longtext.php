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
     * Ensure content, body, description, excerpt columns are LONGTEXT
     * to support very long content without truncation.
     */
    public function up(): void
    {
        // Articles table
        DB::statement('ALTER TABLE articles MODIFY COLUMN content LONGTEXT NULL');
        DB::statement('ALTER TABLE articles MODIFY COLUMN body LONGTEXT NULL');
        DB::statement('ALTER TABLE articles MODIFY COLUMN excerpt TEXT NULL');
        DB::statement('ALTER TABLE articles MODIFY COLUMN description TEXT NULL');
        
        // Videos table
        DB::statement('ALTER TABLE videos MODIFY COLUMN content LONGTEXT NULL');
        DB::statement('ALTER TABLE videos MODIFY COLUMN description TEXT NULL');
        DB::statement('ALTER TABLE videos MODIFY COLUMN excerpt TEXT NULL');
        
        // Products table (if has content column)
        if (Schema::hasColumn('products', 'content')) {
            DB::statement('ALTER TABLE products MODIFY COLUMN content LONGTEXT NULL');
        }
        if (Schema::hasColumn('products', 'description')) {
            DB::statement('ALTER TABLE products MODIFY COLUMN description TEXT NULL');
        }
        if (Schema::hasColumn('products', 'usage_guide')) {
            DB::statement('ALTER TABLE products MODIFY COLUMN usage_guide LONGTEXT NULL');
        }
        if (Schema::hasColumn('products', 'care_instructions')) {
            DB::statement('ALTER TABLE products MODIFY COLUMN care_instructions LONGTEXT NULL');
        }
        
        // Essentials table (if exists)
        if (Schema::hasTable('essentials')) {
            if (Schema::hasColumn('essentials', 'content')) {
                DB::statement('ALTER TABLE essentials MODIFY COLUMN content LONGTEXT NULL');
            }
            if (Schema::hasColumn('essentials', 'description')) {
                DB::statement('ALTER TABLE essentials MODIFY COLUMN description TEXT NULL');
            }
        }
    }

    /**
     * Reverse the migrations.
     * 
     * This migration is safe to keep as LONGTEXT, so we don't reverse it.
     * Reverting would risk data loss if large content exists.
     */
    public function down(): void
    {
        // Do nothing - keep LONGTEXT to prevent data loss
        // If needed to reverse manually:
        // DB::statement('ALTER TABLE articles MODIFY COLUMN content TEXT NULL');
    }
};







