// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  author_id: string;
  category: string;
  tags?: string[];
  featured_image?: string;
  status: 'published' | 'draft';
  views: number;
  likes?: number;
  meta_title?: string;
  meta_description?: string;
  slug: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  featured_image?: string;
  status: 'published' | 'draft';
  meta_title?: string;
  meta_description?: string;
}

// Video Types
export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  instructor_id: string;
  category: string;
  tags?: string[];
  thumbnail: string;
  video_url: string;
  embed_code?: string;
  status: 'published' | 'draft';
  views: number;
  likes?: number;
  meta_title?: string;
  meta_description?: string;
  slug: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVideoRequest {
  title: string;
  description: string;
  duration: string;
  category: string;
  tags?: string[];
  thumbnail: string;
  video_url: string;
  embed_code?: string;
  status: 'published' | 'draft';
  meta_title?: string;
  meta_description?: string;
}

// Tool Types
export interface Tool {
  id: string;
  name: string;
  description: string;
  usage: string;
  category: string;
  price_range?: string;
  image: string;
  video_url?: string;
  affiliate_link?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  isbn?: string;
  image: string;
  buy_link: string;
  borrow_link?: string;
  rating?: number;
  price?: string;
  created_at: string;
  updated_at: string;
}

// Site Settings Types
export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  site_keywords?: string;
  logo?: string;
  favicon?: string;
  hero_title: string;
  hero_subtitle: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  contact_address?: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  analytics_code?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_users: number;
  total_articles: number;
  total_videos: number;
  total_views: number;
  total_tools: number;
  total_books: number;
  avg_rating: number;
  monthly_growth: number;
  weekly_growth: number;
  daily_growth: number;
}

// Analytics Types
export interface AnalyticsData {
  page_views: {
    total: number;
    data: Array<{
      date: string;
      views: number;
    }>;
  };
  popular_content: Array<{
    id: string;
    title: string;
    type: 'article' | 'video';
    views: number;
  }>;
  user_activity: Array<{
    date: string;
    new_users: number;
    active_users: number;
  }>;
  top_categories: Array<{
    category: string;
    count: number;
  }>;
}

// File Upload Types
export interface UploadResponse {
  url: string;
  path: string;
  filename: string;
  size: number;
  mime_type: string;
}

// Search and Filter Types
export interface SearchParams {
  search?: string;
  category?: string;
  status?: 'published' | 'draft';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status_code: number;
}