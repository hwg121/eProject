<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisitorStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
            
            // Average visits per visitor (total records / unique IPs)
            $totalRecords = VisitorStat::count();
            $avgVisitsPerVisitor = $totalVisitors > 0 
                ? round($totalRecords / $totalVisitors, 1) 
                : 0;
            
            return response()->json([
                'success' => true,
                'total_visitors' => $totalVisitors,
                'today_visitors' => $todayVisitors,
                'online_users' => $onlineUsers,
                'avg_visits_per_visitor' => $avgVisitsPerVisitor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching visitor stats'
            ], 500);
        }
    }
    
    public function index(Request $request)
    {
        try {
            $perPage = min($request->get('per_page', 50), 100);
            $today = now()->format('Y-m-d');
            $fiveMinutesAgo = now()->subMinutes(5);
            
            // OPTIMIZED: Use raw SQL for better performance
            // Get latest visit for each unique IP with visit counts
            $sql = "
                SELECT 
                    vs.*,
                    (SELECT COUNT(*) FROM visitor_stats WHERE ip_hash = vs.ip_hash) as visit_count
                FROM visitor_stats vs
                WHERE vs.id IN (
                    SELECT MAX(id) 
                    FROM visitor_stats 
                    GROUP BY ip_hash
                )
                ORDER BY vs.viewed_at DESC
            ";
            
            // Get total count for pagination
            $totalSql = "SELECT COUNT(DISTINCT ip_hash) as total FROM visitor_stats";
            $totalResult = DB::selectOne($totalSql);
            $total = $totalResult->total ?? 0;
            
            // Calculate pagination
            $currentPage = $request->get('page', 1);
            $offset = ($currentPage - 1) * $perPage;
            $lastPage = ceil($total / $perPage);
            
            // Execute query with pagination
            $results = DB::select($sql . " LIMIT ? OFFSET ?", [$perPage, $offset]);
            
            // Transform data
            $transformedData = collect($results)->map(function ($visitor) use ($today, $fiveMinutesAgo) {
                $meta = json_decode($visitor->meta_json, true) ?? [];
                $viewedAt = \Carbon\Carbon::parse($visitor->viewed_at);
                $isOnline = $viewedAt >= $fiveMinutesAgo;
                $isToday = $viewedAt->format('Y-m-d') === $today;
                
                return [
                    'id' => $visitor->ip_hash,
                    'ip_hash' => substr($visitor->ip_hash, 0, 12) . '...', // Shortened for privacy
                    'page' => $visitor->page ?? '/',
                    'user_agent' => $meta['user_agent'] ?? 'Unknown',
                    'referer' => $meta['referer'] ?? 'Direct',
                    'last_visit' => $viewedAt->toIso8601String(),
                    'visit_count' => $visitor->visit_count ?? 1,
                    'is_online' => $isOnline,
                    'is_today' => $isToday
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedData,
                'meta' => [
                    'current_page' => (int) $currentPage,
                    'last_page' => (int) $lastPage,
                    'per_page' => $perPage,
                    'total' => $total
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('VisitorController::index failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching visitors: ' . $e->getMessage()
            ], 500);
        }
    }
}

