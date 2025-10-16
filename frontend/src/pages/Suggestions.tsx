import React, { useState, useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
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

const Suggestions: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const response = await publicService.getSuggestions();
        
        // Handle API response format: {success: true, data: [...]}
        let suggestionsData: Product[] = [];
        if (response && typeof response === 'object' && 'success' in response && (response as any).success && (response as any).data) {
          suggestionsData = (response as any).data;
        } else if (Array.isArray(response)) {
          suggestionsData = response;
        }
        
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

  // Filter suggestions based on search term
  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuggestions = filteredSuggestions.slice(startIndex, endIndex);

  const renderSuggestionCard = (item: Product) => (
    <a 
      key={item.id} 
      href={item.link || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full group hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        {/* Image Section */}
        {item.image && (
          <div className="w-full h-48 overflow-hidden bg-gray-100">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="text-emerald-600">
                <Star className="h-5 w-5" />
              </div>
              <span className="text-sm text-emerald-600 font-medium">{item.subcategory || 'Suggestion'}</span>
            </div>
          <div className="flex items-center space-x-2">
            {item.is_featured && (
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Star className="h-3 w-3 fill-white" />
                Featured
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold">{item.rating || '4.5'}</span>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">{item.name}</h3>
        <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4 text-sm text-emerald-600">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
              {item.difficulty_level || 'beginner'}
            </span>
          </div>
          <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">View Details</span>
          </button>
        </div>
        </div>
      </Card>
    </a>
  );

  return (
    <div className="space-y-12">
      <PageHeader
        title="Gardening Suggestions"
        subtitle="Expert recommendations and tips to help you succeed in your gardening journey"
        icon={<Star className="h-10 w-10" />}
      />

      {/* Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search suggestions..."
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-emerald-800">
              Available Suggestions ({filteredSuggestions.length})
            </h2>
          </div>
          
          {filteredSuggestions.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No suggestions found</h3>
              <p className="text-emerald-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentSuggestions.map(suggestion => renderSuggestionCard(suggestion))}
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