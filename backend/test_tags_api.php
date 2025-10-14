<?php
/**
 * Test script to check tags API endpoint
 * Run this on the server to test if tags data exists and API works
 */

// Test 1: Check if tags table exists and has data
echo "=== TESTING TAGS DATABASE ===\n";

try {
    // Database connection (adjust credentials as needed)
    $host = 'localhost';
    $dbname = 'green_groves';
    $username = 'root';
    $password = '';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if tags table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'tags'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Tags table exists\n";
        
        // Count tags
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM tags");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "📊 Tags count: $count\n";
        
        if ($count > 0) {
            // Show first 5 tags
            $stmt = $pdo->query("SELECT id, name, slug FROM tags LIMIT 5");
            $tags = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "📝 Sample tags:\n";
            foreach ($tags as $tag) {
                echo "  - ID: {$tag['id']}, Name: {$tag['name']}, Slug: {$tag['slug']}\n";
            }
        } else {
            echo "❌ NO TAGS DATA FOUND!\n";
            echo "💡 Run: php artisan db:seed --class=TagSeeder\n";
        }
    } else {
        echo "❌ Tags table does not exist!\n";
        echo "💡 Run: php artisan migrate\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

echo "\n=== TESTING API ENDPOINT ===\n";

// Test 2: Check API endpoint
$apiUrl = 'http://103.252.93.249/api/tags';
echo "🔍 Testing API: $apiUrl\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "📡 HTTP Status: $httpCode\n";
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if ($data) {
            echo "✅ API Response OK\n";
            echo "📊 Response structure: " . json_encode(array_keys($data), JSON_PRETTY_PRINT) . "\n";
            
            if (isset($data['data']) && is_array($data['data'])) {
                echo "📝 Tags count from API: " . count($data['data']) . "\n";
            } else {
                echo "⚠️  Unexpected response format\n";
                echo "📄 Raw response: " . substr($response, 0, 500) . "...\n";
            }
        } else {
            echo "❌ Invalid JSON response\n";
            echo "📄 Raw response: " . substr($response, 0, 500) . "...\n";
        }
    } else {
        echo "❌ API Error - HTTP $httpCode\n";
        echo "📄 Response: " . substr($response, 0, 500) . "...\n";
    }
}

echo "\n=== RECOMMENDATIONS ===\n";
echo "1. If no tags data: php artisan db:seed --class=TagSeeder\n";
echo "2. If table missing: php artisan migrate\n";
echo "3. Check Laravel logs: tail -f storage/logs/laravel.log\n";
echo "4. Test API manually: curl -X GET $apiUrl\n";

