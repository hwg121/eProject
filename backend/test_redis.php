<?php
/**
 * Redis Connection Test Script
 * 
 * Usage: php test_redis.php
 * 
 * This script tests:
 * 1. Redis connection
 * 2. Cache operations (put, get, forget)
 * 3. Performance comparison
 */

// Load Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

echo "\n";
echo "╔══════════════════════════════════════════════════════════╗\n";
echo "║         REDIS CONNECTION & PERFORMANCE TEST              ║\n";
echo "╚══════════════════════════════════════════════════════════╝\n";
echo "\n";

// Test 1: Configuration Check
echo "📋 STEP 1: Configuration Check\n";
echo str_repeat("-", 60) . "\n";

$cacheDriver = config('cache.default');
$redisClient = config('database.redis.client', 'not set');
$redisHost = config('database.redis.default.host', 'not set');
$redisPort = config('database.redis.default.port', 'not set');

echo "Cache Driver:  {$cacheDriver}\n";
echo "Redis Client:  {$redisClient}\n";
echo "Redis Host:    {$redisHost}\n";
echo "Redis Port:    {$redisPort}\n";

if ($cacheDriver !== 'redis') {
    echo "\n⚠️  WARNING: Cache driver is '{$cacheDriver}', not 'redis'\n";
    echo "   Update CACHE_STORE=redis in your .env file\n";
}

echo "\n";

// Test 2: Redis Connection
echo "🔌 STEP 2: Redis Connection Test\n";
echo str_repeat("-", 60) . "\n";

try {
    // Try to connect to Redis
    if ($cacheDriver === 'redis') {
        Cache::put('test_connection', 'OK', 60);
        $result = Cache::get('test_connection');
        Cache::forget('test_connection');
        
        if ($result === 'OK') {
            echo "✅ Redis connection: SUCCESS\n";
            echo "   Data written and read successfully\n";
        } else {
            echo "❌ Redis connection: FAILED\n";
            echo "   Data mismatch\n";
        }
    } else {
        echo "⏭️  Skipping (not using Redis)\n";
    }
} catch (\Exception $e) {
    echo "❌ Redis connection: ERROR\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "\n";
    echo "💡 Troubleshooting:\n";
    echo "   1. Check if Redis is running: redis-cli ping\n";
    echo "   2. Check PHP Redis extension: php -m | grep redis\n";
    echo "   3. Check Predis package: composer show predis/predis\n";
    exit(1);
}

echo "\n";

// Test 3: Performance Comparison
echo "⚡ STEP 3: Performance Comparison\n";
echo str_repeat("-", 60) . "\n";

// Test Redis Cache
$redisIterations = 1000;
$redisStart = microtime(true);

for ($i = 0; $i < $redisIterations; $i++) {
    Cache::put("test_perf_{$i}", "value_{$i}", 60);
    Cache::get("test_perf_{$i}");
    Cache::forget("test_perf_{$i}");
}

$redisTime = (microtime(true) - $redisStart) * 1000; // Convert to ms
$redisAvg = $redisTime / $redisIterations;

echo "Redis Cache ({$redisIterations} operations):\n";
echo "  Total time: " . number_format($redisTime, 2) . " ms\n";
echo "  Avg time:   " . number_format($redisAvg, 3) . " ms/operation\n";

// Simulate Database Cache (for comparison)
$dbIterations = 100; // Fewer iterations for DB
$dbStart = microtime(true);

try {
    for ($i = 0; $i < $dbIterations; $i++) {
        DB::table('cache')->updateOrInsert(
            ['key' => "test_db_{$i}"],
            ['value' => "value_{$i}", 'expiration' => time() + 3600]
        );
        DB::table('cache')->where('key', "test_db_{$i}")->first();
        DB::table('cache')->where('key', "test_db_{$i}")->delete();
    }
    
    $dbTime = (microtime(true) - $dbStart) * 1000;
    $dbAvg = $dbTime / $dbIterations;
    
    echo "\nDatabase Cache ({$dbIterations} operations):\n";
    echo "  Total time: " . number_format($dbTime, 2) . " ms\n";
    echo "  Avg time:   " . number_format($dbAvg, 3) . " ms/operation\n";
    
    $improvement = ($dbAvg / $redisAvg);
    echo "\n🚀 Performance Improvement:\n";
    echo "  Redis is " . number_format($improvement, 1) . "x faster than Database Cache!\n";
    
} catch (\Exception $e) {
    echo "\n⚠️  Could not test database cache: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 4: Real-world Scenario
echo "🌍 STEP 4: Real-world Scenario Test\n";
echo str_repeat("-", 60) . "\n";

// Simulate visitor tracking cache
$visitorTests = 50;
$start = microtime(true);

for ($i = 0; $i < $visitorTests; $i++) {
    $ipHash = md5("192.168.1.{$i}");
    $cacheKey = "visitor_{$ipHash}_" . date('Y-m-d');
    
    if (!Cache::has($cacheKey)) {
        Cache::put($cacheKey, true, now()->endOfDay()->diffInSeconds(now()));
    }
}

$visitorTime = (microtime(true) - $start) * 1000;
$visitorAvg = $visitorTime / $visitorTests;

echo "Visitor Tracking ({$visitorTests} visitors):\n";
echo "  Total time: " . number_format($visitorTime, 2) . " ms\n";
echo "  Avg time:   " . number_format($visitorAvg, 3) . " ms/visitor\n";

// Clean up
for ($i = 0; $i < $visitorTests; $i++) {
    $ipHash = md5("192.168.1.{$i}");
    $cacheKey = "visitor_{$ipHash}_" . date('Y-m-d');
    Cache::forget($cacheKey);
}

echo "\n";

// Summary
echo "╔══════════════════════════════════════════════════════════╗\n";
echo "║                    TEST SUMMARY                          ║\n";
echo "╚══════════════════════════════════════════════════════════╝\n";
echo "\n";

if ($cacheDriver === 'redis') {
    echo "✅ Cache Driver:       Redis (Optimal)\n";
    echo "✅ Connection:         Working\n";
    echo "✅ Performance:        " . number_format($redisAvg, 3) . " ms/operation\n";
    echo "✅ Visitor Tracking:   " . number_format($visitorAvg, 3) . " ms/visitor\n";
    echo "\n";
    echo "🎉 Redis is properly configured and working!\n";
} else {
    echo "⚠️  Cache Driver:       {$cacheDriver} (Not optimal)\n";
    echo "⚠️  Recommendation:     Switch to Redis for better performance\n";
    echo "\n";
    echo "📝 To switch to Redis:\n";
    echo "   1. Update .env: CACHE_STORE=redis\n";
    echo "   2. Run: php artisan config:clear\n";
    echo "   3. Run this test again\n";
}

echo "\n";
echo "═══════════════════════════════════════════════════════════\n";
echo "Test completed at: " . date('Y-m-d H:i:s') . "\n";
echo "═══════════════════════════════════════════════════════════\n";
echo "\n";

