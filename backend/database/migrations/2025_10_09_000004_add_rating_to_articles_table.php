<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ADD RATING COLUMN TO ARTICLES TABLE
 * 
 * Articles table thiếu rating column (videos đã có)
 * Cần thêm để sync rating từ user_interactions
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'rating')) {
                $table->decimal('rating', 3, 2)->default(0)->after('likes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'rating')) {
                $table->dropColumn('rating');
            }
        });
    }
};

