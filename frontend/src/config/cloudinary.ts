// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  // Your actual Cloudinary credentials
  CLOUD_NAME: 'ddjyzgflp',
  UPLOAD_PRESET: 'featured-images', // You'll need to create this preset
  
  // Upload URL
  UPLOAD_URL: `https://api.cloudinary.com/v1_1/ddjyzgflp/image/upload`,
  
  // Image transformations (optional)
  TRANSFORMATIONS: {
    // Auto format and quality
    AUTO_FORMAT: 'f_auto,q_auto',
    
    // Thumbnail size
    THUMBNAIL: 'w_300,h_200,c_fill',
    
    // Medium size
    MEDIUM: 'w_800,h_600,c_fill',
    
    // Large size
    LARGE: 'w_1200,h_800,c_fill',
  }
};

// Helper function to get Cloudinary URL with transformations
export const getCloudinaryUrl = (publicId: string, transformation?: string) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`;
  
  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`;
  }
  
  return `${baseUrl}/${CLOUDINARY_CONFIG.AUTO_FORMAT}/${publicId}`;
};

// Helper function to upload file to Cloudinary
export const uploadToCloudinary = async (
  file: File, 
  folder: string = 'featured-images'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(CLOUDINARY_CONFIG.UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
};
