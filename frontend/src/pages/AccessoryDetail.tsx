import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DetailPage from '../components/UI/DetailPage';
import { publicService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';

interface Accessory {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  brand: string;
  inStock: boolean;
  imageUrl: string;
  features: string[];
  usage: string;
  compatibility: string[];
  specifications: {
    material: string;
    dimensions: string;
    weight: string;
    power?: string;
    color: string;
  };
  careInstructions: string;
  createdAt: string;
  updatedAt: string;
}

const AccessoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        setLoading(true);
        try {
          const data = await publicService.getAccessories();
          const accessoryData = findItemBySlug(data, slug!, 'slug', 'name');
          if (accessoryData) {
            const accessory: Accessory = {
              id: accessoryData.id?.toString() || slug!,
              name: accessoryData.name || 'Untitled Accessory',
              description: accessoryData.description || 'No description available.',
              category: accessoryData.category || 'General',
              price: accessoryData.price || 0,
              brand: accessoryData.brand || 'Unknown Brand',
              inStock: accessoryData.inStock !== undefined ? accessoryData.inStock : true,
              imageUrl: accessoryData.image || accessoryData.imageUrl || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
              features: accessoryData.features || ['High quality', 'Durable'],
              usage: accessoryData.usage || 'General use',
              compatibility: accessoryData.compatibility || ['Most plants'],
              specifications: accessoryData.specifications || {
                material: 'Plastic',
                dimensions: '10" x 8" x 6"',
                weight: '1.2 lbs',
                color: 'Green'
              },
              careInstructions: accessoryData.careInstructions || 'Clean with mild soap and water.',
              createdAt: accessoryData.created_at || new Date().toISOString(),
              updatedAt: accessoryData.updated_at || new Date().toISOString(),
            };
            setAccessory(accessory);
            return;
          }
        } catch (apiError) {
          console.warn('API call failed, using fallback data:', apiError);
        }
        
        // Fallback data
        const mockAccessory: Accessory = {
          id: slug || '1',
          name: 'LED Grow Light Strip',
          description: 'Energy-efficient LED grow light strip perfect for indoor plants. Provides full spectrum light to promote healthy growth and flowering.',
          category: 'Lighting',
          price: 49.99,
          brand: 'PlantGrow',
          inStock: true,
          imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
          features: ['Full spectrum LED', 'Energy efficient', 'Adjustable brightness', 'Timer function', 'Waterproof'],
          usage: 'Perfect for indoor plants, seedlings, and low-light areas. Can be used as primary or supplemental lighting.',
          compatibility: ['Indoor plants', 'Seedlings', 'Herbs', 'Succulents', 'Flowering plants'],
          specifications: {
            material: 'Aluminum & Plastic',
            dimensions: '24" x 2" x 0.5"',
            weight: '1.5 lbs',
            power: '24W',
            color: 'White'
          },
          careInstructions: 'Wipe clean with dry cloth. Avoid getting water on the LED strip. Store in dry place when not in use.',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        };
        setAccessory(mockAccessory);
      } catch (err) {
        setError('Failed to load accessory details');
        console.error('Error fetching accessory:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAccessory();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !accessory) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accessory Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The accessory you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/accessories')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Back to Accessories
        </button>
      </div>
    );
  }

  return (
    <DetailPage
      type="accessory"
      title={accessory.name}
      description={accessory.description}
      content={`
        <h2>Accessory Specifications</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Physical Properties</h3>
            <ul class="space-y-2">
              <li><strong>Material:</strong> ${accessory.specifications.material}</li>
              <li><strong>Dimensions:</strong> ${accessory.specifications.dimensions}</li>
              <li><strong>Weight:</strong> ${accessory.specifications.weight}</li>
              <li><strong>Color:</strong> ${accessory.specifications.color}</li>
              ${accessory.specifications.power ? `<li><strong>Power:</strong> ${accessory.specifications.power}</li>` : ''}
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Features</h3>
            <ul class="space-y-2">
              <li><strong>Category:</strong> ${accessory.category}</li>
              <li><strong>Brand:</strong> ${accessory.brand}</li>
              <li><strong>Availability:</strong> ${accessory.inStock ? 'In Stock' : 'Out of Stock'}</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Features</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          ${accessory.features.map(feature => `<li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>${feature}</li>`).join('')}
        </ul>
        
        <h3 class="text-xl font-semibold mb-4">Usage</h3>
        <p class="mb-6">${accessory.usage}</p>
        
        <h3 class="text-xl font-semibold mb-4">Compatibility</h3>
        <div class="flex flex-wrap gap-2 mb-6">
          ${accessory.compatibility.map(item => `<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">${item}</span>`).join('')}
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Care Instructions</h3>
        <p class="mb-6">${accessory.careInstructions}</p>
      `}
      author={accessory.brand}
      publishedAt={accessory.createdAt}
      tags={[accessory.category, accessory.specifications.material, accessory.specifications.color]}
      imageUrl={accessory.imageUrl}
      views={Math.floor(Math.random() * 1000) + 100}
      likes={Math.floor(Math.random() * 100) + 10}
      backUrl="/accessories"
      rating={4.3}
      price={accessory.price}
      brand={accessory.brand}
      category={accessory.category}
      inStock={accessory.inStock}
      relatedContent={[
        { id: '2', title: 'Plant Watering Timer', type: 'accessory', slug: 'plant-watering-timer' },
        { id: '3', title: 'Decorative Plant Stand', type: 'accessory', slug: 'decorative-plant-stand' },
        { id: '4', title: 'Humidity Monitor', type: 'accessory', slug: 'humidity-monitor' }
      ]}
    >
      {/* Additional accessory-specific content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">Usage Tips</h3>
          <ul className="space-y-2 text-emerald-700 dark:text-emerald-300">
            <li>• Follow manufacturer instructions for optimal performance</li>
            <li>• Regular maintenance ensures longevity</li>
            <li>• Check compatibility with your plants</li>
            <li>• Store properly when not in use</li>
          </ul>
        </div>
      </motion.div>
    </DetailPage>
  );
};

export default AccessoryDetail;
