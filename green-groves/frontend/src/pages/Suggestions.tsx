import React from 'react';
import { Star, ExternalLink, BookOpen, Wrench, Sparkles } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

const Suggestions: React.FC = () => {
  const suggestions = {
    tools: [
      { name: "Fiskars Bypass Pruner", rating: 4.8, price: "$24.99", description: "Sharp, durable pruning shears for clean cuts" },
      { name: "Corona ComfortGEL Trowel", rating: 4.6, price: "$19.95", description: "Ergonomic hand trowel with comfort grip" },
      { name: "Dramm ColorStorm Watering Wand", rating: 4.7, price: "$32.50", description: "Gentle watering wand perfect for delicate plants" }
    ],
    accessories: [
      { name: "Gardener's Supply Tomato Cages", rating: 4.5, price: "$12.95", description: "Sturdy support cages for growing tomatoes" },
      { name: "Solar Fairy String Lights", rating: 4.4, price: "$15.99", description: "Magical lighting for evening garden ambiance" },
      { name: "Decorative Plant Markers", rating: 4.3, price: "$8.75", description: "Stylish markers to identify your plants" }
    ],
    books: [
      { name: "The Flower Farmer", rating: 4.9, price: "$24.95", description: "Complete guide to growing cut flowers" },
      { name: "Grow Your Soil!", rating: 4.7, price: "$19.95", description: "Master soil health for better gardens" },
      { name: "The Pruning Book", rating: 4.6, price: "$22.50", description: "Expert techniques for pruning all plants" }
    ]
  };

  const renderSuggestionCard = (item: any, icon: React.ReactNode, category: string) => (
    <Card key={item.name} className="h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-emerald-600">{icon}</div>
          <span className="text-sm text-emerald-600 font-medium">{category}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">{item.rating}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-emerald-800 mb-2">{item.name}</h3>
      <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{item.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-emerald-800">{item.price}</span>
        <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors">
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">View Details</span>
        </button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-12">
      <PageHeader
        title="Product Suggestions"
        subtitle="Hand-picked recommendations from gardening experts to help you succeed"
        icon={<Star className="h-10 w-10" />}
      />

      {/* Featured Recommendations */}
      <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <h2 className="text-2xl font-bold mb-4">🏆 Editor's Choice This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Best Tool</h3>
            <p className="text-emerald-100">Fiskars Bypass Pruner - Professional-grade cutting performance</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Best Book</h3>
            <p className="text-emerald-100">The Flower Farmer - Transform your passion into profit</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Best Accessory</h3>
            <p className="text-emerald-100">Solar Fairy Lights - Create magical garden nights</p>
          </div>
        </div>
      </Card>

      {/* Tool Recommendations */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">🔧 Recommended Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.tools.map(tool => renderSuggestionCard(tool, <Wrench className="h-5 w-5" />, "Tool"))}
        </div>
      </section>

      {/* Accessory Recommendations */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">✨ Recommended Accessories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.accessories.map(accessory => renderSuggestionCard(accessory, <Sparkles className="h-5 w-5" />, "Accessory"))}
        </div>
      </section>

      {/* Book Recommendations */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-emerald-800 text-center">📚 Recommended Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.books.map(book => renderSuggestionCard(book, <BookOpen className="h-5 w-5" />, "Book"))}
        </div>
      </section>

      {/* Budget-Friendly Options */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <h3 className="text-2xl font-bold mb-6">💰 Budget-Friendly Picks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3">Under $15</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• Basic hand trowel - $8.99</li>
              <li>• Pack of plant markers - $6.50</li>
              <li>• Spray bottle for misting - $4.99</li>
              <li>• Garden gloves - $7.95</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Under $30</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• Quality pruning shears - $24.99</li>
              <li>• Watering wand - $18.50</li>
              <li>• Set of terra cotta pots - $22.00</li>
              <li>• Beginner gardening book - $16.95</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Seasonal Recommendations */}
      <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <h3 className="text-2xl font-bold mb-6">🍂 Seasonal Picks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Spring</h4>
            <p className="text-sm">Seed starting supplies, transplanting tools</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Summer</h4>
            <p className="text-sm">Irrigation systems, shade cloth, harvest baskets</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Fall</h4>
            <p className="text-sm">Mulch, bulb planting tools, leaf rakes</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Winter</h4>
            <p className="text-sm">Planning books, seed catalogs, indoor grow lights</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Suggestions;