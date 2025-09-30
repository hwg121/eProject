import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, BookOpen, Wrench, Sparkles } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const suggestionsData = await publicService.getSuggestions();
        setSuggestions(suggestionsData);
      } catch (err) {
        setError('Failed to load suggestions');
        console.error('Error loading suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  // Filter suggestions based on category and search term
  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(suggestions.map(s => s.category).filter(Boolean))];

  const renderSuggestionCard = (item: any) => (
    <Link key={item.id} to={`/suggestion/${item.slug || generateSlug(item.title)}`} className="block h-full">
      <Card className="h-full group hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-emerald-600">
            <Star className="h-5 w-5" />
          </div>
          <span className="text-sm text-emerald-600 font-medium">{item.category}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">{item.rating || '4.5'}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-emerald-800 mb-2">{item.title}</h3>
      <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{item.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-4 text-sm text-emerald-600">
          <span>👁️ {item.views || 0}</span>
          <span>❤️ {item.likes || 0}</span>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
            {item.difficulty_level || 'beginner'}
          </span>
        </div>
        <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors">
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">View Details</span>
        </button>
      </div>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-12">
      <PageHeader
        title="Gardening Suggestions"
        subtitle="Expert recommendations and tips to help you succeed in your gardening journey"
        icon={<Star className="h-10 w-10" />}
      />

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search suggestions..."
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
          <p className="text-emerald-600">Loading suggestions...</p>
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
          {/* Suggestions Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-emerald-800">
                💡 Gardening Suggestions ({filteredSuggestions.length})
              </h2>
            </div>
            
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">No suggestions found</h3>
                <p className="text-emerald-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSuggestions.map(suggestion => renderSuggestionCard(suggestion))}
              </div>
            )}
          </section>
        </>
      )}

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