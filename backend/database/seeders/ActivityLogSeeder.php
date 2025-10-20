<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Article;
use App\Models\Video;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->info('No admin user found. Skipping ActivityLogSeeder.');
            return;
        }

        // Create some security activities (logins)
        $securityActivities = [
            [
                'user_id' => $admin->id,
                'user_name' => $admin->name,
                'user_ip' => '192.168.1.100',
                'activity_type' => 'security',
                'action' => 'login',
                'entity_type' => 'user',
                'entity_id' => $admin->id,
                'entity_name' => $admin->name,
                'description' => "{$admin->name} logged in",
                'metadata' => json_encode([
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                    'ip_address' => '192.168.1.100'
                ]),
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'user_id' => $admin->id,
                'user_name' => $admin->name,
                'user_ip' => '192.168.1.100',
                'activity_type' => 'security',
                'action' => 'login',
                'entity_type' => 'user',
                'entity_id' => $admin->id,
                'entity_name' => $admin->name,
                'description' => "{$admin->name} logged in",
                'metadata' => json_encode([
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                    'ip_address' => '192.168.1.100'
                ]),
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
            ],
        ];

        foreach ($securityActivities as $activity) {
            ActivityLog::create($activity);
        }

        // Create some public activities (content management)
        $articles = Article::take(3)->get();
        $videos = Video::take(2)->get();

        // Article activities
        foreach ($articles as $index => $article) {
            ActivityLog::create([
                'user_id' => $admin->id,
                'user_name' => $admin->name,
                'user_ip' => '192.168.1.100',
                'activity_type' => 'public',
                'action' => 'created',
                'entity_type' => 'article',
                'entity_id' => $article->id,
                'entity_name' => $article->title,
                'description' => "{$admin->name} created article: {$article->title}",
                'metadata' => json_encode([
                    'status' => $article->status
                ]),
                'created_at' => now()->subHours(5 - $index),
                'updated_at' => now()->subHours(5 - $index),
            ]);

            if ($index === 0) {
                // Update activity for first article
                ActivityLog::create([
                    'user_id' => $admin->id,
                    'user_name' => $admin->name,
                    'user_ip' => '192.168.1.100',
                    'activity_type' => 'public',
                    'action' => 'updated',
                    'entity_type' => 'article',
                    'entity_id' => $article->id,
                    'entity_name' => $article->title,
                    'description' => "{$admin->name} updated article: {$article->title}",
                    'metadata' => json_encode([
                        'status' => $article->status,
                        'changed_fields' => ['title', 'content', 'status']
                    ]),
                    'created_at' => now()->subMinutes(45),
                    'updated_at' => now()->subMinutes(45),
                ]);
            }
        }

        // Video activities
        foreach ($videos as $index => $video) {
            ActivityLog::create([
                'user_id' => $admin->id,
                'user_name' => $admin->name,
                'user_ip' => '192.168.1.100',
                'activity_type' => 'public',
                'action' => 'created',
                'entity_type' => 'video',
                'entity_id' => $video->id,
                'entity_name' => $video->title,
                'description' => "{$admin->name} uploaded video: {$video->title}",
                'metadata' => json_encode([
                    'status' => $video->status
                ]),
                'created_at' => now()->subHours(3 - $index),
                'updated_at' => now()->subHours(3 - $index),
            ]);
        }

        // Add a user creation activity
        $moderator = User::where('role', 'moderator')->first();
        if ($moderator) {
            ActivityLog::create([
                'user_id' => $admin->id,
                'user_name' => $admin->name,
                'user_ip' => '192.168.1.100',
                'activity_type' => 'security',
                'action' => 'created',
                'entity_type' => 'user',
                'entity_id' => $moderator->id,
                'entity_name' => $moderator->name,
                'description' => "{$admin->name} created user {$moderator->name}",
                'metadata' => json_encode([
                    'user_email' => $moderator->email,
                    'user_role' => $moderator->role,
                    'user_status' => $moderator->status
                ]),
                'created_at' => now()->subHours(10),
                'updated_at' => now()->subHours(10),
            ]);
        }

        $this->command->info('ActivityLog seeder completed successfully!');
    }
}



