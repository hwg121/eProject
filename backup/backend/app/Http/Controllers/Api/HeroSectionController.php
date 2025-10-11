<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HeroSectionController extends Controller
{
    /**
     * Display a listing of the resource (Admin).
     */
    public function index(): JsonResponse
    {
        try {
            $heroSections = HeroSection::orderBy('created_at', 'desc')->get();
            return response()->json($heroSections, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching hero sections: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the active hero section (Public).
     */
    public function getActive(): JsonResponse
    {
        try {
            $heroSection = HeroSection::getActive();
            
            if (!$heroSection) {
                return response()->json([
                    'message' => 'No active hero section found'
                ], 404);
            }

            return response()->json($heroSection, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching hero section: ' . $e->getMessage()
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
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'is_active' => 'boolean',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                HeroSection::where('is_active', 1)->update(['is_active' => 0]);
            }

            $heroSection = HeroSection::create($validated);

            return response()->json($heroSection, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating hero section: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $heroSection = HeroSection::findOrFail($id);
            return response()->json($heroSection, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hero section not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $heroSection = HeroSection::findOrFail($id);
            
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'is_active' => 'boolean',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                HeroSection::where('id', '!=', $id)
                    ->where('is_active', 1)
                    ->update(['is_active' => 0]);
            }

            $heroSection->update($validated);

            return response()->json($heroSection, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating hero section: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $heroSection = HeroSection::findOrFail($id);
            $heroSection->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting hero section: ' . $e->getMessage()
            ], 500);
        }
    }
}

