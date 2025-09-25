<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get user from request (set by ApiAuth middleware)
        $user = $request->get('auth_user');

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
                'error' => 'UNAUTHENTICATED'
            ], 401);
        }

        // Check if user has admin role
        if ($user['role'] !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.',
                'error' => 'INSUFFICIENT_PRIVILEGES'
            ], 403);
        }

        return $next($request);
    }
}
