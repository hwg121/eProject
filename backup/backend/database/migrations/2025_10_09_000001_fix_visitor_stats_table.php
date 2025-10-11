<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * FIX: Migration để sửa cấu trúc bảng visitor_stats
 * Vấn đề: Migration cũ định nghĩa sai cấu trúc, không khớp với implementation thực tế
 * 
 * Cấu trúc CŨ (SAI):
 * - ip_address, user_agent, page_url, referrer, country, city, user_id, visited_at
 * 
 * Cấu trúc MỚI (ĐÚNG - khớp với Model và Controller):
 * - ip_hash, page, viewed_at, meta_json
 */
return new class extends Migration
{
    public function up(): void
    {
        // Drop bảng cũ nếu có (CHỈ trên local/staging, KHÔNG chạy trên production nếu có data)
        // Schema::dropIfExists('visitor_stats');
        
        // Tạo lại bảng với cấu trúc đúng
        Schema::create('visitor_stats', function (Blueprint $table) {
            $table->id();
            
            // IP hash (SHA256) để bảo mật và tránh lưu IP trực tiếp
            $table->string('ip_hash')->index();
            
            // Page URL được visit
            $table->string('page')->index();
            
            // Timestamp của lượt visit
            $table->timestamp('viewed_at')->index();
            
            // Metadata JSON chứa thông tin bổ sung
            // { "user_agent": "...", "referer": "...", ... }
            $table->json('meta_json')->nullable();
            
            $table->timestamps();
            
            // Index compound để query nhanh
            $table->index(['ip_hash', 'page', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_stats');
    }
};

