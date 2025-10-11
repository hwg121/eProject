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
        // Add Cloudinary fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_public_id')->nullable()->comment('Cloudinary public_id for user avatar');
        });

        // Add index for better performance
        Schema::table('users', function (Blueprint $table) {
            $table->index('avatar_public_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['avatar_public_id']);
            $table->dropColumn('avatar_public_id');
        });
    }
};
