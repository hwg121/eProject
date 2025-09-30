import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DetailPage from '../components/UI/DetailPage';
import { publicService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  category: string;
}

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const data = await publicService.getArticles();
          const articleData = findItemBySlug(data, slug!, 'slug', 'title');
          if (articleData) {
            const article: Article = {
              id: articleData.id?.toString() || slug!,
              title: articleData.title || 'Untitled Article',
              content: articleData.body || articleData.content || '<p>No content available.</p>',
              excerpt: articleData.excerpt || articleData.description || 'No description available.',
              author: articleData.author?.name || articleData.author || 'Unknown Author',
              publishedAt: articleData.published_at || articleData.created_at || new Date().toISOString(),
              tags: articleData.tags || articleData.categories || ['General'],
              imageUrl: articleData.image || articleData.imageUrl || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              views: articleData.views || 0,
              likes: articleData.likes || 0,
              category: articleData.category || 'General'
            };
            setArticle(article);
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load article from server');
          return;
        }
        
        // If no article found, set error
        setError('Article not found');
      } catch (err) {
        setError('Failed to load article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Article not found</h1>
          <button
            onClick={() => navigate('/techniques')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      type="article"
      title={article.title}
      description={article.excerpt}
      content={article.content}
      author={article.author}
      publishedAt={article.publishedAt}
      tags={article.tags}
      imageUrl={article.imageUrl}
      views={article.views}
      likes={article.likes}
      backUrl="/techniques"
      rating={4.5}
      category={article.category}
      relatedContent={[
        { id: '2', title: 'Container Gardening for Beginners', type: 'article', slug: 'container-gardening-for-beginners' },
        { id: '3', title: 'Seasonal Planting Calendar', type: 'article', slug: 'seasonal-planting-calendar' },
        { id: '4', title: 'Organic Pest Control Methods', type: 'article', slug: 'organic-pest-control-methods' }
      ]}
    >
      {/* Additional article-specific content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">Key Takeaways</h3>
          <ul className="space-y-2 text-emerald-700">
            <li>• Start with healthy soil preparation</li>
            <li>• Use companion planting for natural pest control</li>
            <li>• Compost regularly to maintain soil fertility</li>
            <li>• Choose plants suited to your climate zone</li>
          </ul>
        </div>
      </motion.div>
    </DetailPage>
  );
};

export default ArticleDetail;
