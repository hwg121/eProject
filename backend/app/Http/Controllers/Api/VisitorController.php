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
        // Get real public IP address
        $ip = $request->header('CF-Connecting-IP') ?? // Cloudflare
              $request->header('X-Forwarded-For') ?? // Load balancer
              $request->header('X-Real-IP') ??       // Nginx proxy
              $request->ip();                        // Fallback
        
        // Handle comma-separated IPs (X-Forwarded-For can have multiple)
        $ip = explode(',', $ip)[0];
        $ip = trim($ip);
        
        $ipHash = hash('sha256', $ip);
        $page = $request->get('page', '/');
        $today = now()->format('Y-m-d');
        
        // Check if this IP has visited TODAY (not just 1 hour)
        $cacheKey = "visitor_{$ipHash}_{$today}";
        
        if (!Cache::has($cacheKey)) {
            // Record the visit
            VisitorStat::create([
                'ip_hash' => $ipHash,
                'page' => $page,
                'viewed_at' => now(),
                'meta_json' => json_encode([
                    'user_agent' => $request->userAgent(),
                    'referer' => $request->header('referer'),
                    'real_ip' => $ip, // Debug: store actual IP for verification
                    'cf_ip' => $request->header('CF-Connecting-IP'),
                    'forwarded_for' => $request->header('X-Forwarded-For'),
                    'real_ip_header' => $request->header('X-Real-IP'),
                    'fallback_ip' => $request->ip(),
                ])
            ]);
            
            // Cache for 24 hours (until end of day)
            $secondsUntilMidnight = now()->endOfDay()->diffInSeconds(now());
            Cache::put($cacheKey, true, $secondsUntilMidnight);
        }
        
        // Get total unique visitors (all time)
        $totalVisitors = VisitorStat::distinct('ip_hash')->count();
        
        // Get today's unique visitors
        $todayVisitors = VisitorStat::whereDate('viewed_at', $today)
            ->distinct('ip_hash')
            ->count();
        
        return response()->json([
            'success' => true,
            'total_visitors' => $totalVisitors,
            'today_visitors' => $todayVisitors,
            'message' => 'Visitor count updated'
        ]);
    }
    
    public function getStats()
    {
        try {
            $today = now()->format('Y-m-d');
            
            // Total unique visitors (all time)
            $totalVisitors = VisitorStat::distinct('ip_hash')->count();
            
            // Today's unique visitors
            $todayVisitors = VisitorStat::whereDate('viewed_at', $today)
                ->distinct('ip_hash')
                ->count();
            
            // Online users (visited in last 5 minutes)
            $onlineUsers = VisitorStat::where('viewed_at', '>=', now()->subMinutes(5))
                ->distinct('ip_hash')
                ->count();
            
            return response()->json([
                'success' => true,
                'total_visitors' => $totalVisitors,
                'today_visitors' => $todayVisitors,
                'online_users' => $onlineUsers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching visitor stats'
            ], 500);
        }
    }
}

