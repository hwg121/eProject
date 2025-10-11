<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('category', ['tool', 'book', 'pot', 'accessory', 'suggestion']);
            $table->string('subcategory')->nullable(); // For more specific categorization
            
            // Common fields for all product types
            $table->decimal('price', 10, 2)->nullable();
            $table->string('brand')->nullable();
            $table->string('material')->nullable();
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            
            // Book specific fields
            $table->string('author')->nullable(); // For books
            $table->integer('pages')->nullable(); // For books
            $table->integer('published_year')->nullable(); // For books
            
            // Pot specific fields
            $table->boolean('drainage_holes')->default(false); // For pots
            
            // Accessory specific fields
            $table->boolean('is_waterproof')->default(false); // For accessories
            $table->boolean('is_durable')->default(false); // For accessories
            
            // Suggestion specific fields
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced'])->nullable(); // For suggestions
            $table->string('season')->nullable(); // For suggestions
            $table->string('plant_type')->nullable(); // For suggestions
            $table->string('estimated_time')->nullable(); // For suggestions
            $table->json('tags')->nullable(); // For suggestions
            
            // Generic link field for all products
            $table->string('link')->nullable();
            
            // Status and metadata
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            
            // Statistics
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('category');
            $table->index('status');
            $table->index('is_featured');
            $table->index('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
