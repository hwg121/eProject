<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Http\Resources\ToolResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ToolController extends Controller
{
    /**
     * Display a listing of tools.
     */
    public function index(Request $request)
    {
        $cacheKey = 'tools_' . md5(serialize($request->all()));
        
        return Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Tool::query();

            // Search with optimized query
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Featured filter
            if ($request->has('featured') && $request->featured) {
                $query->where('featured', true);
            }

            // Category filter
            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            // Rating filter
            if ($request->has('min_rating')) {
                $query->where('rating', '>=', $request->min_rating);
            }

            // Order by performance
            $orderBy = $request->get('order_by', 'featured');
            $orderDirection = $request->get('order_direction', 'desc');
            
            switch ($orderBy) {
                case 'rating':
                    $query->orderBy('rating', $orderDirection);
                    break;
                case 'views':
                    $query->orderBy('views', $orderDirection);
                    break;
                case 'newest':
                    $query->orderBy('created_at', $orderDirection);
                    break;
                case 'featured':
                default:
                    $query->orderBy('featured', 'desc')
                          ->orderBy('rating', 'desc')
                          ->orderBy('views', 'desc');
                    break;
            }

            // Pagination with optimized limit
            $perPage = min($request->get('per_page', 12), 50); // Max 50 items per page
            $tools = $query->paginate($perPage);

            return ToolResource::collection($tools);
        });
    }

    /**
     * Store a newly created tool.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'usage' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price_range' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'video_url' => 'nullable|url',
            'affiliate_link' => 'nullable|url',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $tool = Tool::create($request->all());
        
        // Clear cache
        Cache::forget('tools_*');
        
        return new ToolResource($tool);
    }

    /**
     * Display the specified tool.
     */
    public function show(Tool $tool)
    {
        $cacheKey = "tool_{$tool->id}";
        
        return Cache::remember($cacheKey, 600, function () use ($tool) {
            // Increment views
            DB::table('tools')->where('id', $tool->id)->increment('views');
            
            return new ToolResource($tool);
        });
    }

    /**
     * Update the specified tool.
     */
    public function update(Request $request, Tool $tool)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'usage' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price_range' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'video_url' => 'nullable|url',
            'affiliate_link' => 'nullable|url',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $tool->update($request->all());
        
        // Clear cache
        Cache::forget('tools_*');
        Cache::forget("tool_{$tool->id}");
        
        return new ToolResource($tool);
    }

    /**
     * Remove the specified tool.
     */
    public function destroy(Tool $tool)
    {
        $tool->delete();
        
        // Clear cache
        Cache::forget('tools_*');
        Cache::forget("tool_{$tool->id}");
        
        return response()->json(['message' => 'Tool deleted successfully']);
    }

    /**
     * Get featured tools.
     */
    public function featured()
    {
        $cacheKey = 'tools_featured';
        
        return Cache::remember($cacheKey, 300, function () {
            $tools = Tool::where('featured', true)
                        ->orderBy('rating', 'desc')
                        ->orderBy('views', 'desc')
                        ->limit(8)
                        ->get();
            
            return ToolResource::collection($tools);
        });
    }

    /**
     * Get popular tools.
     */
    public function popular()
    {
        $cacheKey = 'tools_popular';
        
        return Cache::remember($cacheKey, 300, function () {
            $tools = Tool::orderBy('views', 'desc')
                        ->orderBy('rating', 'desc')
                        ->limit(8)
                        ->get();
            
            return ToolResource::collection($tools);
        });
    }

    /**
     * Get tools by category.
     */
    public function byCategory(Request $request)
    {
        $category = $request->get('category');
        $cacheKey = "tools_category_{$category}";
        
        return Cache::remember($cacheKey, 300, function () use ($category) {
            $tools = Tool::where('category', $category)
                        ->orderBy('featured', 'desc')
                        ->orderBy('rating', 'desc')
                        ->paginate(12);
            
            return ToolResource::collection($tools);
        });
    }
}