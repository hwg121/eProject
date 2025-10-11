<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['name' => 'Indoor Gardening', 'slug' => 'indoor-gardening', 'description' => 'Tips for indoor plant care'],
            ['name' => 'Outdoor Gardening', 'slug' => 'outdoor-gardening', 'description' => 'Outdoor garden maintenance'],
            ['name' => 'Plant Care', 'slug' => 'plant-care', 'description' => 'General plant care tips'],
            ['name' => 'Soil Management', 'slug' => 'soil-management', 'description' => 'Soil preparation and management'],
            ['name' => 'Watering', 'slug' => 'watering', 'description' => 'Proper watering techniques'],
            ['name' => 'Pruning', 'slug' => 'pruning', 'description' => 'Plant pruning and trimming'],
            ['name' => 'Fertilizing', 'slug' => 'fertilizing', 'description' => 'Fertilizer application'],
            ['name' => 'Pest Control', 'slug' => 'pest-control', 'description' => 'Managing garden pests'],
            ['name' => 'Seasonal Care', 'slug' => 'seasonal-care', 'description' => 'Season-specific care'],
            ['name' => 'Beginner Friendly', 'slug' => 'beginner-friendly', 'description' => 'Easy techniques for beginners'],
            ['name' => 'Advanced', 'slug' => 'advanced', 'description' => 'Advanced gardening techniques'],
            ['name' => 'Organic', 'slug' => 'organic', 'description' => 'Organic gardening methods'],
            ['name' => 'Succulents', 'slug' => 'succulents', 'description' => 'Succulent care'],
            ['name' => 'Vegetables', 'slug' => 'vegetables', 'description' => 'Vegetable gardening'],
            ['name' => 'Herbs', 'slug' => 'herbs', 'description' => 'Herb growing and care'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
