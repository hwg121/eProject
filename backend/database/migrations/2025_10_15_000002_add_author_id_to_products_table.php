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
        Schema::table('products', function (Blueprint $table) {
            // Add author_id column after rating
            $table->unsignedBigInteger('author_id')->nullable()->after('rating');
            
            // Add foreign key constraint
            $table->foreign('author_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
            
            // Add index for performance
            $table->index('author_id');
        });
        
        // Note: Keep existing 'author' string field for backward compatibility
        // Can be used as display name override if author_id is null
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['author_id']);
            $table->dropIndex(['author_id']);
            $table->dropColumn('author_id');
        });
    }
};

