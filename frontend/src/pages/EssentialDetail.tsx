import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Leaf, Package, ShoppingCart, Heart, Share2, Truck, Shield } from 'lucide-react';
import DetailPage from '../components/UI/DetailPage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { publicService } from '../services/api';
import { findItemBySlug } from '../utils/slug';
import { ApiEssential } from '../types/api';

interface Essential {
  id: string;
  name: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  price: number;
  rating: number;
  category: string;
  brand: string;
  weight: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
}

const EssentialDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [essential, setEssential] = useState<Essential | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEssential = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const data = await publicService.getEssentials();
          const essentialData = findItemBySlug<ApiEssential>(data as ApiEssential[], slug!, 'slug', 'name');
          if (essentialData) {
            const essential: Essential = {
              id: essentialData.id?.toString() || slug!,
              name: essentialData.name || 'Untitled Essential',
              description: essentialData.description || 'No description available.',
              content: essentialData.content || essentialData.details || `
                <h2>Essential Information</h2>
                <p>This essential product is designed for gardening enthusiasts.</p>
              `,
              author: essentialData.author || essentialData.manufacturer || 'Unknown Manufacturer',
              publishedAt: essentialData.created_at || essentialData.updated_at || new Date().toISOString(),
              tags: essentialData.tags || essentialData.categories || ['General'],
              imageUrl: essentialData.image || essentialData.imageUrl || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              views: essentialData.views || 0,
              likes: essentialData.likes || 0,
              price: essentialData.price || 0,
              rating: essentialData.rating || 4.0,
              category: essentialData.category || 'General',
              brand: essentialData.brand || essentialData.manufacturer || 'Unknown Brand',
              weight: essentialData.weight || 'N/A',
              ingredients: essentialData.ingredients || ['Natural ingredients'],
              benefits: essentialData.benefits || ['Quality product'],
              usage: essentialData.usage || 'Follow package instructions'
            };
            setEssential(essential);
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load data from server');
          return;
        }
        
        // If no data found, set error
        setError('Data not found');
      } catch (err) {
        setError('Failed to load essential');
        console.error('Error fetching essential:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEssential();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !essential) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Essential not found</h1>
          <button
            onClick={() => navigate('/essentials')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Essentials
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      type="essential"
      title={essential.name}
      description={essential.description}
      content={essential.content}
      author={essential.author}
      publishedAt={essential.publishedAt}
      tags={essential.tags}
      imageUrl={essential.imageUrl}
      views={essential.views}
      likes={essential.likes}
      backUrl="/essentials"
      rating={essential.rating}
      price={essential.price}
      brand={essential.brand}
      category={essential.category}
      inStock={true}
      relatedContent={[
        { id: '2', title: 'Premium Potting Soil', type: 'essential', slug: 'premium-potting-soil' },
        { id: '3', title: 'Natural Pest Control Spray', type: 'essential', slug: 'natural-pest-control-spray' },
        { id: '4', title: 'Plant Growth Enhancer', type: 'essential', slug: 'plant-growth-enhancer' }
      ]}
    >
      {/* Essential Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Product Details */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">Category:</span>
              <span className="text-green-600">{essential.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">Brand:</span>
              <span className="text-green-600">{essential.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">Weight:</span>
              <span className="text-green-600">{essential.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">Usage:</span>
              <span className="text-green-600 text-sm">{essential.usage}</span>
            </div>
          </div>
        </div>

        {/* Price and Rating */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Pricing & Rating</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-800">${essential.price}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(essential.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-blue-700 font-medium">{essential.rating}/5</span>
              </div>
            </div>
            <div className="text-sm text-blue-600">
              Manufacturer: <span className="font-semibold">{essential.brand}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ingredients and Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Ingredients */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
            <Leaf className="h-5 w-5 mr-2" />
            Ingredients
          </h3>
          <ul className="space-y-2">
            {essential.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Benefits
          </h3>
          <ul className="space-y-2">
            {essential.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-orange-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart - ${essential.price}
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
          <Truck className="h-5 w-5 mr-2" />
          Buy Now
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold">
          <Heart className="h-5 w-5 mr-2" />
          Add to Wishlist
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </button>
      </motion.div>
    </DetailPage>
  );
};

export default EssentialDetail;
