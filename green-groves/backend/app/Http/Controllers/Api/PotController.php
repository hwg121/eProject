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
}
