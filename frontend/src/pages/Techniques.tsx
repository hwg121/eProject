import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, User, Calendar, ArrowRight } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';

const Techniques: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await publicService.getArticles();
        console.log('Articles data:', data); // Debug log
        
        // Fallback data if API fails or returns empty
        if (!data || data.length === 0) {
          const mockArticles = [
            {
              id: '1',
              title: 'Complete Guide to Organic Gardening',
              excerpt: 'Learn everything you need to know about organic gardening, from soil preparation to natural pest control methods.',
              body: 'This is a comprehensive guide to organic gardening...',
              author: { name: 'Dr. Sarah Green' },
              published_at: '2024-01-15',
              created_at: '2024-01-15'
            },
            {
              id: '2', 
              title: 'Container Gardening for Beginners',
              excerpt: 'Start your container garden with this step-by-step guide perfect for small spaces.',
              body: 'Container gardening is perfect for beginners...',
              author: { name: 'Mike Garden' },
              published_at: '2024-01-20',
              created_at: '2024-01-20'
            },
            {
              id: '3',
              title: 'Seasonal Planting Calendar',
              excerpt: 'Know exactly when to plant what with our comprehensive seasonal guide.',
              body: 'Timing is everything in gardening...',
              author: { name: 'Green Thumb Expert' },
              published_at: '2024-01-25',
              created_at: '2024-01-25'
            }
          ];
          setArticles(mockArticles);
        } else {
          setArticles(data);
        }
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error loading articles:', err);
        
        // Set fallback data even on error
        const mockArticles = [
          {
            id: '1',
            title: 'Complete Guide to Organic Gardening',
            excerpt: 'Learn everything you need to know about organic gardening, from soil preparation to natural pest control methods.',
            body: 'This is a comprehensive guide to organic gardening...',
            author: { name: 'Dr. Sarah Green' },
            published_at: '2024-01-15',
            created_at: '2024-01-15'
          }
        ];
        setArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Techniques & Tips"
        subtitle="Master the art of gardening with our comprehensive guides and expert advice"
        icon={<Lightbulb className="h-10 w-10" />}
      />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} to={`/article/${article.slug || generateSlug(article.title)}`} className="block h-full">
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src="/image.png"
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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