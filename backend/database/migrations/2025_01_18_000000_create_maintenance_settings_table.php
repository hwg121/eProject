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
        Schema::create('maintenance_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_enabled')->default(false);
            $table->text('message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('estimated_end_at')->nullable();
            $table->unsignedBigInteger('enabled_by')->nullable();
            $table->timestamps();

            $table->foreign('enabled_by')->references('id')->on('users')->onDelete('set null');
        });

        // Insert default maintenance setting
        DB::table('maintenance_settings')->insert([
            'is_enabled' => false,
            'message' => 'We are currently performing scheduled maintenance. We will be back shortly.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_settings');
    }
};

