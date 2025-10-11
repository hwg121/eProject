<?php
/**
 * Simple test script to test image upload
 * This script creates a test image and uploads it
 */

// Test image upload endpoint
$testImagePath = __DIR__ . '/test_simple.png';
$apiUrl = 'http://103.252.93.249/api/test/upload/image';

// Create a simple test image
if (!file_exists($testImagePath)) {
    // Create a 50x50 red PNG
    $image = imagecreate(50, 50);
    $red = imagecolorallocate($image, 255, 0, 0);
    imagefill($image, 0, 0, $red);
    imagepng($image, $testImagePath);
    imagedestroy($image);
    echo "Created test image: $testImagePath\n";
}

echo "Testing upload endpoint: $apiUrl\n";

// Test upload
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'file' => new CURLFile($testImagePath, 'image/png', 'test_simple.png'),
    'folder' => 'featured-images',
    'model_type' => 'video'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json'
]);

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
