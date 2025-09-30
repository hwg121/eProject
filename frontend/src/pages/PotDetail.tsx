import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DetailPage from '../components/UI/DetailPage';
import { publicService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';

interface Pot {
  id: string;
  name: string;
  description: string;
  material: string;
  size: string;
  color: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
  imageUrl: string;
  features: string[];
  careInstructions: string;
  compatibility: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  weight: number;
  drainage: boolean;
  drainageHoles: number;
  createdAt: string;
  updatedAt: string;
}

const PotDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pot, setPot] = useState<Pot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPot = async () => {
      try {
        setLoading(true);
        try {
          const data = await publicService.getPots();
          const potData = findItemBySlug(data, slug!, 'slug', 'name');
          if (potData) {
            const pot: Pot = {
              id: potData.id?.toString() || slug!,
              name: potData.name || 'Untitled Pot',
              description: potData.description || 'No description available.',
              material: potData.material || 'Unknown',
              size: potData.size || 'Unknown',
              color: potData.color || 'Unknown',
              price: potData.price || 0,
              brand: potData.brand || 'Unknown Brand',
              category: potData.category || 'General',
              inStock: potData.inStock !== undefined ? potData.inStock : true,
              imageUrl: potData.image || potData.imageUrl || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              features: potData.features || ['Drainage holes', 'Durable material'],
              careInstructions: potData.careInstructions || 'Clean regularly with mild soap and water.',
              compatibility: potData.compatibility || ['Most plants', 'Indoor plants'],
              dimensions: potData.dimensions || { width: 10, height: 8, depth: 10 },
              weight: potData.weight || 1.5,
              drainage: potData.drainage !== undefined ? potData.drainage : true,
              drainageHoles: potData.drainageHoles || 1,
              createdAt: potData.created_at || new Date().toISOString(),
              updatedAt: potData.updated_at || new Date().toISOString(),
            };
            setPot(pot);
            return;
          }
        } catch (apiError) {
          console.warn('API call failed, using fallback data:', apiError);
        }
        
        // Fallback data
        const mockPot: Pot = {
          id: slug || '1',
          name: 'Premium Ceramic Plant Pot',
          description: 'A beautiful ceramic pot perfect for indoor plants. Features excellent drainage and a modern design that complements any home decor.',
          material: 'Ceramic',
          size: 'Medium',
          color: 'White',
          price: 29.99,
          brand: 'GreenThumb',
          category: 'Indoor',
          inStock: true,
          imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
          features: ['Drainage holes', 'Durable ceramic', 'Modern design', 'Easy to clean'],
          careInstructions: 'Clean regularly with mild soap and water. Avoid harsh chemicals that may damage the ceramic finish.',
          compatibility: ['Succulents', 'Herbs', 'Small plants', 'Indoor plants'],
          dimensions: { width: 12, height: 10, depth: 12 },
          weight: 2.1,
          drainage: true,
          drainageHoles: 1,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        };
        setPot(mockPot);
      } catch (err) {
        setError('Failed to load pot details');
        console.error('Error fetching pot:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPot();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !pot) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pot Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The pot you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/pots')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Back to Pots
        </button>
      </div>
    );
  }

  return (
    <DetailPage
      type="pot"
      title={pot.name}
      description={pot.description}
      content={`
        <h2>Pot Specifications</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Physical Properties</h3>
            <ul class="space-y-2">
              <li><strong>Material:</strong> ${pot.material}</li>
              <li><strong>Size:</strong> ${pot.size}</li>
              <li><strong>Color:</strong> ${pot.color}</li>
              <li><strong>Weight:</strong> ${pot.weight} lbs</li>
              <li><strong>Dimensions:</strong> ${pot.dimensions.width}" × ${pot.dimensions.height}" × ${pot.dimensions.depth}"</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Features</h3>
            <ul class="space-y-2">
              <li><strong>Drainage:</strong> ${pot.drainage ? 'Yes' : 'No'}</li>
              <li><strong>Drainage Holes:</strong> ${pot.drainageHoles}</li>
              <li><strong>Brand:</strong> ${pot.brand}</li>
              <li><strong>Category:</strong> ${pot.category}</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Features</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          ${pot.features.map(feature => `<li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>${feature}</li>`).join('')}
        </ul>
        
        <h3 class="text-xl font-semibold mb-4">Care Instructions</h3>
        <p class="mb-6">${pot.careInstructions}</p>
        
        <h3 class="text-xl font-semibold mb-4">Plant Compatibility</h3>
        <div class="flex flex-wrap gap-2 mb-6">
          ${pot.compatibility.map(plant => `<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">${plant}</span>`).join('')}
        </div>
      `}
      author={pot.brand}
      publishedAt={pot.createdAt}
      tags={[pot.material, pot.size, pot.category, pot.color]}
      imageUrl={pot.imageUrl}
      views={Math.floor(Math.random() * 1000) + 100}
      likes={Math.floor(Math.random() * 100) + 10}
      backUrl="/pots"
      rating={4.5}
      price={pot.price}
      brand={pot.brand}
      category={pot.category}
      inStock={pot.inStock}
      relatedContent={[
        { id: '2', title: 'Terracotta Plant Pot Set', type: 'pot', slug: 'terracotta-plant-pot-set' },
        { id: '3', title: 'Hanging Plant Basket', type: 'pot', slug: 'hanging-plant-basket' },
        { id: '4', title: 'Self-Watering Planter', type: 'pot', slug: 'self-watering-planter' }
      ]}
    >
      {/* Additional pot-specific content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">Pot Care Tips</h3>
          <ul className="space-y-2 text-emerald-700 dark:text-emerald-300">
            <li>• Clean regularly to prevent mineral buildup</li>
            <li>• Check drainage holes for blockages</li>
            <li>• Rotate pot occasionally for even plant growth</li>
            <li>• Use appropriate saucer to catch excess water</li>
          </ul>
        </div>
      </motion.div>
    </DetailPage>
  );
};

export default PotDetail;
