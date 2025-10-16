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
            // Only add author_id if it doesn't exist
            if (!Schema::hasColumn('products', 'author_id')) {
                $table->unsignedBigInteger('author_id')->nullable()->after('slug');
                $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
                $table->index('author_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'author_id')) {
                $table->dropForeign(['author_id']);
                $table->dropIndex(['author_id']);
                $table->dropColumn('author_id');
            }
        });
    }
};

