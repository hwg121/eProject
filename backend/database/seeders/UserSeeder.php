<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@greengroves.com'],
            [
                'name' => 'Admin User',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'phone' => '123 456 7890',
                'phone_country_code' => 'US',
                'country' => 'US',
                'address' => '123 Garden Street',
                'city' => 'Garden City',
                'zip_code' => '12345',
                'bio' => 'Administrator of Green Groves platform',
                'avatar' => null,
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // Create moderator user
        User::firstOrCreate(
            ['email' => 'moderator@greengroves.com'],
            [
                'name' => 'Moderator User',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'phone' => '123 456 7891',
                'phone_country_code' => 'US',
                'country' => 'US',
                'address' => '456 Plant Avenue',
                'city' => 'Plant City',
                'zip_code' => '54321',
                'bio' => 'Content moderator for Green Groves',
                'avatar' => null,
                'role' => 'moderator',
                'status' => 'active',
            ]
        );

        // Create regular users
        for ($i = 1; $i <= 10; $i++) {
            User::firstOrCreate(
                ['email' => "user{$i}@example.com"],
                [
                    'name' => "User {$i}",
                    'email_verified_at' => now(),
                    'password' => Hash::make('password123'),
                    'phone' => "123 456 789{$i}",
                    'phone_country_code' => 'VN',
                    'country' => 'VN',
                    'address' => "{$i}00 Garden Lane",
                    'city' => 'Ho Chi Minh City',
                    'zip_code' => '1234' . $i,
                    'bio' => "Gardening enthusiast user {$i}",
                    'avatar' => null,
                    'role' => 'moderator',
                    'status' => 'active',
                ]
            );
        }

        // Create some banned users
        for ($i = 1; $i <= 2; $i++) {
            User::firstOrCreate(
                ['email' => "banned{$i}@example.com"],
                [
                    'name' => "Banned User {$i}",
                    'email_verified_at' => now(),
                    'password' => Hash::make('password123'),
                    'phone' => "123 456 780{$i}",
                    'phone_country_code' => 'VN',
                    'country' => 'VN',
                    'address' => "{$i}00 Banned Street",
                    'city' => 'Hanoi',
                    'zip_code' => '9999' . $i,
                    'bio' => "Banned user {$i}",
                    'avatar' => null,
                    'role' => 'moderator',
                    'status' => 'banned',
                ]
            );
        }
    }
}
