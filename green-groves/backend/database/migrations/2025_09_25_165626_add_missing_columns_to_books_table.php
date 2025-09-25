<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title');
            $table->string('category')->nullable()->after('author');
            $table->decimal('price', 10, 2)->nullable()->after('description');
            $table->string('image')->nullable()->after('price');
            $table->decimal('rating', 3, 1)->default(0)->after('image');
            $table->string('borrowLink')->nullable()->after('buy_link');
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['slug', 'category', 'price', 'image', 'rating', 'borrowLink']);
        });
    }
};