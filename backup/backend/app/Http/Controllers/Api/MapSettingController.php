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
                'embed_url' => 'required|string',
                'location_name' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'is_active' => 'boolean',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                MapSetting::where('is_active', 1)->update(['is_active' => 0]);
            }

            $mapSetting = MapSetting::create($validated);

            return response()->json($mapSetting, 201);
        } catch (\Exception $e) {
            return response()->json([
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
                'embed_url' => 'sometimes|required|string',
                'location_name' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'is_active' => 'boolean',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                MapSetting::where('id', '!=', $id)
                    ->where('is_active', 1)
                    ->update(['is_active' => 0]);
            }

            $mapSetting->update($validated);

            return response()->json($mapSetting, 200);
        } catch (\Exception $e) {
            return response()->json([
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

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting map setting: ' . $e->getMessage()
            ], 500);
        }
    }
}

