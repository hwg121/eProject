<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $adminExists = User::where('email', 'admin@greengroves.com')->exists();
        
        if (!$adminExists) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@greengroves.com',
                'password' => Hash::make('admin123'), // Change this in production!
                'role' => 'admin',
                'status' => 'active',
                'phone' => '0123456789',
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('✅ Admin user created successfully!');
            $this->command->info('📧 Email: admin@greengroves.com');
            $this->command->info('🔑 Password: admin123');
            $this->command->warn('⚠️  Please change this password after first login!');
        } else {
            $this->command->info('ℹ️  Admin user already exists, skipping...');
        }
        
        // Create a moderator for testing
        $moderatorExists = User::where('email', 'moderator@greengroves.com')->exists();
        
        if (!$moderatorExists) {
            User::create([
                'name' => 'Moderator',
                'email' => 'moderator@greengroves.com',
                'password' => Hash::make('moderator123'), // Change this in production!
                'role' => 'moderator',
                'status' => 'active',
                'phone' => '0987654321',
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('✅ Moderator user created successfully!');
            $this->command->info('📧 Email: moderator@greengroves.com');
            $this->command->info('🔑 Password: moderator123');
        } else {
            $this->command->info('ℹ️  Moderator user already exists, skipping...');
        }
    }
}
