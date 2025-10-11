<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get user from request (set by auth:sanctum middleware)
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
                'error' => 'UNAUTHENTICATED'
            ], 401);
        }

        // Check if user has admin or moderator role
        if (!in_array($user->role, ['admin', 'moderator'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin or Moderator privileges required.',
                'error' => 'INSUFFICIENT_PRIVILEGES'
            ], 403);
        }

        return $next($request);
    }
}
