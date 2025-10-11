<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    /**
     * Get all activity logs (for admin)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 50);
            $activityType = $request->input('activity_type'); // 'public' or 'security'
            
            $query = ActivityLog::query();
            
            if ($activityType && in_array($activityType, ['public', 'security'])) {
                $query->where('activity_type', $activityType);
            }
            
            $logs = $query->with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $logs->items(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch activity logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get public activities (content-related)
     */
    public function getPublicActivities(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 20);
            
            $logs = ActivityLog::publicActivities()
                ->with('user:id,name,email')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch public activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get security activities (login, user management)
     */
    public function getSecurityActivities(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 20);
            
            $logs = ActivityLog::securityActivities()
                ->with('user:id,name,email')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch security activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities (mixed)
     */
    public function getRecentActivities(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 20);
            
            $logs = ActivityLog::recent($limit)
                ->with('user:id,name,email')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear old activity logs (optional - for maintenance)
     */
    public function clearOldLogs(Request $request): JsonResponse
    {
        try {
            $days = $request->input('days', 90); // Default: keep last 90 days
            
            $deletedCount = ActivityLog::where('created_at', '<', now()->subDays($days))
                ->delete();

            return response()->json([
                'success' => true,
                'message' => "Deleted $deletedCount old activity logs",
                'deleted_count' => $deletedCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear old logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


