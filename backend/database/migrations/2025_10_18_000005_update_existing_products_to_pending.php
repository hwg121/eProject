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
        // Update existing products with status 'published' to 'pending' for review
        DB::table('products')
            ->where('status', 'published')
            ->update(['status' => 'pending']);
            
        // Update existing articles with status 'published' to 'pending' for review
        DB::table('articles')
            ->where('status', 'published')
            ->update(['status' => 'pending']);
            
        // Update existing videos with status 'published' to 'pending' for review
        DB::table('videos')
            ->where('status', 'published')
            ->update(['status' => 'pending']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to published
        DB::table('products')
            ->where('status', 'pending')
            ->update(['status' => 'published']);
            
        DB::table('articles')
            ->where('status', 'pending')
            ->update(['status' => 'published']);
            
        DB::table('videos')
            ->where('status', 'pending')
            ->update(['status' => 'published']);
    }
};
