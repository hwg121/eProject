<?php
// Test script to check tag slug and API response

require_once 'vendor/autoload.php';

// Load Laravel app
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Tag;

echo "🔍 Testing Tag Slug: indoor-gardening\n";
echo "=====================================\n\n";

try {
    // 1. Check if tag exists in database
    $tag = Tag::where('slug', 'indoor-gardening')->first();
    
    if ($tag) {
        echo "✅ Tag found in database:\n";
        echo "   ID: {$tag->id}\n";
        echo "   Name: {$tag->name}\n";
        echo "   Slug: {$tag->slug}\n";
        echo "   Description: " . ($tag->description ?: 'NULL') . "\n";
        echo "   Created: {$tag->created_at}\n";
        echo "   Updated: {$tag->updated_at}\n\n";
        
        // 2. Check content counts
        $articlesCount = $tag->articles()->count();
        $videosCount = $tag->videos()->count();
        $productsCount = $tag->products()->count();
        $totalCount = $articlesCount + $videosCount + $productsCount;
        
        echo "📊 Content counts:\n";
        echo "   Articles: {$articlesCount}\n";
        echo "   Videos: {$videosCount}\n";
        echo "   Products: {$productsCount}\n";
        echo "   Total: {$totalCount}\n\n";
        
        // 3. Check articles with this tag
        if ($articlesCount > 0) {
            echo "📝 Articles with this tag:\n";
            $articles = $tag->articles()->get();
            foreach ($articles as $article) {
                echo "   - ID: {$article->id}, Title: {$article->title}, Status: {$article->status}\n";
            }
            echo "\n";
        }
        
        // 4. Test API response format
        echo "🌐 Testing API response format:\n";
        $tag->articles_count = $articlesCount;
        $tag->videos_count = $videosCount;
        $tag->products_count = $productsCount;
        $tag->total_count = $totalCount;
        
        $apiResponse = [
            'success' => true,
            'data' => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'description' => $tag->description,
                'articles_count' => $articlesCount,
                'videos_count' => $videosCount,
                'products_count' => $productsCount,
                'total_count' => $totalCount,
                'created_at' => $tag->created_at,
                'updated_at' => $tag->updated_at,
            ]
        ];
        
        echo json_encode($apiResponse, JSON_PRETTY_PRINT) . "\n\n";
        
    } else {
        echo "❌ Tag 'indoor-gardening' NOT found in database!\n\n";
        
        // Check all tags to see what's available
        echo "🔍 All available tags:\n";
        $allTags = Tag::all();
        foreach ($allTags as $t) {
            echo "   - ID: {$t->id}, Name: {$t->name}, Slug: {$t->slug}\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n🔍 Test completed.\n";
