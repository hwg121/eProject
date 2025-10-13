import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Gem, Star, Heart, Gift, Lightbulb, Shield, Clock, ExternalLink, DollarSign } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';
import { useResponsiveDesign } from '../utils/responsiveDesign';

interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  content?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'draft' | 'archived';
  price?: number;
  image?: string;
  images_json?: string;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  is_featured?: boolean;
  is_published?: boolean;
  views?: number;
  likes?: number;
  rating?: number;
  
  // Tool specific
  usage?: string;
  video_url?: string;
  affiliate_link?: string;
  
  // Book specific
  author?: string;
  pages?: number;
  published_year?: number;
  buyLink?: string;
  borrowLink?: string;
  
  // Pot specific
  drainage_holes?: boolean;
  
  // Accessory specific
  is_waterproof?: boolean;
  is_durable?: boolean;
  
  // Suggestion specific
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  season?: string;
  plant_type?: string;
  estimated_time?: string;
  tags?: string[];
  
  // Generic link
  link?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

const Accessories: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const loadAccessories = async () => {
      try {
        setLoading(true);
        const data = await publicService.getAccessories();
        setAccessories(data as Product[]);
      } catch (err) {
        setError('Failed to load accessories');
        console.error('Error loading accessories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccessories();
  }, []);

  // Filter accessories based on search term
  const filteredAccessories = accessories.filter(accessory => {
    const matchesSearch = accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accessory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (accessory.material && accessory.material.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccessories = filteredAccessories.slice(startIndex, endIndex);

  const renderAccessoryCard = (accessory: Product) => (
    <a 
      key={accessory.id} 
      href={accessory.link || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full group hover:shadow-xl transition-all duration-300 p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-sm text-emerald-600 font-medium">{accessory.subcategory || 'Accessory'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {accessory.is_featured && (
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Star className="h-3 w-3 fill-white" />
                Featured
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold">4.5</span>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">{accessory.name}</h3>
        <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{accessory.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4 text-sm text-emerald-600">
            {accessory.material && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                {accessory.material}
              </span>
            )}
            {accessory.color && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {accessory.color}
              </span>
            )}
          </div>
          <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">View Details</span>
          </button>
        </div>
      </Card>
    </a>
  );
  const decorativeItems = [
    {
      category: "Mini Decorative Items",
      icon: "🧚‍♀️",
      items: [
        {
          name: "Mini Fairy Houses",
          description: "Small cute houses for fairy tale world in pots",
          price: "$15 - $60",
          materials: "Resin plastic, ceramic, wood",
          sizes: "1-4 inches tall",
          durability: "2-5 years",
          maintenance: "Clean once a month",
          bestFor: "Ornamental pots, terrarium, desk decoration"
        },
        {
          name: "Animal Figurines",
          description: "Cute animals like rabbits, dogs, cats, mini birds",
          price: "$10 - $45",
          materials: "Resin plastic, ceramic",
          sizes: "1-3 inches tall",
          durability: "3-7 years",
          maintenance: "Dust every 2 weeks",
          bestFor: "Small pot decoration, desk, children's room"
        },
        {
          name: "Mini Stairs & Benches",
          description: "Tiny furniture to create living spaces",
          price: "$12 - $55",
          materials: "Wood, plastic, metal",
          sizes: "1-5 inches long",
          durability: "2-4 years",
          maintenance: "Repaint annually (wood)",
          bestFor: "Mini garden scenes, terrarium"
        },
        {
          name: "Signs & Fences",
          description: "Mini directional signs and decorative fences",
          price: "$8 - $30",
          materials: "Wood, plastic, metal",
          sizes: "1-2 inches tall",
          durability: "1-3 years",
          maintenance: "Replace text when faded",
          bestFor: "Create boundaries, accents, plant labels"
        },
        {
          name: "Bridges & Pathways",
          description: "Create cute walkways in mini gardens",
          price: "$18 - $75",
          materials: "Wood, artificial stone, plastic",
          sizes: "2-8 inches long",
          durability: "2-5 years",
          maintenance: "Clean moss and algae",
          bestFor: "Large terrarium, landscape pots"
        }
      ],
      color: "from-pink-500 to-rose-600"
    },
    {
      category: "Functional Accessories",
      icon: "🔧",
      items: [
        {
          name: "Premium Pot Saucers",
          description: "Protect floors, collect excess water with beautiful design",
          price: "$5 - $25",
          materials: "ABS plastic, ceramic, stainless steel, bamboo",
          sizes: "4-20 inch diameter",
          durability: "3-10 years",
          maintenance: "Clean weekly",
          bestFor: "All pot types, especially indoor pots"
        },
        {
          name: "Rolling Plant Caddies",
          description: "Help move large pots easily, with wheel locks",
          price: "$30 - $90",
          materials: "PP plastic, metal, rubber",
          sizes: "Supports 44-220lbs",
          durability: "5-10 years",
          maintenance: "Oil wheels every 6 months",
          bestFor: "Large pots >12 inches, fruit plants, seasonal moving"
        },
        {
          name: "Smart Plant Labels",
          description: "Label plant names, QR codes, care notes",
          price: "$6 - $18",
          materials: "PVC plastic, bamboo wood, metal",
          sizes: "4-12 inches tall",
          durability: "2-5 years",
          maintenance: "Replace labels when faded",
          bestFor: "Vegetable garden, seedlings, learning"
        },
        {
          name: "Self-Watering Spikes",
          description: "Water slowly when away, adjustable speed",
          price: "$15 - $60",
          materials: "PP plastic, ceramic, glass",
          sizes: "16oz-68oz bottles",
          durability: "1-3 years",
          maintenance: "Clean drip tip",
          bestFor: "Travel times, indoor plants, moisture-loving plants"
        },
        {
          name: "Smart Moisture Sensors",
          description: "Measure soil moisture, temperature, light, app connected",
          price: "$60 - $150",
          materials: "ABS plastic, electronic sensors",
          sizes: "4-6 inches long",
          durability: "2-4 years",
          maintenance: "Replace battery, update app",
          bestFor: "Premium plants, learning, research"
        }
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      category: "Stones & Decorative Materials",
      icon: "💎",
      items: [
        {
          name: "Natural Colored Pebbles",
          description: "River stones, beach pebbles in various natural colors",
          price: "$10 - $30 per lb",
          materials: "Natural stone: granite, quartz, marble",
          sizes: "0.2-1.2 inch diameter",
          durability: "Permanent",
          maintenance: "Rinse clean every 3 months",
          bestFor: "Pot surface cover, decoration, drainage"
        },
        {
          name: "Art Glass Pebbles",
          description: "Transparent glass beads, multicolored, light-reflecting",
          price: "$15 - $45 per lb",
          materials: "Recycled glass, safe",
          sizes: "0.2-0.8 inch diameter",
          durability: "10+ years",
          maintenance: "Wash with soapy water",
          bestFor: "Hydroponic pots, modern decoration, LED lighting"
        },
        {
          name: "Sea Shells",
          description: "Natural shells and snails from the sea, cleaned",
          price: "$12 - $36 per lb",
          materials: "Natural shells, no chemicals",
          sizes: "0.4-2 inches long",
          durability: "5-10 years",
          maintenance: "Soak in salt water monthly",
          bestFor: "Beach style, succulent pots, terrarium"
        },
        {
          name: "Decorative Dried Moss",
          description: "Natural dried moss, long-lasting color, soft texture",
          price: "$18 - $60 per package",
          materials: "Natural moss, treated",
          sizes: "3.5-18oz packages",
          durability: "1-2 years",
          maintenance: "Light misting occasionally",
          bestFor: "Terrarium, ornamental pots, Christmas decoration"
        },
        {
          name: "Colored Decorative Sand",
          description: "Fine multicolored sand, safe, non-toxic",
          price: "$8 - $24 per lb",
          materials: "Colored quartz sand",
          sizes: "0.004-0.02 inches",
          durability: "Permanent",
          maintenance: "None needed",
          bestFor: "Terrarium, glass pots, sand art"
        }
      ],
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const lightingAccessories = [
    {
      name: "LED Plant Grow Lights",
      description: "Full spectrum LED lights for indoor plants",
      specs: "20-100W, 3000-6500K, IP65",
      price: "$60 - $240",
      features: ["Automatic timer", "Adjustable intensity", "Full spectrum light"],
      bestFor: "Indoor plants, winter season, dark spaces"
    },
    {
      name: "LED String Lights",
      description: "Waterproof LED string lights, multicolored",
      specs: "16-66ft, 12V, IP67, solar/USB",
      price: "$30 - $120",
      features: ["Waterproof", "Multiple flashing modes", "Solar powered"],
      bestFor: "Night decoration, parties, festivals"
    },
    {
      name: "Mini Spotlights",
      description: "Compact spotlights for individual plants",
      specs: "3-12W, 3000K, 30-60° beam angle",
      price: "$45 - $150",
      features: ["Adjustable beam angle", "Waterproof", "Ground spike"],
      bestFor: "Highlight beautiful plants, landscape decoration"
    }
  ];

  const seasonalDecorations = [
    {
      season: "Spring",
      icon: "🌸",
      items: ["Pastel artificial flowers", "Butterfly decorations", "Mini bird nests", "Welcome signs"],
      colors: ["Light pink", "Light green", "Light yellow", "White"],
      themes: "Fresh, vibrant, hopeful",
      price: "$15 - $90 per set"
    },
    {
      season: "Summer",
      icon: "☀️",
      items: ["Mini sun umbrellas", "Tiny pool floats", "Sunglasses for plants", "Beach signs"],
      colors: ["Blue", "Bright yellow", "Orange", "Red"],
      themes: "Energetic, cheerful, ocean",
      price: "$18 - $120 per set"
    },
    {
      season: "Fall",
      icon: "🍂",
      items: ["Dried leaf decorations", "Mini pumpkins", "LED candles", "Harvest signs"],
      colors: ["Orange", "Yellow", "Brown", "Brick red"],
      themes: "Warm, harvest, grateful",
      price: "$21 - $105 per set"
    },
    {
      season: "Winter",
      icon: "❄️",
      items: ["Artificial snow", "Mini Christmas trees", "Warm LED lights", "Christmas signs"],
      colors: ["White", "Silver", "Dark green", "Red"],
      themes: "Cozy, festive, family",
      price: "$24 - $150 per set"
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Accessories"
        subtitle="Diverse accessory world: mini decorations, stones, lighting and smart accessories"
        icon={<Sparkles className="h-10 w-10" />}
      />

      {/* Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search accessories by name, description, or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading accessories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Accessories Grid */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-emerald-800">
              Available Accessories ({filteredAccessories.length})
              </h2>
            </div>
            
            {filteredAccessories.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">No accessories found</h3>
              <p className="text-emerald-600">Try adjusting your search criteria</p>
              </div>
            ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentAccessories.map(accessory => renderAccessoryCard(accessory))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
                  >
                    Next
                  </button>
              </div>
            )}
            </>
          )}
        </>
      )}

      {/* Decorative Items Section */}
      <section className="space-y-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">✨ Decorative Accessories Guide</h2>
          <p className="text-emerald-600 text-lg">Transform your garden with beautiful decorations</p>
        </div>
        
      {decorativeItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white text-4xl mb-4 shadow-lg">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">{category.category}</h3>
            </div>
            
            {/* Grid layout: 3 items on top row, 2 items on bottom row for 5 items */}
            <div className="space-y-6">
              {category.items.length === 5 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.slice(0, 3).map((item, index) => (
                      <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="text-center mb-4">
                          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${category.color} text-white text-xl mb-3 shadow-md`}>
                            {category.icon}
                          </div>
                          <h4 className="text-lg font-bold text-emerald-800 mb-2">{item.name}</h4>
                          <p className="text-emerald-600 text-sm">{item.description}</p>
                        </div>
                      
                      <div className="space-y-4">
                        {/* Technical Specs */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                              <Gem className="h-3 w-3 mr-1" />
                              Material
                            </h4>
                            <p className="text-blue-700 text-xs">{item.materials}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-purple-800 text-sm flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Size
                            </h4>
                            <p className="text-purple-700 text-xs">{item.sizes}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-green-800 text-sm flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Lifespan
                            </h4>
                            <p className="text-green-700 text-xs">{item.durability}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-orange-800 text-sm flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Maintenance
                            </h4>
                            <p className="text-orange-700 text-xs">{item.maintenance}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-indigo-800 mb-1">Best for:</h4>
                            <p className="text-indigo-700 text-sm">{item.bestFor}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Price range:
                            </h4>
                            <p className="text-gray-700 text-sm font-semibold">{item.price}</p>
                          </div>
                        </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {category.items.slice(3, 5).map((item, index) => (
                      <Card key={index + 3} className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="text-center mb-4">
                          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${category.color} text-white text-xl mb-3 shadow-md`}>
                            {category.icon}
                          </div>
                          <h4 className="text-lg font-bold text-emerald-800 mb-2">{item.name}</h4>
                          <p className="text-emerald-600 text-sm">{item.description}</p>
                        </div>
                      
                      <div className="space-y-4">
                        {/* Technical Specs */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                              <Gem className="h-3 w-3 mr-1" />
                              Material
                            </h4>
                            <p className="text-blue-700 text-xs">{item.materials}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-purple-800 text-sm flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Size
                            </h4>
                            <p className="text-purple-700 text-xs">{item.sizes}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-green-800 text-sm flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Lifespan
                            </h4>
                            <p className="text-green-700 text-xs">{item.durability}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-orange-800 text-sm flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Maintenance
                            </h4>
                            <p className="text-orange-700 text-xs">{item.maintenance}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-indigo-800 mb-1">Best for:</h4>
                            <p className="text-indigo-700 text-sm">{item.bestFor}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Price range:
                            </h4>
                            <p className="text-gray-700 text-sm font-semibold">{item.price}</p>
                          </div>
                        </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item, index) => (
                    <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="text-center mb-4">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${category.color} text-white text-xl mb-3 shadow-md`}>
                    {category.icon}
                  </div>
                        <h4 className="text-lg font-bold text-emerald-800 mb-2">{item.name}</h4>
                        <p className="text-emerald-600 text-sm">{item.description}</p>
                </div>
                
                <div className="space-y-4">
                  {/* Technical Specs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                        <Gem className="h-3 w-3 mr-1" />
                        Material
                      </h4>
                      <p className="text-blue-700 text-xs">{item.materials}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-800 text-sm flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Size
                      </h4>
                      <p className="text-purple-700 text-xs">{item.sizes}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Lifespan
                      </h4>
                      <p className="text-green-700 text-xs">{item.durability}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-orange-800 text-sm flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Maintenance
                      </h4>
                      <p className="text-orange-700 text-xs">{item.maintenance}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-1">Best for:</h4>
                      <p className="text-indigo-700 text-sm">{item.bestFor}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Price range:
                      </h4>
                      <p className="text-gray-700 text-sm font-semibold">{item.price}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
              )}
            </div>
          </div>
      ))}
      </section>

      {/* Lighting Accessories Section */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">💡 Lighting & Decoration Systems</h2>
          <p className="text-emerald-600 text-lg">Illuminate your garden with smart lighting solutions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lightingAccessories.map((light, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-3xl mb-3 shadow-md">
                  💡
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-2">{light.name}</h3>
                <p className="text-emerald-600 text-sm">{light.description}</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Technical specs:</h4>
                  <p className="text-yellow-700 text-sm">{light.specs}</p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Key features:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {light.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Best for:</h4>
                    <p className="text-green-700 text-sm">{light.bestFor}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-1">Price range:</h4>
                    <p className="text-purple-700 text-sm font-semibold">{light.price}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Seasonal Decorations */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">🗓️ Seasonal Decorations</h2>
          <p className="text-emerald-600 text-lg">Celebrate every season with themed decorations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalDecorations.map((season, index) => {
            // Define color schemes for each season
            const colorSchemes = [
              { bg: 'from-pink-50 to-green-50', title: 'text-pink-800', text: 'text-pink-700', badge: 'bg-pink-200 text-pink-800', box: 'bg-pink-50' }, // Spring
              { bg: 'from-blue-50 to-yellow-50', title: 'text-blue-800', text: 'text-blue-700', badge: 'bg-blue-200 text-blue-800', box: 'bg-blue-50' }, // Summer
              { bg: 'from-orange-50 to-amber-50', title: 'text-orange-800', text: 'text-orange-700', badge: 'bg-orange-200 text-orange-800', box: 'bg-orange-50' }, // Fall
              { bg: 'from-blue-50 to-slate-50', title: 'text-blue-800', text: 'text-blue-700', badge: 'bg-blue-200 text-blue-800', box: 'bg-blue-50' } // Winter
            ];
            const colors = colorSchemes[index];
            
            return (
              <Card key={index} className={`text-center bg-gradient-to-b ${colors.bg} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <div className="text-6xl mb-4 transform transition-transform duration-300 hover:scale-110">{season.icon}</div>
                <h3 className={`text-xl font-bold ${colors.title} mb-3`}>{season.season}</h3>
              
              <div className="space-y-4">
                  <div className={`${colors.box} p-3 rounded-lg`}>
                    <h4 className={`font-semibold ${colors.title} mb-2`}>Accessories:</h4>
                    <ul className={`${colors.text} text-sm space-y-1`}>
                    {season.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                  <div className={`${colors.box} p-3 rounded-lg`}>
                    <h4 className={`font-semibold ${colors.title} mb-2`}>Main colors:</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {season.colors.map((color, i) => (
                        <span key={i} className={`${colors.badge} px-2 py-1 rounded-full text-xs`}>
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                
                  <div className={`${colors.box} p-3 rounded-lg`}>
                    <h4 className={`font-semibold ${colors.title} mb-1`}>Theme:</h4>
                    <p className={`${colors.text} text-sm`}>{season.themes}</p>
                </div>
                
                  <div className={`${colors.box} p-3 rounded-lg`}>
                    <h4 className={`font-semibold ${colors.title} mb-1`}>Decoration set price:</h4>
                    <p className={`${colors.text} text-sm font-semibold`}>{season.price}</p>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </section>

      {/* DIY Accessories Guide */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">🎨 DIY Accessories Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Recycled Material Decorations
            </h4>
            <ul className="space-y-2 text-purple-100 text-sm">
              <li>• <strong>Plastic bottles:</strong> Cut into pots, decorative lights</li>
              <li>• <strong>Milk cartons:</strong> Wrap with colored paper for mini pots</li>
              <li>• <strong>Old CDs:</strong> Make reflective discs, bird deterrents</li>
              <li>• <strong>Eggshells:</strong> Natural biodegradable seed pots</li>
              <li>• <strong>Newspaper:</strong> Make biodegradable paper pots</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              DIY Smart Accessories
            </h4>
            <ul className="space-y-2 text-purple-100 text-sm">
              <li>• <strong>Watering system:</strong> Bottle + plastic tubing</li>
              <li>• <strong>Moisture sensor:</strong> Bamboo stick + paper</li>
              <li>• <strong>LED lights:</strong> LED strip + mechanical timer</li>
              <li>• <strong>Hanging system:</strong> Rope + wood</li>
              <li>• <strong>Plant labels:</strong> Popsicle sticks + stickers</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Themed Decorations
            </h4>
            <ul className="space-y-2 text-purple-100 text-sm">
              <li>• <strong>Japanese style:</strong> Bamboo, stones, white sand</li>
              <li>• <strong>Mediterranean style:</strong> Pebbles, shells</li>
              <li>• <strong>Vintage style:</strong> Old wood, rusty metal</li>
              <li>• <strong>Modern style:</strong> Glass, stainless steel</li>
              <li>• <strong>Natural style:</strong> Stones, wood, moss</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Care and Maintenance */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">🧹 Accessory Care & Maintenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">🧽 Daily Cleaning</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• Dust decorative accessories</li>
              <li>• Check LED lights functioning</li>
              <li>• Clean pot saucers</li>
              <li>• Rearrange for better aesthetics</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">🔧 Weekly Maintenance</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• Check automatic watering system</li>
              <li>• Clean decorative stones</li>
              <li>• Change water in decorative containers</li>
              <li>• Check hanging system stability</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">🗓️ Monthly Maintenance</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• Deep clean all accessories</li>
              <li>• Replace sensor and LED batteries</li>
              <li>• Repaint wood accessories if needed</li>
              <li>• Update control apps</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">🔄 Seasonal Maintenance</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• Change seasonal decorations</li>
              <li>• Store unused accessories</li>
              <li>• Check waterproofing for rainy season</li>
              <li>• Prepare accessories for new season</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Budget Planning */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">💰 Accessory Budget Planning</h2>
          <p className="text-emerald-600 text-lg">Find the perfect accessory package for your budget</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 hover:border-green-400 transition-all duration-300 hover:shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-3 shadow-md">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Basic Package</h3>
              <p className="text-green-700 text-2xl font-bold">$60 - $150</p>
            </div>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Includes:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 10-15 basic mini figurines</li>
                  <li>• 4-7lbs natural colored stones</li>
                  <li>• 5-10 plastic pot saucers</li>
                  <li>• 1 seasonal decoration set</li>
                  <li>• 16ft basic LED string lights</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Best for:</h4>
                <p className="text-blue-700 text-sm">Beginners, small garden, experimentation</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mb-3 shadow-md">
                <Star className="h-8 w-8 text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Standard Package</h3>
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">POPULAR</span>
              <p className="text-blue-700 text-2xl font-bold">$150 - $450</p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Includes:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• 20-30 diverse decorative accessories</li>
                  <li>• 11lbs glass pebbles + shells</li>
                  <li>• LED lighting system with timer</li>
                  <li>• 3-5 basic self-watering devices</li>
                  <li>• 4-season decoration sets</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Best for:</h4>
                <p className="text-purple-700 text-sm">Experienced, medium garden</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mb-3 shadow-md">
                <Star className="h-8 w-8 text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">Premium Package</h3>
              <p className="text-purple-700 text-2xl font-bold">$450+</p>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Includes:</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• 50+ premium, handmade accessories</li>
                  <li>• Smart lighting system</li>
                  <li>• IoT sensors, app control</li>
                  <li>• Imported decorative materials</li>
                  <li>• Custom design</li>
                </ul>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg">
                <h4 className="font-semibold text-pink-800 mb-2">Best for:</h4>
                <p className="text-pink-700 text-sm">Experts, large garden, commercial</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Shopping Guide */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">🛒 Smart Shopping Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              📍 Trusted Shopping Places
            </h4>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Hardware stores:</h5>
                <p className="text-orange-100 text-sm">Stones, saucers, basic tools</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Online shops (Amazon, eBay):</h5>
                <p className="text-orange-100 text-sm">Decorative accessories, LED lights, figurines</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Craft stores:</h5>
                <p className="text-orange-100 text-sm">Handmade items, wood, bamboo, unique products</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              💡 Shopping Tips
            </h4>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Compare prices:</h5>
                <p className="text-orange-100 text-sm">Check 3-5 sources before deciding</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Buy in sets:</h5>
                <p className="text-orange-100 text-sm">Save 20-30% when buying bundles</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Check quality:</h5>
                <p className="text-orange-100 text-sm">Read reviews, see real customer photos</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Accessories;