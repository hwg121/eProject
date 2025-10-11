<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserInteraction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class InteractionController extends Controller
{
    /**
     * Get real public IP address from request
     */
    private function getRealIpAddress(Request $request): string
    {
        $ip = $request->header('CF-Connecting-IP') ?? // Cloudflare
              $request->header('X-Forwarded-For') ??  // Load balancer
              $request->header('X-Real-IP') ??        // Nginx proxy
              $request->ip();                         // Fallback
        
        // Handle comma-separated IPs (X-Forwarded-For can have multiple)
        $ip = explode(',', $ip)[0];
        $ip = trim($ip);
        
        return $ip;
    }
    /**
     * Toggle like for content
     */
    public function toggleLike(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content_type' => 'required|string|in:article,book,tool,video,pot,accessory,suggestion',
                'content_id' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userIp = $this->getRealIpAddress($request);
            $userId = auth()->id(); // null if not authenticated
        
        // Check if user already liked this content
        $existingLike = UserInteraction::forContent($request->content_type, $request->content_id)
            ->forUser($userIp, $userId)
            ->where('interaction_type', 'like')
            ->first();

        if ($existingLike) {
            // Unlike: delete the interaction
            $existingLike->delete();
            $isLiked = false;
        } else {
            // Like: create new interaction
            UserInteraction::create([
                'user_ip' => $userIp,
                'user_id' => $userId,
                'content_type' => $request->content_type,
                'content_id' => $request->content_id,
                'interaction_type' => 'like',
                'value' => 1
            ]);
            $isLiked = true;
        }

        // Get updated like count
        $likeCount = UserInteraction::forContent($request->content_type, $request->content_id)
            ->likes()
            ->count();

        // ✨ Sync like count to content table
        $this->updateContentLikeCount($request->content_type, $request->content_id, $likeCount);

            return response()->json([
                'success' => true,
                'is_liked' => $isLiked,
                'like_count' => $likeCount,
                'message' => $isLiked ? 'Content liked successfully' : 'Content unliked successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in toggleLike: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle like',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit rating for content
     */
    public function submitRating(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content_type' => 'required|string|in:article,book,tool,video,pot,accessory,suggestion',
                'content_id' => 'required|integer|min:1',
                'rating' => 'required|integer|min:1|max:5',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userIp = $this->getRealIpAddress($request);
            $userId = auth()->id(); // null if not authenticated
        
        // Check if user already rated this content
        $existingRating = UserInteraction::forContent($request->content_type, $request->content_id)
            ->forUser($userIp, $userId)
            ->where('interaction_type', 'rating')
            ->first();

        if ($existingRating) {
            // Update existing rating
            $existingRating->update([
                'value' => $request->rating,
                'rating_value' => $request->rating
            ]);
            $message = 'Rating updated successfully';
        } else {
            // Create new rating
            UserInteraction::create([
                'user_ip' => $userIp,
                'user_id' => $userId,
                'content_type' => $request->content_type,
                'content_id' => $request->content_id,
                'interaction_type' => 'rating',
                'value' => $request->rating,
                'rating_value' => $request->rating
            ]);
            $message = 'Rating submitted successfully';
        }

        // Get updated average rating
        $ratings = UserInteraction::forContent($request->content_type, $request->content_id)
            ->ratings()
            ->get();
            
        $averageRating = $ratings->avg('value');
        $ratingCount = $ratings->count();

        // ✨ Sync rating to content table
        $this->updateContentRating($request->content_type, $request->content_id, $averageRating);

            return response()->json([
                'success' => true,
                'rating' => $request->rating,
                'average_rating' => round($averageRating, 1),
                'rating_count' => $ratingCount,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in submitRating: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit rating',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's interactions for content
     */
    public function getUserInteractions(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content_type' => 'required|string|in:article,book,tool,video,pot,accessory,suggestion',
                'content_id' => 'required|integer|min:1',
            ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userIp = $this->getRealIpAddress($request);
        $userId = auth()->id();
        
        $interactions = UserInteraction::forContent($request->content_type, $request->content_id)
            ->forUser($userIp, $userId)
            ->get()
            ->keyBy('interaction_type');

        $userLike = $interactions->get('like');
        $userRating = $interactions->get('rating');

            return response()->json([
                'success' => true,
                'is_liked' => $userLike ? $userLike->value == 1 : false,
                'user_rating' => $userRating ? $userRating->value : 0,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getUserInteractions: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user interactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Track page view
     */
    public function trackView(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content_type' => 'required|string|in:article,book,tool,video,pot,accessory,suggestion,product',
                'content_id' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get real public IP address
            $userIp = $this->getRealIpAddress($request);
            
            $userId = auth()->id();
            
            // Check if user already viewed this content in the last hour
            $cacheKey = "view_{$userIp}_{$request->content_type}_{$request->content_id}";
            
            // Always try to update view count directly on content table
            try {
                $this->updateContentViewCount($request->content_type, $request->content_id);
            } catch (\Exception $dbError) {
                \Log::error('Database error updating view count: ' . $dbError->getMessage());
            }

            // Try to record interaction if possible
            if (!\Cache::has($cacheKey)) {
                try {
                    UserInteraction::create([
                        'user_ip' => $userIp,
                        'user_id' => $userId,
                        'content_type' => $request->content_type,
                        'content_id' => $request->content_id,
                        'interaction_type' => 'view',
                        'value' => 1
                    ]);
                    \Cache::put($cacheKey, true, 3600);
                } catch (\Exception $dbError) {
                    \Log::error('Database error recording interaction: ' . $dbError->getMessage());
                }
            }

            // Get view count from content table instead of interactions
            $viewCount = 1; // Default fallback
            try {
                if (in_array($request->content_type, ['tool', 'book', 'pot', 'accessory', 'suggestion', 'essential', 'product'])) {
                    $product = \App\Models\Product::where('id', $request->content_id)->first();
                    $viewCount = $product ? $product->views : 1;
                } elseif ($request->content_type === 'article') {
                    $article = \App\Models\Article::where('id', $request->content_id)->first();
                    $viewCount = $article ? $article->views : 1;
                } elseif ($request->content_type === 'video') {
                    $video = \App\Models\Video::where('id', $request->content_id)->first();
                    $viewCount = $video ? $video->views : 1;
                }
            } catch (\Exception $e) {
                \Log::error('Error getting view count: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'view_count' => $viewCount,
                'message' => 'View tracked successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in trackView: ' . $e->getMessage());
            return response()->json([
                'success' => true, // Return success even on error to avoid breaking frontend
                'view_count' => 1,
                'message' => 'View tracked (fallback mode)'
            ]);
        }
    }

    /**
     * Update content view count in the respective table
     */
    private function updateContentViewCount($contentType, $contentId)
    {
        try {
            if (in_array($contentType, ['tool', 'book', 'pot', 'accessory', 'suggestion', 'essential', 'product'])) {
                // All product types use the unified Product model
                \App\Models\Product::where('id', $contentId)->increment('views');
            } elseif ($contentType === 'article') {
                \App\Models\Article::where('id', $contentId)->increment('views');
            } elseif ($contentType === 'video') {
                \App\Models\Video::where('id', $contentId)->increment('views');
            }
        } catch (\Exception $e) {
            // Log error but don't break the request
            \Log::error('Failed to update view count: ' . $e->getMessage());
        }
    }

    /**
     * Get model class for content type
     */
    private function getModelClass($contentType)
    {
        $models = [
            'article' => \App\Models\Article::class,
            'video' => \App\Models\Video::class,
            // All product types now use the unified Product model
            'book' => \App\Models\Product::class,
            'tool' => \App\Models\Product::class,
            'essential' => \App\Models\Product::class,
            'pot' => \App\Models\Product::class,
            'accessory' => \App\Models\Product::class,
            'suggestion' => \App\Models\Product::class,
        ];

        return $models[$contentType] ?? null;
    }

    /**
     * Update like count in content table (articles/videos)
     */
    private function updateContentLikeCount($contentType, $contentId, $likeCount)
    {
        try {
            if (in_array($contentType, ['tool', 'book', 'pot', 'accessory', 'suggestion', 'essential'])) {
                \App\Models\Product::where('id', $contentId)->update(['likes' => $likeCount]);
            } elseif ($contentType === 'article') {
                \App\Models\Article::where('id', $contentId)->update(['likes' => $likeCount]);
            } elseif ($contentType === 'video') {
                \App\Models\Video::where('id', $contentId)->update(['likes' => $likeCount]);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to update like count in content table: ' . $e->getMessage());
        }
    }

    /**
     * Update rating in content table (articles/videos)
     */
    private function updateContentRating($contentType, $contentId, $averageRating)
    {
        try {
            $roundedRating = $averageRating ? round($averageRating, 2) : 0;
            
            if (in_array($contentType, ['tool', 'book', 'pot', 'accessory', 'suggestion', 'essential'])) {
                \App\Models\Product::where('id', $contentId)->update(['rating' => $roundedRating]);
            } elseif ($contentType === 'article') {
                \App\Models\Article::where('id', $contentId)->update(['rating' => $roundedRating]);
            } elseif ($contentType === 'video') {
                \App\Models\Video::where('id', $contentId)->update(['rating' => $roundedRating]);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to update rating in content table: ' . $e->getMessage());
        }
    }

    /**
     * Get content statistics
     */
    public function getContentStats(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content_type' => 'required|string|in:article,book,tool,video,pot,accessory,suggestion',
                'content_id' => 'required|integer|min:1',
            ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $likeCount = UserInteraction::forContent($request->content_type, $request->content_id)
            ->likes()
            ->count();

        $viewCount = UserInteraction::forContent($request->content_type, $request->content_id)
            ->where('interaction_type', 'view')
            ->count();

        $ratings = UserInteraction::forContent($request->content_type, $request->content_id)
            ->ratings()
            ->get();

        $averageRating = $ratings->avg('value');
        $ratingCount = $ratings->count();

            return response()->json([
                'success' => true,
                'like_count' => $likeCount,
                'view_count' => $viewCount,
                'average_rating' => $averageRating ? round($averageRating, 1) : 0,
                'rating_count' => $ratingCount,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getContentStats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get content stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}