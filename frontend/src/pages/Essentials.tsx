import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flower, Droplets, Bug, Sprout, Beaker, Shield, Scaling as Seedling, CheckCircle, AlertTriangle, Info, Thermometer, Sun, Wind, Clock, ArrowRight, DollarSign } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';

const Essentials: React.FC = () => {
  const [essentials, setEssentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEssentials = async () => {
      try {
        setLoading(true);
        const data = await publicService.getEssentials();
        setEssentials(data);
      } catch (err) {
        setError('Failed to load essentials');
        console.error('Error loading essentials:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEssentials();
  }, []);
  const soilTypes = [
    {
      name: "Clay Soil",
      description: "Retains water well but drains poorly, rich in nutrients",
      pros: ["Retains water well", "Rich in minerals", "Stable structure", "Erosion resistant"],
      cons: ["Poor drainage", "Hard to dig", "Compacts easily", "Poor air penetration"],
      bestFor: "Fruit trees, roses, water plants",
      pH: "6.0 - 7.5",
      texture: "Sticky, muddy when wet",
      drainage: "Poor (1-2cm/hour)",
      nutrients: "High (natural NPK)",
      price: "$15 - $25 per 50lb bag",
      color: "from-amber-500 to-orange-600"
    },
    {
      name: "Sandy Soil",
      description: "Drains well but difficult to retain water and nutrients",
      pros: ["Good drainage", "Easy to dig", "Warms quickly", "Well aerated"],
      cons: ["Loses water quickly", "Low nutrients", "Needs frequent watering", "Erosion prone"],
      bestFor: "Herbs, root vegetables, cacti",
      pH: "6.0 - 7.0",
      texture: "Loose, crumbles when dry",
      drainage: "Good (5-10cm/hour)",
      nutrients: "Low (needs fertilizer)",
      price: "$10 - $20 per 50lb bag",
      color: "from-yellow-500 to-amber-600"
    },
    {
      name: "Loamy Soil",
      description: "Ideal soil with perfect balance of clay, sand, and organic matter",
      pros: ["Perfect balance", "Moderate drainage", "Rich in nutrients", "Easy to work with"],
      cons: ["Hard to find naturally", "Needs maintenance", "Higher cost"],
      bestFor: "Most types of plants",
      pH: "6.0 - 7.0",
      texture: "Soft, crumbly, easy to handle",
      drainage: "Medium (3-5cm/hour)",
      nutrients: "High (balanced NPK)",
      price: "$25 - $40 per 50lb bag",
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Humus Soil",
      description: "Rich in organic matter, dark colored, very fertile",
      pros: ["Extremely rich in nutrients", "Good moisture retention", "Loose structure", "Beautiful dark color"],
      cons: ["Can be too rich", "Needs mixing", "May retain too much water"],
      bestFor: "Seed starting, young plants, leafy greens",
      pH: "5.5 - 6.5",
      texture: "Loose, dark colored",
      drainage: "Medium (2-4cm/hour)",
      nutrients: "Very high (organic)",
      price: "$30 - $50 per 50lb bag",
      color: "from-gray-700 to-gray-900"
    }
  ];

  const fertilizers = [
    {
      type: "Organic Fertilizers",
      icon: "🌱",
      examples: [
        { name: "Cow manure", npk: "1-1-1", price: "$8 per 40lb bag" },
        { name: "Compost", npk: "2-1-2", price: "$12 per 40lb bag" },
        { name: "Worm castings", npk: "3-2-2", price: "$20 per 20lb bag" },
        { name: "Bat guano", npk: "10-3-1", price: "$25 per 10lb bag" }
      ],
      benefits: ["Environmentally safe", "Improves soil structure", "Long-lasting nutrition", "Increases beneficial microorganisms"],
      usage: "Mix into soil before planting, apply every 2-3 months",
      dosage: "1-2 cups per square foot",
      timing: "Early morning or evening",
      storage: "Dry, cool, ventilated area",
      color: "from-green-500 to-emerald-600"
    },
    {
      type: "Synthetic Fertilizers",
      icon: "⚗️",
      examples: [
        { name: "NPK 16-16-8", npk: "16-16-8", price: "$15 per 2lb bag" },
        { name: "Urea", npk: "46-0-0", price: "$10 per 2lb bag" },
        { name: "Superphosphate", npk: "0-18-0", price: "$12 per 2lb bag" },
        { name: "Potassium chloride", npk: "0-0-60", price: "$14 per 2lb bag" }
      ],
      benefits: ["Fast acting", "High concentration", "Easy to use", "Cost effective"],
      usage: "Dilute according to instructions, apply every 2 weeks",
      dosage: "1-2 tsp per gallon of water",
      timing: "Morning, avoid hot sun",
      storage: "Sealed, away from moisture",
      color: "from-blue-500 to-indigo-600"
    },
    {
      type: "Biological Fertilizers",
      icon: "🦠",
      examples: [
        { name: "EM (Effective microorganisms)", npk: "Enzymes", price: "$20 per 32oz bottle" },
        { name: "Trichoderma", npk: "Beneficial fungi", price: "$15 per 4oz package" },
        { name: "Mycorrhiza", npk: "Root fungi", price: "$25 per 2oz package" },
        { name: "Bacillus", npk: "Beneficial bacteria", price: "$18 per 16oz bottle" }
      ],
      benefits: ["Improves nutrient uptake", "Disease prevention", "Soil improvement", "Environmentally friendly"],
      usage: "Water at root zone every 1-2 weeks, dilute as directed",
      dosage: "1-2 tsp per gallon of water",
      timing: "Evening, when soil is moist",
      storage: "Refrigerate, protect from light",
      color: "from-purple-500 to-violet-600"
    }
  ];

  const pesticides = [
    {
      category: "Biological Pesticides",
      icon: "🐛",
      products: [
        { name: "BT (Bacillus thuringiensis)", target: "Leaf-eating caterpillars", price: "$15 per 1oz package" },
        { name: "Neem oil", target: "Aphids, spider mites", price: "$25 per 4oz bottle" },
        { name: "Natural pyrethrin", target: "Flies, mosquitoes", price: "$35 per 8oz bottle" },
        { name: "Spinosad", target: "Leaf rollers", price: "$30 per 4oz bottle" }
      ],
      targets: ["Leaf-eating caterpillars", "Aphids", "Spider mites", "Thrips"],
      safety: "Safe for humans and pets",
      application: "Spray in evening, avoid direct sunlight",
      dosage: "1-2ml per liter of water",
      frequency: "Every 7-10 days",
      color: "from-green-500 to-teal-600"
    },
    {
      category: "Fungicides",
      icon: "🍄",
      products: [
        { name: "Copper sulfate", target: "Leaf spot diseases", price: "$12 per 4oz package" },
        { name: "Mancozeb", target: "Powdery mildew", price: "$18 per 4oz package" },
        { name: "Propiconazole", target: "Root rot", price: "$28 per 4oz bottle" },
        { name: "Carbendazim", target: "Fungal wilt", price: "$22 per 2oz package" }
      ],
      targets: ["Leaf spot diseases", "Powdery mildew", "Root rot", "Fungal wilt"],
      safety: "Wear protective equipment when using",
      application: "Spray preventively, avoid windy conditions",
      dosage: "0.5-1g per liter of water",
      frequency: "Every 14 days",
      color: "from-orange-500 to-red-600"
    },
    {
      category: "Natural Methods",
      icon: "🌿",
      products: [
        { name: "Soap water", target: "Green aphids", price: "DIY - $2" },
        { name: "Garlic + chili spray", target: "Young caterpillars", price: "DIY - $3" },
        { name: "Neem oil", target: "Light fungal issues", price: "$20 per 2oz bottle" },
        { name: "Baking soda", target: "Powdery mildew", price: "$5 per 16oz box" }
      ],
      targets: ["Green aphids", "Young caterpillars", "Light fungal issues", "Small insects"],
      safety: "Completely safe",
      application: "Can be used frequently",
      dosage: "According to natural recipes",
      frequency: "Every 3-5 days",
      color: "from-emerald-500 to-green-600"
    }
  ];

  const seedGuide = [
    {
      category: "Leafy Greens",
      icon: "🥬",
      varieties: [
        { name: "Water spinach", germination: "3-5 days", harvest: "20-25 days", price: "$5 per packet" },
        { name: "Bok choy", germination: "4-6 days", harvest: "25-30 days", price: "$6 per packet" },
        { name: "Lettuce", germination: "5-7 days", harvest: "30-40 days", price: "$7 per packet" },
        { name: "Amaranth", germination: "3-4 days", harvest: "20-30 days", price: "$5 per packet" }
      ],
      sowingTime: "Year-round, avoid heavy rain season",
      soilTemp: "68-77°F",
      spacing: "4-6 inches between plants",
      depth: "0.2-0.4 inches",
      tips: "Sow thinly, water gently, harvest early",
      color: "from-green-400 to-emerald-500"
    },
    {
      category: "Root Vegetables",
      icon: "🥕",
      varieties: [
        { name: "Carrots", germination: "10-14 days", harvest: "70-80 days", price: "$8 per packet" },
        { name: "Radishes", germination: "7-10 days", harvest: "60-70 days", price: "$6 per packet" },
        { name: "Potatoes", germination: "14-21 days", harvest: "90-120 days", price: "$15 per lb" },
        { name: "Onions", germination: "10-15 days", harvest: "100-120 days", price: "$10 per packet" }
      ],
      sowingTime: "Dry season (October-March)",
      soilTemp: "59-68°F",
      spacing: "2-4 inches between plants",
      depth: "0.4-0.8 inches",
      tips: "Loose, well-draining soil, no fresh manure",
      color: "from-orange-400 to-red-500"
    },
    {
      category: "Fruiting Vegetables",
      icon: "🍅",
      varieties: [
        { name: "Tomatoes", germination: "7-10 days", harvest: "70-90 days", price: "$10 per packet" },
        { name: "Peppers", germination: "10-14 days", harvest: "80-100 days", price: "$12 per packet" },
        { name: "Cucumbers", germination: "5-8 days", harvest: "50-60 days", price: "$8 per packet" },
        { name: "Green beans", germination: "7-10 days", harvest: "60-80 days", price: "$7 per packet" }
      ],
      sowingTime: "End of rainy season (August-October)",
      soilTemp: "72-82°F",
      spacing: "12-20 inches between plants",
      depth: "0.4-0.8 inches",
      tips: "Need support structures, water consistently, fertilize regularly",
      color: "from-red-400 to-pink-500"
    },
    {
      category: "Herbs",
      icon: "🌿",
      varieties: [
        { name: "Basil", germination: "7-14 days", harvest: "30-45 days", price: "$6 per packet" },
        { name: "Cilantro", germination: "10-21 days", harvest: "25-35 days", price: "$5 per packet" },
        { name: "Mint", germination: "5-10 days", harvest: "30-40 days", price: "$7 per packet" },
        { name: "Peppermint", germination: "14-21 days", harvest: "40-60 days", price: "$8 per packet" }
      ],
      sowingTime: "Year-round",
      soilTemp: "64-77°F",
      spacing: "6-8 inches between plants",
      depth: "0.2 inches",
      tips: "Less water, more light, regular pruning",
      color: "from-green-400 to-teal-500"
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Essentials"
        subtitle="Master the basics: soil, fertilizers, pesticides and seeds for successful gardening"
        icon={<Flower className="h-10 w-10" />}
      />

      {/* Soil Types Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">🌱 Soil Types Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {soilTypes.map((soil, index) => (
            <Card key={index} className="h-full">
              <div className={`w-full h-3 rounded-t-lg bg-gradient-to-r ${soil.color} mb-4`}></div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">{soil.name}</h3>
              <p className="text-emerald-600 mb-4">{soil.description}</p>
              
              {/* Technical Specs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 text-sm">pH Level</h4>
                  <p className="text-blue-700 text-sm">{soil.pH}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-800 text-sm">Drainage</h4>
                  <p className="text-purple-700 text-sm">{soil.drainage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Advantages
                  </h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    {soil.pros.map((pro, i) => (
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
                    {soil.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-1">Best for:</h4>
                  <p className="text-indigo-700 text-sm">{soil.bestFor}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">Price range:</h4>
                  <p className="text-gray-700 text-sm font-semibold">{soil.price}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Fertilizers Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">🌿 Fertilizer Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fertilizers.map((fertilizer, index) => (
            <Card key={index} className="h-full">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${fertilizer.color} text-white text-2xl mb-3`}>
                  {fertilizer.icon}
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">{fertilizer.type}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Popular products:</h4>
                  <div className="space-y-2">
                    {fertilizer.examples.map((example, i) => (
                      <div key={i} className="border-l-2 border-emerald-300 pl-3">
                        <div className="font-medium text-emerald-700 text-sm">{example.name}</div>
                        <div className="text-emerald-600 text-xs">NPK: {example.npk} • {example.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Benefits:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {fertilizer.benefits.map((benefit, i) => (
                      <li key={i}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-1">Usage:</h4>
                    <p className="text-purple-700 text-sm">{fertilizer.usage}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-1">Dosage:</h4>
                    <p className="text-yellow-700 text-sm">{fertilizer.dosage}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-1 text-sm">Timing:</h4>
                    <p className="text-pink-700 text-xs">{fertilizer.timing}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">Storage:</h4>
                    <p className="text-gray-700 text-xs">{fertilizer.storage}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pesticides Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">🛡️ Plant Protection Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pesticides.map((pesticide, index) => (
            <Card key={index} className="h-full">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${pesticide.color} text-white text-2xl mb-3`}>
                  {pesticide.icon}
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">{pesticide.category}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Products:</h4>
                  <div className="space-y-2">
                    {pesticide.products.map((product, i) => (
                      <div key={i} className="border-l-2 border-emerald-300 pl-3">
                        <div className="font-medium text-emerald-700 text-sm">{product.name}</div>
                        <div className="text-emerald-600 text-xs">{product.target} • {product.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Targets:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pesticide.targets.map((target, i) => (
                      <span key={i} className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-1">Safety:</h4>
                    <p className="text-yellow-700 text-sm">{pesticide.safety}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Application:</h4>
                    <p className="text-blue-700 text-sm">{pesticide.application}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-1 text-sm">Dosage:</h4>
                    <p className="text-purple-700 text-xs">{pesticide.dosage}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-1 text-sm">Frequency:</h4>
                    <p className="text-indigo-700 text-xs">{pesticide.frequency}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Seeds Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">🌱 Seed Growing Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seedGuide.map((guide, index) => (
            <Card key={index} className="h-full">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${guide.color} text-white text-2xl mb-3`}>
                  {guide.icon}
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">{guide.category}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Popular varieties:</h4>
                  <div className="space-y-2">
                    {guide.varieties.map((variety, i) => (
                      <div key={i} className="border-l-2 border-emerald-300 pl-3">
                        <div className="font-medium text-emerald-700 text-sm">{variety.name}</div>
                        <div className="text-emerald-600 text-xs">
                          Germination: {variety.germination} • Harvest: {variety.harvest} • {variety.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1 text-sm flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Season:
                    </h4>
                    <p className="text-blue-700 text-xs">{guide.sowingTime}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-1 text-sm flex items-center">
                      <Thermometer className="h-3 w-3 mr-1" />
                      Soil temp:
                    </h4>
                    <p className="text-purple-700 text-xs">{guide.soilTemp}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-1 text-sm">Spacing:</h4>
                    <p className="text-orange-700 text-xs">{guide.spacing}</p>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-1 text-sm">Depth:</h4>
                    <p className="text-pink-700 text-xs">{guide.depth}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-1">Success tips:</h4>
                  <p className="text-yellow-700 text-sm">{guide.tips}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Seasonal Calendar */}
      <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">📅 Seasonal Gardening Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Sun className="h-5 w-5 mr-2" />
              🌸 Spring (Feb-Apr)
            </h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• <strong>Sow:</strong> Leafy greens, herbs</li>
              <li>• <strong>Plant:</strong> Fruit trees, flowers</li>
              <li>• <strong>Fertilize:</strong> Organic, compost</li>
              <li>• <strong>Prepare:</strong> New soil, containers</li>
              <li>• <strong>Temperature:</strong> 68-77°F</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Thermometer className="h-5 w-5 mr-2" />
              ☀️ Summer (May-Jul)
            </h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• <strong>Water:</strong> Twice daily, morning-evening</li>
              <li>• <strong>Shade:</strong> 50-70% shade cloth</li>
              <li>• <strong>Protect:</strong> Peak pest season</li>
              <li>• <strong>Harvest:</strong> Summer vegetables</li>
              <li>• <strong>Temperature:</strong> 82-95°F</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Wind className="h-5 w-5 mr-2" />
              🍂 Fall (Aug-Oct)
            </h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• <strong>Sow:</strong> Winter vegetables, root crops</li>
              <li>• <strong>Plant:</strong> Ornamental plants, foliage</li>
              <li>• <strong>Prune:</strong> Shape ornamental plants</li>
              <li>• <strong>Compost:</strong> Make compost from fallen leaves</li>
              <li>• <strong>Temperature:</strong> 72-82°F</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Droplets className="h-5 w-5 mr-2" />
              ❄️ Winter (Nov-Jan)
            </h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>• <strong>Protect:</strong> Cover from cold, move indoors</li>
              <li>• <strong>Water:</strong> Reduce 50%, midday watering</li>
              <li>• <strong>Prepare:</strong> Seeds for next year</li>
              <li>• <strong>Plan:</strong> Design new garden layouts</li>
              <li>• <strong>Temperature:</strong> 59-72°F</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Expert Tips */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">💡 Expert Tips & Secrets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Beaker className="h-5 w-5 mr-2" />
              Professional Soil Testing
            </h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>• <strong>pH:</strong> Use test strips, target 6.0-7.0</li>
              <li>• <strong>Drainage:</strong> Dig 12" hole, pour water</li>
              <li>• <strong>Nutrients:</strong> Test NPK with kit</li>
              <li>• <strong>Structure:</strong> Squeeze soil, observe texture</li>
              <li>• <strong>Frequency:</strong> Every 6 months</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Droplets className="h-5 w-5 mr-2" />
              Scientific Watering
            </h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>• <strong>Timing:</strong> 6-7am, 5-6pm</li>
              <li>• <strong>Location:</strong> Water roots, avoid leaves/flowers</li>
              <li>• <strong>Check:</strong> Water when top 1" is dry</li>
              <li>• <strong>Water:</strong> Room temperature, let sit overnight</li>
              <li>• <strong>Amount:</strong> Deep watering, avoid waterlogging</li>
            </ul>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Proactive Disease Prevention
            </h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>• <strong>Observe:</strong> Daily inspection, early morning</li>
              <li>• <strong>Hygiene:</strong> Remove yellow/diseased leaves immediately</li>
              <li>• <strong>Ventilation:</strong> Adequate spacing between plants</li>
              <li>• <strong>Prevention:</strong> Spray organic fungicides</li>
              <li>• <strong>Isolation:</strong> Separate diseased plants immediately</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Troubleshooting Guide */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">🚨 Common Problem Solutions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">🌱 Soil Problems</h4>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Hard, compacted soil</h5>
                <p className="text-orange-100 text-sm">
                  <strong>Solution:</strong> Mix sand + compost, regular cultivation
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Waterlogged soil</h5>
                <p className="text-orange-100 text-sm">
                  <strong>Solution:</strong> Add drainage holes, mix in perlite
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Too acidic/alkaline soil</h5>
                <p className="text-orange-100 text-sm">
                  <strong>Solution:</strong> Lime powder (acidic), sulfur (alkaline)
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">🌿 Plant Problems</h4>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Yellow leaves, leaf drop</h5>
                <p className="text-orange-100 text-sm">
                  <strong>Cause:</strong> Overwatering, insufficient light
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Stunted growth</h5>
                <p className="text-orange-100 text-sm">
                  <strong>Cause:</strong> Nutrient deficiency, pot too small
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h5 className="font-semibold mb-1">Seeds won't germinate</h5>
                <p className="text-orange-100 text-sm">
                  <strong>Cause:</strong> Old seeds, wrong temperature
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Essentials Products */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading essentials...</p>
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
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-emerald-800 text-center mb-8">Essential Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {essentials.map((essential) => (
              <Link key={essential.id} to={`/essential/${essential.slug || generateSlug(essential.name)}`} className="block h-full">
                <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={essential.image || '/image.png'}
                      alt={essential.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <ArrowRight className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded text-sm font-medium">
                      ${essential.price || '0'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                      {essential.category || 'General'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-800">Essential</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
                    {essential.name}
                  </h3>
                  <p className="text-emerald-600 mb-4 leading-relaxed">
                    {essential.description?.substring(0, 100) + '...'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
                    <div className="flex items-center space-x-1">
                      <Beaker className="h-4 w-4" />
                      <span>{essential.category || 'General'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${essential.price || '0'}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Essentials;