import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Droplets, Sun, Wind, Star, Heart, Gift, Lightbulb, Shield, Clock, DollarSign, Thermometer, Eye, CheckCircle, AlertTriangle, Info, Ruler, Weight, Palette, ExternalLink } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';
import { useResponsiveDesign } from '../utils/responsiveDesign';

interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  content?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'archived';
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

const Pots: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [pots, setPots] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const loadPots = async () => {
      try {
        setLoading(true);
        const response = await publicService.getPots();
        
        // Handle API response format: {success: true, data: [...]}
        let potsData: Product[] = [];
        if (response && typeof response === 'object' && 'success' in response && (response as any).success && (response as any).data) {
          potsData = (response as any).data;
        } else if (Array.isArray(response)) {
          potsData = response;
        }
        
        setPots(potsData);
      } catch (err) {
        setError('Failed to load pots');
        console.error('Error loading pots:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPots();
  }, []);

  // Filter pots based on search term
  const filteredPots = pots.filter(pot => {
    const matchesSearch = pot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pot.material && pot.material.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPots = filteredPots.slice(startIndex, endIndex);

  const renderPotCard = (pot: Product) => (
    <a 
      key={pot.id} 
      href={pot.link || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full group hover:shadow-xl transition-all duration-300 p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="text-emerald-600">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-sm text-emerald-600 font-medium">{pot.subcategory || pot.material || 'Pot'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {pot.is_featured && (
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
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">{pot.name}</h3>
        <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{pot.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4 text-sm text-emerald-600">
            {pot.size && <span>{pot.size}</span>}
            {pot.material && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                {pot.material}
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
  const potTypes = [
    {
      category: "Plastic Pots",
      icon: "🪴",
      description: "Lightweight, durable, colorful variety, affordable",
      items: [
        {
          name: "Basic PP Plastic Pots",
          description: "Polypropylene plastic pots, lightweight and durable",
          price: "$5 - $15",
          sizes: "4-16 inch diameter",
          weight: "2-18oz",
          durability: "3-5 years",
          drainage: "Has drainage holes",
          uvResistant: "UV resistant",
          bestFor: "Indoor plants, balcony, beginners",
          pros: ["Lightweight, easy to move", "Affordable", "Won't break when dropped", "Many colors available"],
          cons: ["Not very aesthetic", "Colors may fade", "Poor heat retention"]
        },
        {
          name: "Premium Composite Plastic Pots",
          description: "Plastic mixed with fiberglass, durable and beautiful",
          price: "$25 - $80",
          sizes: "6-24 inch diameter",
          weight: "7-53oz",
          durability: "7-10 years",
          drainage: "Good drainage system",
          uvResistant: "Premium UV protection",
          bestFor: "Premium plants, outdoor decoration",
          pros: ["Durable and beautiful", "Weather resistant", "Lighter than ceramic", "Modern design"],
          cons: ["Higher cost", "Less natural", "Needs regular cleaning"]
        },
        {
          name: "Self-Watering Plastic Pots",
          description: "Has water reservoir, automatically provides moisture",
          price: "$35 - $120",
          sizes: "8-20 inch diameter",
          weight: "11-35oz",
          durability: "5-8 years",
          drainage: "Smart self-watering system",
          uvResistant: "UV resistant",
          bestFor: "Busy people, frequent travelers",
          pros: ["Automatic watering", "Time-saving", "Healthy plants", "Smart technology"],
          cons: ["Higher cost", "Needs maintenance", "More complex"]
        }
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      category: "Ceramic Pots",
      icon: "🏺",
      description: "High aesthetics, breathable, good heat retention",
      items: [
        {
          name: "Traditional Fired Clay Pots",
          description: "Natural fired clay, good breathability",
          price: "$10 - $45",
          sizes: "3-14 inch diameter",
          weight: "7-70oz",
          durability: "10-20 years",
          drainage: "Natural breathability",
          uvResistant: "Not needed",
          bestFor: "Herbs, succulents, traditional plants",
          pros: ["Good breathability", "High aesthetics", "Heat retention", "Environmentally friendly"],
          cons: ["Heavy", "Breakable", "Higher cost", "Hard to move"]
        },
        {
          name: "Premium Glazed Ceramic Pots",
          description: "Glazed ceramic, shiny finish, waterproof",
          price: "$30 - $200",
          sizes: "5-20 inch diameter",
          weight: "11-105oz",
          durability: "15-30 years",
          drainage: "Needs drainage holes",
          uvResistant: "Fade resistant",
          bestFor: "Premium plants, interior decoration",
          pros: ["Very beautiful", "Fade resistant", "Easy to clean", "Elegant"],
          cons: ["Very heavy", "Very expensive", "Breakable", "Not breathable"]
        }
      ],
      color: "from-orange-500 to-red-600"
    },
    {
      category: "Metal Pots",
      icon: "⚙️",
      description: "Modern, durable, rust-resistant",
      items: [
        {
          name: "Stainless Steel 304 Pots",
          description: "Premium stainless steel, rust-free, permanent durability",
          price: "$45 - $150",
          sizes: "6-18 inch diameter",
          weight: "14-70oz",
          durability: "20+ years",
          drainage: "Precision laser holes",
          uvResistant: "Not needed",
          bestFor: "Modern style, outdoor, commercial",
          pros: ["Rust-free", "Very durable", "Modern", "Easy to clean"],
          cons: ["Heats up quickly", "Expensive", "Cold appearance", "Reflects light"]
        },
        {
          name: "Anodized Aluminum Pots",
          description: "Surface-treated aluminum, lightweight and beautiful",
          price: "$25 - $100",
          sizes: "5-20 inch diameter",
          weight: "7-42oz",
          durability: "10-15 years",
          drainage: "Good drainage holes",
          uvResistant: "Oxidation resistant",
          bestFor: "Balcony, rooftop, industrial style",
          pros: ["Lightweight", "Rust-free", "Many colors", "Reasonable price"],
          cons: ["Dents easily", "Conducts heat", "Less elegant"]
        }
      ],
      color: "from-gray-500 to-slate-600"
    }
  ];

  const hangingSystems = [
    {
      type: "Single Hangers",
      icon: "🪝",
      description: "Hang 1 pot, simple, easy to install",
      products: [
        {
          name: "Stainless Steel 304 Hook",
          description: "Rust-free stainless steel hook, supports 11lbs",
          price: "$8 - $25",
          capacity: "1 pot, max 11lbs",
          material: "Stainless steel 304, rust-free",
          installation: "Screw into wall/ceiling",
          bestFor: "Small pots, single hanging plants"
        },
        {
          name: "Bamboo Wood Hanger",
          description: "Natural bamboo hanger, environmentally friendly",
          price: "$12 - $35",
          capacity: "1 pot, max 7lbs",
          material: "Natural bamboo, rope",
          installation: "Hook or nail hanging",
          bestFor: "Natural style, lightweight plants"
        }
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      type: "Multi-Tier Hangers",
      icon: "🏗️",
      description: "Hang multiple pots, optimize space",
      products: [
        {
          name: "3-Tier Metal Hanger",
          description: "Powder-coated metal frame, 3 tiers",
          price: "$60 - $150",
          capacity: "3 pots, max 33lbs",
          material: "Powder-coated steel",
          installation: "Ceiling or wall hook",
          bestFor: "Space optimization, multiple plants"
        },
        {
          name: "Cable Wire Hanging System",
          description: "Stainless steel cable, adjustable height",
          price: "$45 - $120",
          capacity: "2-4 pots, max 44lbs",
          material: "Stainless steel cable, adjustable hooks",
          installation: "Ceiling mount, flexible adjustment",
          bestFor: "High spaces, large plants"
        }
      ],
      color: "from-purple-500 to-violet-600"
    }
  ];

  const sizingGuide = [
    {
      plantType: "Herbs",
      icon: "🌿",
      potSize: "3-6 inches",
      depth: "3-5 inches",
      examples: ["Basil", "Cilantro", "Mint", "Parsley"],
      tips: "Small pots, good drainage, easy to move",
      waterAmount: "3-10 fl oz",
      soilAmount: "0.1-0.3 gallons"
    },
    {
      plantType: "Indoor Plants",
      icon: "🪴",
      potSize: "6-10 inches",
      depth: "6-8 inches",
      examples: ["Pothos", "Monstera", "Rubber plant", "Snake plant"],
      tips: "Medium pots, with saucer, high aesthetics",
      waterAmount: "17-34 fl oz",
      soilAmount: "0.5-1 gallon"
    },
    {
      plantType: "Small Fruit Plants",
      icon: "🍅",
      potSize: "10-16 inches",
      depth: "10-14 inches",
      examples: ["Cherry tomatoes", "Peppers", "Strawberries", "Lemon"],
      tips: "Large pots, good drainage, with wheels",
      waterAmount: "34-68 fl oz",
      soilAmount: "2-4 gallons"
    },
    {
      plantType: "Large Ornamental Plants",
      icon: "🌳",
      potSize: "16-24 inches",
      depth: "16-20 inches",
      examples: ["Ficus", "Fig tree", "Banyan", "Flame tree"],
      tips: "Very large pots, sturdy, drainage system",
      waterAmount: "101-169 fl oz",
      soilAmount: "5-10 gallons"
    },
    {
      plantType: "Succulents & Cacti",
      icon: "🌵",
      potSize: "2-8 inches",
      depth: "2-6 inches",
      examples: ["Succulents", "Cacti", "Aloe", "Jade plant"],
      tips: "Shallow pots, excellent drainage, with gravel",
      waterAmount: "2-7 fl oz",
      soilAmount: "0.05-0.5 gallons"
    },
    {
      plantType: "Hanging Plants",
      icon: "🕷️",
      potSize: "5-10 inches",
      depth: "4-8 inches",
      examples: ["Spider plant", "String of hearts", "Heartleaf philodendron", "Boston fern"],
      tips: "Lightweight pots, hanging hooks, good drainage",
      waterAmount: "7-17 fl oz",
      soilAmount: "0.3-0.8 gallons"
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pots & Containers"
        subtitle="Complete guide to choosing pots, hanging systems and frames for each plant type"
        icon={<Package className="h-10 w-10" />}
      />

      {/* Search Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search pots by name, description, or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base min-h-[44px] touch-manipulation"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading pots...</p>
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
          {/* Pots Grid */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-emerald-800">
              Available Pots ({filteredPots.length})
            </h2>
          </div>
          
          {filteredPots.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No pots found</h3>
              <p className="text-emerald-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {currentPots.map(pot => renderPotCard(pot))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-6 sm:mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
                  >
                    Previous
                  </button>
                  
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] min-w-[44px] touch-manipulation ${
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
                    className="px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Pot Types Section */}
      <section className="space-y-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">🪴 Complete Pot Types Guide</h2>
          <p className="text-emerald-600 text-lg">Discover the perfect pot for your plants</p>
        </div>
        
        {potTypes.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-white text-4xl mb-4 shadow-lg">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">{category.category}</h3>
              <p className="text-emerald-600 text-lg max-w-2xl mx-auto">{category.description}</p>
            </div>
            
            <div className={`grid grid-cols-1 gap-6 ${category.items.length === 2 ? 'md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                        <Ruler className="h-3 w-3 mr-1" />
                        Size
                      </h4>
                      <p className="text-blue-700 text-xs">{item.sizes}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-800 text-sm flex items-center">
                        <Weight className="h-3 w-3 mr-1" />
                        Weight
                      </h4>
                      <p className="text-purple-700 text-xs">{item.weight}</p>
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
                        <Droplets className="h-3 w-3 mr-1" />
                        Drainage
                      </h4>
                      <p className="text-orange-700 text-xs">{item.drainage}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Advantages
                      </h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        {item.pros.map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Disadvantages
                      </h4>
                      <ul className="text-orange-700 text-sm space-y-1">
                        {item.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
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
        </div>
        ))}
      </section>

      {/* Hanging Systems Section */}
      <section className="space-y-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">🪝 Hanging Systems Guide</h2>
          <p className="text-emerald-600 text-lg">Smart solutions for vertical gardening</p>
        </div>
        
        {hangingSystems.map((system, systemIndex) => (
          <div key={systemIndex} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 text-white text-4xl mb-4 shadow-lg">
                {system.icon}
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">{system.type}</h3>
              <p className="text-emerald-600 text-lg max-w-2xl mx-auto">{system.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {system.products.map((product, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${system.color} text-white text-xl mb-3 shadow-md`}>
                      {system.icon}
                    </div>
                    <h4 className="text-lg font-bold text-emerald-800 mb-2">{product.name}</h4>
                    <p className="text-emerald-600 text-sm">{product.description}</p>
                  </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-1">Load capacity:</h4>
                      <p className="text-blue-700 text-sm">{product.capacity}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-1">Material:</h4>
                      <p className="text-purple-700 text-sm">{product.material}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-1">Installation:</h4>
                      <p className="text-green-700 text-sm">{product.installation}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-1">Best for:</h4>
                      <p className="text-yellow-700 text-sm">{product.bestFor}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-1">Price range:</h4>
                      <p className="text-gray-700 text-sm font-semibold">{product.price}</p>
                    </div>
                  </div>
                </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Sizing Guide */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">📏 Pot Size Selection Guide</h2>
          <p className="text-emerald-600 text-lg">Choose the right size for healthy plant growth</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sizingGuide.map((guide, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{guide.icon}</div>
                <h3 className="text-xl font-bold text-emerald-800">{guide.plantType}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-1">Pot size:</h4>
                  <p className="text-blue-700 text-sm">Diameter: {guide.potSize}</p>
                  <p className="text-blue-700 text-sm">Depth: {guide.depth}</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1">Examples:</h4>
                  <div className="flex flex-wrap gap-1">
                    {guide.examples.map((example, i) => (
                      <span key={i} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-1">Selection tips:</h4>
                  <p className="text-yellow-700 text-sm">{guide.tips}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <h5 className="font-semibold text-purple-800 text-xs mb-1">Water amount:</h5>
                    <p className="text-purple-700 text-xs">{guide.waterAmount}</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded-lg">
                    <h5 className="font-semibold text-orange-800 text-xs mb-1">Soil amount:</h5>
                    <p className="text-orange-700 text-xs">{guide.soilAmount}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Budget Planning */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">💰 Budget Planning</h2>
          <p className="text-emerald-600 text-lg">Find the perfect package for your budget</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 hover:border-green-400 transition-all duration-300 hover:shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-3 shadow-md">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Basic Package</h3>
              <p className="text-green-700 text-2xl font-bold">$150 - $300</p>
            </div>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Includes:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 5-8 basic plastic pots</li>
                  <li>• 2-3 single hangers</li>
                  <li>• Basic saucers</li>
                  <li>• Maintenance tools</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Best for:</h4>
                <p className="text-blue-700 text-sm">Beginners, small balcony</p>
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
              <p className="text-blue-700 text-2xl font-bold">$300 - $800</p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Includes:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• 8-15 diverse material pots</li>
                  <li>• Multi-tier hanging system</li>
                  <li>• Self-watering pots</li>
                  <li>• Premium accessories</li>
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
              <p className="text-purple-700 text-2xl font-bold">$800+</p>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Includes:</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• 20+ premium, handmade pots</li>
                  <li>• Automatic hanging system</li>
                  <li>• Smart IoT pots</li>
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

      {/* Shopping Tips */}
      <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">🛒 Smart Shopping Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              📍 Trusted Shopping Places
            </h4>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Hardware stores:</h5>
                <p className="text-teal-100 text-sm">Plastic, metal pots, affordable prices</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Ceramic stores:</h5>
                <p className="text-teal-100 text-sm">Clay, ceramic, handmade pots</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Online shops:</h5>
                <p className="text-teal-100 text-sm">Variety, easy price comparison</p>
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
                <h5 className="font-semibold mb-1">Check quality:</h5>
                <p className="text-teal-100 text-sm">Drainage holes, thickness, color</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Buy in sets:</h5>
                <p className="text-teal-100 text-sm">Save 15-25% when buying multiple</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Measure space:</h5>
                <p className="text-teal-100 text-sm">Measure carefully before buying</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Pots;