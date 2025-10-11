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
        Schema::table('users', function (Blueprint $table) {
            // Add country and phone_country_code fields
            $table->string('country', 10)->nullable()->after('phone');
            $table->string('phone_country_code', 5)->nullable()->after('phone');
            
            // Remove unused fields
            $table->dropColumn(['state', 'company', 'is_email_verified']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add back the removed fields
            $table->string('state')->nullable()->after('city');
            $table->string('company')->nullable()->after('zip_code');
            $table->boolean('is_email_verified')->default(false)->after('is_banned');
            
            // Remove country and phone_country_code fields
            $table->dropColumn(['country', 'phone_country_code']);
        });
    }
};
