<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accessory;
use App\Http\Resources\AccessoryResource;
use Illuminate\Http\Request;

class AccessoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Accessory::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('material')) {
            $query->where('material', $request->material);
        }

        if ($request->has('is_waterproof')) {
            $query->where('is_waterproof', $request->boolean('is_waterproof'));
        }

        $perPage = $request->get('per_page', 10);
        $accessories = $query->paginate($perPage);

        return AccessoryResource::collection($accessories);
    }

    public function show($id)
    {
        $accessory = Accessory::findOrFail($id);
        return new AccessoryResource($accessory);
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

        $Accessory = Accessory::create($request->all());
        return new AccessoryResource($Accessory);
    }

    public function update(Request $request, $id)
    {
        $Accessory = Accessory::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $Accessory->update($request->all());
        return new AccessoryResource($Accessory);
    }

    public function destroy($id)
    {
        $Accessory = Accessory::findOrFail($id);
        $Accessory->delete();
        
        return response()->json([
            'message' => 'Accessory deleted successfully'
        ], 200);
    }

}