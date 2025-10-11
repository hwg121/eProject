<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ContactSetting;

class ContactSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContactSetting::create([
            'email' => 'info@greengroves.com',
            'phone' => '+84 123 456 789',
            'address' => '123 Garden Street, District 1, Ho Chi Minh City, Vietnam',
            'website' => 'https://greengroves.com',
            'facebook' => 'https://facebook.com/greengroves',
            'instagram' => 'https://instagram.com/greengroves',
            'youtube' => 'https://youtube.com/@greengroves',
            'linkedin' => 'https://linkedin.com/company/greengroves',
            'working_hours' => 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 5:00 PM',
            'is_active' => true
        ]);
    }
}
