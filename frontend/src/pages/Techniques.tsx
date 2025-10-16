import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, User, Calendar, ArrowRight, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Carousel from '../components/ui/Carousel';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';
import { useResponsiveDesign } from '../utils/responsiveDesign';

const Techniques: React.FC = () => {
  const { isMobile, isSmallMobile, isLargeMobile, isTablet, isDesktop, isTouchDevice } = useResponsiveDesign();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await publicService.getArticles();
        
        // Handle API response format: {success: true, data: [...]}
        let articlesData: Article[] = [];
        if (response && typeof response === 'object' && 'success' in response && (response as any).success && (response as any).data) {
          articlesData = (response as any).data;
        } else if (Array.isArray(response)) {
          articlesData = response;
        }
        
        // Only use real API data
        if (articlesData && articlesData.length > 0) {
          setArticles(articlesData);
        } else {
          setError('No articles available');
        }
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  // Featured articles will be the first 3 articles from the database
  const featuredArticles = articles.slice(0, 3).map(article => ({
    id: article.id.toString(),
    title: article.title,
    description: article.excerpt || article.body?.substring(0, 150) + '...',
    image: article.featured_image || article.cover || '/image.png',
    badge: 'Featured',
    link: `/article/${article.slug || generateSlug(article.title)}`
  }));

  return (
    <div className="space-y-12">
      <PageHeader
        title="Gardening Techniques & Tips"
        subtitle="Master the art of gardening with our comprehensive guides and expert advice"
        icon={<Lightbulb className="h-10 w-10" />}
      />

      {/* Featured Articles Carousel */}
      {!loading && !error && articles.length > 0 && (
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Featured Techniques</h2>
            <p className="text-emerald-600 text-lg">
              Discover our most popular gardening techniques and tips
            </p>
          </div>
          
          <Carousel 
            items={featuredArticles}
            autoPlay={true}
            interval={6000}
            showDots={true}
            showArrows={true}
            className="shadow-xl"
          />
        </section>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading articles...</p>
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
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No techniques found</h3>
              <p className="text-emerald-600">Check back later for new gardening techniques and tips</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((article) => (
            <Link key={article.id} to={`/article/${article.slug || generateSlug(article.title)}`} className="block h-full">
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={article.featured_image || article.cover || '/image.png'}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.is_featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="h-3.5 w-3.5 fill-white" />
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-emerald-600 mb-4 leading-relaxed">
                  {article.excerpt || article.body?.substring(0, 150) + '...'}
                </p>
                <div className="flex items-center justify-between text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Author: {article.author?.name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </Link>
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

      <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
        <h3 className="text-2xl font-bold mb-4">Quick Gardening Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">🌱 For Beginners</h4>
            <ul className="space-y-1 text-emerald-100">
              <li>• Start with easy-to-grow plants like herbs</li>
              <li>• Water in early morning or late evening</li>
              <li>• Test your soil pH before planting</li>
              <li>• Use organic compost for better soil health</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">🌿 Advanced Tips</h4>
            <ul className="space-y-1 text-emerald-100">
              <li>• Practice crop rotation for vegetable gardens</li>
              <li>• Implement companion planting strategies</li>
              <li>• Create a composting system</li>
              <li>• Use beneficial insects for pest control</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Techniques;