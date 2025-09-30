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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'usage' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price_range' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'video_url' => 'nullable|url',
            'affiliate_link' => 'nullable|url',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $tool = Tool::create($request->all());
        return new ToolResource($tool);
    }

    public function update(Request $request, $id)
    {
        $tool = Tool::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'usage' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price_range' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'video_url' => 'nullable|url',
            'affiliate_link' => 'nullable|url',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $tool->update($request->all());
        return new ToolResource($tool);
    }

    public function destroy($id)
    {
        $tool = Tool::findOrFail($id);
        $tool->delete();
        
        return response()->json([
            'message' => 'Tool deleted successfully'
        ], 200);
    }

}