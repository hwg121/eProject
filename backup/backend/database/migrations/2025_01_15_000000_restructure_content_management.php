<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update articles table to support rich content for Techniques
        Schema::table('articles', function (Blueprint $table) {
            // Only add reading_time as content and featured_image already exist
            if (!Schema::hasColumn('articles', 'reading_time')) {
                $table->integer('reading_time')->nullable()->after('content');
            }
        });

        // Update videos table to support rich content
        Schema::table('videos', function (Blueprint $table) {
            // Only add transcript as content and duration already exist
            if (!Schema::hasColumn('videos', 'transcript')) {
                $table->longText('transcript')->nullable()->after('duration');
            }
        });

        // Ensure products table has additional fields for product management
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'currency')) {
                $table->string('currency', 3)->default('USD')->after('price');
            }
            if (!Schema::hasColumn('products', 'affiliate_id')) {
                $table->string('affiliate_id')->nullable()->after('currency');
            }
            if (!Schema::hasColumn('products', 'external_id')) {
                $table->string('external_id')->nullable()->after('affiliate_id');
            }
            if (!Schema::hasColumn('products', 'availability')) {
                $table->enum('availability', ['in_stock', 'out_of_stock', 'discontinued'])->default('in_stock')->after('external_id');
            }
        });

        // Update categories table to reflect new structure
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'type')) {
                $table->enum('type', ['content', 'product'])->default('content')->after('name');
            }
            if (!Schema::hasColumn('categories', 'parent_id')) {
                $table->unsignedBigInteger('parent_id')->nullable()->after('type');
                $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
            }
        });

        // Insert default categories for new structure
        DB::table('categories')->insertOrIgnore([
            // Content Management Categories
            ['name' => 'Technique', 'slug' => 'technique', 'type' => 'content', 'description' => 'Detailed technique articles', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Video', 'slug' => 'video', 'type' => 'content', 'description' => 'Video tutorials and content', 'created_at' => now(), 'updated_at' => now()],
            
            // Product Management Categories
            ['name' => 'Tool', 'slug' => 'tool', 'type' => 'product', 'description' => 'Gardening tools and equipment', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pot', 'slug' => 'pot', 'type' => 'product', 'description' => 'Plant pots and containers', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Accessory', 'slug' => 'accessory', 'type' => 'product', 'description' => 'Gardening accessories', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Suggestion', 'slug' => 'suggestion', 'type' => 'product', 'description' => 'Product suggestions and recommendations', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Book', 'slug' => 'book', 'type' => 'product', 'description' => 'Books and reading materials', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Update existing data to match new categories
        DB::table('articles')->update(['category_id' => DB::table('categories')->where('slug', 'technique')->value('id')]);
        DB::table('videos')->update(['category_id' => DB::table('categories')->where('slug', 'video')->value('id')]);
        
        // Update products table to use new categories based on product category
        DB::table('products')->where('category', 'tool')->update(['category_id' => DB::table('categories')->where('slug', 'tool')->value('id')]);
        DB::table('products')->where('category', 'pot')->update(['category_id' => DB::table('categories')->where('slug', 'pot')->value('id')]);
        DB::table('products')->where('category', 'accessory')->update(['category_id' => DB::table('categories')->where('slug', 'accessory')->value('id')]);
        DB::table('products')->where('category', 'suggestion')->update(['category_id' => DB::table('categories')->where('slug', 'suggestion')->value('id')]);
        DB::table('products')->where('category', 'book')->update(['category_id' => DB::table('categories')->where('slug', 'book')->value('id')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove added columns
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['reading_time']);
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['transcript']);
        });

        // Drop added columns from products table
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['currency', 'affiliate_id', 'external_id', 'availability']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['type', 'parent_id']);
        });

        // Remove inserted categories
        DB::table('categories')->whereIn('slug', [
            'technique', 'video', 'tool', 'pot', 'accessory', 'suggestion', 'book'
        ])->delete();
    }
};
