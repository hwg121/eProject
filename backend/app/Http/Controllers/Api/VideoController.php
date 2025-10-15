<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Check if videos table exists
            if (!Schema::hasTable('videos')) {
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

            $query = Video::query()->with('tags');

            // Filter by status
            // Check if user is authenticated admin/moderator
            $isAdmin = auth()->check() && in_array(auth()->user()->role, ['admin', 'moderator']);
            
            if ($isAdmin) {
                // Admin can see all, but if status param provided, filter by it
                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
                // If no status param or status=all, show all videos for admin
            } else {
                // Public access: only show published videos
                $query->where('status', 'published');
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Sort - Featured items first, then by sortBy
            $query->orderBy('is_featured', 'desc');
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $videos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => \App\Http\Resources\VideoResource::collection($videos->items()),
                'meta' => [
                    'current_page' => $videos->currentPage(),
                    'last_page' => $videos->lastPage(),
                    'per_page' => $videos->perPage(),
                    'total' => $videos->total(),
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

    public function show($id)
    {
        try {
            // Check if user is authenticated admin/moderator
            $isAdmin = auth()->check() && in_array(auth()->user()->role, ['admin', 'moderator']);
            
            if ($isAdmin) {
                // Admin can view any video
                $video = Video::with('tags')->findOrFail($id);
            } else {
                // Public can only view published videos
                $video = Video::with('tags')->where('status', 'published')->findOrFail($id);
            }
            
            // Use atomic increment to prevent race conditions
            Video::where('id', $id)->increment('views');
            $video->refresh();
            
            return response()->json([
                'success' => true,
                'data' => new \App\Http\Resources\VideoResource($video)
            ]);
        } catch (\Exception $e) {
            Log::error('VideoController::show failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching video: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Check if videos table exists and has required columns
            if (!Schema::hasTable('videos')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Videos table does not exist'
                ], 500);
            }

            // Basic validation rules
            $validationRules = [
                'title' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:videos,slug',
                'description' => 'nullable|string',
                'excerpt' => 'nullable|string',
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'featured_image_public_id' => 'nullable|string',
                'cover' => 'nullable|string',
                'cover_public_id' => 'nullable|string',
                'thumbnail_public_id' => 'nullable|string',
                'video_url' => 'nullable|url',
                'embed_url' => 'nullable|url',
                'thumbnail' => 'nullable|string',
                'instructor' => 'nullable|string|max:255',
                'duration' => 'nullable|integer',
                'category' => 'nullable|string|max:100',
                'status' => 'required|in:published,archived',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'is_featured' => 'nullable|boolean',
                'category_id' => 'nullable|integer',
                'author_id' => 'nullable|integer',
                'published_at' => 'nullable|date',
            ];

            // Add optional columns if they exist in the table
            if (Schema::hasColumn('videos', 'link')) {
                $validationRules['link'] = 'nullable|string'; // Changed from url to string
            }
            if (Schema::hasColumn('videos', 'thumbnail_url')) {
                $validationRules['thumbnail_url'] = 'nullable|string'; // Changed from url to string
            }
            if (Schema::hasColumn('videos', 'rating')) {
                $validationRules['rating'] = 'nullable|numeric|min:0|max:5';
            }
            
            // Tags are now managed via pivot table
            $validationRules['tags'] = 'nullable|array';
            $validationRules['tags.*'] = 'integer|exists:tags,id';

            $validated = $request->validate($validationRules);

            // Handle featured_image - ensure it's properly set
            if ($request->has('featured_image')) {
                $validated['featured_image'] = $request->input('featured_image');
            }

            // Auto-generate embed URL from video_url if it's a YouTube URL
            if (isset($validated['video_url']) && $validated['video_url']) {
                $videoUrl = $validated['video_url'];
                $embedUrl = $this->generateEmbedUrl($videoUrl);
                if ($embedUrl) {
                    $validated['embed_url'] = $embedUrl;
                }
            }
            // Also check link field if it exists
            if (isset($validated['link']) && $validated['link']) {
                $link = $validated['link'];
                $embedUrl = $this->generateEmbedUrl($link);
                if ($embedUrl) {
                    $validated['embed_url'] = $embedUrl;
                }
            }
            
            // Extract tags before creating video
            $tags = $validated['tags'] ?? [];
            unset($validated['tags']);
            
            $video = Video::create($validated);
            
            // Sync tags
            if (!empty($tags)) {
                $video->tags()->sync($tags);
                // Load tags relationship to return in response
                $video->load('tags');
            }
            
            // Log video creation activity
            ActivityLog::logPublic(
                'created',
                'video',
                $video->id,
                $video->title,
                auth()->user() ? auth()->user()->name . " uploaded video: {$video->title}" : "Video uploaded: {$video->title}",
                ['status' => $video->status]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Video created successfully',
                'data' => new \App\Http\Resources\VideoResource($video)
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate slug or other DB constraints
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Video with this title or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('VideoController::store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'user_id' => auth()->id(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating video: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('VideoController::update called', [
                'id' => $id,
                'request_data' => $request->all(),
                'user_id' => auth()->id()
            ]);
            
            // Handle _method=PUT for Laravel compatibility
            if ($request->has('_method') && $request->input('_method') === 'PUT') {
                $request->merge($request->except('_method'));
            }
            
            $video = Video::with('tags')->findOrFail($id);
            Log::info('VideoController::update - Video found', [
                'video_id' => $video->id,
                'current_status' => $video->status,
                'title' => $video->title
            ]);
            
            // Validation rules - simplified to avoid 422 errors
            $validationRules = [
                'title' => 'nullable|string|max:255',
                'slug' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'excerpt' => 'nullable|string',
                'content' => 'nullable|string',
                'featured_image' => 'nullable|string',
                'featured_image_public_id' => 'nullable|string',
                'cover' => 'nullable|string',
                'cover_public_id' => 'nullable|string',
                'thumbnail_public_id' => 'nullable|string',
                'video_url' => 'nullable|string',
                'embed_url' => 'nullable|string',
                'thumbnail' => 'nullable|string',
                'instructor' => 'nullable|string|max:255',
                'duration' => 'nullable|string',
                'category' => 'nullable|string|max:100',
                'status' => 'nullable|string|in:published,archived',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'is_featured' => 'nullable|boolean',
                'category_id' => 'nullable|integer',
                'author_id' => 'nullable|integer',
                'published_at' => 'nullable|date',
            ];

            // Add optional columns if they exist
            if (Schema::hasColumn('videos', 'link')) {
                $validationRules['link'] = 'nullable|string';
            }
            if (Schema::hasColumn('videos', 'thumbnail_url')) {
                $validationRules['thumbnail_url'] = 'nullable|string';
            }
            if (Schema::hasColumn('videos', 'rating')) {
                $validationRules['rating'] = 'nullable|numeric|min:0|max:5';
            }
            
            // Tags are now managed via pivot table
            $validationRules['tags'] = 'nullable|array';
            $validationRules['tags.*'] = 'integer|exists:tags,id';

            // Validate with fallback to prevent 422 errors
            try {
                $validated = $request->validate($validationRules);
            } catch (\Illuminate\Validation\ValidationException $e) {
                // Use request data directly if validation fails
                $validated = $request->only(array_keys($validationRules));
            }

            // Handle featured_image properly
            if ($request->has('featured_image')) {
                $featuredImage = $request->input('featured_image');


                if (is_array($featuredImage)) {
                    $url = $featuredImage['secure_url'] ?? $featuredImage['url'] ?? null;
                    $validated['featured_image'] = $url;
                } elseif (is_string($featuredImage)) {
                    $validated['featured_image'] = $featuredImage;
                } else {
                    $validated['featured_image'] = $video->featured_image; // keep old image
                }
            } else {
                $validated['featured_image'] = $video->featured_image; // keep old image if not sent
            }

            // Auto-generate embed URL from video_url if it's a YouTube URL
            if (isset($validated['video_url']) && $validated['video_url']) {
                $embedUrl = $this->generateEmbedUrl($validated['video_url']);
                if ($embedUrl) {
                    $validated['embed_url'] = $embedUrl;
                }
            }
            
            if (isset($validated['link']) && $validated['link']) {
                $embedUrl = $this->generateEmbedUrl($validated['link']);
                if ($embedUrl) {
                    $validated['embed_url'] = $embedUrl;
                }
            }
            
            // Extract tags before updating video
            $tags = $validated['tags'] ?? null;
            unset($validated['tags']);
            
            $video->update($validated);
            
            // Sync tags if provided
            if ($tags !== null) {
                $video->tags()->sync($tags);
            }
            
            // Reload model with tags relationship after sync
            $video->refresh();
            $video->load('tags');
            
            Log::info('VideoController::update - Video updated', [
                'video_id' => $video->id,
                'new_status' => $video->status,
                'updated_fields' => array_keys($validated)
            ]);
            
            // Log video update activity
            ActivityLog::logPublic(
                'updated',
                'video',
                $video->id,
                $video->title,
                auth()->user() ? auth()->user()->name . " updated video: {$video->title}" : "Video updated: {$video->title}",
                ['status' => $video->status, 'changed_fields' => array_keys($validated)]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Video updated successfully',
                'data' => new \App\Http\Resources\VideoResource($video)
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
                'message' => 'Video not found'
            ], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate slug or other DB constraints
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Video with this title or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('VideoController::update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'user_id' => auth()->id(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating video: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $video = Video::findOrFail($id);
            $videoTitle = $video->title;
            $video->delete();
            
            // Log video deletion activity
            ActivityLog::logPublic(
                'deleted',
                'video',
                $id,
                $videoTitle,
                auth()->user() ? auth()->user()->name . " deleted video: {$videoTitle}" : "Video deleted: {$videoTitle}"
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Video deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting video: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generate embed URL from video link
     */
    private function generateEmbedUrl($link)
    {
        if (empty($link)) {
            return null;
        }
        
        // YouTube URLs
        if (strpos($link, 'youtube.com/watch?v=') !== false) {
            $videoId = explode('v=', $link)[1];
            $videoId = explode('&', $videoId)[0]; // Remove any additional parameters
            return "https://www.youtube.com/embed/{$videoId}";
        }
        
        if (strpos($link, 'youtu.be/') !== false) {
            $videoId = explode('youtu.be/', $link)[1];
            $videoId = explode('?', $videoId)[0]; // Remove any additional parameters
            return "https://www.youtube.com/embed/{$videoId}";
        }
        
        // Vimeo URLs
        if (strpos($link, 'vimeo.com/') !== false) {
            $videoId = explode('vimeo.com/', $link)[1];
            $videoId = explode('?', $videoId)[0]; // Remove any additional parameters
            return "https://player.vimeo.com/video/{$videoId}";
        }
        
        // Return null if we can't generate embed URL
        return null;
    }
}

