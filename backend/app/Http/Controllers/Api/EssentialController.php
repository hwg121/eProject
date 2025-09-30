<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Essential;
use App\Http\Resources\EssentialResource;
use Illuminate\Http\Request;

class EssentialController extends Controller
{
    public function index(Request $request)
    {
        $query = Essential::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('season')) {
            $query->where('season', $request->season);
        }

        $perPage = $request->get('per_page', 10);
        $essentials = $query->paginate($perPage);

        return EssentialResource::collection($essentials);
    }

    public function show($id)
    {
        $essential = Essential::findOrFail($id);
        return new EssentialResource($essential);
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

        $Essential = Essential::create($request->all());
        return new EssentialResource($Essential);
    }

    public function update(Request $request, $id)
    {
        $Essential = Essential::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $Essential->update($request->all());
        return new EssentialResource($Essential);
    }

    public function destroy($id)
    {
        $Essential = Essential::findOrFail($id);
        $Essential->delete();
        
        return response()->json([
            'message' => 'Essential deleted successfully'
        ], 200);
    }

}