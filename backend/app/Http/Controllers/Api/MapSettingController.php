<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MapSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MapSettingController extends Controller
{
    /**
     * Display a listing of the resource (Admin).
     */
    public function index(): JsonResponse
    {
        try {
            $mapSettings = MapSetting::orderBy('created_at', 'desc')->get();
            return response()->json($mapSettings, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching map settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the active map setting (Public).
     */
    public function getActive(): JsonResponse
    {
        try {
            $mapSetting = MapSetting::getActive();
            
            if (!$mapSetting) {
                return response()->json([
                    'message' => 'No active map setting found'
                ], 404);
            }

            return response()->json($mapSetting, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching map setting: ' . $e->getMessage()
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
                'embed_url' => 'required|string|min:10|max:5000',
                'location_name' => 'nullable|string|min:3|max:100',
                'address' => 'nullable|string|min:5|max:200',
                'is_active' => 'boolean',
            ], [
                'embed_url.required' => 'Map embed code is required.',
                'embed_url.min' => 'Embed code must be at least 10 characters.',
                'embed_url.max' => 'Embed code must not exceed 5000 characters.',
                'location_name.min' => 'Location name must be at least 3 characters.',
                'location_name.max' => 'Location name must not exceed 100 characters.',
                'address.min' => 'Address must be at least 5 characters.',
                'address.max' => 'Address must not exceed 200 characters.',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                MapSetting::where('is_active', 1)->update(['is_active' => 0]);
            }

            $mapSetting = MapSetting::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Map setting created successfully',
                'data' => $mapSetting
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('MapSettingController::store failed', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating map setting: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $mapSetting = MapSetting::findOrFail($id);
            return response()->json($mapSetting, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Map setting not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $mapSetting = MapSetting::findOrFail($id);
            
            $validated = $request->validate([
                'embed_url' => 'sometimes|required|string|min:10|max:5000',
                'location_name' => 'nullable|string|min:3|max:100',
                'address' => 'nullable|string|min:5|max:200',
                'is_active' => 'boolean',
            ], [
                'embed_url.min' => 'Embed code must be at least 10 characters.',
                'embed_url.max' => 'Embed code must not exceed 5000 characters.',
                'location_name.min' => 'Location name must be at least 3 characters.',
                'location_name.max' => 'Location name must not exceed 100 characters.',
                'address.min' => 'Address must be at least 5 characters.',
                'address.max' => 'Address must not exceed 200 characters.',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                MapSetting::where('id', '!=', $id)
                    ->where('is_active', 1)
                    ->update(['is_active' => 0]);
            }

            $mapSetting->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Map setting updated successfully',
                'data' => $mapSetting
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
                'message' => 'Map setting not found.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('MapSettingController::update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating map setting: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $mapSetting = MapSetting::find($id);
            
            if (!$mapSetting) {
                return response()->json([
                    'message' => 'Map setting not found'
                ], 404);
            }

            $mapSetting->delete();

            return response()->json([
                'success' => true,
                'message' => 'Map setting deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('MapSettingController::destroy failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting map setting: ' . $e->getMessage()
            ], 500);
        }
    }
}

