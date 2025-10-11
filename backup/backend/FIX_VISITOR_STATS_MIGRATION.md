# SỬA MIGRATION VISITOR_STATS

## Vấn đề

File migration `backend/database/migrations/2025_01_01_000016_create_visitor_stats_table.php` định nghĩa SAI cấu trúc bảng, không khớp với:
- Model `VisitorStat`
- Controller `VisitorController`
- Database production thực tế

## Giải pháp

### Cách 1: Xóa và tạo migration mới (KHUYẾN NGHỊ CHO LOCAL/STAGING)

1. **Xóa migration cũ:**
```bash
# Xóa file migration cũ
rm backend/database/migrations/2025_01_01_000016_create_visitor_stats_table.php
```

2. **Sử dụng migration mới:**
```bash
# File migration mới đã được tạo
backend/database/migrations/2025_10_09_000001_fix_visitor_stats_table.php
```

3. **Chạy migration:**
```bash
cd backend
php artisan migrate:fresh --seed  # LOCAL ONLY - Sẽ xóa toàn bộ data
# HOẶC
php artisan migrate  # Chỉ chạy migration mới
```

### Cách 2: Sửa file migration cũ (NẾU CHƯA CHẠY MIGRATE)

Thay thế nội dung file `2025_01_01_000016_create_visitor_stats_table.php` bằng:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_stats', function (Blueprint $table) {
            $table->id();
            $table->string('ip_hash')->index();
            $table->string('page')->index();
            $table->timestamp('viewed_at')->index();
            $table->json('meta_json')->nullable();
            $table->timestamps();
            
            // Composite index
            $table->index(['ip_hash', 'page', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_stats');
    }
};
```

### Cách 3: Production database đã có data (KHUYẾN NGHỊ CHO PRODUCTION)

**KHÔNG LÀM GÌ CẢ** - Database production đã đúng cấu trúc!

Chỉ cần:
1. Backup file migration cũ
2. Cập nhật file migration để lần sau deploy không bị lỗi
3. Document việc này để team biết

## Kiểm tra

Sau khi sửa, verify bằng cách:

```bash
# Kiểm tra cấu trúc bảng
php artisan tinker
```

```php
// Trong tinker
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Lấy cấu trúc bảng
$columns = Schema::getColumnListing('visitor_stats');
print_r($columns);

// Kiểm tra có thể create record
$stat = App\Models\VisitorStat::create([
    'ip_hash' => hash('sha256', '127.0.0.1'),
    'page' => '/test',
    'viewed_at' => now(),
    'meta_json' => json_encode(['test' => true])
]);
print_r($stat->toArray());
```

## Kết quả mong đợi

Bảng `visitor_stats` phải có các columns:
- `id` (primary key)
- `ip_hash` (varchar, indexed)
- `page` (varchar, indexed)
- `viewed_at` (timestamp, indexed)
- `meta_json` (json, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Lưu ý

- **KHÔNG chạy `migrate:fresh` trên production** - sẽ mất toàn bộ dữ liệu
- **Backup database trước** khi thực hiện bất kỳ thay đổi nào
- **Test trên local/staging** trước khi áp dụng lên production

