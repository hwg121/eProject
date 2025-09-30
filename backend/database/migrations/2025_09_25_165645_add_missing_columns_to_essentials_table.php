<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('essentials', function (Blueprint $table) {
            $table->string('slug')->unique()->after('name');
            $table->text('description')->nullable()->after('slug');
            $table->decimal('price', 10, 2)->nullable()->after('description');
            $table->string('image')->nullable()->after('price');
            $table->string('category')->nullable()->after('image');
            $table->string('weight')->nullable()->after('category');
            $table->string('brand')->nullable()->after('weight');
        });
    }

    public function down(): void
    {
        Schema::table('essentials', function (Blueprint $table) {
            $table->dropColumn(['slug', 'description', 'price', 'image', 'category', 'weight', 'brand']);
        });
    }
};