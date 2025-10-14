<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class StaffMemberController extends Controller
{
    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    /**
     * Display a listing of the resource (Admin).
     */
    public function index(): JsonResponse
    {
        try {
            $staffMembers = StaffMember::orderBy('display_order', 'asc')->get();
            return response()->json($staffMembers, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching staff members: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active staff members (Public) - Limited to 5.
     */
    public function getActive(): JsonResponse
    {
        try {
            $staffMembers = StaffMember::getActiveStaff(5);
            return response()->json($staffMembers, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching active staff members: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:2|max:100',
                'role' => 'required|string|min:2|max:50',
                'short_bio' => 'required|string|min:10|max:1000',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:3072', // 3MB max
                'display_order' => 'nullable|integer|min:0|max:1000',
                'is_active' => 'boolean',
            ], [
                'name.required' => 'Staff member name is required.',
                'name.min' => 'Name must be at least 2 characters.',
                'name.max' => 'Name must not exceed 100 characters.',
                'role.required' => 'Role is required.',
                'role.min' => 'Role must be at least 2 characters.',
                'role.max' => 'Role must not exceed 50 characters.',
                'short_bio.required' => 'Bio is required.',
                'short_bio.min' => 'Bio must be at least 10 characters.',
                'short_bio.max' => 'Bio must not exceed 1000 characters.',
                'display_order.min' => 'Display order cannot be negative.',
                'display_order.max' => 'Display order cannot exceed 1000.',
            ]);

            // Upload avatar if provided
            if ($request->hasFile('avatar')) {
                try {
                    $avatar = $request->file('avatar');
                    $result = $this->cloudinary->uploadFeaturedImage($avatar, 'staff');
                    
                    $validated['avatar'] = $result['secure_url'];
                    $validated['avatar_public_id'] = $result['public_id'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Avatar upload failed: ' . $e->getMessage()
                    ], 500);
                }
            }

            $staffMember = StaffMember::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Staff member created successfully',
                'data' => $staffMember
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('StaffMemberController::store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating staff member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $staffMember = StaffMember::findOrFail($id);
            return response()->json($staffMember, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Staff member not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $staffMember = StaffMember::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|required|string|min:2|max:100',
                'role' => 'sometimes|required|string|min:2|max:50',
                'short_bio' => 'sometimes|required|string|min:10|max:1000',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:3072',
                'display_order' => 'nullable|integer|min:0|max:1000',
                'is_active' => 'boolean',
            ], [
                'name.min' => 'Name must be at least 2 characters.',
                'name.max' => 'Name must not exceed 100 characters.',
                'role.min' => 'Role must be at least 2 characters.',
                'role.max' => 'Role must not exceed 50 characters.',
                'short_bio.min' => 'Bio must be at least 10 characters.',
                'short_bio.max' => 'Bio must not exceed 1000 characters.',
                'display_order.min' => 'Display order cannot be negative.',
                'display_order.max' => 'Display order cannot exceed 1000.',
            ]);

            // Upload new avatar if provided
            if ($request->hasFile('avatar')) {
                try {
                    // Delete old avatar from Cloudinary if exists
                    if ($staffMember->avatar_public_id) {
                        try {
                            $this->cloudinary->delete($staffMember->avatar_public_id);
                        } catch (\Exception $e) {
                            Log::warning('Failed to delete old avatar from Cloudinary', [
                                'staff_id' => $staffMember->id,
                                'public_id' => $staffMember->avatar_public_id,
                                'error' => $e->getMessage()
                            ]);
                        }
                    }

                    // Upload new avatar to Cloudinary
                    $avatar = $request->file('avatar');
                    $result = $this->cloudinary->uploadFeaturedImage($avatar, 'staff');
                    
                    $validated['avatar'] = $result['secure_url'];
                    $validated['avatar_public_id'] = $result['public_id'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Avatar upload failed: ' . $e->getMessage()
                    ], 500);
                }
            }

            $staffMember->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Staff member updated successfully',
                'data' => $staffMember
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Staff member not found.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('StaffMemberController::update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating staff member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $staffMember = StaffMember::find($id);
            
            if (!$staffMember) {
                return response()->json([
                    'message' => 'Staff member not found'
                ], 404);
            }

            // Skip Cloudinary deletion for now to avoid errors
            // Just delete from database
            $staffMember->delete();

            return response()->json([
                'success' => true,
                'message' => 'Staff member deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('StaffMemberController::destroy failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting staff member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder staff members.
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            // Log incoming data for debugging
            Log::info('Staff reorder request', [
                'data' => $request->all()
            ]);

            $validated = $request->validate([
                'orders' => 'required|array',
                'orders.*.id' => 'required|integer|exists:staff_members,id',
                'orders.*.display_order' => 'required|integer',
            ]);

            foreach ($validated['orders'] as $order) {
                StaffMember::where('id', $order['id'])
                    ->update(['display_order' => $order['display_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Staff members reordered successfully'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Staff reorder validation failed', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Staff reorder failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error reordering staff members: ' . $e->getMessage()
            ], 500);
        }
    }
}

