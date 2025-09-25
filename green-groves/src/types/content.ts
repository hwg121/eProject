export interface BaseContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

export interface Technique extends BaseContent {
  author: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  tags: string[];
  estimatedTime?: string;
  materials?: string[];
  steps?: string[];
}

export interface Tool extends BaseContent {
  brand: string;
  model: string;
  category: string;
  price: number;
  specifications: string;
  usage: string;
  rating: number;
  inStock: boolean;
  buyLink?: string;
}

export interface Essential extends BaseContent {
  type: string;
  size: string;
  material: string;
  phLevel?: string;
  nutrients?: string;
  usage: string;
  careInstructions: string;
  price?: number;
}

export interface Pot extends BaseContent {
  material: string;
  size: string;
  color: string;
  shape: string;
  capacity: string;
  drainageHoles: boolean;
  price: number;
  weight: string;
  durability: string;
  careInstructions: string;
}

export interface Accessory extends BaseContent {
  category: string;
  type: string;
  material: string;
  size: string;
  color: string;
  price: number;
  rating: number;
  isDecorative: boolean;
  weatherResistant: boolean;
  specifications: string;
}

export interface Suggestion extends BaseContent {
  category: string;
  type: string;
  price: number;
  rating: number;
  buyLink: string;
  pros: string[];
  cons: string[];
}

export interface Video extends BaseContent {
  instructor: string;
  category: string;
  duration: string;
  videoUrl: string;
  embedCode?: string;
  views: number;
  likes: number;
  tags: string[];
}

export interface Book extends BaseContent {
  author: string;
  category: string;
  isbn?: string;
  price: number;
  rating: number;
  buyLink: string;
  borrowLink?: string;
  publisher?: string;
  publishedYear?: number;
  pages?: number;
}