<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Rules\StrongPassword;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
                'error' => 'INVALID_CREDENTIALS'
            ], 401);
        }

        // Check if user is banned
        if ($user->isBanned()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been banned. Please contact administrator.',
                'error' => 'ACCOUNT_BANNED',
                'banned' => true
            ], 403);
        }

        // Create token using Sanctum
        $token = $user->createToken('auth-token', ['*'])->plainTextToken;

        // Log login activity
        ActivityLog::logSecurity(
            'login',
            "User {$user->name} logged in",
            [
                'user_email' => $user->email,
                'user_role' => $user->role,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ],
            'user',
            $user->id,
            $user->name
        );

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                    'avatar_public_id' => $user->avatar_public_id,
                    'phone' => $user->phone,
                    'phone_country_code' => $user->phone_country_code,
                    'country' => $user->country,
                    'address' => $user->address,
                    'city' => $user->city,
                    'zip_code' => $user->zip_code,
                    'is_banned' => $user->is_banned,
                    'first_login' => $user->first_login,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]
        ]);
    }

    /**
     * Logout user and revoke token
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Get current user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                    'avatar_public_id' => $user->avatar_public_id,
                    'phone' => $user->phone,
                    'phone_country_code' => $user->phone_country_code,
                    'country' => $user->country,
                    'address' => $user->address,
                    'city' => $user->city,
                    'zip_code' => $user->zip_code,
                    'is_banned' => $user->is_banned,
                    'first_login' => $user->first_login,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]
        ]);
    }

    /**
     * Refresh token (logout and login again)
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Delete current token
        $request->user()->currentAccessToken()->delete();
        
        // Create new token using Sanctum
        $token = $user->createToken('auth-token', ['*'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                    'avatar_public_id' => $user->avatar_public_id,
                    'phone' => $user->phone,
                    'phone_country_code' => $user->phone_country_code,
                    'country' => $user->country,
                    'address' => $user->address,
                    'city' => $user->city,
                    'zip_code' => $user->zip_code,
                    'is_banned' => $user->is_banned,
                    'first_login' => $user->first_login,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]
        ]);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'currentPassword' => 'required',
                'newPassword' => ['required', new StrongPassword()],
                'confirmPassword' => 'required|same:newPassword',
            ]);

            $user = $request->user();

            // Verify current password
            if (!Hash::check($validated['currentPassword'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect',
                    'error' => 'INVALID_CURRENT_PASSWORD'
                ], 400);
            }

            // Check if new password is different from current
            if (Hash::check($validated['newPassword'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'New password must be different from current password',
                    'error' => 'SAME_PASSWORD'
                ], 400);
            }

            // Update password
            $user->password = Hash::make($validated['newPassword']);
            $user->first_login = false; // Mark as not first login anymore
            $user->save();

            // Log password change activity
            ActivityLog::logSecurity(
                'password_change',
                "User {$user->name} changed password",
                [
                    'user_email' => $user->email,
                    'user_role' => $user->role,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ],
                'user',
                $user->id,
                $user->name
            );

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'status' => $user->status,
                        'first_login' => $user->first_login,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Change password error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while changing password: ' . $e->getMessage(),
                'error' => 'INTERNAL_ERROR'
            ], 500);
        }
    }
}
