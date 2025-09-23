<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('essentials', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // soil, fertilizer, pesticide, seed
            $table->string('name');
            $table->json('details_json')->nullable();
            $table->string('season')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('essentials');
    }
};
