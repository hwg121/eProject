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
}
