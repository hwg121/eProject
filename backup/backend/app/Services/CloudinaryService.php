<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class CloudinaryService
{
    private $cloudName;
    private $apiKey;
    private $apiSecret;
    private $uploadPreset;

    public function __construct()
    {
        $this->cloudName = config('cloudinary.cloud_name');
        $this->apiKey = config('cloudinary.api_key');
        $this->apiSecret = config('cloudinary.api_secret');
        
        // Use direct preset names instead of env variables
        $this->uploadPreset = 'feature-images'; // Default preset name

        if (empty($this->cloudName)) {
            Log::error('Cloudinary configuration missing');
            throw new \Exception('Cloudinary cloud_name not configured');
        }
    }

    /**
     * Upload file using direct HTTP request - NO fopen() usage
     */
    public function upload($file, $folder = 'featured-images', $preset = null)
    {
        try {
            $finalPreset = $preset ?: $this->uploadPreset;
            Log::info('Starting upload', [
                'folder' => $folder,
                'preset' => $finalPreset,
                'cloud_name' => $this->cloudName
            ]);

            // Get file info without using fopen()
            $fileInfo = $this->getFileInfoSafely($file);
            
            Log::info('File info retrieved', [
                'path' => $fileInfo['path'],
                'filename' => $fileInfo['filename'],
                'mime_type' => $fileInfo['mime_type']
            ]);

            // Prepare upload parameters for unsigned preset
            // Use CURLFile for proper file upload
            $params = [
                'file' => new \CURLFile($fileInfo['path'], $fileInfo['mime_type'], $fileInfo['filename']),
                'upload_preset' => $finalPreset,
                'folder' => $folder
            ];

            // Upload to Cloudinary using cURL for proper file upload
            $uploadUrl = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $uploadUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($curlError) {
                throw new \Exception('cURL error: ' . $curlError);
            }

            if ($httpCode === 200) {
                $result = json_decode($response, true);
                Log::info('Upload successful', [
                    'public_id' => $result['public_id'],
                    'url' => $result['secure_url']
                ]);
                return $result;
            } else {
                Log::error('Upload failed', [
                    'status' => $httpCode,
                    'body' => $response
                ]);
                throw new \Exception('Upload failed: ' . $response);
            }

        } catch (\Exception $e) {
            Log::error('Upload error', [
                'error' => $e->getMessage(),
                'folder' => $folder
            ]);
            throw $e;
        }
    }

    /**
     * Get file info safely without fopen()
     */
    private function getFileInfoSafely($file)
    {
        if ($file instanceof \Illuminate\Http\UploadedFile) {
            // For UploadedFile, get temporary file path
            $tempPath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            
            Log::info('UploadedFile info retrieved', [
                'temp_path' => $tempPath,
                'filename' => $filename,
                'mime_type' => $mimeType,
                'size' => $file->getSize()
            ]);
            
            return [
                'path' => $tempPath,
                'filename' => $filename,
                'mime_type' => $mimeType
            ];
        } elseif (is_string($file)) {
            // For file paths, use file_get_contents (safer than fopen)
            if (file_exists($file)) {
                $mimeType = mime_content_type($file);
                $filename = basename($file);
                
                Log::info('File info retrieved from path', [
                    'path' => $file,
                    'filename' => $filename,
                    'mime_type' => $mimeType
                ]);
                
                return [
                    'path' => $file,
                    'filename' => $filename,
                    'mime_type' => $mimeType
                ];
            } else {
                throw new \Exception('File not found: ' . $file);
            }
        } else {
            throw new \Exception('Invalid file type');
        }
    }

    /**
     * Generate Cloudinary signature (for signed requests like delete)
     */
    private function generateSignature($params)
    {
        $signatureString = '';
        ksort($params);
        
        foreach ($params as $key => $value) {
            if ($key !== 'file' && $key !== 'signature') {
                $signatureString .= $key . '=' . $value . '&';
            }
        }
        
        $signatureString = rtrim($signatureString, '&');
        $signatureString .= $this->apiSecret;
        
        return sha1($signatureString);
    }

    /**
     * Upload featured image
     */
    public function uploadFeaturedImage($file, $modelType = 'video')
    {
        $folder = match($modelType) {
            'video' => 'featured-images',
            'article' => 'featured-images',
            'product' => 'product-images',
            'about' => 'about-us',
            'user' => 'user-avatar',
            default => 'featured-images'
        };

        $preset = match($modelType) {
            'video' => 'feature-images',
            'article' => 'feature-images', 
            'product' => 'product-images',
            'about' => 'covers',
            'user' => 'user-avatar',
            default => 'feature-images'
        };

        return $this->upload($file, $folder, $preset);
    }

    /**
     * Delete image from Cloudinary (requires signed request)
     */
    public function destroy($publicId)
    {
        try {
            $params = [
                'public_id' => $publicId,
                'api_key' => $this->apiKey,
                'timestamp' => time()
            ];

            // Generate signature for delete (delete requires signed request)
            $signature = $this->generateSignature($params);
            $params['signature'] = $signature;

            $response = Http::timeout(30)->post("https://api.cloudinary.com/v1_1/{$this->cloudName}/image/destroy", $params);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Image deleted successfully', [
                    'public_id' => $publicId,
                    'result' => $result['result']
                ]);
                return $result;
            } else {
                Log::error('Delete failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Delete failed: ' . $response->body());
            }

        } catch (\Exception $e) {
            Log::error('Delete error', [
                'error' => $e->getMessage(),
                'public_id' => $publicId
            ]);
            throw $e;
        }
    }

    /**
     * Get image URL with transformations
     */
    public function getUrl($publicId, $transformations = null)
    {
        $baseUrl = "https://res.cloudinary.com/{$this->cloudName}/image/upload";
        
        if ($transformations) {
            $baseUrl .= "/{$transformations}";
        }
        
        $baseUrl .= "/{$publicId}";
        
        return $baseUrl;
    }

    /**
     * Test configuration
     */
    public function testConfiguration()
    {
        return [
            'cloud_name' => $this->cloudName ?: 'NOT_SET',
            'api_key' => $this->apiKey ?: 'NOT_SET',
            'has_api_secret' => !empty($this->apiSecret),
            'upload_preset' => $this->uploadPreset ?: 'NOT_SET'
        ];
    }
}