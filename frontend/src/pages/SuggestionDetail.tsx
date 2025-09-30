import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DetailPage from '../components/UI/DetailPage';
import { publicService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  brand: string;
  inStock: boolean;
  imageUrl: string;
  benefits: string[];
  usage: string;
  targetAudience: string[];
  specifications: {
    type: string;
    size: string;
    material?: string;
    features: string[];
  };
  pros: string[];
  cons: string[];
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

const SuggestionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        setLoading(true);
        try {
          const data = await publicService.getSuggestions();
          const suggestionData = findItemBySlug(data, slug!, 'slug', 'title');
          if (suggestionData) {
            const suggestion: Suggestion = {
              id: suggestionData.id?.toString() || slug!,
              title: suggestionData.title || 'Untitled Suggestion',
              description: suggestionData.description || 'No description available.',
              category: suggestionData.category || 'General',
              price: suggestionData.price || 0,
              brand: suggestionData.brand || 'Unknown Brand',
              inStock: suggestionData.inStock !== undefined ? suggestionData.inStock : true,
              imageUrl: suggestionData.image || suggestionData.imageUrl || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              benefits: suggestionData.benefits || ['High quality', 'Good value'],
              usage: suggestionData.usage || 'General use',
              targetAudience: suggestionData.targetAudience || ['Beginners', 'Gardeners'],
              specifications: suggestionData.specifications || {
                type: 'Product',
                size: 'Standard',
                features: ['Durable', 'Easy to use']
              },
              pros: suggestionData.pros || ['Good quality', 'Affordable'],
              cons: suggestionData.cons || ['Limited availability'],
              rating: suggestionData.rating || 4.0,
              reviews: suggestionData.reviews || 0,
              createdAt: suggestionData.created_at || new Date().toISOString(),
              updatedAt: suggestionData.updated_at || new Date().toISOString(),
            };
            setSuggestion(suggestion);
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load suggestion from server');
          return;
        }
        
        // If no suggestion found, set error
        setError('Suggestion not found');
      } catch (err) {
        setError('Failed to load suggestion details');
        console.error('Error fetching suggestion:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSuggestion();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !suggestion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Suggestion Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The suggestion you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/suggestions')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Back to Suggestions
        </button>
      </div>
    );
  }

  return (
    <DetailPage
      type="suggestion"
      title={suggestion.title}
      description={suggestion.description}
      content={`
        <h2>Suggestion Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Basic Information</h3>
            <ul class="space-y-2">
              <li><strong>Category:</strong> ${suggestion.category}</li>
              <li><strong>Brand:</strong> ${suggestion.brand}</li>
              <li><strong>Type:</strong> ${suggestion.specifications.type}</li>
              <li><strong>Size:</strong> ${suggestion.specifications.size}</li>
              ${suggestion.specifications.material ? `<li><strong>Material:</strong> ${suggestion.specifications.material}</li>` : ''}
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Ratings & Reviews</h3>
            <ul class="space-y-2">
              <li><strong>Rating:</strong> ${suggestion.rating}/5 ⭐</li>
              <li><strong>Reviews:</strong> ${suggestion.reviews}</li>
              <li><strong>Availability:</strong> ${suggestion.inStock ? 'In Stock' : 'Out of Stock'}</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Benefits</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          ${suggestion.benefits.map(benefit => `<li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>${benefit}</li>`).join('')}
        </ul>
        
        <h3 class="text-xl font-semibold mb-4">Usage</h3>
        <p class="mb-6">${suggestion.usage}</p>
        
        <h3 class="text-xl font-semibold mb-4">Target Audience</h3>
        <div class="flex flex-wrap gap-2 mb-6">
          ${suggestion.targetAudience.map(audience => `<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">${audience}</span>`).join('')}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-xl font-semibold mb-4 text-green-600">Pros</h3>
            <ul class="space-y-2">
              ${suggestion.pros.map(pro => `<li class="flex items-center"><span class="text-green-600 mr-2">+</span>${pro}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4 text-red-600">Cons</h3>
            <ul class="space-y-2">
              ${suggestion.cons.map(con => `<li class="flex items-center"><span class="text-red-600 mr-2">-</span>${con}</li>`).join('')}
            </ul>
          </div>
        </div>
      `}
      author={suggestion.brand}
      publishedAt={suggestion.createdAt}
      tags={[suggestion.category, suggestion.specifications.type, suggestion.brand]}
      imageUrl={suggestion.imageUrl}
      views={Math.floor(Math.random() * 1000) + 100}
      likes={Math.floor(Math.random() * 100) + 10}
      backUrl="/suggestions"
      rating={suggestion.rating}
      price={suggestion.price}
      brand={suggestion.brand}
      category={suggestion.category}
      inStock={suggestion.inStock}
      relatedContent={[
        { id: '2', title: 'Liquid Plant Fertilizer', type: 'suggestion', slug: 'liquid-plant-fertilizer' },
        { id: '3', title: 'Plant Growth Light', type: 'suggestion', slug: 'plant-growth-light' },
        { id: '4', title: 'Watering Can Set', type: 'suggestion', slug: 'watering-can-set' }
      ]}
    >
      {/* Additional suggestion-specific content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">Why We Recommend This</h3>
          <ul className="space-y-2 text-emerald-700 dark:text-emerald-300">
            <li>• High customer satisfaction rating</li>
            <li>• Excellent value for money</li>
            <li>• Proven results in plant care</li>
            <li>• Suitable for various skill levels</li>
          </ul>
        </div>
      </motion.div>
    </DetailPage>
  );
};

export default SuggestionDetail;
