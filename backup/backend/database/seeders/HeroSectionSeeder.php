<?php

namespace Database\Seeders;

use App\Models\HeroSection;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HeroSection::create([
            'title' => 'Welcome to Green Groves',
            'description' => 'Your trusted companion on the journey to explore the wonderful world of gardening. We provide in-depth knowledge, practical tips, and a passionate community to help you create and care for your own green garden.',
            'is_active' => true,
        ]);
    }
}

