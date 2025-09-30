<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SimpleController extends Controller
{
    public function test()
    {
        return response()->json([
            'message' => 'Simple controller working',
            'timestamp' => now(),
            'status' => 'ok'
        ]);
    }

    public function articles()
    {
        try {
            return response()->json([
                'message' => 'Articles endpoint working',
                'data' => [],
                'status' => 'ok'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Articles error',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function tools()
    {
        try {
            return response()->json([
                'message' => 'Tools endpoint working',
                'data' => [],
                'status' => 'ok'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Tools error',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function videos()
    {
        try {
            return response()->json([
                'message' => 'Videos endpoint working',
                'data' => [],
                'status' => 'ok'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Videos error',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function books()
    {
        try {
            return response()->json([
                'message' => 'Books endpoint working',
                'data' => [],
                'status' => 'ok'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Books error',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}
