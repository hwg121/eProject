<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class ResponseCacheMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): BaseResponse
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Generate cache key
        $cacheKey = 'response_' . md5($request->fullUrl() . serialize($request->all()));
        
        // Check if response is cached
        $cachedResponse = Cache::get($cacheKey);
        if ($cachedResponse) {
            return Response::make($cachedResponse['content'], 200, $cachedResponse['headers']);
        }

        // Get response
        $response = $next($request);

        // Cache successful responses
        if ($response->getStatusCode() === 200) {
            $cacheTime = $this->getCacheTime($request);
            if ($cacheTime > 0) {
                Cache::put($cacheKey, [
                    'content' => $response->getContent(),
                    'headers' => $response->headers->all()
                ], $cacheTime);
            }
        }

        return $response;
    }

    /**
     * Get cache time based on request path
     */
    private function getCacheTime(Request $request): int
    {
        $path = $request->path();
        
        // Cache times in seconds
        $cacheTimes = [
            'api/articles' => 300,      // 5 minutes
            'api/tools' => 300,         // 5 minutes
            'api/videos' => 300,        // 5 minutes
            'api/books' => 300,         // 5 minutes
            'api/pots' => 300,          // 5 minutes
            'api/accessories' => 300,   // 5 minutes
            'api/essentials' => 300,    // 5 minutes
            'api/suggestions' => 300,   // 5 minutes
            'api/categories' => 600,    // 10 minutes
            'api/about-us' => 1800,     // 30 minutes
        ];

        foreach ($cacheTimes as $pattern => $time) {
            if (str_starts_with($path, $pattern)) {
                return $time;
            }
        }

        return 0; // Don't cache
    }
}
