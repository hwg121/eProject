import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Star, ExternalLink } from 'lucide-react';
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

const Books: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await publicService.getBooks({ 
          page: currentPage, 
          per_page: 50 // Load 50 items per request
        });
        
        // Handle API response format: {data: [...], meta: {...}}
        let booksData: Product[] = [];
        if (response && typeof response === 'object' && 'data' in response) {
          booksData = response.data;
          // Update total pages from server meta (for UI pagination display)
          if (response.meta) {
            const totalItems = response.meta.total || 0;
            // Calculate pages based on client-side itemsPerPage for UI display
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
          }
        } else if (Array.isArray(response)) {
          booksData = response;
        }
        
        setBooks(booksData);
      } catch (err) {
        setError('Failed to load books');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [currentPage, itemsPerPage]);

  // Filter books based on search term (client-side filtering for current page)
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Use filtered books for display (no client-side pagination, server handles it)
  const currentBooks = filteredBooks;

  return (
    <div className="space-y-12">
      <PageHeader
        title="Expand Your Gardening Knowledge"
        subtitle="Discover our carefully curated collection of gardening books. From beginner guides to advanced techniques, find the perfect book to enhance your gardening skills."
        icon={<BookOpen className="h-10 w-10" />}
      />

      {/* Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </Card>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading books...</p>
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
              Available Books ({filteredBooks.length})
            </h2>
          </div>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No books found</h3>
              <p className="text-emerald-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBooks.map((book) => (
                <a 
                  key={book.id} 
                  href={book.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    {/* Image Section */}
                    {book.image && (
                      <div className="w-full h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={book.image} 
                          alt={book.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="text-emerald-600">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <span className="text-sm text-emerald-600 font-medium">{book.subcategory || 'General'}</span>
                        </div>
                      <div className="flex items-center space-x-2">
                        {book.is_featured && (
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="h-3 w-3 fill-white" />
                            Featured
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">{book.rating || '4.5'}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">{book.name}</h3>
                    <p className="text-emerald-600 font-medium mb-2">by {book.author || 'Unknown Author'}</p>
                    <p className="text-emerald-600 text-sm mb-4 leading-relaxed">{book.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-4 text-sm text-emerald-600">
                        <span>{book.price ? `$${book.price}` : 'Free'}</span>
                        {book.pages && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                            {book.pages} pages
                          </span>
                        )}
                      </div>
                      <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 transition-colors">
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-sm">View Details</span>
                      </button>
                    </div>
                    </div>
                  </Card>
                </a>
              ))}
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

      {/* Featured Books */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-4">📖 Editor's Book Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Best for Beginners</h3>
            <p className="text-indigo-100">Square Foot Gardening - Simple method, maximum results</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Most Inspiring</h3>
            <p className="text-indigo-100">The Hidden Life of Trees - Nature's amazing secrets</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Most Practical</h3>
            <p className="text-indigo-100">The Vegetable Gardener's Bible - Proven growing system</p>
          </div>
        </div>
      </Card>

      {/* Book Categories */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <h3 className="text-2xl font-bold mb-6">📚 Book Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">🌱 Beginner Guides</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Square Foot Gardening</li>
              <li>• Container Gardening</li>
              <li>• Basic Plant Care</li>
              <li>• Tool Selection</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🥕 Vegetable Growing</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Organic Methods</li>
              <li>• Season Extension</li>
              <li>• Pest Management</li>
              <li>• Companion Planting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌸 Flower Gardening</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Perennial Gardens</li>
              <li>• Cut Flower Growing</li>
              <li>• Garden Design</li>
              <li>• Seasonal Color</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌿 Specialized Topics</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Native Plant Gardening</li>
              <li>• Permaculture</li>
              <li>• Soil Science</li>
              <li>• Plant Botany</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Reading Tips */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <h3 className="text-2xl font-bold mb-4">📖 Reading & Learning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3">📝 Effective Reading</h4>
            <ul className="space-y-2 text-orange-100">
              <li>• Keep a gardening journal alongside</li>
              <li>• Mark pages with seasonal reminders</li>
              <li>• Practice techniques as you read</li>
              <li>• Join online book discussions</li>
              <li>• Create your own reference system</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌱 Application Tips</h4>
            <ul className="space-y-2 text-orange-100">
              <li>• Start with one new technique at a time</li>
              <li>• Adapt advice to your climate</li>
              <li>• Take before/after photos</li>
              <li>• Share experiences with other gardeners</li>
              <li>• Build your personal library gradually</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Library Resources */}
      <Card className="border-2 border-emerald-200">
        <h3 className="text-2xl font-bold text-emerald-800 mb-4">📍 Find These Books</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-lg mb-3">
              <BookOpen className="h-8 w-8 text-emerald-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-emerald-800 mb-2">Local Libraries</h4>
            <p className="text-emerald-600 text-sm">Check your local library system for physical and digital copies</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-lg mb-3">
              <ExternalLink className="h-8 w-8 text-emerald-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-emerald-800 mb-2">Online Stores</h4>
            <p className="text-emerald-600 text-sm">Purchase from major online retailers and bookstores</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-lg mb-3">
              <Star className="h-8 w-8 text-emerald-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-emerald-800 mb-2">Book Swaps</h4>
            <p className="text-emerald-600 text-sm">Join local gardening groups for book exchanges</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Books;