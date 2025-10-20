<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use App\Models\ActivityLog;
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
                'title' => 'required|string|min:3|max:100',
                'description' => 'required|string|min:10|max:500',
                'is_active' => 'boolean',
            ], [
                'title.required' => 'Title is required.',
                'title.min' => 'Title must be at least 3 characters.',
                'title.max' => 'Title must not exceed 100 characters.',
                'description.required' => 'Description is required.',
                'description.min' => 'Description must be at least 10 characters.',
                'description.max' => 'Description must not exceed 500 characters.',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                HeroSection::where('is_active', 1)->update(['is_active' => 0]);
            }

            $heroSection = HeroSection::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Hero section created successfully',
                'data' => $heroSection
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('HeroSectionController::store failed', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
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
                'title' => 'sometimes|required|string|min:3|max:100',
                'description' => 'sometimes|required|string|min:10|max:500',
                'is_active' => 'boolean',
            ], [
                'title.min' => 'Title must be at least 3 characters.',
                'title.max' => 'Title must not exceed 100 characters.',
                'description.min' => 'Description must be at least 10 characters.',
                'description.max' => 'Description must not exceed 500 characters.',
            ]);

            // If setting as active, deactivate others
            if (isset($validated['is_active']) && $validated['is_active']) {
                HeroSection::where('id', '!=', $id)
                    ->where('is_active', 1)
                    ->update(['is_active' => 0]);
            }

            $heroSection->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Hero section updated successfully',
                'data' => $heroSection
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
                'message' => 'Hero section not found.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('HeroSectionController::update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
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
            $heroTitle = $heroSection->title;
            $heroSection->delete();
            
            // Log hero section deletion
            ActivityLog::logPublic(
                'deleted',
                'hero_section',
                $id,
                $heroTitle,
                auth()->user() ? auth()->user()->name . " deleted hero section: {$heroTitle}" : "Hero section deleted: {$heroTitle}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Hero section deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hero section not found.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('HeroSectionController::destroy failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting hero section: ' . $e->getMessage()
            ], 500);
        }
    }
}

