<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use App\Http\Controllers\Traits\AuthorizesContent;

class ArticleController extends Controller
{
    use AuthorizesContent;

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

            $query = Article::query()->with(['tags', 'authorUser', 'creator', 'updater']);

            // Filter by status
            // Check if user is authenticated admin/moderator
            $user = auth()->user();
            $isAdmin = $user && $user->role === 'admin';
            $isModerator = $user && $user->role === 'moderator';
            
            if ($isAdmin) {
                // Admin can see all, but if status param provided, filter by it
                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
                // If no status param or status=all, show all articles for admin
            } else if ($isModerator) {
                // Moderator only sees their own content
                $query->where('author_id', $user->id);
                
                // Filter by status if provided
                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
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

            // Pagination - Allow higher limit for admin dashboard
            $requestedPerPage = $request->get('per_page', 15);
            $maxPerPage = $isAdmin ? 1000 : 50; // Admin can fetch more items
            $perPage = min($requestedPerPage, $maxPerPage);
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
            $user = auth()->user();
            $isAdmin = $user && $user->role === 'admin';
            $isModerator = $user && $user->role === 'moderator';
            
            if ($isAdmin) {
                // Admin can view any article
                $article = Article::with(['tags', 'authorUser', 'creator', 'updater'])->findOrFail($id);
            } else if ($isModerator) {
                // Moderator can view their own articles (any status)
                $article = Article::with(['tags', 'authorUser', 'creator', 'updater'])
                    ->where('author_id', $user->id)
                    ->findOrFail($id);
            } else {
                // Public can only view published articles
                $article = Article::with(['tags', 'authorUser', 'creator', 'updater'])->where('status', 'published')->findOrFail($id);
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
            $data = $request->all();
            
            // Set default status based on role
            if (!isset($data['status']) || !$this->canSetStatus($data['status'])) {
                $data['status'] = $this->getDefaultStatus();
            }
            
            // Admin can set author_id, moderator cannot
            if (auth()->user()->role === 'admin') {
                // Admin can specify author_id from request, default to self
                if (!isset($data['author_id'])) {
                    $data['author_id'] = auth()->id();
                }
            } else {
                // Moderator: force author to self
                $data['author_id'] = auth()->id();
            }
            
            $request->merge($data);
            
            $validated = $request->validate([
                'title' => 'required|string|min:3|max:200',
                'slug' => 'required|string|max:255|unique:articles,slug',
                'excerpt' => 'nullable|string|max:500',
                'body' => 'nullable|string', // Make body nullable since content can be used instead
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'required|in:draft,pending,published,archived',
                'category' => 'nullable|string|max:100', // Accept category as string like Video
                'category_id' => 'nullable|exists:categories,id',
                'author_id' => auth()->user()->role === 'admin' ? 'nullable|exists:users,id' : 'nullable',
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
            
            // Load relationships for response
            $article->load(['author', 'creator', 'updater']);
            
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
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate slug
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article with this title or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('ArticleController::store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating article: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $article = Article::with(['tags', 'author', 'creator', 'updater'])->findOrFail($id);
            
            // Authorization check - moderator can only modify their own content
            if (!$this->canModifyContent($article)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only modify your own content.'
                ], 403);
            }
            
            $data = $request->all();
            $user = auth()->user();
            
            // Detect if this is a STATUS-ONLY change (quick action)
            $providedFields = array_keys($data);
            $isStatusOnly = count($providedFields) === 1 && isset($data['status']);
            
            // Detect if content was actually changed
            $contentFields = ['title', 'slug', 'excerpt', 'body', 'content', 'featured_image', 
                             'cover', 'category', 'category_id'];
            $isContentChanged = false;
            foreach ($contentFields as $field) {
                if (isset($data[$field]) && $data[$field] != $article->$field) {
                    $isContentChanged = true;
                    break;
                }
            }
            
            // Moderator logic for status validation
            if ($user->role === 'moderator') {
                $currentStatus = $article->status;
                $newStatus = $data['status'] ?? $currentStatus;
                
                if ($isStatusOnly) {
                    // Quick status change - use transition rules
                    if (!$this->canTransitionStatus($currentStatus, $newStatus, false)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid status transition. You cannot set this status.'
                        ], 403);
                    }
                } else if ($isContentChanged && $currentStatus === 'published') {
                    // Content edit on published item - force to pending
                    $data['status'] = 'pending';
                    \Log::info('Moderator edited published content - forcing to pending', [
                        'article_id' => $id,
                        'user_id' => $user->id
                    ]);
                }
                
                // Prevent moderator from changing author
                unset($data['author_id']);
            }
            
            $request->merge($data);
            
            $validated = $request->validate([
                'title' => 'sometimes|required|string|min:3|max:200',
                'slug' => 'sometimes|required|string|max:255|unique:articles,slug,' . $id,
                'excerpt' => 'nullable|string|max:500',
                'body' => 'nullable|string',
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'sometimes|required|in:draft,pending,published,archived',
                'category' => 'nullable|string|max:100', // Accept category as string like Video
                'category_id' => 'nullable|exists:categories,id',
                'author_id' => auth()->user()->role === 'admin' ? 'nullable|exists:users,id' : 'nullable',
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
            
            // Reload relationships for response
            $article->load(['author', 'creator', 'updater']);
            
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found.'
            ], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article with this title or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('ArticleController::update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
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
            
            // Authorization check - moderator can only delete their own content
            if (!$this->canModifyContent($article)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only delete your own content.'
                ], 403);
            }
            
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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('ArticleController::destroy failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting article: ' . $e->getMessage()
            ], 500);
        }
    }
}

