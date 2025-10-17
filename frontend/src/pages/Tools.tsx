import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Star, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
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

const Tools: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [tools, setTools] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const response = await publicService.getTools({ 
          page: currentPage, 
          per_page: 50 
        });
        
        // Handle API response format: {data: [...], meta: {...}}
        let toolsData: Product[] = [];
        if (response && typeof response === 'object' && 'data' in response) {
          toolsData = response.data;
          // Update total pages from server meta (for UI pagination display)
          if (response.meta) {
            const totalItems = response.meta.total || 0;
            // Calculate pages based on client-side itemsPerPage for UI display
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
          }
        } else if (Array.isArray(response)) {
          toolsData = response;
        }
        
        // Only use real API data
        if (toolsData && toolsData.length > 0) {
          setTools(toolsData);
        } else {
          setError('No tools available');
        }
      } catch (err) {
        setError('Failed to load tools');
        console.error('Error loading tools:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, [currentPage, itemsPerPage]);

  // Filter tools based on search term (client-side filtering for current page)
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Use filtered tools for display (server handles pagination)
  const currentTools = filteredTools;

  return (
    <div className="space-y-12">
      <PageHeader
        title="Essential Gardening Tools"
        subtitle="Discover the essential tools that make gardening easier, more efficient, and more enjoyable. From basic hand tools to advanced equipment."
        icon={<Wrench className="h-10 w-10" />}
      />

      {/* Search Bar */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-emerald-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px] touch-manipulation"
            />
          </div>
        </div>
      </Card>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading tools...</p>
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
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-2 sm:px-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-800">
              Available Tools ({filteredTools.length})
            </h2>
          </div>
          
          {filteredTools.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Wrench className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-emerald-800 mb-2">No tools found</h3>
              <p className="text-sm sm:text-base text-emerald-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {currentTools.map((tool) => (
                <a 
                  key={tool.id} 
                  href={tool.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    {/* Image Section */}
                    {tool.image && (
                      <div className="w-full h-40 sm:h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={tool.image} 
                          alt={tool.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <div className="text-emerald-600">
                            <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <span className="text-xs sm:text-sm text-emerald-600 font-medium">{tool.subcategory || 'Tool'}</span>
                        </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap gap-1.5">
                        {tool.is_featured && (
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-white" />
                            <span className="hidden sm:inline">Featured</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                          <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                          <span className="text-xs sm:text-sm font-semibold">{tool.rating || '4.5'}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-1.5 sm:mb-2 line-clamp-2">{tool.name}</h3>
                    <p className="text-emerald-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">{tool.description}</p>
                    <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-emerald-600 flex-wrap gap-1.5">
                        <span className="font-semibold">{tool.price ? `$${tool.price}` : 'Free'}</span>
                        {tool.brand && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                            {tool.brand}
                          </span>
                        )}
                      </div>
                      <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors min-h-[44px] touch-manipulation">
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">View</span>
                      </button>
                    </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>

            {/* Pagination - Perfect Mobile */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 px-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors min-h-[44px] min-w-[80px] sm:min-w-[100px] text-sm sm:text-base font-medium touch-manipulation"
                >
                  Prev
                </button>
                
                <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors min-h-[44px] min-w-[44px] text-sm sm:text-base font-medium touch-manipulation ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white shadow-md'
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
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors min-h-[44px] min-w-[80px] sm:min-w-[100px] text-sm sm:text-base font-medium touch-manipulation"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </>
    )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-800">Tool Demonstration</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-emerald-600 hover:text-emerald-800 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Tool demonstration video"
              />
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
        <h3 className="text-2xl font-bold mb-4">Tool Care Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">🔧 Maintenance</h4>
            <ul className="space-y-1 text-blue-100">
              <li>• Clean tools after each use</li>
              <li>• Keep cutting edges sharp</li>
              <li>• Oil moving parts regularly</li>
              <li>• Store in a dry place</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">💡 Pro Tips</h4>
            <ul className="space-y-1 text-blue-100">
              <li>• Invest in quality over quantity</li>
              <li>• Choose ergonomic handles</li>
              <li>• Consider tool weight for comfort</li>
              <li>• Keep a basic repair kit handy</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tools;