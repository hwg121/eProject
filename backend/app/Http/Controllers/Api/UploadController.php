<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    /**
     * Upload file (image or video)
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:10240', // 10MB max
            'type' => 'required|in:image,video'
        ]);

        try {
            $file = $request->file('file');
            $type = $request->input('type');
            
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;
            
            // Determine storage path based on type
            $path = $type === 'image' ? 'images' : 'videos';
            $fullPath = $path . '/' . $filename;
            
            // Store file
            $storedPath = $file->storeAs($path, $filename, 'public');
            
            // Generate public URL
            $url = Storage::disk('public')->url($storedPath);
            
            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $storedPath,
                'filename' => $filename,
                'type' => $type,
                'size' => $file->getSize()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete uploaded file
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            $path = $request->input('path');
            
            // Check if file exists
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'File deleted successfully'
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
