<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
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

            $query = Article::query()->with('tags');

            // Filter by status
            // Check if user is authenticated admin/moderator
            $isAdmin = auth()->check() && in_array(auth()->user()->role, ['admin', 'moderator']);
            
            if ($isAdmin) {
                // Admin can see all, but if status param provided, filter by it
                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
                // If no status param or status=all, show all articles for admin
            } else {
                // Public access: only show published articles
                $query->where('status', 'published');
            }

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

            // Sort - Featured items first, then by sortBy
            $query->orderBy('is_featured', 'desc');
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $articles = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => ArticleResource::collection($articles->items()),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'per_page' => $articles->perPage(),
                    'total' => $articles->total(),
                ]
            ]);
        } catch (\Exception $e) {
            // Log error for debugging
            \Log::error('ArticleController::index failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'user_id' => auth()->id(),
            ]);
            
            // Return error to frontend for debugging
            return response()->json([
                'success' => false,
                'message' => 'Error fetching articles: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified article.
     */
    public function show($id)
    {
        try {
            // Check if user is authenticated admin/moderator
            $isAdmin = auth()->check() && in_array(auth()->user()->role, ['admin', 'moderator']);
            
            if ($isAdmin) {
                // Admin can view any article
                $article = Article::with('tags')->findOrFail($id);
            } else {
                // Public can only view published articles
                $article = Article::with('tags')->where('status', 'published')->findOrFail($id);
            }
            
            // Use atomic increment to prevent race conditions
            Article::where('id', $id)->increment('views');
            $article->refresh();
            
            return response()->json([
                'success' => true,
                'data' => new ArticleResource($article)
            ]);
        } catch (\Exception $e) {
            \Log::error('ArticleController::show failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);
            
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
                'slug' => 'required|string|max:255|unique:articles,slug',
                'excerpt' => 'nullable|string',
                'body' => 'nullable|string', // Make body nullable since content can be used instead
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'required|in:published,archived',
                'category' => 'nullable|string|max:100', // Accept category as string like Video
                'category_id' => 'nullable|exists:categories,id',
                'author_id' => 'nullable|exists:users,id',
                'published_at' => 'nullable|date',
                'views' => 'nullable|integer',
                'likes' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'nullable|boolean',
                'tags' => 'nullable|array', // Accept array of tag IDs
                'tags.*' => 'integer|exists:tags,id',
            ]);
            
            \Log::info('ArticleController::store - About to create with validated data:', $validated);
            
            // Extract tags before creating article
            $tags = $validated['tags'] ?? [];
            unset($validated['tags']);
            
            $article = Article::create($validated);
            
            // Sync tags
            if (!empty($tags)) {
                $article->tags()->sync($tags);
                // Load tags relationship to return in response
                $article->load('tags');
            }
            
            \Log::info('ArticleController::store - Article created:', [
                'id' => $article->id,
                'exists_in_db' => Article::where('id', $article->id)->exists()
            ]);
            
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
                'data' => new ArticleResource($article)
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
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
            $article = Article::with('tags')->findOrFail($id);
            
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:articles,slug,' . $id,
                'excerpt' => 'nullable|string',
                'body' => 'nullable|string',
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'sometimes|required|in:published,archived',
                'category' => 'nullable|string|max:100', // Accept category as string like Video
                'category_id' => 'nullable|exists:categories,id',
                'author_id' => 'nullable|exists:users,id',
                'published_at' => 'nullable|date',
                'views' => 'nullable|integer',
                'likes' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_featured' => 'nullable|boolean',
                'tags' => 'nullable|array', // Accept array of tag IDs
                'tags.*' => 'integer|exists:tags,id',
            ]);

            // Extract tags before updating article
            $tags = $validated['tags'] ?? null;
            unset($validated['tags']);

            $article->update($validated);
            
            // Sync tags if provided
            if ($tags !== null) {
                $article->tags()->sync($tags);
                // Reload tags relationship after sync
                $article->load('tags');
            }
            
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
                'data' => new ArticleResource($article)
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

