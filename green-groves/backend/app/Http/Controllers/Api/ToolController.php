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
}
