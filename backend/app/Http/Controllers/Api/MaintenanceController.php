<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MaintenanceResource;
use App\Models\MaintenanceSetting;
use App\Models\SecuritySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class MaintenanceController extends Controller
{
    /**
     * Get maintenance status (public endpoint)
     */
    public function status()
    {
        try {
            $maintenance = MaintenanceSetting::current();
            
            return response()->json([
                'success' => true,
                'data' => new MaintenanceResource($maintenance)
            ]);
        } catch (\Exception $e) {
            Log::error('MaintenanceController::status failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get maintenance status'
            ], 500);
        }
    }

    /**
     * Get maintenance settings (admin only)
     */
    public function show(Request $request)
    {
        try {
            // Check authentication and admin role
            $user = auth()->user();
            if (!$user || $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $maintenance = MaintenanceSetting::with('enabledBy')->first() ?? MaintenanceSetting::current();
            
            return response()->json([
                'success' => true,
                'data' => new MaintenanceResource($maintenance)
            ]);
        } catch (\Exception $e) {
            Log::error('MaintenanceController::show failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get maintenance settings'
            ], 500);
        }
    }

    /**
     * Update maintenance settings (admin only, requires security password)
     */
    public function update(Request $request)
    {
        try {
            // Check authentication and admin role
            $user = auth()->user();
            if (!$user || $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Validate request
            $request->validate([
                'is_enabled' => 'required|boolean',
                'message' => 'nullable|string|max:1000',
                'estimated_end_at' => 'nullable|date',
                'security_password' => 'required|string',
            ]);

            // Verify security password
            $securitySetting = SecuritySetting::where('key', 'admin_verification_password')->first();
            if (!$securitySetting || !Hash::check($request->security_password, $securitySetting->value)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid security password',
                    'errors' => [
                        'security_password' => ['The security password is incorrect.']
                    ]
                ], 422); // Use 422 for validation errors, not 401 to avoid logout
            }

            // Update maintenance setting
            $maintenance = MaintenanceSetting::current();
            
            $data = [
                'is_enabled' => $request->is_enabled,
                'message' => $request->message ?? 'We are currently performing scheduled maintenance. We will be back shortly.',
            ];

            if ($request->is_enabled) {
                $data['started_at'] = now();
                $data['enabled_by'] = $user->id;
            } else {
                $data['started_at'] = null;
                $data['enabled_by'] = null;
            }

            if ($request->estimated_end_at) {
                // Convert UTC time from frontend to Asia/Ho_Chi_Minh timezone
                $utcTime = \Carbon\Carbon::parse($request->estimated_end_at, 'UTC');
                $data['estimated_end_at'] = $utcTime->setTimezone('Asia/Ho_Chi_Minh');
            } else {
                $data['estimated_end_at'] = null;
            }

            $maintenance->update($data);

            // Log activity
            Log::info('Maintenance mode updated', [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'is_enabled' => $request->is_enabled,
            ]);

            // Refresh to get the latest data with relationships
            $maintenance = $maintenance->fresh(['enabledBy']);
            
            return response()->json([
                'success' => true,
                'message' => $request->is_enabled 
                    ? 'Maintenance mode enabled successfully' 
                    : 'Maintenance mode disabled successfully',
                'data' => new MaintenanceResource($maintenance)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('MaintenanceController::update failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update maintenance settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update maintenance message and estimated end time (no security password required)
     */
    public function updateContent(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'message' => 'nullable|string|max:1000',
                'estimated_end_at' => 'nullable|date',
            ]);

            // Update maintenance setting
            $maintenance = MaintenanceSetting::current();
            
            $data = [];
            
            if ($request->has('message')) {
                $data['message'] = $request->message;
            }
            
            if ($request->has('estimated_end_at')) {
                // Convert UTC time from frontend to Asia/Ho_Chi_Minh timezone
                $utcTime = \Carbon\Carbon::parse($request->estimated_end_at, 'UTC');
                $data['estimated_end_at'] = $utcTime->setTimezone('Asia/Ho_Chi_Minh');
            }

            $maintenance->update($data);

            // Log activity
            Log::info('Maintenance content updated', [
                'user_id' => auth()->id(),
                'updated_fields' => array_keys($data),
            ]);

            // Refresh to get the latest data with relationships
            $maintenance = $maintenance->fresh(['enabledBy']);
            
            return response()->json([
                'success' => true,
                'message' => 'Maintenance content updated successfully',
                'data' => new MaintenanceResource($maintenance)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('MaintenanceController::updateContent failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update maintenance content: ' . $e->getMessage()
            ], 500);
        }
    }
}

