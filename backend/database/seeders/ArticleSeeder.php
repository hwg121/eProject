<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\User;
use App\Models\Category;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $moderator = User::where('role', 'moderator')->first();
        $category = Category::where('slug', 'technique')->first();

        $articles = [
            [
                'title' => 'Essential Indoor Plant Care Guide',
                'slug' => 'essential-indoor-plant-care-guide',
                'excerpt' => 'Learn the fundamentals of keeping your indoor plants healthy and thriving.',
                'description' => 'A comprehensive guide to indoor plant care covering watering, lighting, and common issues.',
                'body' => 'Indoor plants can transform any space into a vibrant, living environment...',
                'content' => '<h1>Essential Indoor Plant Care Guide</h1><p>Indoor plants can transform any space into a vibrant, living environment. However, they require proper care to thrive. Here are the essential tips for indoor plant care:</p><h2>Lighting Requirements</h2><p>Most indoor plants need bright, indirect light. Place them near windows but avoid direct sunlight which can scorch leaves.</p><h2>Watering Techniques</h2><p>Water when the top inch of soil feels dry. Overwatering is the most common cause of plant death.</p><h2>Humidity and Temperature</h2><p>Maintain consistent temperature and consider humidity levels for tropical plants.</p>',
                'featured_image' => null,
                'cover' => null,
                'category' => 'Technique',
                'status' => 'published',
                'views' => 1250,
                'likes' => 89,
                'is_featured' => true,
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Soil Preparation for Vegetable Gardens',
                'slug' => 'soil-preparation-vegetable-gardens',
                'excerpt' => 'Master the art of soil preparation for bountiful vegetable harvests.',
                'description' => 'Step-by-step guide to preparing soil for vegetable gardening.',
                'body' => 'Good soil is the foundation of a successful vegetable garden...',
                'content' => '<h1>Soil Preparation for Vegetable Gardens</h1><p>Good soil is the foundation of a successful vegetable garden. Here\'s how to prepare your soil:</p><h2>Soil Testing</h2><p>Start by testing your soil pH and nutrient levels.</p><h2>Amending the Soil</h2><p>Add organic matter like compost to improve soil structure and fertility.</p><h2>Drainage</h2><p>Ensure proper drainage to prevent waterlogged roots.</p>',
                'featured_image' => null,
                'cover' => null,
                'category' => 'Technique',
                'status' => 'published',
                'views' => 980,
                'likes' => 67,
                'is_featured' => false,
                'category_id' => $category->id,
                'author_id' => $moderator->id,
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Pruning Techniques for Fruit Trees',
                'slug' => 'pruning-techniques-fruit-trees',
                'excerpt' => 'Learn proper pruning techniques to maximize fruit production.',
                'description' => 'Comprehensive guide to pruning fruit trees for optimal growth and yield.',
                'body' => 'Proper pruning is essential for healthy fruit trees...',
                'content' => '<h1>Pruning Techniques for Fruit Trees</h1><p>Proper pruning is essential for healthy fruit trees and maximum yield. Here are the key techniques:</p><h2>When to Prune</h2><p>Prune during dormancy in late winter or early spring.</p><h2>Basic Pruning Cuts</h2><p>Learn the difference between heading cuts and thinning cuts.</p><h2>Tree Shape</h2><p>Maintain an open center for better air circulation and light penetration.</p>',
                'featured_image' => null,
                'cover' => null,
                'category' => 'Technique',
                'status' => 'published',
                'views' => 756,
                'likes' => 45,
                'is_featured' => false,
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Organic Pest Control Methods',
                'slug' => 'organic-pest-control-methods',
                'excerpt' => 'Natural ways to control garden pests without harmful chemicals.',
                'description' => 'Environmentally friendly pest control methods for your garden.',
                'body' => 'Organic pest control is safer for your family and the environment...',
                'content' => '<h1>Organic Pest Control Methods</h1><p>Organic pest control is safer for your family and the environment. Here are effective natural methods:</p><h2>Companion Planting</h2><p>Plant herbs and flowers that repel pests naturally.</p><h2>Beneficial Insects</h2><p>Attract beneficial insects like ladybugs and lacewings.</p><h2>Natural Sprays</h2><p>Make your own organic sprays using neem oil or soap solutions.</p>',
                'featured_image' => null,
                'cover' => null,
                'category' => 'Technique',
                'status' => 'published',
                'views' => 1120,
                'likes' => 78,
                'is_featured' => true,
                'category_id' => $category->id,
                'author_id' => $moderator->id,
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Watering Schedules for Different Plants',
                'slug' => 'watering-schedules-different-plants',
                'excerpt' => 'Understanding watering needs for various plant types.',
                'description' => 'Learn how to water different types of plants effectively.',
                'body' => 'Different plants have different watering requirements...',
                'content' => '<h1>Watering Schedules for Different Plants</h1><p>Different plants have different watering requirements. Here\'s how to water effectively:</p><h2>Succulents and Cacti</h2><p>Water sparingly, allowing soil to dry completely between waterings.</p><h2>Tropical Plants</h2><p>Keep soil consistently moist but not waterlogged.</p><h2>Vegetables</h2><p>Deep, infrequent watering encourages strong root development.</p>',
                'featured_image' => null,
                'cover' => null,
                'category' => 'Technique',
                'status' => 'draft',
                'views' => 0,
                'likes' => 0,
                'is_featured' => false,
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'published_at' => null,
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
