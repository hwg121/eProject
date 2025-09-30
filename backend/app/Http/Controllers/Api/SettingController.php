<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');
        
        return response()->json([
            'site_name' => $settings->get('site_name', 'Green Groves'),
            'site_description' => $settings->get('site_description', 'Website làm vườn quy mô nhỏ'),
            'contact_email' => $settings->get('contact_email', 'info@greengroves.com'),
            'contact_phone' => $settings->get('contact_phone', '+84 123 456 789'),
            'contact_address' => $settings->get('contact_address', '123 Đường ABC, Quận XYZ, TP.HCM'),
            'google_maps_api_key' => $settings->get('google_maps_api_key', ''),
            'youtube_api_key' => $settings->get('youtube_api_key', ''),
        ]);
    }
}

