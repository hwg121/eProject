<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\Http\Resources\SuggestionResource;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function index(Request $request)
    {
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
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Sort by featured first, then by rating
        $query->orderBy('is_featured', 'desc')
              ->orderBy('rating', 'desc')
              ->orderBy('views', 'desc');

        $perPage = $request->get('per_page', 10);
        $suggestions = $query->paginate($perPage);

        return SuggestionResource::collection($suggestions);
    }

    public function show($id)
    {
        $suggestion = Suggestion::where('is_published', true)->findOrFail($id);
        
        // Increment views
        $suggestion->increment('views');
        
        return new SuggestionResource($suggestion);
    }

    public function featured()
    {
        $suggestions = Suggestion::where('is_published', true)
            ->where('is_featured', true)
            ->orderBy('rating', 'desc')
            ->limit(6)
            ->get();

        return SuggestionResource::collection($suggestions);
    }

    public function categories()
    {
        $categories = Suggestion::where('is_published', true)
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json(['categories' => $categories]);
    }
}