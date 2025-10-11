<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ImageController extends Controller
{
    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    /**
     * Upload image to Cloudinary - SIMPLE VERSION
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            // Check authentication
            $user = auth('sanctum')->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Check admin or moderator role
            if (!in_array($user->role, ['admin', 'moderator'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin or Moderator privileges required'
                ], 403);
            }

            // Simple validation
            $validator = Validator::make($request->all(), [
                'file' => 'required|image|max:10240', // Max 10MB
                'folder' => 'nullable|string',
                'model_type' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $folder = $request->input('folder', 'featured-images');
            $modelType = $request->input('model_type', 'video');

            Log::info('Image upload attempt', [
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'folder' => $folder,
                'model_type' => $modelType
            ]);

            // Upload to Cloudinary
            if ($modelType === 'video' || $modelType === 'article') {
                $result = $this->cloudinary->uploadFeaturedImage($file, $modelType);
            } elseif ($modelType === 'user' || $modelType === 'avatar') {
                $result = $this->cloudinary->uploadFeaturedImage($file, 'user');
            } else {
                $result = $this->cloudinary->upload($file, $folder);
            }

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'url' => $result['secure_url'],
                    'public_id' => $result['public_id'],
                    'folder' => $result['folder'] ?? $folder,
                    'width' => $result['width'] ?? null,
                    'height' => $result['height'] ?? null,
                    'format' => $result['format'] ?? null,
                    'bytes' => $result['bytes'] ?? null
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Image upload failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete image from Cloudinary
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'public_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $publicId = $request->input('public_id');
            $result = $this->cloudinary->destroy($publicId);

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Image delete failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get image URL with transformations
     */
    public function getUrl(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'public_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $publicId = $request->input('public_id');
            $transformations = $request->input('transformations');
            $url = $this->cloudinary->getUrl($publicId, $transformations);

            return response()->json([
                'success' => true,
                'data' => [
                    'url' => $url,
                    'public_id' => $publicId,
                    'transformations' => $transformations
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Get URL failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Get URL failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test upload without auth - NO fopen() usage
     */
    public function testUpload(Request $request): JsonResponse
    {
        try {
            // Simple validation
            $validator = Validator::make($request->all(), [
                'file' => 'required|image|max:10240', // Max 10MB
                'folder' => 'nullable|string',
                'model_type' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $folder = $request->input('folder', 'featured-images');
            $modelType = $request->input('model_type', 'video');

            Log::info('Test upload attempt (NO fopen)', [
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'folder' => $folder,
                'model_type' => $modelType,
                'is_valid' => $file->isValid()
            ]);

            // Upload to Cloudinary using new service (NO fopen())
            if ($modelType === 'video' || $modelType === 'article') {
                $result = $this->cloudinary->uploadFeaturedImage($file, $modelType);
            } else {
                $result = $this->cloudinary->upload($file, $folder);
            }

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully (NO fopen)',
                'data' => [
                    'url' => $result['secure_url'],
                    'public_id' => $result['public_id'],
                    'folder' => $result['folder'] ?? $folder,
                    'width' => $result['width'] ?? null,
                    'height' => $result['height'] ?? null,
                    'format' => $result['format'] ?? null,
                    'bytes' => $result['bytes'] ?? null
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Test upload failed (NO fopen)', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Test upload failed: ' . $e->getMessage()
            ], 500);
        }
    }
}