<?php
// Test visitor tracking debug
// Chạy file này để test API visitor

$url = 'https://greengroves.blog/api/visitor-counter';
$data = ['page' => '/test'];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response: " . $result . "\n";

// Test visitor stats
$stats_url = 'https://greengroves.blog/api/visitor-stats';
$stats_result = file_get_contents($stats_url);

echo "Stats Response: " . $stats_result . "\n";
?>
