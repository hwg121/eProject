import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../services/api';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // in MB
  shape?: 'rounded' | 'rounded-full'; // Shape of the image
  modelType?: string; // For backend folder
  folder?: string; // For backend folder
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  className = '',
  placeholder = 'Click to upload image',
  accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  maxSize = 10,
  shape = 'rounded',
  modelType,
  folder
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  // Upload via backend API
  const uploadToBackend = async (file: File): Promise<string> => {
    const uploadFolder = folder || 'featured-images';
    const uploadModelType = modelType || 'video';
    const response = await apiClient.uploadImage(file, uploadFolder, uploadModelType);
    
    // Extract URL from response object - check both 'url' and 'secure_url'
    if (response && typeof response === 'object' && 'success' in response && response.success && 'data' in response && response.data && typeof response.data === 'object') {
      // Check for 'url' first, then 'secure_url' as fallback
      if ('url' in response.data) {
        return response.data.url as string;
      } else if ('secure_url' in response.data) {
        return response.data.secure_url as string;
      }
    }
    
    // Fallback if response is already a string
    if (typeof response === 'string') {
      return response;
    }
    
    console.error('Invalid response format:', response);
    throw new Error('Invalid response format from upload API');
  };

  const handleFileSelect = async (file: File) => {
    // Basic validation
    const maxSizeBytes = Math.min(maxSize * 1024 * 1024, 10 * 1024 * 1024);
    if (file.size > maxSizeBytes) {
      onError?.(`File size must be less than ${Math.min(maxSize, 10)}MB`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onError?.('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Auto upload to Cloudinary
    setIsUploading(true);
    
    try {
      const cloudinaryUrl = await uploadToBackend(file);
      
      // Update with Cloudinary URL and notify parent
      // Ensure we're passing a string, not an object
      const imageUrl = typeof cloudinaryUrl === 'string' ? cloudinaryUrl : 
                      (cloudinaryUrl && typeof cloudinaryUrl === 'object' && cloudinaryUrl.url) ? cloudinaryUrl.url :
                      (cloudinaryUrl && typeof cloudinaryUrl === 'object' && cloudinaryUrl.secure_url) ? cloudinaryUrl.secure_url :
                      cloudinaryUrl;
      
      onChange(imageUrl);
      setPreview(imageUrl);
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      onError?.(errorMessage);
      
      // Keep preview and notify parent with local URL as fallback
      onChange(previewUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className={`
          ${shape === 'rounded-full' ? 'w-32 h-32 mx-auto flex items-center justify-center' : 'w-full'} border-2 border-dashed ${shape === 'rounded-full' ? 'rounded-full' : 'rounded-lg'} ${shape === 'rounded-full' ? 'p-0' : 'p-4'} cursor-pointer transition-all duration-200
          ${preview ? 'border-green-500 bg-green-50 hover:bg-green-100' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        `}
        aria-label={preview ? "Change featured image" : "Upload featured image"}
        aria-describedby={preview ? "image-preview" : "upload-instructions"}
      >
        {preview ? (
          <div className={`relative ${shape === 'rounded-full' ? 'w-full h-full' : ''}`}>
            <img
              src={preview}
              alt="Image preview"
              className={`w-full h-full object-cover ${shape}`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <div className={`text-center ${shape === 'rounded-full' ? 'flex flex-col items-center justify-center h-full' : ''}`}>
            <div className="text-gray-500 mb-2">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300"></div>
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium mt-2">Uploading image...</span>
                  <span className="text-xs text-gray-500 mt-1">Please wait</span>
                </div>
              ) : (
                <>
                  <svg className={`mx-auto text-gray-400 ${shape === 'rounded-full' ? 'h-8 w-8' : 'h-12 w-12'}`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {shape !== 'rounded-full' && (
                    <>
                      <p className="text-sm text-gray-600 mt-2" id="upload-instructions">{placeholder}</p>
                      <p className="text-xs text-gray-500 mt-1">Max size: {Math.min(maxSize, 10)}MB • JPG, PNG, GIF, WebP</p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default ImageUpload;

