<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            // Add missing columns that are used in VideoController and Video model
            $table->string('link')->nullable()->after('video_url');
            $table->string('thumbnail_url')->nullable()->after('thumbnail');
            $table->decimal('rating', 3, 2)->nullable()->after('likes');
            $table->text('tags')->nullable()->after('category');
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['link', 'thumbnail_url', 'rating', 'tags']);
        });
    }
};
