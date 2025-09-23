<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisitorStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VisitorController extends Controller
{
    public function increment(Request $request)
    {
        $ip = $request->ip();
        $ipHash = hash('sha256', $ip);
        $page = $request->get('page', '/');
        
        // Check if this IP has visited in the last hour
        $cacheKey = "visitor_{$ipHash}_{$page}";
        
        if (!Cache::has($cacheKey)) {
            // Record the visit
            VisitorStat::create([
                'ip_hash' => $ipHash,
                'page' => $page,
                'viewed_at' => now(),
                'meta_json' => json_encode([
                    'user_agent' => $request->userAgent(),
                    'referer' => $request->header('referer'),
                ])
            ]);
            
            // Cache for 1 hour
            Cache::put($cacheKey, true, 3600);
        }
        
        // Get total visitor count
        $totalVisitors = VisitorStat::distinct('ip_hash')->count();
        
        return response()->json([
            'total_visitors' => $totalVisitors,
            'message' => 'Visitor count updated'
        ]);
    }
}
