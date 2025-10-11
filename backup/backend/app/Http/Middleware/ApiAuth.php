<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Debug logging
        \Log::info('ApiAuth Middleware - Request details:', [
            'url' => $request->url(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'authorization_header' => $request->header('Authorization')
        ]);
        
        // Check if request has authorization header
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader) {
            \Log::warning('ApiAuth Middleware - No authorization header');
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
                'error' => 'UNAUTHORIZED'
            ], 401);
        }

        // Check if it's a Bearer token
        if (!str_starts_with($authHeader, 'Bearer ')) {
            \Log::warning('ApiAuth Middleware - Invalid authorization format', [
                'auth_header' => $authHeader
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid authorization format. Expected: Bearer <token>',
                'error' => 'INVALID_AUTH_FORMAT'
            ], 401);
        }

        // Extract token
        $token = substr($authHeader, 7); // Remove 'Bearer ' prefix
        
        \Log::info('ApiAuth Middleware - Token extracted:', [
            'token' => $token,
            'token_length' => strlen($token)
        ]);

        // For demo purposes, accept 'demo-token-123' as valid
        if ($token === 'demo-token-123') {
            \Log::info('ApiAuth Middleware - Valid demo token, proceeding');
            // Add user info to request for demo
            $request->merge(['auth_user' => [
                'id' => 1,
                'email' => 'admin@greengroves.com',
                'name' => 'Admin User',
                'role' => 'admin'
            ]]);
            
            return $next($request);
        }

        // For production, you would validate the token here
        // Example: check against database, JWT validation, etc.
        
        \Log::warning('ApiAuth Middleware - Invalid token', [
            'token' => $token,
            'expected' => 'demo-token-123'
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired token',
            'error' => 'INVALID_TOKEN'
        ], 401);
    }
}
