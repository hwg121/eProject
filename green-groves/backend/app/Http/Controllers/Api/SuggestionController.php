<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\Http\Resources\SuggestionResource;
use App\Jobs\IncrementSuggestionViews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SuggestionController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'suggestions_' . md5(serialize($request->all()));
        
        return Cache::remember($cacheKey, 600, function () use ($request) { // Cache for 10 minutes
            $query = Suggestion::query()->where('is_published', true);

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('difficulty_level')) {
                $query->where('difficulty_level', $request->difficulty_level);
            }

            if ($request->has('season')) {
                $query->where('season', $request->season);
            }

            if ($request->has('plant_type')) {
                $query->where('plant_type', $request->plant_type);
            }

            if ($request->has('is_featured')) {
                $query->where('is_featured', $request->boolean('is_featured'));
            }

            if ($request->has('search')) {
                $search = $request->search;
                // Use LIKE search as fallback if fulltext index not available
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // Sort by featured first, then by rating - using composite index
            $query->orderBy('is_featured', 'desc')
                  ->orderBy('rating', 'desc')
                  ->orderBy('views', 'desc');

            $perPage = min($request->get('per_page', 10), 50);
            $suggestions = $query->paginate($perPage);

            return SuggestionResource::collection($suggestions);
        });
    }

    public function show($id)
    {
        $cacheKey = "suggestion_{$id}";
        
        $suggestion = Cache::remember($cacheKey, 1200, function () use ($id) { // Cache for 20 minutes
            return Suggestion::where('is_published', true)->findOrFail($id);
        });
        
        // Increment views asynchronously to avoid blocking
        IncrementSuggestionViews::dispatch($suggestion->id);
        
        return new SuggestionResource($suggestion);
    }

    public function featured()
    {
        return Cache::remember('suggestions_featured', 1800, function () { // Cache for 30 minutes
            $suggestions = Suggestion::where('is_published', true)
                ->where('is_featured', true)
                ->orderBy('rating', 'desc')
                ->limit(6)
                ->get();

            return SuggestionResource::collection($suggestions);
        });
    }

    public function categories()
    {
        return Cache::remember('suggestions_categories', 3600, function () { // Cache for 1 hour
            $categories = Suggestion::where('is_published', true)
                ->select('category')
                ->distinct()
                ->pluck('category')
                ->filter()
                ->values();

            return response()->json(['categories' => $categories]);
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $suggestion = Suggestion::create($request->all());
        
        // Clear related caches
        Cache::forget('suggestions_featured');
        Cache::forget('suggestions_categories');
        
        return new SuggestionResource($suggestion);
    }

    public function update(Request $request, $id)
    {
        $suggestion = Suggestion::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $suggestion->update($request->all());
        
        // Clear related caches
        Cache::forget("suggestion_{$id}");
        Cache::forget('suggestions_featured');
        Cache::forget('suggestions_categories');
        
        return new SuggestionResource($suggestion);
    }

    public function destroy($id)
    {
        $suggestion = Suggestion::findOrFail($id);
        $suggestion->delete();
        
        // Clear related caches
        Cache::forget("suggestion_{$id}");
        Cache::forget('suggestions_featured');
        Cache::forget('suggestions_categories');
        
        return response()->json([
            'message' => 'Suggestion deleted successfully'
        ], 200);
    }

}