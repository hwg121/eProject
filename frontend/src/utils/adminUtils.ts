import { ContentItem } from '../types/admin';

// Transform functions to convert API data to ContentItem format
export const transformArticleToContentItem = (article: any): ContentItem => ({
  id: article.id.toString(),
  title: article.title,
  slug: article.slug, // Add slug for proper URL routing
  author: article.authorUser?.name || article.creator?.name || 'Unknown Author',
  authorUser: article.authorUser,
  creator: article.creator,
  author_id: article.author_id,
  category: article.category || 'Technique', // Use category from API, fallback to 'Technique'
  status: article.status || 'published',
  views: article.views || 0,
  likes: article.likes || 0,
  rating: article.rating || 0,
  createdAt: article.createdAt || article.created_at || new Date().toISOString(),
  updatedAt: article.updatedAt || article.updated_at || new Date().toISOString(),
  featured: article.featured || article.is_featured || false,
  description: article.excerpt || article.description || (article.body ? article.body.substring(0, 150) + '...' : ''),
  content: article.body || article.content || '',
  tags: article.tags || [],
  imageUrl: article.featured_image || article.cover || '/image.png',
  featured_image: article.featured_image || article.cover || ''
});

export const transformVideoToContentItem = (video: any): ContentItem & { embedUrl?: string } => ({
  id: video.id.toString(),
  title: video.title,
  slug: video.slug, // Add slug for proper URL routing
  instructor: video.authorUser?.name || video.creator?.name || 'Unknown Author',
  authorUser: video.authorUser,
  creator: video.creator,
  author_id: video.author_id,
  category: 'Video',
  status: video.status || 'published',
  featured: video.is_featured || false,
  views: video.views || 0,
  likes: video.likes || 0,
  rating: video.rating || 0,
  createdAt: video.createdAt || video.created_at || new Date().toISOString(),
  updatedAt: video.updatedAt || video.updated_at || new Date().toISOString(),
  description: video.description || video.excerpt || '',
  content: video.content || video.transcript || '',
  tags: video.tags || [],
  videoUrl: video.video_url || video.videoUrl || '',
  embedUrl: video.embed_url || video.embedUrl || '',
  imageUrl: video.featured_image || '/image.png',
  featured_image: video.featured_image || ''
});

export const transformBookToContentItem = (book: any): ContentItem => ({
  id: book.id.toString(),
  name: book.name || book.title,
  title: book.title || book.name,
  author: book.authorUser?.name || book.creator?.name || 'Unknown Author',
  authorUser: book.authorUser,
  creator: book.creator,
  author_id: book.author_id,
  category: 'book',
  subcategory: book.subcategory || '',
  status: book.status || 'published',
  price: book.price,
  rating: book.rating || 4.5,
  featured: book.is_featured || false,
  createdAt: book.createdAt || book.created_at || new Date().toISOString(),
  updatedAt: book.updatedAt || book.updated_at || new Date().toISOString(),
  description: book.description,
  tags: book.tags || [],
  image: book.image || '/image.png',
  imageUrl: book.image || '/image.png',
  featured_image: book.image || ''
});

export const transformToolToContentItem = (tool: any): ContentItem => ({
  id: tool.id.toString(),
  name: tool.name || tool.title,
  title: tool.title || tool.name,
  author: tool.authorUser?.name || tool.creator?.name || 'Unknown Author',
  authorUser: tool.authorUser,
  creator: tool.creator,
  author_id: tool.author_id,
  category: 'tool',
  subcategory: tool.subcategory || '',
  status: tool.status || 'published',
  link: tool.link,
  brand: tool.brand,
  material: tool.material,
  size: tool.size,
  color: tool.color,
  price: tool.price,
  featured: tool.is_featured || false,
  isWaterproof: tool.is_waterproof || false,
  isDurable: tool.is_durable || false,
  views: tool.views || 0,
  likes: tool.likes || 0,
  rating: tool.rating || 0,
  createdAt: tool.createdAt || tool.created_at || new Date().toISOString(),
  updatedAt: tool.updatedAt || tool.updated_at || new Date().toISOString(),
  description: tool.description,
  content: tool.content,
  tags: tool.tags || [],
  cover: tool.cover,
  image: tool.image || '/image.png',
  imageUrl: tool.image || '/image.png'
});

export const transformEssentialToContentItem = (essential: any): ContentItem => ({
  id: essential.id.toString(),
  title: essential.name,
  author: essential.authorUser?.name || essential.creator?.name || 'Unknown Author',
  authorUser: essential.authorUser,
  creator: essential.creator,
  author_id: essential.author_id,
  category: 'Tool',
  status: essential.status || 'published',
  link: essential.link,
  brand: essential.brand,
  material: essential.material,
  size: essential.size,
  color: essential.color,
  isWaterproof: essential.is_waterproof || false,
  isDurable: essential.is_durable || false,
  views: essential.views || 0,
  likes: essential.likes || 0,
  rating: essential.rating || 0,
  createdAt: essential.createdAt || essential.created_at || new Date().toISOString(),
  updatedAt: essential.updatedAt || essential.updated_at || new Date().toISOString(),
  description: essential.description,
  content: essential.content,
  tags: essential.tags || [],
  cover: essential.cover,
  imageUrl: essential.image || '/image.png'
});

export const transformPotToContentItem = (pot: any): ContentItem => ({
  id: pot.id.toString(),
  name: pot.name || pot.title,
  title: pot.title || pot.name,
  author: pot.authorUser?.name || pot.creator?.name || 'Unknown Author',
  authorUser: pot.authorUser,
  creator: pot.creator,
  author_id: pot.author_id,
  category: 'pot',
  subcategory: pot.subcategory || '',
  status: pot.status || 'published',
  link: pot.link,
  brand: pot.brand,
  material: pot.material,
  size: pot.size,
  color: pot.color,
  price: pot.price,
  featured: pot.is_featured || false,
  isWaterproof: pot.is_waterproof || false,
  isDurable: pot.is_durable || false,
  views: pot.views || 0,
  likes: pot.likes || 0,
  rating: pot.rating || 0,
  createdAt: pot.createdAt || pot.created_at || new Date().toISOString(),
  updatedAt: pot.updatedAt || pot.updated_at || new Date().toISOString(),
  description: pot.description,
  content: pot.content,
  tags: pot.tags || [],
  cover: pot.cover,
  image: pot.image || '/image.png',
  imageUrl: pot.image || '/image.png'
});

export const transformAccessoryToContentItem = (accessory: any): ContentItem => ({
  id: accessory.id.toString(),
  name: accessory.name || accessory.title,
  title: accessory.title || accessory.name,
  author: accessory.authorUser?.name || accessory.creator?.name || 'Unknown Author',
  authorUser: accessory.authorUser,
  creator: accessory.creator,
  author_id: accessory.author_id,
  category: 'accessory',
  subcategory: accessory.subcategory || '',
  status: accessory.status || 'published',
  link: accessory.link,
  brand: accessory.brand,
  material: accessory.material,
  size: accessory.size,
  color: accessory.color,
  price: accessory.price,
  featured: accessory.is_featured || false,
  isWaterproof: accessory.is_waterproof || false,
  isDurable: accessory.is_durable || false,
  views: accessory.views || 0,
  likes: accessory.likes || 0,
  rating: accessory.rating || 0,
  createdAt: accessory.createdAt || accessory.created_at || new Date().toISOString(),
  updatedAt: accessory.updatedAt || accessory.updated_at || new Date().toISOString(),
  description: accessory.description,
  content: accessory.content,
  tags: accessory.tags || [],
  cover: accessory.cover,
  image: accessory.image || '/image.png',
  imageUrl: accessory.image || '/image.png'
});

export const transformSuggestionToContentItem = (suggestion: any): ContentItem => ({
  id: suggestion.id.toString(),
  name: suggestion.name || suggestion.title,
  title: suggestion.title || suggestion.name,
  author: suggestion.authorUser?.name || suggestion.creator?.name || 'Unknown Author',
  authorUser: suggestion.authorUser,
  creator: suggestion.creator,
  author_id: suggestion.author_id,
  category: 'suggestion',
  subcategory: suggestion.subcategory || '',
  status: suggestion.status || 'published',
  price: suggestion.price,
  rating: suggestion.rating || 0,
  views: suggestion.views || 0,
  likes: suggestion.likes || 0,
  createdAt: suggestion.createdAt || suggestion.created_at || new Date().toISOString(),
  updatedAt: suggestion.updatedAt || suggestion.updated_at || new Date().toISOString(),
  description: suggestion.description,
  image: suggestion.image || '/image.png',
  imageUrl: suggestion.image || '/image.png',
  featured_image: suggestion.image || '',
  featured: suggestion.is_featured || false,
  difficulty: suggestion.difficulty_level || 'beginner',
  tags: suggestion.tags || []
});

export const transformAboutUsToContentItem = (aboutUs: any): ContentItem => ({
  id: aboutUs.id.toString(),
  title: aboutUs.title,
  category: 'About Us',
  status: aboutUs.is_active ? 'published' : 'archived',
  rating: 5.0,
  views: 0,
  likes: 0,
  createdAt: aboutUs.createdAt || aboutUs.created_at || new Date().toISOString(),
  updatedAt: aboutUs.updatedAt || aboutUs.updated_at || new Date().toISOString(),
  description: aboutUs.description,
  imageUrl: aboutUs.image || '/image.png',
  featured: aboutUs.is_active || false,
  author: 'Admin',
  tags: []
});

// Utility functions
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateProductSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Content sorting function
export const sortContent = (content: ContentItem[], sortBy: string): ContentItem[] => {
  try {
    return [...content].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
  } catch (error) {
    console.error('Error sorting content:', error);
    return content; // Return original array if sorting fails
  }
};

// Validation functions
export const validateForm = (formData: any): boolean => {
  if (!formData.title.trim()) {
    alert('Title is required!');
    return false;
  }
  if (!formData.description.trim()) {
    alert('Description is required!');
    return false;
  }
  if (!formData.category) {
    alert('Category is required!');
    return false;
  }
  return true;
};

export const validateProductForm = (productFormData: any): boolean => {
  if (!productFormData.title.trim()) {
    alert('Product name is required!');
    return false;
  }
  if (!productFormData.description.trim()) {
    alert('Description is required!');
    return false;
  }
  if (!productFormData.category) {
    alert('Category is required!');
    return false;
  }
  return true;
};

// File validation for avatar upload
export const validateAvatarFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please select a valid image file (JPEG, JPG, PNG, GIF)');
    return false;
  }
  
  if (file.size > 3 * 1024 * 1024) {
    alert('File size must be less than 3MB');
    return false;
  }
  
  return true;
};
