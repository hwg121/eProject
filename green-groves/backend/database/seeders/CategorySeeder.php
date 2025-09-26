<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Trồng trọt',
                'slug' => 'trong-trot',
            ],
            [
                'name' => 'Chăm sóc',
                'slug' => 'cham-soc',
            ],
            [
                'name' => 'Dụng cụ',
                'slug' => 'dung-cu',
            ],
            [
                'name' => 'Hướng dẫn',
                'slug' => 'huong-dan',
            ],
            [
                'name' => 'Sách',
                'slug' => 'sach',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
