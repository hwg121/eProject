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
}