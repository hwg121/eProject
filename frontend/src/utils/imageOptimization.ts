// Image optimization utilities
export const optimizeImage = (src: string, width?: number, quality: number = 80): string => {
  // If it's a Pexels image, add optimization parameters
  if (src.includes('pexels.com')) {
    const baseUrl = src.split('?')[0];
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    params.append('q', quality.toString());
    params.append('auto', 'compress');
    return `${baseUrl}?${params.toString()}`;
  }
  
  // For other images, return as is
  return src;
};

export const getWebPImage = (src: string): string => {
  // Convert to WebP if supported
  if (src.includes('pexels.com')) {
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  return src;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};


