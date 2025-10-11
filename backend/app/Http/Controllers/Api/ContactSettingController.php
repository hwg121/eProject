<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ContactSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $contactSettings = ContactSetting::orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $contactSettings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contact settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active contact settings for public display
     */
    public function getActive(): JsonResponse
    {
        try {
            $contactSetting = ContactSetting::getActive();
            
            return response()->json([
                'success' => true,
                'data' => $contactSetting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch active contact settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'nullable|email',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'website' => 'nullable|url',
                'facebook' => 'nullable|url',
                'instagram' => 'nullable|url',
                'youtube' => 'nullable|url',
                'linkedin' => 'nullable|url',
                'working_hours' => 'nullable|string|max:200',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // If setting this as active, deactivate others
            if ($request->input('is_active', false)) {
                ContactSetting::where('is_active', true)->update(['is_active' => false]);
            }

            $contactSetting = ContactSetting::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Contact settings created successfully',
                'data' => $contactSetting
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create contact settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $contactSetting = ContactSetting::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $contactSetting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact settings not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $contactSetting = ContactSetting::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'email' => 'nullable|email',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'website' => 'nullable|url',
                'facebook' => 'nullable|url',
                'instagram' => 'nullable|url',
                'youtube' => 'nullable|url',
                'linkedin' => 'nullable|url',
                'working_hours' => 'nullable|string|max:200',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // If setting this as active, deactivate others
            if ($request->input('is_active', false)) {
                ContactSetting::where('is_active', true)
                    ->where('id', '!=', $id)
                    ->update(['is_active' => false]);
            }

            $contactSetting->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Contact settings updated successfully',
                'data' => $contactSetting
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $contactSetting = ContactSetting::findOrFail($id);
            $contactSetting->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact settings deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
