export interface ContentItem {
  id: string;
  title: string;
  author?: string;
  instructor?: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views?: number;
  likes?: number;
  rating?: number;
  link?: string;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  isWaterproof?: boolean;
  isDurable?: boolean;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  type?: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  featured_image?: string;
  videoUrl?: string;
  embedUrl?: string;
  buyLink?: string;
  borrowLink?: string;
  slug?: string;
  cover?: string;
  content?: string;
  body?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  embedCode?: string;
  duration?: string;
  isbn?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  type: string;
}

export interface TopContentItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  type: string;
}

export interface ContentFormProps {
  type: string;
  item: ContentItem | null;
  categories: string[];
  onSave: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalVisitors?: number;
  visitorGrowth?: number;
  totalViews: number;
  totalArticles: number;
  totalVideos: number;
  totalBooks: number;
  totalSuggestions: number;
  totalAboutUs: number;
  totalContactMessages: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
  avgRating: number;
  // Product counts for charts
  totalTools?: number;
  totalPots?: number;
  totalAccessories?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'banned';
  avatar?: string;
  avatar_public_id?: string;
  phone?: string;
  phone_country_code?: string;
  country?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  is_banned?: boolean;
  createdAt: string;
  updatedAt: string;
}
