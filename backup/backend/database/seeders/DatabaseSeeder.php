<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Users first (required by other seeders)
            AdminUserSeeder::class, // Create admin & moderator users first
            UserSeeder::class,
            
            // Categories and Tags
            CategorySeeder::class,
            TagSeeder::class,
            
            // Content (requires categories, users)
            ArticleSeeder::class,
            VideoSeeder::class,
            ProductSeeder::class, // Unified products seeder
            
            // About Us components (new structure)
            HeroSectionSeeder::class,
            StaffMemberSeeder::class,
            MapSettingSeeder::class,
            ContactSettingSeeder::class,
            
            // Messages and Logs
            ContactMessageSeeder::class,
            ActivityLogSeeder::class, // Create activity logs last (requires users, articles, videos)
        ]);
    }
}