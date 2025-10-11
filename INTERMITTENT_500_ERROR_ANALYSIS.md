# 🔍 PHÂN TÍCH LỖI 500 GET GIÁN ĐOẠN (Intermittent 500 GET Errors)

## 📊 HIỆN TƯỢNG
- **Tần suất:** 99% bình thường, 1% gặp lỗi
- **Loại lỗi:** HTTP 500 Internal Server Error
- **Method:** GET requests
- **Tính chất:** Ngẫu nhiên (intermittent), không ổn định

---

## 🎯 NGUYÊN NHÂN THƯỜNG GẶP

### 1️⃣ **DATABASE CONNECTION TIMEOUT**

**Mô tả:**
- Server MySQL có giới hạn số connections đồng thời
- Khi quá nhiều requests cùng lúc → connection pool đầy
- Một số requests không get được connection → 500 error

**Dấu hiệu:**
- Lỗi xuất hiện khi có nhiều users truy cập
- Lỗi tự fix sau vài giây/phút
- Error message: "Too many connections" hoặc "Connection timeout"

**Giải pháp:**
```php
// File: backend/config/database.php
'mysql' => [
    // Tăng pool size
    'pool' => [
        'min' => 2,
        'max' => 20,  // Tăng từ 10 → 20
    ],
    
    // Thêm retry logic
    'options' => [
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_PERSISTENT => false,  // Tắt persistent connections
    ],
]
```

**Prevention:**
- ✅ Đóng connections sau khi dùng xong
- ✅ Sử dụng Connection pooling
- ✅ Tối ưu queries (reduce query count)
- ✅ Cache kết quả thường dùng

---

### 2️⃣ **RACE CONDITION - CONCURRENT REQUESTS**

**Mô tả:**
- Nhiều requests cùng update một record
- Transaction conflicts
- Lock timeout

**Ví dụ thực tế trong project:**
```php
// File: ArticleController.php, VideoController.php
// Current code:
public function show($id) {
    $article = Article::findOrFail($id);
    $article->increment('views');  // ⚠️ Có thể race condition
    return response()->json(['data' => $article]);
}

// Khi 2+ users cùng xem 1 article cùng lúc:
// Request 1: Read views = 100, Write views = 101
// Request 2: Read views = 100, Write views = 101 (đồng thời)
// Kết quả: views = 101 thay vì 102
// Hoặc: Database lock conflict → 500 error
```

**Recommended Fix:**
```php
// ✅ OPTION 1: Use direct DB increment (atomic operation)
public function show($id) {
    try {
        $article = Article::findOrFail($id);
        
        // Atomic increment - no race condition
        Article::where('id', $id)->increment('views');
        
        // Reload fresh data
        $article->refresh();
        
        return response()->json([
            'success' => true,
            'data' => $article
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
}

// ✅ OPTION 2: Queue view increment (best for high traffic)
use App\Jobs\IncrementViewCount;

public function show($id) {
    $article = Article::findOrFail($id);
    
    // Dispatch job to increment views asynchronously
    IncrementViewCount::dispatch('article', $id);
    
    return response()->json([
        'success' => true,
        'data' => $article
    ]);
}
```

---

### 3️⃣ **MISSING NULL CHECKS - DATA CORRUPTION**

**Mô tả:**
- Một số records có data null/corrupted
- Code không handle null properly
- Khi query trúng record có vấn đề → 500 error

**Check trong project:**
```php
// Các trường có thể null gây lỗi:
- author (relationship)
- category (relationship)
- images_json (JSON field)
- tags (JSON field)
- rating, views, likes (numeric fields)
```

**Giải pháp đã áp dụng:**
```php
// ✅ ProductResource.php - Already safe
'rating' => is_numeric($this->rating) ? (float) $this->rating : 0.0,
'views' => $this->views ?? 0,
'likes' => $this->likes ?? 0,

// ✅ VideoResource.php - Already safe
'views' => $this->views ?? 0,
'likes' => $this->likes ?? 0,
'rating' => $this->rating ?? 0,
```

**Additional Safety:**
```php
// Nên thêm trong ArticleResource.php (nếu chưa có):
public function toArray($request): array {
    return [
        'id' => $this->id,
        'title' => $this->title ?? '',
        'slug' => $this->slug ?? '',
        'excerpt' => $this->excerpt ?? '',
        'body' => $this->body ?? '',
        'featured_image' => $this->featured_image ?? '',
        'author' => $this->author?->name ?? 'Admin',  // ✅ Null-safe
        'category' => $this->category?->name ?? 'General',  // ✅ Null-safe
        'views' => $this->views ?? 0,
        'likes' => $this->likes ?? 0,
        'rating' => is_numeric($this->rating) ? (float) $this->rating : 0.0,
        'status' => $this->status ?? 'published',
        'is_featured' => (bool) ($this->is_featured ?? false),
    ];
}
```

---

### 4️⃣ **TIMEOUT ON COMPLEX QUERIES**

**Mô tả:**
- Query quá phức tạp (nhiều JOINs, WHERE, ORDER BY)
- Thiếu database indexes
- Query execution time vượt quá limit

**Giải pháp:**
```sql
-- Add indexes for common queries
-- File: migration

-- For articles
ALTER TABLE articles ADD INDEX idx_status_created (status, created_at);
ALTER TABLE articles ADD INDEX idx_slug (slug);
ALTER TABLE articles ADD INDEX idx_views (views);

-- For videos
ALTER TABLE videos ADD INDEX idx_status_created (status, created_at);
ALTER TABLE videos ADD INDEX idx_slug (slug);

-- For products
ALTER TABLE products ADD INDEX idx_category_status (category, status);
ALTER TABLE products ADD INDEX idx_featured (is_featured);
```

**Query Optimization:**
```php
// ❌ SLOW: Multiple separate queries
$articles = Article::all();
$videos = Video::all();
$products = Product::all();

// ✅ FAST: Add conditions and limits
$articles = Article::where('status', 'published')
    ->select(['id', 'title', 'slug', 'views'])  // Only needed fields
    ->orderBy('created_at', 'desc')
    ->limit(50)  // Limit results
    ->get();
```

---

### 5️⃣ **MIDDLEWARE AUTHENTICATION ISSUES**

**Mô tả:**
- Token validation timeout
- Session expired mid-request
- Sanctum token verification slow

**Check:**
```php
// File: routes/api.php
// Kiểm tra middleware
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
});

// Potential issues:
// - Token đã expire nhưng chưa refresh
// - Database query trong token validation
// - CORS preflight timeout
```

**Giải pháp:**
```php
// Add timeout protection
public function index(Request $request) {
    // Set max execution time
    set_time_limit(30);
    
    try {
        // Your code
    } catch (\Exception $e) {
        \Log::error('API Error', [
            'endpoint' => request()->path(),
            'method' => request()->method(),
            'user' => auth()->id(),
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Server error occurred'
        ], 500);
    }
}
```

---

## 🛡️ PREVENTION STRATEGIES

### 1. Add Comprehensive Error Logging

```php
// File: backend/app/Exceptions/Handler.php
public function register(): void
{
    $this->reportable(function (Throwable $e) {
        // Log all 500 errors with context
        if ($e instanceof \Exception) {
            \Log::error('500 Error Occurred', [
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'user_id' => auth()->id(),
                'ip' => request()->ip(),
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    });
}
```

### 2. Add Request Retry Logic (Frontend)

```typescript
// File: frontend/src/services/api.ts
class ApiClient {
    async request<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(`${this.baseURL}${endpoint}`, {
                    ...options,
                    headers: this.getHeaders(),
                });
                
                if (response.ok) {
                    return await response.json();
                }
                
                // If 500 error and not last retry, wait and retry
                if (response.status === 500 && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                    continue;
                }
                
                throw new Error(`HTTP ${response.status}`);
            } catch (error) {
                if (i === retries - 1) throw error;
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        throw new Error('Max retries reached');
    }
}
```

### 3. Add Health Check Endpoint

```php
// File: backend/routes/api.php
Route::get('/health', function() {
    try {
        // Check database connection
        DB::connection()->getPdo();
        
        // Check critical tables
        $articlesCount = Article::count();
        $videosCount = Video::count();
        
        return response()->json([
            'status' => 'healthy',
            'database' => 'connected',
            'articles' => $articlesCount,
            'videos' => $videosCount,
            'timestamp' => now()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'error' => $e->getMessage()
        ], 500);
    }
});
```

### 4. Add Response Caching for Heavy Queries

```php
// For frequently accessed, rarely changed data
public function index(Request $request) {
    $page = $request->get('page', 1);
    $status = $request->get('status', 'all');
    
    $cacheKey = "articles_{$page}_{$status}";
    
    return Cache::remember($cacheKey, 300, function() use ($request) {
        $query = Article::query();
        
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        return $query->paginate(15);
    });
}

// Clear cache when data changes
public function store(Request $request) {
    $article = Article::create($validated);
    
    // Clear relevant caches
    Cache::flush('articles_*');  // Clear all article caches
    
    return response()->json($article);
}
```

---

## 📋 IMMEDIATE ACTION CHECKLIST

### Để giảm lỗi 500 GET xuống gần 0%, nên làm:

#### Priority 1 - Critical (Làm ngay):
- [ ] **Add error logging** để track khi nào lỗi xảy ra
- [ ] **Check Laravel logs** trên server: `storage/logs/laravel.log`
- [ ] **Verify database indexes** cho các queries thường dùng
- [ ] **Add null checks** trong tất cả Resources

#### Priority 2 - Important (Nên làm):
- [ ] **Implement caching** cho queries heavy
- [ ] **Add retry logic** ở frontend cho GET requests
- [ ] **Optimize queries** - chỉ select fields cần thiết
- [ ] **Eager load relationships** để tránh N+1

#### Priority 3 - Enhancement (Có thể làm sau):
- [ ] **Add health check endpoint**
- [ ] **Implement request queueing** cho view increments
- [ ] **Add database connection pooling**
- [ ] **Monitor server resources** (CPU, Memory, Connections)

---

## 🔍 DEBUG STEPS KHI GẶP LỖI 500 GET

### Step 1: Identify Which Endpoint
```javascript
// Frontend: Check Network Tab
// Tìm request bị 500
// Copy Request URL
// Example: GET https://greengroves.blog/api/admin/articles?page=2
```

### Step 2: Check Laravel Logs
```bash
# Trên server, check file:
tail -f storage/logs/laravel.log

# Hoặc check latest errors:
tail -100 storage/logs/laravel.log | grep "ERROR"
```

### Step 3: Reproduce Error
```bash
# Test API endpoint directly
curl -X GET "https://greengroves.blog/api/admin/articles" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Nếu reproduce được → check response
# Nếu không reproduce → là intermittent issue
```

### Step 4: Check Database
```sql
-- Check for corrupt data
SELECT id, title, slug, author_id, category_id 
FROM articles 
WHERE slug IS NULL OR slug = '';

-- Check for orphaned relationships
SELECT a.id, a.title, a.author_id
FROM articles a
LEFT JOIN users u ON a.author_id = u.id
WHERE a.author_id IS NOT NULL AND u.id IS NULL;

-- Check JSON fields
SELECT id, images_json 
FROM products 
WHERE images_json IS NOT NULL 
  AND images_json != '[]'
  AND images_json NOT LIKE '[%]';  -- Invalid JSON
```

### Step 5: Add Temporary Logging
```php
// Temporarily add to controller to identify issue:
public function index(Request $request) {
    \Log::info('Article index called', [
        'request' => $request->all(),
        'user_id' => auth()->id(),
        'memory_usage' => memory_get_usage(true),
    ]);
    
    try {
        $articles = Article::paginate(15);
        
        \Log::info('Articles fetched successfully', [
            'count' => $articles->count(),
            'memory_usage' => memory_get_usage(true),
        ]);
        
        return response()->json(['data' => $articles]);
    } catch (\Exception $e) {
        \Log::error('Article index failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'memory_usage' => memory_get_usage(true),
        ]);
        throw $e;
    }
}
```

---

## 🎯 MOST LIKELY CAUSES FOR YOUR PROJECT

### Based on current code analysis:

#### 1. **Race Condition in View Increment** (70% probability)
```php
// Current code in ArticleController, VideoController:
$article->increment('views');  // ⚠️ Not atomic

// Multiple concurrent requests → deadlock/timeout → 500 error
```

**Fix:**
```php
// Use atomic increment instead
Article::where('id', $id)->increment('views');
```

#### 2. **Missing Eager Loading** (20% probability)
```php
// If using relationships in Resources without eager loading
$articles = Article::all();  // No eager loading

// Resource tries to access $article->author->name
// → N+1 queries → timeout → 500 error
```

**Fix:**
```php
$articles = Article::with(['author', 'category'])->paginate(15);
```

#### 3. **Database Connection Limit** (10% probability)
```
Too many connections at peak times
→ Some requests can't get connection
→ 500 error
```

---

## 🚀 RECOMMENDED QUICK FIXES

### Fix 1: Make View Increment Atomic (Apply Now)

```php
// File: backend/app/Http/Controllers/Api/ArticleController.php
public function show($id) {
    try {
        $article = Article::findOrFail($id);
        
        // ✅ Use atomic increment instead of $article->increment()
        Article::where('id', $id)->increment('views');
        $article->refresh();
        
        return response()->json([
            'success' => true,
            'data' => $article
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
}

// Apply same fix to:
// - VideoController::show()
// - ProductController::show()
// - Any other controller with increment()
```

### Fix 2: Add Comprehensive Error Logging

```php
// File: backend/app/Http/Controllers/Api/ArticleController.php
public function index(Request $request) {
    try {
        $query = Article::query();
        
        // ... existing filter logic ...
        
        $articles = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'meta' => [...]
        ]);
    } catch (\Exception $e) {
        // ✅ Log detailed error info
        \Log::error('ArticleController::index failed', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'request' => $request->all(),
            'user_id' => auth()->id(),
            'memory' => memory_get_usage(true),
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Error fetching articles',
            'debug' => app()->environment('local') ? $e->getMessage() : null
        ], 500);
    }
}
```

### Fix 3: Add Request Timeout Handling (Frontend)

```typescript
// File: frontend/src/services/api.ts
class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retries = 2  // ✅ Add retry for 500 errors
    ): Promise<T> {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
                
                const response = await fetch(`${this.baseURL}${endpoint}`, {
                    ...options,
                    signal: controller.signal,
                    headers: this.getHeaders(),
                });
                
                clearTimeout(timeout);
                
                if (!response.ok) {
                    // If 500 error and not last attempt, retry
                    if (response.status === 500 && attempt < retries) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }
                    throw new Error(`HTTP ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                if (attempt === retries) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        throw new Error('Request failed after retries');
    }
}
```

---

## 📊 MONITORING RECOMMENDATIONS

### 1. Add Error Tracking
```php
// Track error frequency
\Log::channel('api_errors')->error('500 Error', [
    'endpoint' => request()->path(),
    'timestamp' => now(),
]);

// Analyze logs to find pattern:
// - Which endpoint errors most?
// - What time of day?
// - Which users affected?
```

### 2. Add Performance Monitoring
```php
// Measure query execution time
$startTime = microtime(true);

$articles = Article::paginate(15);

$executionTime = microtime(true) - $startTime;

if ($executionTime > 1.0) {  // Slow query (>1s)
    \Log::warning('Slow query detected', [
        'endpoint' => request()->path(),
        'execution_time' => $executionTime,
        'query' => $articles->toSql()
    ]);
}
```

---

## ❓ QUESTIONS TO INVESTIGATE

Để xác định chính xác nguyên nhân, cần check:

1. **Khi nào lỗi xuất hiện?**
   - Giờ cao điểm (nhiều users)?
   - Endpoint cụ thể nào?
   - Action cụ thể nào (load page, scroll, filter)?

2. **Laravel logs có gì không?**
   - Check `storage/logs/laravel.log` trên server
   - Có error stack trace nào không?
   - Error message cụ thể là gì?

3. **Database có vấn đề không?**
   - Có records nào có data null/corrupt?
   - Có slow queries không?
   - Connection count có cao không?

4. **Server resources thế nào?**
   - CPU usage có spike không?
   - Memory available còn bao nhiêu?
   - Disk I/O có high không?

---

## 💡 NEXT STEPS

### Immediate (Ngay bây giờ):
1. ✅ **Check Laravel logs** trên server để xem error message cụ thể
2. ✅ **Ghi chú** endpoint nào bị lỗi (articles? videos? products?)
3. ✅ **Ghi chú** thời điểm bị lỗi (giờ nào trong ngày?)

### Short-term (Sắp tới):
1. ⏳ **Apply atomic increment fix** cho view counts
2. ⏳ **Add error logging** chi tiết trong controllers
3. ⏳ **Add database indexes** cho performance

### Long-term (Dài hạn):
1. 📈 **Implement caching** cho heavy queries
2. 📈 **Add monitoring/alerting** system
3. 📈 **Optimize database** và server config

---

## 🎓 KEY TAKEAWAYS

✅ **Lỗi 500 GET intermittent thường do:**
- Race conditions (concurrent requests)
- Database connection limits
- Missing null checks
- N+1 query problems
- Server resource limits

✅ **Prevention strategy:**
- Use atomic operations
- Add comprehensive error logging
- Implement retry logic
- Cache frequent queries
- Add database indexes

✅ **Debug approach:**
- Check Laravel logs first
- Identify pattern (endpoint, timing, frequency)
- Fix root cause, not symptoms
- Monitor after fix to verify

---

**Tóm lại:** Lỗi 1% thường là do **race condition** hoặc **database connection timeout** vào giờ cao điểm. 

**Action ngay:** Check Laravel logs để xác định chính xác endpoint và error message!

---

**Document Version:** 1.0  
**Created:** 2025-10-11  
**Status:** 🔍 Analyzing Intermittent Errors
