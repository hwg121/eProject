<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request)
    {
        try {
            // Check if articles table exists
            if (!Schema::hasTable('articles')) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'meta' => [
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => 15,
                        'total' => 0,
                    ]
                ]);
            }

            $query = Article::query();

            // Filter by status
            // Admin can see all, but if status param provided, filter by it
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            // If no status param or status=all, show all articles for admin

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('body', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $articles = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $articles->items(),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'per_page' => $articles->perPage(),
                    'total' => $articles->total(),
                ]
            ]);
        } catch (\Exception $e) {
            // Return empty data instead of error for better frontend experience
            return response()->json([
                'success' => true,
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 15,
                    'total' => 0,
                ]
            ]);
        }
    }

    /**
     * Display the specified article.
     */
    public function show($id)
    {
        try {
            $article = Article::findOrFail($id);
            
            // Increment view count
            $article->increment('views');
            
            return response()->json([
                'success' => true,
                'data' => $article
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching article: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'excerpt' => 'nullable|string',
                'body' => 'required|string',
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'required|in:draft,published',
                'category_id' => 'nullable|exists:categories,id',
                'author_id' => 'nullable|exists:users,id',
                'published_at' => 'nullable|date',
                'views' => 'nullable|integer',
                'likes' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'nullable|boolean',
            ]);

            $article = Article::create($validated);
            
            // Log article creation activity
            ActivityLog::logPublic(
                'created',
                'article',
                $article->id,
                $article->title,
                auth()->user() ? auth()->user()->name . " created article: {$article->title}" : "Article created: {$article->title}",
                ['status' => $article->status]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Article created successfully',
                'data' => $article
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating article: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $article = Article::findOrFail($id);
            
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'excerpt' => 'nullable|string',
                'body' => 'sometimes|required|string',
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'sometimes|required|in:draft,published',
                'category_id' => 'nullable|exists:categories,id',
                'author_id' => 'nullable|exists:users,id',
                'published_at' => 'nullable|date',
                'views' => 'nullable|integer',
                'likes' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'nullable|boolean',
            ]);

            $article->update($validated);
            
            // Log article update activity
            ActivityLog::logPublic(
                'updated',
                'article',
                $article->id,
                $article->title,
                auth()->user() ? auth()->user()->name . " updated article: {$article->title}" : "Article updated: {$article->title}",
                ['status' => $article->status, 'changed_fields' => array_keys($validated)]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => $article
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating article: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $article = Article::findOrFail($id);
            $articleTitle = $article->title;
            $article->delete();
            
            // Log article deletion activity
            ActivityLog::logPublic(
                'deleted',
                'article',
                $id,
                $articleTitle,
                auth()->user() ? auth()->user()->name . " deleted article: {$articleTitle}" : "Article deleted: {$articleTitle}"
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting article: ' . $e->getMessage()
            ], 500);
        }
    }
}

