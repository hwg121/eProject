<?php

namespace Database\Seeders;

use App\Models\MapSetting;
use Illuminate\Database\Seeder;

class MapSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MapSetting::create([
            'embed_url' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325113983561!2d106.66420897451814!3d10.786834589362443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed23c8d0f0b%3A0x82578a88900bedb0!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1696000000000!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            'location_name' => 'Green Groves Office',
            'address' => 'Ben Thanh Market Area, District 1, Ho Chi Minh City, Vietnam',
            'is_active' => true,
        ]);
    }
}

