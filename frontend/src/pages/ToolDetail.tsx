import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, DollarSign, Truck, Shield, CheckCircle } from 'lucide-react';
import DetailPage from '../components/UI/DetailPage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';

interface Tool {
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
  brand: string;
  specifications: string[];
  features: string[];
}

const ToolDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const data = await publicService.getTools();
          const toolData = findItemBySlug(data, slug!, 'slug', 'name');
          if (toolData) {
            const tool: Tool = {
              id: toolData.id?.toString() || slug!,
              name: toolData.name || 'Untitled Tool',
              description: toolData.description || 'No description available.',
              content: toolData.content || toolData.specifications || `
                <h2>Tool Information</h2>
                <p>This tool is designed for gardening enthusiasts.</p>
              `,
              author: toolData.author || toolData.manufacturer || 'Unknown Manufacturer',
              publishedAt: toolData.created_at || toolData.updated_at || new Date().toISOString(),
              tags: toolData.tags || toolData.categories || ['General'],
              imageUrl: toolData.images_json ? JSON.parse(toolData.images_json)[0] : toolData.imageUrl || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
              views: toolData.views || 0,
              likes: toolData.likes || 0,
              price: toolData.price || 0,
              rating: toolData.rating || 4.0,
              brand: toolData.brand || toolData.manufacturer || 'Unknown Brand',
              specifications: toolData.specifications ? 
                (typeof toolData.specifications === 'string' ? 
                  toolData.specifications.split(',').map((s: string) => s.trim()) : 
                  toolData.specifications) : 
                ['No specifications available'],
              features: toolData.features || ['Quality construction', 'Durable materials']
            };
            setTool(tool);
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
        setError('Failed to load tool');
        console.error('Error fetching tool:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTool();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Tool not found</h1>
          <button
            onClick={() => navigate('/tools')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      type="tool"
      title={tool.name}
      description={tool.description}
      content={tool.content}
      author={tool.author}
      publishedAt={tool.publishedAt}
      tags={tool.tags}
      imageUrl={tool.imageUrl}
      views={tool.views}
      likes={tool.likes}
      backUrl="/tools"
      rating={tool.rating}
      price={tool.price}
      brand={tool.brand}
      category={tool.category}
      inStock={true}
      relatedContent={[
        { id: '2', title: 'Premium Pruning Shears', type: 'tool', slug: 'premium-pruning-shears' },
        { id: '3', title: 'Watering Can Set', type: 'tool', slug: 'watering-can-set' },
        { id: '4', title: 'Garden Gloves', type: 'tool', slug: 'garden-gloves' }
      ]}
    >
      {/* Tool Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Price and Rating */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">Pricing & Rating</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-emerald-800">${tool.price}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(tool.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-emerald-700 font-medium">{tool.rating}/5</span>
              </div>
            </div>
            <div className="text-sm text-emerald-600">
              Brand: <span className="font-semibold">{tool.brand}</span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Specifications</h3>
          <ul className="space-y-2">
            {tool.specifications.map((spec, index) => (
              <li key={index} className="flex items-center text-blue-700">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-sm">{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-purple-800 mb-4">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tool.features.map((feature, index) => (
            <div key={index} className="flex items-center text-purple-700">
              <CheckCircle className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
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
          <DollarSign className="h-5 w-5 mr-2" />
          Add to Cart - ${tool.price}
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
          <Truck className="h-5 w-5 mr-2" />
          Buy Now
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold">
          <Shield className="h-5 w-5 mr-2" />
          Add to Wishlist
        </button>
      </motion.div>
    </DetailPage>
  );
};

export default ToolDetail;
