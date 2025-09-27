<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request)
    {
        $cacheKey = 'articles_' . md5(serialize($request->all()));
        
        return Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Article::with(['category', 'author']);

            // Only published articles
            $query->where('status', 'published')
                  ->where('published_at', '<=', now());

            // Search with optimized query
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('body', 'like', "%{$search}%");
                });
            }

            // Category filter
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Featured filter
            if ($request->has('featured') && $request->featured) {
                $query->where('featured', true);
            }

            // Author filter
            if ($request->has('author_id')) {
                $query->where('author_id', $request->author_id);
            }

            // Order by performance
            $orderBy = $request->get('order_by', 'featured');
            $orderDirection = $request->get('order_direction', 'desc');
            
            switch ($orderBy) {
                case 'newest':
                    $query->orderBy('published_at', $orderDirection);
                    break;
                case 'oldest':
                    $query->orderBy('published_at', 'asc');
                    break;
                case 'views':
                    $query->orderBy('views', $orderDirection);
                    break;
                case 'featured':
                default:
                    $query->orderBy('featured', 'desc')
                          ->orderBy('published_at', 'desc');
                    break;
            }

            // Pagination with optimized limit
            $perPage = min($request->get('per_page', 12), 50);
            $articles = $query->paginate($perPage);

            return ArticleResource::collection($articles);
        });
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles',
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'author_id' => 'required|exists:users,id',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'featured' => 'boolean',
        ]);

        $article = Article::create($request->all());
        
        // Clear cache
        Cache::forget('articles_*');
        
        return new ArticleResource($article);
    }

    /**
     * Display the specified article.
     */
    public function show(Article $article)
    {
        $cacheKey = "article_{$article->id}";
        
        return Cache::remember($cacheKey, 600, function () use ($article) {
            // Increment views
            DB::table('articles')->where('id', $article->id)->increment('views');
            
            // Load relationships
            $article->load(['category', 'author', 'tags']);
            
            return new ArticleResource($article);
        });
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:articles,slug,' . $article->id,
            'excerpt' => 'nullable|string',
            'body' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'author_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|required|in:draft,published',
            'published_at' => 'nullable|date',
            'featured' => 'boolean',
        ]);

        $article->update($request->all());
        
        // Clear cache
        Cache::forget('articles_*');
        Cache::forget("article_{$article->id}");
        
        return new ArticleResource($article);
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article)
    {
        $article->delete();
        
        // Clear cache
        Cache::forget('articles_*');
        Cache::forget("article_{$article->id}");
        
        return response()->json(['message' => 'Article deleted successfully']);
    }

    /**
     * Get featured articles.
     */
    public function featured()
    {
        $cacheKey = 'articles_featured';
        
        return Cache::remember($cacheKey, 300, function () {
            $articles = Article::with(['category', 'author'])
                        ->where('status', 'published')
                        ->where('published_at', '<=', now())
                        ->where('featured', true)
                        ->orderBy('published_at', 'desc')
                        ->limit(6)
                        ->get();
            
            return ArticleResource::collection($articles);
        });
    }

    /**
     * Get latest articles.
     */
    public function latest()
    {
        $cacheKey = 'articles_latest';
        
        return Cache::remember($cacheKey, 300, function () {
            $articles = Article::with(['category', 'author'])
                        ->where('status', 'published')
                        ->where('published_at', '<=', now())
                        ->orderBy('published_at', 'desc')
                        ->limit(8)
                        ->get();
            
            return ArticleResource::collection($articles);
        });
    }

    /**
     * Get popular articles.
     */
    public function popular()
    {
        $cacheKey = 'articles_popular';
        
        return Cache::remember($cacheKey, 300, function () {
            $articles = Article::with(['category', 'author'])
                        ->where('status', 'published')
                        ->where('published_at', '<=', now())
                        ->orderBy('views', 'desc')
                        ->orderBy('published_at', 'desc')
                        ->limit(8)
                        ->get();
            
            return ArticleResource::collection($articles);
        });
    }

    /**
     * Get articles by category.
     */
    public function byCategory(Request $request)
    {
        $categoryId = $request->get('category_id');
        $cacheKey = "articles_category_{$categoryId}";
        
        return Cache::remember($cacheKey, 300, function () use ($categoryId) {
            $articles = Article::with(['category', 'author'])
                        ->where('status', 'published')
                        ->where('published_at', '<=', now())
                        ->where('category_id', $categoryId)
                        ->orderBy('featured', 'desc')
                        ->orderBy('published_at', 'desc')
                        ->paginate(12);
            
            return ArticleResource::collection($articles);
        });
    }

    /**
     * Get related articles.
     */
    public function related(Article $article)
    {
        $cacheKey = "articles_related_{$article->id}";
        
        return Cache::remember($cacheKey, 300, function () use ($article) {
            $articles = Article::with(['category', 'author'])
                        ->where('status', 'published')
                        ->where('published_at', '<=', now())
                        ->where('id', '!=', $article->id)
                        ->where('category_id', $article->category_id)
                        ->orderBy('views', 'desc')
                        ->limit(4)
                        ->get();
            
            return ArticleResource::collection($articles);
        });
    }
}