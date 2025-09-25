import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, Gem, Leaf, Droplets, Sun, Wind, Star, Heart, Gift, Lightbulb, Shield, Clock, DollarSign } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';

const Accessories: React.FC = () => {
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAccessories = async () => {
      try {
        setLoading(true);
        const data = await publicService.getAccessories();
        setAccessories(data);
      } catch (err) {
        setError('Failed to load accessories');
        console.error('Error loading accessories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccessories();
  }, []);

  // Filter accessories based on category and search term
  const filteredAccessories = accessories.filter(accessory => {
    const matchesCategory = selectedCategory === 'all' || accessory.category === selectedCategory;
    const matchesSearch = accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accessory.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(accessories.map(a => a.category).filter(Boolean))];

  const renderAccessoryCard = (accessory: any) => (
    <Card key={accessory.id} className="h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-emerald-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-sm text-emerald-600 font-medium">{accessory.category}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">4.5</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-emerald-800 mb-2">{accessory.name}</h3>
      <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{accessory.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600">Material:</span>
          <span className="font-medium">{accessory.material}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600">Size:</span>
          <span className="font-medium">{accessory.size}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600">Color:</span>
          <span className="font-medium">{accessory.color}</span>
        </div>
        {accessory.brand && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-600">Brand:</span>
            <span className="font-medium">{accessory.brand}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600">Waterproof:</span>
          <span className="font-medium">{accessory.is_waterproof ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600">Durable:</span>
          <span className="font-medium">{accessory.is_durable ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-emerald-800">
          {accessory.price ? `$${accessory.price}` : 'Contact for price'}
        </span>
        <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm">View Details</span>
        </button>
      </div>
    </Card>
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

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
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
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-emerald-800">
                ✨ Available Accessories ({filteredAccessories.length})
              </h2>
            </div>
            
            {filteredAccessories.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">No accessories found</h3>
                <p className="text-emerald-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAccessories.map(accessory => renderAccessoryCard(accessory))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Decorative Items Section */}
      {decorativeItems.map((category, categoryIndex) => (
        <section key={categoryIndex} className="space-y-6">
          <h2 className="text-3xl font-bold text-emerald-800 text-center flex items-center justify-center">
            <span className="text-4xl mr-3">{category.icon}</span>
            {category.category} Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item, index) => (
              <Card key={index} className="h-full">
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.color} text-white text-2xl mb-3`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-800">{item.name}</h3>
                  <p className="text-emerald-600 text-sm mt-2">{item.description}</p>
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
        </section>
      ))}

      {/* Lighting Accessories Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">💡 Lighting & Decoration Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lightingAccessories.map((light, index) => (
            <Card key={index} className="h-full">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-2xl mb-3">
                  💡
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">{light.name}</h3>
                <p className="text-emerald-600 text-sm mt-2">{light.description}</p>
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
        <h2 className="text-3xl font-bold text-emerald-800 text-center">🗓️ Seasonal Decorations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalDecorations.map((season, index) => (
            <Card key={index} className="text-center bg-gradient-to-b from-emerald-50 to-green-50">
              <div className="text-6xl mb-4">{season.icon}</div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">{season.season}</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Accessories:</h4>
                  <ul className="text-emerald-700 text-sm space-y-1">
                    {season.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Main colors:</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {season.colors.map((color, i) => (
                      <span key={i} className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-1">Theme:</h4>
                  <p className="text-emerald-700 text-sm">{season.themes}</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-1">Decoration set price:</h4>
                  <p className="text-emerald-700 text-sm font-semibold">{season.price}</p>
                </div>
              </div>
            </Card>
          ))}
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
        <h2 className="text-3xl font-bold text-emerald-800 text-center">💰 Accessory Budget Planning</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200">
            <div className="text-center mb-4">
              <Star className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-green-800">Basic Package</h3>
              <p className="text-green-600 font-bold">$60 - $150</p>
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
          
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200">
            <div className="text-center mb-4">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-blue-800">Standard Package</h3>
              <p className="text-blue-600 font-bold">$150 - $450</p>
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
          
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200">
            <div className="text-center mb-4">
              <Star className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-purple-800">Premium Package</h3>
              <p className="text-purple-600 font-bold">$450+</p>
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