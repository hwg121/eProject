<?php
/**
 * Simple upload test script
 */

echo "Testing Cloudinary upload...\n";

// Test Cloudinary config
$configUrl = 'http://103.252.93.249/api/test/cloudinary';
$configResponse = file_get_contents($configUrl);
$configData = json_decode($configResponse, true);

echo "Cloudinary Config Test:\n";
echo "Success: " . ($configData['success'] ? 'YES' : 'NO') . "\n";
if ($configData['success']) {
    echo "Cloud Name: " . $configData['config']['cloud_name'] . "\n";
    echo "API Key: " . $configData['config']['api_key'] . "\n";
    echo "Initialized: " . ($configData['config']['cloudinary_initialized'] ? 'YES' : 'NO') . "\n";
} else {
    echo "Error: " . $configData['message'] . "\n";
}

echo "\n";

// Test upload
$testImagePath = __DIR__ . '/test.png';
if (!file_exists($testImagePath)) {
    // Create a simple test image
    $image = imagecreate(100, 100);
    $red = imagecolorallocate($image, 255, 0, 0);
    imagefill($image, 0, 0, $red);
    imagepng($image, $testImagePath);
    imagedestroy($image);
    echo "Created test image\n";
}

echo "Testing upload...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://103.252.93.249/api/test/upload/image');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'file' => new CURLFile($testImagePath, 'image/png', 'test.png'),
    'folder' => 'featured-images',
    'model_type' => 'video'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";

// Clean up
if (file_exists($testImagePath)) {
    unlink($testImagePath);
    echo "Cleaned up test image\n";
}

echo "Test completed!\n";
?>
