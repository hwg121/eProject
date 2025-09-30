<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add image fields to articles table
        Schema::table('articles', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('body');
        });

        // Add image fields to videos table
        Schema::table('videos', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('description');
        });

        // Add image fields to books table
        Schema::table('books', function (Blueprint $table) {
            $table->string('cover_image')->nullable()->after('description');
        });

        // Add image fields to tools table
        Schema::table('tools', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('description');
        });

        // Add image fields to essentials table
        Schema::table('essentials', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('description');
        });

        // Add image fields to pots table
        Schema::table('pots', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('description');
        });

        // Add image fields to accessories table
        Schema::table('accessories', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('description');
        });

        // Add image fields to suggestions table
        Schema::table('suggestions', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        // Remove image fields from articles table
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        // Remove image fields from videos table
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        // Remove image fields from books table
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn('cover_image');
        });

        // Remove image fields from tools table
        Schema::table('tools', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        // Remove image fields from essentials table
        Schema::table('essentials', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        // Remove image fields from pots table
        Schema::table('pots', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        // Remove image fields from accessories table
        Schema::table('accessories', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        // Remove image fields from suggestions table
        Schema::table('suggestions', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });
    }
};