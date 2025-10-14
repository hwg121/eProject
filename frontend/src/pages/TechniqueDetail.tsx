import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Clock, Users, ThumbsUp, CheckCircle, Star } from 'lucide-react';
import DetailPage from '../components/UI/DetailPage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';
import { publicService, articlesService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Technique {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  difficulty: string;
  duration: string;
  materials: string[];
  steps: string[];
  tips: string[];
  category: string;
  rating: number;
}

const TechniqueDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [technique, setTechnique] = useState<Technique | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnique = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin/moderator
        const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');
        
        // Try to fetch from API
        try {
          // If admin, fetch all articles (including archived)
          // If public, fetch only published articles
          const response = isAdmin 
            ? await articlesService.getAll({ per_page: 1000 })
            : await publicService.getArticles(); // Using articles as techniques
          
          // Handle API response format: {success: true, data: [...]}
          let articlesData: ApiArticle[] = [];
          if (response && typeof response === 'object' && 'success' in response && (response as any).success && (response as any).data) {
            // Check if data is paginated or direct array
            const dataField = (response as any).data;
            if (Array.isArray(dataField)) {
              articlesData = dataField;
            } else if (dataField && Array.isArray(dataField.data)) {
              // Paginated response
              articlesData = dataField.data;
            }
          } else if (Array.isArray(response)) {
            articlesData = response;
          }
          
          const techniqueData = findItemBySlug(articlesData, slug!, 'slug', 'title');
          if (techniqueData) {
            // Convert ApiTag[] to TagData[] for DetailPage compatibility
            const convertedTags = Array.isArray(techniqueData.tags) 
              ? techniqueData.tags.map(tag => ({
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug,
                  description: tag.description || null
                }))
              : [];

            const technique: Technique = {
              id: techniqueData.id?.toString() || slug!,
              title: techniqueData.title || '',
              description: techniqueData.description || techniqueData.excerpt || '',
              content: techniqueData.body || techniqueData.content || '',
              author: techniqueData.author?.name || techniqueData.author || '',
              publishedAt: techniqueData.published_at || techniqueData.created_at || new Date().toISOString(),
              tags: convertedTags,
              imageUrl: techniqueData.image || techniqueData.imageUrl || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              views: techniqueData.views || 0,
              likes: techniqueData.likes || 0,
              difficulty: techniqueData.difficulty || '',
              duration: techniqueData.duration || '',
              materials: techniqueData.materials || [],
              steps: techniqueData.steps || [],
              tips: techniqueData.tips || [],
              category: techniqueData.category || '',
              rating: techniqueData.rating || 0
            };
            setTechnique(technique);
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load technique from server');
          return;
        }
        
        // If no technique found, set error
        setError('Technique not found');
      } catch (err) {
        setError('Failed to load technique');
        console.error('Error fetching technique:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTechnique();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !technique) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Technique not found</h1>
          <button
            onClick={() => navigate('/techniques')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Techniques
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      type="technique"
      title={technique.title}
      description={technique.description}
      content={`
        <h2>Technique Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Basic Information</h3>
            <ul class="space-y-2">
              <li><strong>Difficulty:</strong> ${technique.difficulty}</li>
              <li><strong>Duration:</strong> ${technique.duration}</li>
              <li><strong>Category:</strong> ${technique.category}</li>
              <li><strong>Rating:</strong> ${technique.rating}/5 ⭐</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Materials Needed</h3>
            <ul class="space-y-2">
              ${technique.materials.map(material => `<li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>${material}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Step-by-Step Instructions</h3>
        <ol class="space-y-4 mb-6">
          ${technique.steps.map((step, index) => `
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-semibold mr-3">${index + 1}</span>
              <span>${step}</span>
            </li>
          `).join('')}
        </ol>
        
        <h3 class="text-xl font-semibold mb-4">Pro Tips</h3>
        <ul class="space-y-2 mb-6">
          ${technique.tips.map(tip => `<li class="flex items-center"><span class="text-yellow-500 mr-2">💡</span>${tip}</li>`).join('')}
        </ul>
      `}
      author={technique.author}
      publishedAt={technique.publishedAt}
      tags={technique.tags}
      imageUrl={technique.imageUrl}
      views={technique.views || 0}
      likes={technique.likes || 0}
      backUrl="/techniques"
      rating={technique.rating || 0}
      contentId={parseInt(technique.id)}
      duration={technique.duration}
      category={technique.category}
      relatedContent={[]}
    >
      {/* Technique Stats */}

      {/* Difficulty and Rating */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      >
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-orange-800 mb-4">Difficulty Level</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-orange-800 mr-3">{technique.difficulty}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(technique.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-purple-800 mb-4">Technique Rating</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-purple-800 mr-3">{technique.rating}/5</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(technique.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </DetailPage>
  );
};

export default TechniqueDetail;
