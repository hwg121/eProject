<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('content');
            $table->string('category')->nullable();
            $table->string('difficulty_level')->default('beginner'); // beginner, intermediate, advanced
            $table->string('season')->nullable(); // spring, summer, fall, winter, all
            $table->string('plant_type')->nullable(); // indoor, outdoor, both
            $table->integer('estimated_time')->nullable(); // in minutes
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->string('image')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suggestions');
    }
};