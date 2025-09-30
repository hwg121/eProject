<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GeolocationController extends Controller
{
    public function getLocation(Request $request)
    {
        // In a real app, you would use a geolocation service
        // For now, return a default location
        return response()->json([
            'city' => 'Hồ Chí Minh',
            'country' => 'Việt Nam',
            'latitude' => 10.8231,
            'longitude' => 106.6297,
            'timezone' => 'Asia/Ho_Chi_Minh'
        ]);
    }
}

