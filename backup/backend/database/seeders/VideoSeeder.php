<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Video;
use App\Models\User;
use App\Models\Category;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $moderator = User::where('role', 'moderator')->first();
        $category = Category::where('slug', 'video')->first();

        $videos = [
            [
                'title' => 'Complete Beginner\'s Guide to Gardening',
                'slug' => 'complete-beginners-guide-gardening',
                'description' => 'Learn the basics of gardening from soil preparation to plant care.',
                'excerpt' => 'A comprehensive video tutorial for gardening beginners.',
                'instructor' => 'Sarah Green',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail' => null,
                'featured_image' => null,
                'cover' => null,
                'content' => '<h1>Complete Beginner\'s Guide to Gardening</h1><p>This comprehensive tutorial covers all the basics you need to start your gardening journey.</p><h2>What You\'ll Learn</h2><ul><li>Soil preparation techniques</li><li>Plant selection and placement</li><li>Watering and fertilizing</li><li>Common problems and solutions</li></ul>',
                'category' => 'Video',
                'status' => 'published',
                'views' => 2150,
                'likes' => 156,
                'duration' => 1800, // 30 minutes
                'is_featured' => true,
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Indoor Plant Care Masterclass',
                'slug' => 'indoor-plant-care-masterclass',
                'description' => 'Master the art of indoor plant care with this detailed video guide.',
                'excerpt' => 'Advanced techniques for keeping indoor plants healthy and thriving.',
                'instructor' => 'Dr. Plant Expert',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail' => null,
                'featured_image' => null,
                'cover' => null,
                'content' => '<h1>Indoor Plant Care Masterclass</h1><p>Advanced techniques for indoor plant enthusiasts.</p><h2>Topics Covered</h2><ul><li>Light requirements and positioning</li><li>Humidity management</li><li>Fertilizer application</li><li>Pest prevention</li></ul>',
                'category' => 'Video',
                'status' => 'published',
                'views' => 1890,
                'likes' => 134,
                'duration' => 2400, // 40 minutes
                'is_featured' => false,
                'category_id' => $category->id,
                'author_id' => $moderator->id,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Organic Vegetable Gardening Techniques',
                'slug' => 'organic-vegetable-gardening-techniques',
                'description' => 'Learn sustainable methods for growing organic vegetables.',
                'excerpt' => 'Sustainable gardening practices for organic vegetable production.',
                'instructor' => 'Green Thumb Mike',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail' => null,
                'featured_image' => null,
                'cover' => null,
                'content' => '<h1>Organic Vegetable Gardening Techniques</h1><p>Sustainable methods for growing healthy, organic vegetables.</p><h2>Key Techniques</h2><ul><li>Compost preparation</li><li>Companion planting</li><li>Natural pest control</li><li>Soil health maintenance</li></ul>',
                'category' => 'Video',
                'status' => 'published',
                'views' => 1650,
                'likes' => 98,
                'duration' => 2700, // 45 minutes
                'is_featured' => true,
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Pruning and Training Fruit Trees',
                'slug' => 'pruning-training-fruit-trees',
                'description' => 'Step-by-step guide to pruning and training fruit trees for maximum yield.',
                'excerpt' => 'Expert techniques for fruit tree maintenance and training.',
                'instructor' => 'Orchard Master',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail' => null,
                'featured_image' => null,
                'cover' => null,
                'content' => '<h1>Pruning and Training Fruit Trees</h1><p>Expert techniques for maintaining healthy, productive fruit trees.</p><h2>Training Methods</h2><ul><li>Espalier techniques</li><li>Central leader training</li><li>Open center pruning</li><li>Seasonal maintenance</li></ul>',
                'category' => 'Video',
                'status' => 'published',
                'views' => 1420,
                'likes' => 87,
                'duration' => 2100, // 35 minutes
                'is_featured' => false,
                'category_id' => $category->id,
                'author_id' => $moderator->id,
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Container Gardening for Small Spaces',
                'slug' => 'container-gardening-small-spaces',
                'description' => 'Maximize your small space with creative container gardening solutions.',
                'excerpt' => 'Creative container gardening ideas for urban dwellers.',
                'instructor' => 'Urban Gardener',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail' => null,
                'featured_image' => null,
                'cover' => null,
                'content' => '<h1>Container Gardening for Small Spaces</h1><p>Creative solutions for gardening in limited spaces.</p><h2>Container Options</h2><ul><li>Vertical gardening systems</li><li>Hanging baskets</li><li>Window boxes</li><li>Raised bed alternatives</li></ul>',
                'category' => 'Video',
                'status' => 'draft',
                'views' => 0,
                'likes' => 0,
                'duration' => 1800, // 30 minutes
                'is_featured' => false,
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'published_at' => null,
            ],
        ];

        foreach ($videos as $video) {
            Video::create($video);
        }
    }
}
