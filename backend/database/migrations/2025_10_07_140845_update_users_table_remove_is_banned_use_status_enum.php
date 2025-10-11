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
        Schema::table('users', function (Blueprint $table) {
            // First, update any NULL status to 'active'
            DB::statement("UPDATE users SET status = 'active' WHERE status IS NULL OR status = ''");
            
            // Drop is_banned column if it exists
            if (Schema::hasColumn('users', 'is_banned')) {
                $table->dropColumn('is_banned');
            }
            
            // Modify status column to be ENUM with only 'active' and 'banned'
            // Drop and recreate to ensure ENUM constraint
            $table->dropColumn('status');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['active', 'banned'])->default('active')->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Restore is_banned column
            $table->boolean('is_banned')->default(false)->after('status');
            
            // Revert status to string
            $table->dropColumn('status');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->after('role');
        });
    }
};
