<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Http\Resources\ToolResource;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    /**
     * Display a listing of tools.
     */
    public function index(Request $request)
    {
        $query = Tool::query();

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $tools = $query->paginate($perPage);

        return ToolResource::collection($tools);
    }

    /**
     * Display the specified tool.
     */
    public function show($id)
    {
        $tool = Tool::findOrFail($id);
        return new ToolResource($tool);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $Tool = Tool::create($request->all());
        return new ToolResource($Tool);
    }

    public function update(Request $request, $id)
    {
        $Tool = Tool::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $Tool->update($request->all());
        return new ToolResource($Tool);
    }

    public function destroy($id)
    {
        $Tool = Tool::findOrFail($id);
        $Tool->delete();
        
        return response()->json([
            'message' => 'Tool deleted successfully'
        ], 200);
    }

}