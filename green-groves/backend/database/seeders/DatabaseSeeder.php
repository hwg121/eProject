<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Run custom seeders
        $this->call([
            CategorySeeder::class,
            ArticleSeeder::class,
            ToolSeeder::class,
            VideoSeeder::class,
            BookSeeder::class,
            EssentialSeeder::class,
            PotSeeder::class,
            AccessorySeeder::class,
            SuggestionSeeder::class,
            AboutUsSeeder::class,
        ]);
    }
}
