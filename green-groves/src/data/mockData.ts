// Mock data for the application
export interface Tool {
  id: number;
  name: string;
  description: string;
  usage: string;
  videoUrl?: string;
  image: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  buyLink: string;
  borrowLink: string;
  image: string;
  price?: number;
}

export interface Seed {
  id: number;
  name: string;
  season: string;
  care: string;
  description: string;
  image: string;
}

export const tools: Tool[] = [
  {
    id: 1,
    name: "Garden Trowel",
    description: "Essential hand tool for digging, planting, and weeding",
    usage: "Perfect for transplanting seedlings and precise digging work",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg"
  },
  {
    id: 2,
    name: "Pruning Shears",
    description: "Sharp cutting tool for trimming plants and branches",
    usage: "Ideal for deadheading flowers and cutting small branches",
    image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg"
  },
  {
    id: 3,
    name: "Watering Can",
    description: "Container for watering plants with controlled flow",
    usage: "Gentle watering for seedlings and indoor plants",
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg"
  }
];

export const articles: Article[] = [
  {
    id: 1,
    title: "Small Space Gardening: Maximum Yield in Minimum Space",
    content: "Learn how to maximize your garden productivity even in the smallest spaces. From vertical growing to container gardening, discover techniques that work.",
    author: "Sarah Green",
    date: "2024-01-15",
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg"
  },
  {
    id: 2,
    title: "Companion Planting: Nature's Perfect Partnerships",
    content: "Discover which plants thrive together and how companion planting can improve your garden's health and productivity naturally.",
    author: "Mike Garden",
    date: "2024-01-10",
    image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg"
  },
  {
    id: 3,
    title: "Organic Pest Control Methods",
    content: "Protect your plants naturally with these effective organic pest control techniques that won't harm beneficial insects.",
    author: "Emma Nature",
    date: "2024-01-05",
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg"
  }
];

export const books: Book[] = [
  {
    id: 1,
    title: "The Well-Tended Perennial Garden",
    author: "Tracy DiSabato-Aust",
    description: "A comprehensive guide to growing and maintaining beautiful perennial gardens.",
    buyLink: "https://example.com/buy",
    borrowLink: "https://example.com/borrow",
    image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg"
  },
  {
    id: 2,
    title: "Square Foot Gardening",
    author: "Mel Bartholomew",
    description: "Revolutionary method for growing more vegetables in less space with less work.",
    buyLink: "https://example.com/buy",
    borrowLink: "https://example.com/borrow",
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg"
  }
];

export const seeds: Seed[] = [
  {
    id: 1,
    name: "Tomato Seeds",
    season: "Spring-Summer",
    care: "Full sun, regular watering, support with stakes",
    description: "Versatile vegetable perfect for beginners",
    image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg"
  },
  {
    id: 2,
    name: "Basil Seeds",
    season: "Spring-Summer",
    care: "Warm weather, well-drained soil, regular pruning",
    description: "Aromatic herb great for cooking",
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg"
  }
];

export const soilTips = [
  {
    id: 1,
    title: "Clay Soil",
    name: "Clay Soil",
    description: "Heavy soil that retains water well but drains poorly, rich in nutrients",
    pros: ["Retains water well", "Rich in minerals", "Stable structure", "Erosion resistant"],
    cons: ["Poor drainage", "Hard to dig", "Compacts easily", "Poor air penetration"],
    bestFor: "Fruit trees, roses, water plants",
    pH: "6.0 - 7.5",
    texture: "Sticky, muddy when wet",
    drainage: "Poor (1-2cm/hour)",
    nutrients: "High (natural NPK)",
    price: "$15 - 25 per 50lb bag",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 2,
    title: "Sandy Soil",
    name: "Sandy Soil", 
    description: "Well-draining soil but difficult to retain water and nutrients",
    pros: ["Good drainage", "Easy to dig", "Warms quickly", "Well aerated"],
    cons: ["Loses water quickly", "Low nutrients", "Needs frequent watering", "Erosion prone"],
    bestFor: "Herbs, root vegetables, cacti",
    pH: "6.0 - 7.0",
    texture: "Loose, crumbles when dry",
    drainage: "Good (5-10cm/hour)",
    nutrients: "Low (needs fertilizer)",
    price: "$10 - 20 per 50lb bag",
    color: "from-yellow-500 to-amber-600"
  }
];

export const pots = [
  {
    id: 1,
    name: "Terra Cotta Pots",
    description: "Classic clay pots that provide excellent drainage",
    usage: "Perfect for herbs and small vegetables"
  },
  {
    id: 2,
    name: "Self-Watering Planters",
    description: "Smart containers that help maintain consistent moisture",
    usage: "Ideal for busy gardeners and vacation care"
  }
];

export const accessories = [
  {
    id: 1,
    name: "Garden Gnomes",
    description: "Whimsical decorative figures for your garden",
    type: "Decorative"
  },
  {
    id: 2,
    name: "Decorative Pebbles",
    description: "Natural stones for pathways and decoration",
    type: "Functional"
  }
];