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

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'site_name' => 'sometimes|string|max:255',
                'site_description' => 'sometimes|string',
                'contact_email' => 'sometimes|email',
                'contact_phone' => 'sometimes|string|max:20',
                'contact_address' => 'sometimes|string',
                'google_maps_api_key' => 'sometimes|string',
                'youtube_api_key' => 'sometimes|string',
            ]);

            foreach ($validated as $key => $value) {
                SiteSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => $validated
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating settings: ' . $e->getMessage()
            ], 500);
        }
    }
}

