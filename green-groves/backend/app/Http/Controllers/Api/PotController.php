<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pot;
use App\Http\Resources\PotResource;
use Illuminate\Http\Request;

class PotController extends Controller
{
    public function index(Request $request)
    {
        $query = Pot::query();

        if ($request->has('material')) {
            $query->where('material', $request->material);
        }

        $perPage = $request->get('per_page', 10);
        $pots = $query->paginate($perPage);

        return PotResource::collection($pots);
    }

    public function show($id)
    {
        $pot = Pot::findOrFail($id);
        return new PotResource($pot);
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

        $Pot = Pot::create($request->all());
        return new PotResource($Pot);
    }

    public function update(Request $request, $id)
    {
        $Pot = Pot::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'views' => 'integer|min:0',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $Pot->update($request->all());
        return new PotResource($Pot);
    }

    public function destroy($id)
    {
        $Pot = Pot::findOrFail($id);
        $Pot->delete();
        
        return response()->json([
            'message' => 'Pot deleted successfully'
        ], 200);
    }

}