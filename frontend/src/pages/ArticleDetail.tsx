import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DetailPage from '../components/UI/DetailPage';
import { publicService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';
import { ApiArticle } from '../types/api';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: Tag[];
  imageUrl: string;
  views: number;
  likes: number;
  rating: number;
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
          const response = await publicService.getArticles();
          
          // Handle API response format: {success: true, data: [...]}
          let articlesData: ApiArticle[] = [];
          if (response && typeof response === 'object' && 'success' in response && (response as any).success && (response as any).data) {
            articlesData = (response as any).data;
          } else if (Array.isArray(response)) {
            articlesData = response;
          }
          
          const articleData = findItemBySlug(articlesData, slug!, 'slug', 'title');
          if (articleData) {
            // Convert ApiTag[] to TagData[] for DetailPage compatibility
            const convertedTags = Array.isArray(articleData.tags) 
              ? articleData.tags.map(tag => ({
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug,
                  description: tag.description || null
                }))
              : [];

            const article: Article = {
              id: articleData.id?.toString() || slug!,
              title: articleData.title || '',
              content: articleData.body || articleData.content || '',
              excerpt: articleData.excerpt || articleData.description || '',
              author: articleData.author?.name || articleData.author || '',
              publishedAt: articleData.published_at || articleData.created_at || new Date().toISOString(),
              tags: convertedTags,
              imageUrl: (articleData as ApiArticle & { featured_image?: string; cover?: string }).featured_image || (articleData as ApiArticle & { cover?: string }).cover || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              views: articleData.views || 0,
              likes: articleData.likes || 0,
              rating: articleData.rating || 0,
              category: articleData.category || ''
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
      views={article.views || 0}
      likes={article.likes || 0}
      backUrl="/techniques"
      rating={article.rating || 0}
      contentId={parseInt(article.id)}
      category={article.category}
      relatedContent={[]}
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
