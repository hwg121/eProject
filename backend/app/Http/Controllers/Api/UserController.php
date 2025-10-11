<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\SecuritySetting;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sortBy', 'created_at');
        $sortOrder = $request->get('sortOrder', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|max:20',
                'phone_country_code' => 'nullable|string|max:5',
                'country' => 'nullable|string|max:10',
                'address' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:255',
                'zip_code' => 'nullable|string|max:20',
                'role' => ['required', Rule::in(['admin', 'moderator'])],
                'status' => ['required', Rule::in(['active', 'banned'])],
                'avatar' => 'nullable|string', // Accept avatar URL from Cloudinary
                'avatar_public_id' => 'nullable|string|max:255', // Accept public_id from Cloudinary
                'security_password' => 'nullable|string', // Required when creating admin
            ]);
            
            // Check if creating admin role
            if ($validated['role'] === 'admin') {
                // Require security password
                if (!isset($validated['security_password'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Security password is required to create admin user',
                        'requires_security_password' => true
                    ], 403);
                }
                
                // Validate security password using hash from database
                if (!SecuritySetting::verifyAdminPassword($validated['security_password'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid security password',
                        'requires_security_password' => true
                    ], 403);
                }
            }
            
            // Remove security_password from data before creating user
            unset($validated['security_password']);

            // Hash password
            $validated['password'] = Hash::make($validated['password']);

            // Handle avatar upload (if file is provided instead of URL)
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $avatarPath = $avatar->store('avatars', 'public');
                $validated['avatar'] = $avatarPath;
            }

            $user = User::create($validated);

            // Log user creation activity
            ActivityLog::logSecurity(
                'created',
                auth()->user() ? auth()->user()->name . " created user {$user->name}" : "User {$user->name} was created",
                [
                    'user_email' => $user->email,
                    'user_role' => $user->role,
                    'user_status' => $user->status
                ],
                'user',
                $user->id,
                $user->name
            );

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($id)],
                'password' => 'sometimes|string|min:8',
                'phone' => 'nullable|string|max:20',
                'phone_country_code' => 'nullable|string|max:5',
                'country' => 'nullable|string|max:10',
                'address' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:255',
                'zip_code' => 'nullable|string|max:20',
                'role' => ['sometimes', Rule::in(['admin', 'moderator'])],
                'status' => ['sometimes', Rule::in(['active', 'banned'])],
                'is_email_verified' => 'boolean',
                'avatar' => 'nullable|string', // Accept avatar URL from Cloudinary
                'avatar_public_id' => 'nullable|string|max:255', // Accept public_id from Cloudinary
                'security_password' => 'nullable|string', // Required when editing admin
            ]);
            
            // Check if changing role to admin OR if user is already admin
            $isChangingToAdmin = isset($validated['role']) && $validated['role'] === 'admin';
            $isAlreadyAdmin = $user->role === 'admin';
            
            if ($isChangingToAdmin || $isAlreadyAdmin) {
                // Require security password when:
                // 1. Changing any user to admin
                // 2. Editing an existing admin user
                if (!isset($validated['security_password'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Security password is required to create/edit admin user',
                        'requires_security_password' => true
                    ], 403);
                }
                
                // Validate security password using hash from database
                if (!SecuritySetting::verifyAdminPassword($validated['security_password'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid security password',
                        'requires_security_password' => true
                    ], 403);
                }
            }
            
            // Remove security_password from data before updating user
            unset($validated['security_password']);

            // Hash password if provided
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Handle avatar upload with Cloudinary
            if ($request->hasFile('avatar')) {
                try {
                    // Delete old avatar from Cloudinary if exists
                    if ($user->avatar_public_id) {
                        $this->cloudinary->destroy($user->avatar_public_id);
                    }
                    
                    // Upload new avatar to Cloudinary
                    $avatar = $request->file('avatar');
                    $result = $this->cloudinary->uploadFeaturedImage($avatar, 'user');
                    
                    $validated['avatar'] = $result['secure_url'];
                    $validated['avatar_public_id'] = $result['public_id'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Avatar upload failed: ' . $e->getMessage()
                    ], 500);
                }
            }

            $user->update($validated);

            // Log user update activity
            ActivityLog::logSecurity(
                'updated',
                auth()->user() ? auth()->user()->name . " updated user {$user->name}" : "User {$user->name} was updated",
                [
                    'user_email' => $user->email,
                    'user_role' => $user->role,
                    'user_status' => $user->status,
                    'changed_fields' => array_keys($validated)
                ],
                'user',
                $user->id,
                $user->name
            );

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user->fresh()
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            
            // Store user info before deleting
            $userName = $user->name;
            $userEmail = $user->email;
            $userRole = $user->role;

            // Delete avatar from Cloudinary if exists
            if ($user->avatar_public_id) {
                try {
                    $this->cloudinary->destroy($user->avatar_public_id);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete avatar from Cloudinary', [
                        'user_id' => $user->id,
                        'public_id' => $user->avatar_public_id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $user->delete();

            // Log user deletion activity
            ActivityLog::logSecurity(
                'deleted',
                auth()->user() ? auth()->user()->name . " deleted user {$userName}" : "User {$userName} was deleted",
                [
                    'user_email' => $userEmail,
                    'user_role' => $userRole
                ],
                'user',
                $id,
                $userName
            );

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current user profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Get recent logs for debugging
     */
    public function getLogs(Request $request): JsonResponse
    {
        try {
            $logFile = storage_path('logs/laravel.log');
            if (!file_exists($logFile)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Log file not found'
                ]);
            }
            
            $logs = file_get_contents($logFile);
            $recentLogs = array_slice(explode("\n", $logs), -50); // Last 50 lines
            
            return response()->json([
                'success' => true,
                'logs' => $recentLogs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reading logs: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Test endpoint for debugging
     */
    public function testProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            return response()->json([
                'success' => true,
                'message' => 'Test endpoint working',
                'data' => [
                    'user_id' => $user->id,
                    'request_method' => $request->method(),
                    'content_type' => $request->header('Content-Type'),
                    'request_data' => $request->all(),
                    'user_avatar' => $user->avatar,
                    'user_avatar_public_id' => $user->avatar_public_id
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update current user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
                'password' => 'sometimes|string|min:8',
                'phone' => 'nullable|string|max:20',
                'phone_country_code' => 'nullable|string|max:5',
                'country' => 'nullable|string|max:10',
                'address' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:255',
                'zip_code' => 'nullable|string|max:20',
                'role' => ['sometimes', Rule::in(['admin', 'moderator'])],
                'status' => ['sometimes', Rule::in(['active', 'banned'])],
                'avatar' => 'nullable|string', // Accept avatar URL from Cloudinary
                'avatar_public_id' => 'nullable|string|max:255', // Accept public_id from Cloudinary
            ]);

            // Hash password if provided
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Avatar is already uploaded to Cloudinary, just save URL and public_id

            $user->update($validated);

            // Refresh user data to get updated values
            $user->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Profile update validation failed', [
                'user_id' => $request->user()?->id,
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Profile update failed', [
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Profile update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update admin security password (Admin only)
     */
    public function updateSecurityPassword(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);
            
            // Verify current password
            if (!SecuritySetting::verifyAdminPassword($validated['current_password'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current security password is incorrect'
                ], 403);
            }
            
            // Update to new password
            SecuritySetting::updateAdminPassword($validated['new_password']);
            
            return response()->json([
                'success' => true,
                'message' => 'Security password updated successfully'
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update security password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload avatar for user (separate endpoint for admin)
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:3072', // 3MB max
                'model_type' => 'required|string|in:user',
                'user_id' => 'nullable|exists:users,id'
            ]);

            $user = $request->user();
            if ($validated['user_id']) {
                $user = User::findOrFail($validated['user_id']);
            }

            // Delete old avatar from Cloudinary if exists
            if ($user->avatar_public_id) {
                try {
                    $this->cloudinary->destroy($user->avatar_public_id);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete old avatar', [
                        'user_id' => $user->id,
                        'public_id' => $user->avatar_public_id,
                        'error' => $e->getMessage()
                    ]);
                }
            }
            
            // Upload new avatar to Cloudinary
            $avatar = $request->file('avatar');
            $result = $this->cloudinary->uploadFeaturedImage($avatar, 'user');
            
            // Update user with new avatar
            $user->update([
                'avatar' => $result['secure_url'],
                'avatar_public_id' => $result['public_id']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar uploaded successfully',
                'data' => [
                    'secure_url' => $result['secure_url'],
                    'public_id' => $result['public_id'],
                    'user_id' => $user->id
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Avatar upload failed', [
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Avatar upload failed: ' . $e->getMessage()
            ], 500);
        }
    }
}