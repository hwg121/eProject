<?php
// Script to check products in database

require_once 'vendor/autoload.php';

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;

echo "=== CHECKING PRODUCTS IN DATABASE ===\n\n";

try {
    // Get all products
    $allProducts = Product::all();
    echo "Total products in database: " . $allProducts->count() . "\n\n";
    
    // Count by status
    $published = Product::where('status', 'published')->count();
    $archived = Product::where('status', 'archived')->count();
    
    echo "Published products: {$published}\n";
    echo "Archived products: {$archived}\n\n";
    
    // Show archived products details
    if ($archived > 0) {
        echo "=== ARCHIVED PRODUCTS DETAILS ===\n";
        $archivedProducts = Product::where('status', 'archived')->get();
        foreach ($archivedProducts as $product) {
            echo "ID: {$product->id}, Name: {$product->name}, Status: {$product->status}, Category: {$product->category}\n";
        }
    } else {
        echo "❌ NO ARCHIVED PRODUCTS FOUND!\n";
    }
    
    // Show published products details
    echo "\n=== PUBLISHED PRODUCTS DETAILS ===\n";
    $publishedProducts = Product::where('status', 'published')->get();
    foreach ($publishedProducts as $product) {
        echo "ID: {$product->id}, Name: {$product->name}, Status: {$product->status}, Category: {$product->category}\n";
    }
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== CHECK COMPLETED ===\n";
?>



