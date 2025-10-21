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
        // Add avatar_public_id to users table if not exists
        if (!Schema::hasColumn('users', 'avatar_public_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('avatar_public_id')->nullable()
                      ->after('avatar')
                      ->comment('Cloudinary public_id for user avatar');
            });
        }

        // Add index if not exists
        $indexName = 'users_avatar_public_id_index';
        $indexes = DB::select("SHOW INDEX FROM users WHERE Key_name = ?", [$indexName]);
        if (empty($indexes)) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('avatar_public_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop index first
            $table->dropIndex(['avatar_public_id']);
            // Then drop column
            $table->dropColumn('avatar_public_id');
        });
    }
};


