<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBanned
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if ($user && $user->isBanned()) {
            // If API request, return JSON
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been banned. Please contact administrator.',
                    'banned' => true
                ], 403);
            }
            
            // For web requests, logout and redirect
            auth()->logout();
            return redirect('/login')->with('error', 'Your account has been banned.');
        }

        return $next($request);
    }
}
