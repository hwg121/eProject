<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request)
    {
        // Generate cache key based on request parameters
        $cacheKey = 'articles_' . md5(serialize($request->all()));
        
        return Cache::remember($cacheKey, 900, function () use ($request) { // Cache for 15 minutes
            $query = Article::with(['category', 'tags', 'author'])
                ->where('status', 'published')
                ->orderBy('published_at', 'desc');

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Search with full-text search for better performance
            if ($request->has('search')) {
                $search = $request->search;
                $query->whereFullText(['title', 'excerpt', 'body'], $search);
            }

            // Pagination
            $perPage = min($request->get('per_page', 10), 50); // Limit max per page
            $articles = $query->paginate($perPage);

            return ArticleResource::collection($articles);
        });
    }

    /**
     * Display the specified article.
     */
    public function show($id)
    {
        $cacheKey = "article_{$id}";
        
        return Cache::remember($cacheKey, 1800, function () use ($id) { // Cache for 30 minutes
            $article = Article::with(['category', 'tags', 'author'])
                ->where('status', 'published')
                ->findOrFail($id);

            return new ArticleResource($article);
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'status' => 'required|in:draft,published',
            'category_id' => 'nullable|exists:categories,id',
            'published_at' => 'nullable|date',
        ]);

        $article = Article::create($request->all());
        return new ArticleResource($article);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'excerpt' => 'nullable|string',
            'body' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:draft,published',
            'category_id' => 'nullable|exists:categories,id',
            'published_at' => 'nullable|date',
        ]);

        $article->update($request->all());
        return new ArticleResource($article);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        
        return response()->json([
            'message' => 'Article deleted successfully'
        ], 200);
    }
}

