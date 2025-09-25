export const ROUTES = {
  HOME: '/',
  TECHNIQUES: '/techniques',
  TOOLS: '/tools',
  ESSENTIALS: '/essentials',
  POTS: '/pots',
  ACCESSORIES: '/accessories',
  SUGGESTIONS: '/suggestions',
  VIDEOS: '/videos',
  BOOKS: '/books',
  ABOUT: '/about',
  LOGIN: '/login',
  ADMIN: '/admin',
} as const;

export const CONTENT_TYPES = {
  TECHNIQUE: 'technique',
  TOOL: 'tool',
  ESSENTIAL: 'essential',
  POT: 'pot',
  ACCESSORY: 'accessory',
  SUGGESTION: 'suggestion',
  VIDEO: 'video',
  BOOK: 'book',
} as const;

export const STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;