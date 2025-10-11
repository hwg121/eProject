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
        Schema::create('campaign_settings', function (Blueprint $table) {
            $table->id();
            $table->string('metric_name')->unique(); // 'visitors', 'views', 'content', 'rating'
            $table->decimal('goal_value', 10, 2)->default(0);
            $table->decimal('baseline_value', 10, 2)->default(0);
            $table->timestamp('baseline_captured_at')->nullable();
            $table->timestamps();
        });

        // Initial campaign settings will be created when first accessed
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_settings');
    }
};

