<?php
// Quick test script to check if video update works

$baseUrl = 'http://localhost/backend/public/api'; // Adjust as needed
$videoId = 1;

echo "=== QUICK TEST FOR VIDEO UPDATE ===\n\n";

// Test 1: Try test route without auth
echo "Test 1: Using test route without authentication\n";
$testData = [
    'title' => 'Quick Test Video',
    'featured_image' => 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    'status' => 'published',
    '_method' => 'PUT'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "{$baseUrl}/test/videos/{$videoId}/update");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: {$httpCode}\n";
echo "Response: {$response}\n\n";

if ($httpCode === 200) {
    echo "✅ SUCCESS! Video update is working.\n";
    $result = json_decode($response, true);
    if ($result && isset($result['data']['featured_image'])) {
        echo "✅ Featured image: {$result['data']['featured_image']}\n";
    }
} else {
    echo "❌ FAILED! Check the response above.\n";
}

echo "\n=== TEST COMPLETED ===\n";
?>
