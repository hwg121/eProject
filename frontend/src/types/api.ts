// API response types for better type safety

export interface ApiVideo {
  id?: string | number;
  title?: string;
  description?: string;
  content?: string;
  transcript?: string;
  author?: string;
  instructor?: string;
  published_at?: string;
  created_at?: string;
  tags?: string[];
  categories?: string[];
  thumbnail?: string;
  imageUrl?: string;
  views?: number;
  likes?: number;
  duration?: string;
  embed_url?: string;
  video_url?: string;
  slug?: string;
}

export interface ApiEssential {
  id?: string | number;
  name?: string;
  description?: string;
  content?: string;
  details?: string;
  author?: string;
  manufacturer?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  categories?: string[];
  image?: string;
  imageUrl?: string;
  views?: number;
  likes?: number;
  price?: number;
  rating?: number;
  category?: string;
  brand?: string;
  weight?: string;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
  in_stock?: boolean;
  slug?: string;
}

export interface ApiArticle {
  id?: string | number;
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  published_at?: string;
  created_at?: string;
  tags?: string[];
  categories?: string[];
  image?: string;
  imageUrl?: string;
  views?: number;
  likes?: number;
  slug?: string;
}

export interface ApiTool {
  id?: string | number;
  name?: string;
  description?: string;
  content?: string;
  author?: string;
  manufacturer?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  categories?: string[];
  image?: string;
  imageUrl?: string;
  views?: number;
  likes?: number;
  price?: number;
  rating?: number;
  category?: string;
  brand?: string;
  in_stock?: boolean;
  slug?: string;
}

export interface ApiBook {
  id?: string | number;
  title?: string;
  description?: string;
  content?: string;
  author?: string;
  publisher?: string;
  published_at?: string;
  created_at?: string;
  tags?: string[];
  categories?: string[];
  image?: string;
  imageUrl?: string;
  views?: number;
  likes?: number;
  price?: number;
  rating?: number;
  isbn?: string;
  pages?: number;
  slug?: string;
}

export interface ApiPot {
  id?: string | number;
  name?: string;
  description?: string;
  content?: string;
  material?: string;
  dimensions?: string;
  drainage?: string;
  care_instructions?: string[];
  plant_compatibility?: string[];
  specifications?: string[];
  price?: number;
  rating?: number;
  views?: number;
  likes?: number;
  in_stock?: boolean;
  image?: string;
  imageUrl?: string;
  tags?: string[];
  published_at?: string;
  created_at?: string;
  author?: string;
  slug?: string;
}

export interface ApiAccessory {
  id?: string | number;
  name?: string;
  description?: string;
  content?: string;
  category?: string;
  brand?: string;
  price?: number;
  rating?: number;
  views?: number;
  likes?: number;
  in_stock?: boolean;
  image?: string;
  imageUrl?: string;
  tags?: string[];
  published_at?: string;
  created_at?: string;
  author?: string;
  usage?: string;
  benefits?: string[];
  specifications?: string[];
  slug?: string;
}

export interface ApiSuggestion {
  id?: string | number;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  difficulty_level?: string;
  season?: string;
  plant_type?: string;
  estimated_time?: string;
  rating?: number;
  views?: number;
  likes?: number;
  image?: string;
  imageUrl?: string;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  author?: string;
  price?: number;
  brand?: string;
  in_stock?: boolean;
  benefits?: string[];
  usage?: string;
  target_audience?: string[];
  specifications?: { [key: string]: string };
  pros?: string[];
  cons?: string[];
  reviews?: number;
  slug?: string;
}