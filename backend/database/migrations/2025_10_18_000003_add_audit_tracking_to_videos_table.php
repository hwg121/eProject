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
        Schema::table('videos', function (Blueprint $table) {
            // Check and add created_by
            if (!Schema::hasColumn('videos', 'created_by')) {
                $table->foreignId('created_by')
                      ->nullable()
                      ->after('author_id')
                      ->constrained('users')
                      ->onDelete('set null');
                $table->index('created_by');
            }
            
            // Check and add updated_by
            if (!Schema::hasColumn('videos', 'updated_by')) {
                $table->foreignId('updated_by')
                      ->nullable()
                      ->after('created_by')
                      ->constrained('users')
                      ->onDelete('set null');
                $table->index('updated_by');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            if (Schema::hasColumn('videos', 'created_by')) {
                $table->dropForeign(['created_by']);
                $table->dropIndex(['created_by']);
                $table->dropColumn('created_by');
            }
            if (Schema::hasColumn('videos', 'updated_by')) {
                $table->dropForeign(['updated_by']);
                $table->dropIndex(['updated_by']);
                $table->dropColumn('updated_by');
            }
        });
    }
};

