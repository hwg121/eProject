import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Play, Star, DollarSign, ArrowRight } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import Carousel from '../components/UI/Carousel';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';

interface Tool {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  category: string;
  specifications: string;
  imageUrl: string;
  images_json?: string;
  video_url?: string;
  status: 'active' | 'inactive';
  rating: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

const Tools: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const data = await publicService.getTools();
        console.log('Tools data:', data); // Debug log
        
        // Only use real API data
        if (data && data.length > 0) {
          setTools(data as Tool[]);
        } else {
          setError('No tools available');
        }
      } catch (err) {
        setError('Failed to load tools');
        console.error('Error loading tools:', err);
        
        // Set fallback data even on error
        const mockTools: Tool[] = [
          {
            id: '1',
            name: 'Professional Garden Spade',
            description: 'Heavy-duty garden spade perfect for digging, planting, and soil preparation.',
            brand: 'GreenThumb Pro',
            model: 'GT-SP001',
            price: 89.99,
            category: 'Digging Tools',
            specifications: 'Blade Length: 12 inches, Handle Length: 28 inches',
            imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
            images_json: JSON.stringify(['https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg']),
            video_url: 'https://example.com/video1',
            status: 'active',
            rating: 4.8,
            inStock: true,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15'
          }
        ];
        setTools(mockTools);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  // Featured tools will be the first 3 tools from the database
  const featuredTools = tools.slice(0, 3).map(tool => ({
    id: tool.id.toString(),
    title: tool.name,
    description: tool.description,
    image: tool.images_json ? JSON.parse(tool.images_json)[0] : '/image.png',
    badge: 'Featured',
    link: '#'
  }));
  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Tools"
        subtitle="Discover the essential tools that make gardening easier and more enjoyable"
        icon={<Wrench className="h-10 w-10" />}
      />

      {/* Featured Tools Carousel */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Featured Tools</h2>
          <p className="text-emerald-600 text-lg">
            Discover our top-rated gardening tools chosen by experts
          </p>
        </div>
        
        <Carousel 
          items={featuredTools}
          autoPlay={true}
          interval={5000}
          showDots={true}
          showArrows={true}
          className="shadow-xl"
        />
      </section>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading tools...</p>
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
          {tools.map((tool) => (
            <Link key={tool.id} to={`/tool/${tool.slug || generateSlug(tool.name)}`} className="block h-full">
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={tool.images_json ? JSON.parse(tool.images_json)[0] : '/image.png'}
                    alt={tool.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded text-sm font-medium">
                    ${tool.price}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-emerald-600 mb-3 leading-relaxed">
                  {tool.description.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-emerald-600">{tool.rating}/5</span>
                  </div>
                  <span className="text-sm text-emerald-500">{tool.brand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-emerald-800 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {tool.price}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tool.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tool.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-800">Tool Demonstration</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-emerald-600 hover:text-emerald-800 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Tool demonstration video"
              />
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
        <h3 className="text-2xl font-bold mb-4">Tool Care Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">🔧 Maintenance</h4>
            <ul className="space-y-1 text-blue-100">
              <li>• Clean tools after each use</li>
              <li>• Keep cutting edges sharp</li>
              <li>• Oil moving parts regularly</li>
              <li>• Store in a dry place</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">💡 Pro Tips</h4>
            <ul className="space-y-1 text-blue-100">
              <li>• Invest in quality over quantity</li>
              <li>• Choose ergonomic handles</li>
              <li>• Consider tool weight for comfort</li>
              <li>• Keep a basic repair kit handy</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tools;