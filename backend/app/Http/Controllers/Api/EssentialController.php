<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Essential;
use Illuminate\Http\Request;

class EssentialController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Essential::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->where('status', 'published');
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $essentials = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $essentials->items(),
                'meta' => [
                    'current_page' => $essentials->currentPage(),
                    'last_page' => $essentials->lastPage(),
                    'per_page' => $essentials->perPage(),
                    'total' => $essentials->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching essentials: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $essential = Essential::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $essential
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching essential: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|string|max:255',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'content' => 'nullable|string',
                'image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'required|in:published,archived',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'brand' => 'nullable|string',
                'material' => 'nullable|string',
                'size' => 'nullable|string',
                'color' => 'nullable|string',
                'is_waterproof' => 'nullable|boolean',
                'is_durable' => 'nullable|boolean',
                'season' => 'nullable|string',
            ]);

            $essential = Essential::create($validated);

            return response()->json([
                'success' => true,
                'data' => $essential
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating essential: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $essential = Essential::findOrFail($id);

            $validated = $request->validate([
                'type' => 'sometimes|string|max:255',
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'content' => 'nullable|string',
                'image' => 'nullable|string',
                'cover' => 'nullable|string',
                'status' => 'sometimes|in:published,archived',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'brand' => 'nullable|string',
                'material' => 'nullable|string',
                'size' => 'nullable|string',
                'color' => 'nullable|string',
                'is_waterproof' => 'nullable|boolean',
                'is_durable' => 'nullable|boolean',
                'season' => 'nullable|string',
            ]);

            $essential->update($validated);

            return response()->json([
                'success' => true,
                'data' => $essential
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating essential: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $essential = Essential::findOrFail($id);
            $essential->delete();

            return response()->json([
                'success' => true,
                'message' => 'Essential deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting essential: ' . $e->getMessage()
            ], 500);
        }
    }
}