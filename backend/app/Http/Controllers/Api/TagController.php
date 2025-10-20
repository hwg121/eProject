<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use App\Models\Article;
use App\Models\Video;
use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class TagController extends Controller
{
    /**
     * Display a listing of tags with content counts.
     */
    public function index(Request $request)
    {
        try {
            Log::info('🔍 [TagController] Step 1: index() called', [
                'params' => $request->all(),
                'user_id' => auth()->id(),
            ]);
            
            $query = Tag::query();
            
            Log::info('🔍 [TagController] Step 2: Initial query created');

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                Log::info('🔍 [TagController] Step 3: Adding search filter', ['search' => $search]);
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sortBy', 'name');
            $sortOrder = $request->get('sortOrder', 'asc');
            $query->orderBy($sortBy, $sortOrder);
            
            Log::info('🔍 [TagController] Step 4: Sort applied', ['sortBy' => $sortBy, 'sortOrder' => $sortOrder]);

            // Pagination (increased limit for tag input search)
            $perPage = min($request->get('per_page', 50), 500);
            $tags = $query->paginate($perPage);
            
            Log::info('🔍 [TagController] Step 5: Query executed', [
                'total_tags' => $tags->total(),
                'current_page' => $tags->currentPage(),
                'tags_count' => $tags->count(),
            ]);

            // Load content counts for each tag
            $tags->getCollection()->transform(function ($tag) {
                Log::info('🔍 [TagController] Step 6: Processing tag', [
                    'tag_id' => $tag->id,
                    'tag_name' => $tag->name,
                ]);
                
                $tag->articles_count = $tag->articles()->count();
                $tag->videos_count = $tag->videos()->count();
                $tag->products_count = $tag->products()->count();
                $tag->total_count = $tag->articles_count + $tag->videos_count + $tag->products_count;
                
                Log::info('🔍 [TagController] Tag counts loaded', [
                    'tag_name' => $tag->name,
                    'articles' => $tag->articles_count,
                    'videos' => $tag->videos_count,
                    'products' => $tag->products_count,
                ]);
                
                return $tag;
            });
            
            $responseData = [
                'success' => true,
                'data' => TagResource::collection($tags->items()),
                'meta' => [
                    'current_page' => $tags->currentPage(),
                    'last_page' => $tags->lastPage(),
                    'per_page' => $tags->perPage(),
                    'total' => $tags->total(),
                ]
            ];
            
            Log::info('🔍 [TagController] Step 7: Returning response', [
                'data_count' => count($responseData['data']),
                'meta' => $responseData['meta'],
            ]);

            return response()->json($responseData);
        } catch (\Exception $e) {
            Log::error('🔍 [TagController] ERROR in index()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tags: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified tag by slug.
     */
    public function show($slug)
    {
        try {
            $tag = Tag::where('slug', $slug)->firstOrFail();
            
            // Load content counts
            $tag->articles_count = $tag->articles()->count();
            $tag->videos_count = $tag->videos()->count();
            $tag->products_count = $tag->products()->count();
            $tag->total_count = $tag->articles_count + $tag->videos_count + $tag->products_count;
            
            return response()->json([
                'success' => true,
                'data' => new TagResource($tag)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tag not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get all content associated with a tag.
     */
    public function contents($slug, Request $request)
    {
        try {
            $tag = Tag::where('slug', $slug)->firstOrFail();
            
            $type = $request->get('type', 'all'); // all, articles, videos, products
            $perPage = min($request->get('per_page', 15), 50);
            
            $contents = [];
            
            if ($type === 'all' || $type === 'articles') {
                $articles = $tag->articles()
                    ->where('status', 'published')
                    ->orderBy('created_at', 'desc')
                    ->limit($type === 'all' ? 10 : $perPage)
                    ->get()
                    ->map(function($article) {
                        return [
                            'id' => $article->id,
                            'type' => 'article',
                            'title' => $article->title,
                            'slug' => $article->slug,
                            'excerpt' => $article->excerpt,
                            'featured_image' => $article->featured_image,
                            'category' => $article->category,
                            'views' => $article->views,
                            'likes' => $article->likes,
                            'rating' => $article->rating,
                            'created_at' => $article->created_at,
                        ];
                    });
                $contents = array_merge($contents, $articles->toArray());
            }
            
            if ($type === 'all' || $type === 'videos') {
                $videos = $tag->videos()
                    ->where('status', 'published')
                    ->orderBy('created_at', 'desc')
                    ->limit($type === 'all' ? 10 : $perPage)
                    ->get()
                    ->map(function($video) {
                        return [
                            'id' => $video->id,
                            'type' => 'video',
                            'title' => $video->title,
                            'slug' => $video->slug,
                            'description' => $video->description,
                            'featured_image' => $video->featured_image,
                            'thumbnail' => $video->thumbnail,
                            'instructor' => $video->instructor,
                            'duration' => $video->duration,
                            'views' => $video->views,
                            'likes' => $video->likes,
                            'rating' => $video->rating,
                            'created_at' => $video->created_at,
                        ];
                    });
                $contents = array_merge($contents, $videos->toArray());
            }
            
            if ($type === 'all' || $type === 'products') {
                $products = $tag->products()
                    ->where('status', 'published')
                    ->orderBy('created_at', 'desc')
                    ->limit($type === 'all' ? 10 : $perPage)
                    ->get()
                    ->map(function($product) {
                        return [
                            'id' => $product->id,
                            'type' => 'product',
                            'name' => $product->name,
                            'slug' => $product->slug,
                            'description' => $product->description,
                            'category' => $product->category,
                            'price' => $product->price,
                            'rating' => $product->rating,
                            'views' => $product->views,
                            'likes' => $product->likes,
                            'created_at' => $product->created_at,
                        ];
                    });
                $contents = array_merge($contents, $products->toArray());
            }
            
            // Sort all contents by created_at desc
            usort($contents, function($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });
            
            return response()->json([
                'success' => true,
                'data' => [
                    'tag' => new TagResource($tag),
                    'contents' => $contents,
                    'total' => count($contents),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tag contents: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:2|max:255|unique:tags,name',
                'slug' => 'nullable|string|max:255|unique:tags,slug|regex:/^[a-z0-9-]+$/',
                'description' => 'nullable|string|max:1000',
            ], [
                'name.required' => 'Tag name is required.',
                'name.min' => 'Tag name must be at least 2 characters.',
                'name.max' => 'Tag name must not exceed 255 characters.',
                'name.unique' => 'A tag with this name already exists.',
                'slug.max' => 'Slug must not exceed 255 characters.',
                'slug.unique' => 'A tag with this slug already exists.',
                'slug.regex' => 'Slug can only contain lowercase letters, numbers, and hyphens.',
                'description.max' => 'Description must not exceed 1000 characters.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();
            
            // Auto-generate slug if not provided
            if (!isset($validated['slug']) || empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);
                
                // Ensure slug uniqueness
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (Tag::where('slug', $validated['slug'])->exists()) {
                    $validated['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
            
            $tag = Tag::create($validated);
            
            // Load content counts
            $tag->articles_count = 0;
            $tag->videos_count = 0;
            $tag->products_count = 0;
            $tag->total_count = 0;
            
            return response()->json([
                'success' => true,
                'message' => 'Tag created successfully',
                'data' => new TagResource($tag)
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate entry
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tag with this name or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('TagController::store failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating tag: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, $id)
    {
        try {
            $tag = Tag::findOrFail($id);
            
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|min:2|max:255|unique:tags,name,' . $id,
                'slug' => 'sometimes|required|string|max:255|unique:tags,slug,' . $id . '|regex:/^[a-z0-9-]+$/',
                'description' => 'nullable|string|max:1000',
            ], [
                'name.min' => 'Tag name must be at least 2 characters.',
                'name.max' => 'Tag name must not exceed 255 characters.',
                'name.unique' => 'A tag with this name already exists.',
                'slug.max' => 'Slug must not exceed 255 characters.',
                'slug.unique' => 'A tag with this slug already exists.',
                'slug.regex' => 'Slug can only contain lowercase letters, numbers, and hyphens.',
                'description.max' => 'Description must not exceed 1000 characters.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();
            
            // If name is updated but slug is not provided, regenerate slug
            if (isset($validated['name']) && !isset($validated['slug'])) {
                $newSlug = Str::slug($validated['name']);
                
                // Only update slug if it's different from current slug
                if ($newSlug !== $tag->slug) {
                    // Ensure uniqueness
                    $originalSlug = $newSlug;
                    $counter = 1;
                    while (Tag::where('slug', $newSlug)->where('id', '!=', $id)->exists()) {
                        $newSlug = $originalSlug . '-' . $counter;
                        $counter++;
                    }
                    $validated['slug'] = $newSlug;
                }
            }
            
            $tag->update($validated);
            
            // Load content counts
            $tag->articles_count = $tag->articles()->count();
            $tag->videos_count = $tag->videos()->count();
            $tag->products_count = $tag->products()->count();
            $tag->total_count = $tag->articles_count + $tag->videos_count + $tag->products_count;
            
            return response()->json([
                'success' => true,
                'message' => 'Tag updated successfully',
                'data' => new TagResource($tag)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tag not found.'
            ], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate entry
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tag with this name or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('TagController::update failed', [
                'error' => $e->getMessage(),
                'id' => $id,
                'request' => $request->all(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating tag: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified tag.
     */
    public function destroy($id)
    {
        try {
            $tag = Tag::findOrFail($id);
            
            // Get content counts before deletion for logging
            $articlesCount = $tag->articles()->count();
            $videosCount = $tag->videos()->count();
            $productsCount = $tag->products()->count();
            
            $tagName = $tag->name;
            
            Log::info('Deleting tag', [
                'id' => $id,
                'name' => $tagName,
                'articles_count' => $articlesCount,
                'videos_count' => $videosCount,
                'products_count' => $productsCount,
            ]);
            
            // Delete tag (pivot table entries will be cascade deleted)
            $tag->delete();
            
            // Log tag deletion activity
            ActivityLog::logPublic(
                'deleted',
                'tag',
                $id,
                $tagName,
                auth()->user() ? auth()->user()->name . " deleted tag: {$tagName} ({$articlesCount} articles, {$videosCount} videos, {$productsCount} products)" : "Tag deleted: {$tagName}"
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Tag deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tag not found.'
            ], 404);
        } catch (\Exception $e) {
            Log::error('TagController::destroy failed', [
                'error' => $e->getMessage(),
                'id' => $id,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting tag: ' . $e->getMessage()
            ], 500);
        }
    }
}

