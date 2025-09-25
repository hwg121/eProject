import { Technique, Tool, Essential, Pot, Accessory, Suggestion, Video, Book } from '../types/content';

export const initialTechniques: Technique[] = [
  {
    id: '1',
    title: 'Container Gardening for Small Spaces',
    description: 'Learn how to maximize your garden productivity in small spaces using containers and vertical growing techniques.',
    imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
    author: 'Sarah Green',
    category: 'Beginner',
    difficulty: 'beginner',
    content: 'Container gardening is perfect for those with limited space. Start by choosing the right containers with proper drainage. Select plants that thrive in containers like herbs, lettuce, and cherry tomatoes. Use quality potting mix and ensure adequate sunlight.',
    tags: ['container', 'small-space', 'urban', 'beginner'],
    estimatedTime: '2-3 hours setup',
    materials: ['Containers with drainage', 'Quality potting mix', 'Seeds or seedlings', 'Watering can'],
    steps: [
      'Choose containers with drainage holes',
      'Fill with quality potting mix',
      'Plant seeds or seedlings at proper depth',
      'Water gently and place in sunny location',
      'Monitor daily and water as needed'
    ],
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    featured: true
  }
];

export const initialTools: Tool[] = [
  {
    id: '1',
    title: 'Professional Pruning Shears',
    description: 'High-quality steel pruning shears for precise cuts and healthy plant maintenance.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    brand: 'GardenPro',
    model: 'GP-2024',
    category: 'Cutting Tools',
    price: 29.99,
    specifications: 'Steel blade, ergonomic handle, 8-inch length, rust-resistant coating',
    usage: 'Perfect for pruning roses, small branches, and deadheading flowers. Clean after each use and oil regularly.',
    rating: 4.8,
    inStock: true,
    buyLink: 'https://example.com/buy-pruning-shears',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    featured: true
  }
];

export const initialEssentials: Essential[] = [
  {
    id: '1',
    title: 'Organic Compost',
    description: 'Rich organic compost for healthy plant growth and soil improvement.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    type: 'Soil Amendment',
    size: '40lb bag',
    material: 'Organic matter, decomposed plant material',
    phLevel: '6.5-7.0',
    nutrients: 'High in NPK, beneficial microorganisms',
    usage: 'Mix 1:3 ratio with garden soil for best results',
    careInstructions: 'Store in dry place, mix with existing soil before planting',
    price: 24.99,
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];

export const initialPots: Pot[] = [
  {
    id: '1',
    title: 'Ceramic Garden Pot',
    description: 'Beautiful ceramic pot perfect for indoor and outdoor plants with excellent drainage.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    material: 'Ceramic',
    size: '12 inches diameter',
    color: 'Terracotta',
    shape: 'Round',
    capacity: '2 gallons',
    drainageHoles: true,
    price: 24.99,
    weight: '3.5 lbs',
    durability: '10+ years with proper care',
    careInstructions: 'Clean with mild soap, protect from freezing temperatures',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];

export const initialAccessories: Accessory[] = [
  {
    id: '1',
    title: 'Solar Garden Lights',
    description: 'Beautiful solar-powered LED lights for garden decoration and pathway lighting.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    category: 'Lighting',
    type: 'Decorative',
    material: 'Stainless Steel',
    size: '12 inches tall',
    color: 'Warm White LED',
    price: 29.99,
    rating: 4.7,
    isDecorative: true,
    weatherResistant: true,
    specifications: 'LED lights, solar powered, 8-hour runtime, IP65 waterproof',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];

export const initialSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Best Pruning Shears 2024',
    description: 'Top-rated pruning shears for professional results and long-lasting performance.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    category: 'Tools',
    type: 'Cutting Tool',
    price: 29.99,
    rating: 4.6,
    buyLink: 'https://example.com/buy-shears',
    pros: ['Sharp steel blades', 'Ergonomic design', 'Rust resistant', 'Easy to clean'],
    cons: ['Higher price point', 'Requires regular maintenance'],
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    featured: true
  }
];

export const initialVideos: Video[] = [
  {
    id: '1',
    title: 'Pruning Techniques for Beginners',
    description: 'Learn basic pruning techniques to keep your plants healthy and promote better growth.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    instructor: 'Emma Nature',
    category: 'Techniques',
    duration: '12:45',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    embedCode: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
    views: 9834,
    likes: 567,
    tags: ['pruning', 'beginner', 'plant-care'],
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];

export const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Well-Tended Perennial Garden',
    description: 'A comprehensive guide to creating and maintaining beautiful perennial gardens that bloom year after year.',
    imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    author: 'Tracy DiSabato-Aust',
    category: 'Perennials',
    isbn: '978-1604692556',
    price: 24.95,
    rating: 4.8,
    buyLink: 'https://example.com/buy-perennial-garden',
    borrowLink: 'https://example.com/borrow-perennial-garden',
    publisher: 'Timber Press',
    publishedYear: 2017,
    pages: 320,
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];