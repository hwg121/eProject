<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technique',
                'slug' => 'technique',
                'description' => 'Gardening techniques and methods',
                'image' => null,
            ],
            [
                'name' => 'Video',
                'slug' => 'video',
                'description' => 'Video tutorials and guides',
                'image' => null,
            ],
            [
                'name' => 'Book',
                'slug' => 'book',
                'description' => 'Books and reading materials',
                'image' => null,
            ],
            [
                'name' => 'Tool',
                'slug' => 'tool',
                'description' => 'Gardening tools and equipment',
                'image' => null,
            ],
            [
                'name' => 'Pot',
                'slug' => 'pot',
                'description' => 'Plant pots and containers',
                'image' => null,
            ],
            [
                'name' => 'Accessory',
                'slug' => 'accessory',
                'description' => 'Gardening accessories',
                'image' => null,
            ],
            [
                'name' => 'Suggestion',
                'slug' => 'suggestion',
                'description' => 'Plant care suggestions and tips',
                'image' => null,
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']], // Find by slug
                $category // Create with these attributes if not found
            );
        }
    }
}
