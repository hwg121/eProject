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
        // Add image_public_id to products table if not exists
        if (!Schema::hasColumn('products', 'image_public_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('image_public_id')->nullable()
                      ->after('image')
                      ->comment('Cloudinary public_id for product image');
            });
        }

        // Add index if not exists
        $indexName = 'products_image_public_id_index';
        $indexes = DB::select("SHOW INDEX FROM products WHERE Key_name = ?", [$indexName]);
        if (empty($indexes)) {
            Schema::table('products', function (Blueprint $table) {
                $table->index('image_public_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop index first
            $table->dropIndex(['image_public_id']);
            // Then drop column
            $table->dropColumn('image_public_id');
        });
    }
};


