<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutUs;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class AboutUsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $aboutUs = AboutUs::where('status', 'published')->get();
            return response()->json([
                'success' => true,
                'data' => $aboutUs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching about us: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|string',
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'values' => 'nullable|string',
            'team_members' => 'nullable|array',
            'achievements' => 'nullable|array',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'address' => 'nullable|string',
            'social_links' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $aboutUs = AboutUs::create($validated);
        return response()->json([
            'success' => true,
            'data' => $aboutUs
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $aboutUs = AboutUs::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $aboutUs
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $aboutUs = AboutUs::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
            'image' => 'nullable|string',
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'values' => 'nullable|string',
            'team_members' => 'nullable|array',
            'achievements' => 'nullable|array',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'address' => 'nullable|string',
            'social_links' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $aboutUs->update($validated);
        return response()->json([
            'success' => true,
            'data' => $aboutUs
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $aboutUs = AboutUs::findOrFail($id);
        $aboutUs->delete();
        
        return response()->json(['message' => 'About Us content deleted successfully']);
    }

    /**
     * Get the active About Us content
     */
    public function active(): JsonResponse
    {
        $aboutUs = AboutUs::where('is_active', true)->first();
        
        if (!$aboutUs) {
            return response()->json(['message' => 'No active About Us content found'], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $aboutUs
        ]);
    }
}
