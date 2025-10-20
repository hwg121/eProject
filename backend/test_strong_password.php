<?php

// Test StrongPassword regex pattern

$pattern = '/[!@#$%^&*()\[\]{}<>,.?":;|_+=\-\/\\\\`~\']/';

$testPasswords = [
    'Test123!',      // Valid - has special char !
    'Test123@',      // Valid - has special char @
    'Test123#',      // Valid - has special char #
    'Test123$',      // Valid - has special char $
    'Test123/',      // Valid - has special char /
    'Test123\\',     // Valid - has special char \
    'Test123~',      // Valid - has special char ~
    'Test123',       // Invalid - no special char
];

echo "Testing StrongPassword regex pattern:\n";
echo "Pattern: $pattern\n\n";

foreach ($testPasswords as $password) {
    $match = preg_match($pattern, $password);
    $status = $match ? '✓ VALID' : '✗ INVALID';
    echo "$status: '$password'\n";
}

// Test for regex errors
$error = preg_last_error();
if ($error !== PREG_NO_ERROR) {
    echo "\n❌ PREG ERROR: " . $error . "\n";
    switch ($error) {
        case PREG_INTERNAL_ERROR:
            echo "Internal PCRE error\n";
            break;
        case PREG_BACKTRACK_LIMIT_ERROR:
            echo "Backtrack limit exhausted\n";
            break;
        case PREG_RECURSION_LIMIT_ERROR:
            echo "Recursion limit exhausted\n";
            break;
        case PREG_BAD_UTF8_ERROR:
            echo "Bad UTF8 error\n";
            break;
        case PREG_BAD_UTF8_OFFSET_ERROR:
            echo "Bad UTF8 offset error\n";
            break;
        default:
            echo "Unknown error\n";
    }
} else {
    echo "\n✓ No regex errors!\n";
}

