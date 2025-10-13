<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CampaignSetting;
use App\Models\VisitorStat;
use App\Models\Article;
use App\Models\Video;
use App\Models\Product;
use App\Models\UserInteraction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CampaignSettingController extends Controller
{
    /**
     * Display a listing of campaign settings
     */
    public function index(): JsonResponse
    {
        try {
            $settings = CampaignSetting::orderBy('metric_name')->get();
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch campaign settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified campaign setting
     */
    public function show(string $metric): JsonResponse
    {
        try {
            $setting = CampaignSetting::getByMetric($metric);
            
            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign setting not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch campaign setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified campaign setting
     */
    public function update(Request $request, string $metric): JsonResponse
    {
        try {
            $setting = CampaignSetting::getByMetric($metric);
            
            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign setting not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'goal_value' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $newGoal = (float) $request->input('goal_value');
            
            // Check if we should reset baseline (>30% change)
            if ($setting->shouldResetBaseline($newGoal)) {
                // Get current value for this metric
                $currentValue = $this->getCurrentValue($metric);
                
                $setting->baseline_value = $currentValue;
                $setting->baseline_captured_at = now();
            }
            
            // Update goal value
            $setting->goal_value = $newGoal;
            $setting->save();

            return response()->json([
                'success' => true,
                'message' => 'Campaign setting updated successfully',
                'data' => $setting
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update campaign setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get stats overview with campaign data
     */
    public function getStatsOverview(): JsonResponse
    {
        try {
            $stats = [];

            foreach (CampaignSetting::getMetricNames() as $metric) {
                $setting = CampaignSetting::getByMetric($metric);
                
                // Create setting if it doesn't exist
                if (!$setting) {
                    $setting = CampaignSetting::create([
                        'metric_name' => $metric,
                        'goal_value' => 0,
                        'baseline_value' => 0,
                        'baseline_captured_at' => null
                    ]);
                }

                $currentValue = $this->getCurrentValue($metric);
                $goalValue = (float) $setting->goal_value;
                $baselineValue = (float) $setting->baseline_value;

                // Calculate progress
                $progress = $goalValue > 0 
                    ? ($currentValue / $goalValue) * 100 
                    : 0;
                $progress = min($progress, 100); // Cap at 100%

                // Calculate growth from baseline
                if ($baselineValue > 0) {
                    $growth = (($currentValue - $baselineValue) / $baselineValue) * 100;
                } elseif ($currentValue > 0) {
                    $growth = 100; // Show 100% growth if no baseline but has current value
                } else {
                    $growth = 0;
                }

                $stats[$metric] = [
                    'metric_name' => $metric,
                    'current_value' => $currentValue,
                    'goal_value' => $goalValue,
                    'baseline_value' => $baselineValue,
                    'baseline_captured_at' => $setting->baseline_captured_at ? $setting->baseline_captured_at->toISOString() : null,
                    'progress' => round($progress, 2),
                    'growth' => round($growth, 2),
                ];
            }

            return response()->json([
                'success' => true,
                'data' => (object) $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stats overview',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current value for a specific metric
     */
    private function getCurrentValue(string $metric): float
    {
        try {
            switch ($metric) {
                case 'visitors':
                    // Total unique visitors - handle case where table might not exist
                    if (Schema::hasTable('visitor_stats')) {
                        return (float) VisitorStat::distinct('ip_hash')->count();
                    }
                    return 0.0;

                case 'views':
                    // Total views from all content
                    $articleViews = Schema::hasTable('articles') ? (Article::sum('views') ?? 0) : 0;
                    $videoViews = Schema::hasTable('videos') ? (Video::sum('views') ?? 0) : 0;
                    $productViews = Schema::hasTable('products') ? (Product::sum('views') ?? 0) : 0;
                    return (float) ($articleViews + $videoViews + $productViews);

                case 'content':
                    // Total content items (only published)
                    $articles = Schema::hasTable('articles') ? Article::where('status', 'published')->count() : 0;
                    $videos = Schema::hasTable('videos') ? Video::where('status', 'published')->count() : 0;
                    $products = Schema::hasTable('products') ? Product::where('status', 'published')->count() : 0;
                    return (float) ($articles + $videos + $products);

                case 'rating':
                    // Average rating across all published content with rating >= 1
                    $allContent = collect();
                    
                    // Get articles with ratings (only published, rating >= 1)
                    if (Schema::hasTable('articles')) {
                        $articles = Article::where('status', 'published')
                            ->whereNotNull('rating')
                            ->where('rating', '>=', 1)
                            ->pluck('rating');
                        $allContent = $allContent->merge($articles);
                    }
                    
                    // Get videos with ratings (only published, rating >= 1)
                    if (Schema::hasTable('videos')) {
                        $videos = Video::where('status', 'published')
                            ->whereNotNull('rating')
                            ->where('rating', '>=', 1)
                            ->pluck('rating');
                        $allContent = $allContent->merge($videos);
                    }
                    
                    // Get products with ratings (only published, rating >= 1)
                    if (Schema::hasTable('products')) {
                        $products = Product::where('status', 'published')
                            ->whereNotNull('rating')
                            ->where('rating', '>=', 1)
                            ->pluck('rating');
                        $allContent = $allContent->merge($products);
                    }
                    
                    // Calculate average (only items with rating >= 1)
                    if ($allContent->count() > 0) {
                        return (float) $allContent->avg();
                    }
                    
                    return 0.0;

                default:
                    return 0.0;
            }
        } catch (\Exception $e) {
            \Log::error("Error getting current value for metric {$metric}: " . $e->getMessage());
            return 0.0;
        }
    }
}

