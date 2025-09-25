<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pots', function (Blueprint $table) {
            $table->string('slug')->unique()->after('name');
            $table->decimal('price', 10, 2)->nullable()->after('description');
            $table->string('size')->nullable()->after('price');
            $table->boolean('drainage_holes')->default(true)->after('size');
            $table->string('color')->nullable()->after('drainage_holes');
            $table->string('brand')->nullable()->after('color');
        });
    }

    public function down(): void
    {
        Schema::table('pots', function (Blueprint $table) {
            $table->dropColumn(['slug', 'price', 'size', 'drainage_holes', 'color', 'brand']);
        });
    }
};