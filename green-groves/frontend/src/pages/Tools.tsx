import React, { useState } from 'react';
import { Wrench, Play, ExternalLink } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import Carousel from '../components/UI/Carousel';
import { tools } from '../data/mockData';

const Tools: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const featuredTools = [
    {
      id: '1',
      title: 'Professional Pruning Shears',
      description: 'Sharp, durable cutting tools for precise pruning and plant maintenance. Essential for every gardener.',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      badge: 'Best Seller',
      link: '#'
    },
    {
      id: '2',
      title: 'Ergonomic Garden Trowel',
      description: 'Comfortable grip design reduces hand fatigue during extended planting and weeding sessions.',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
      badge: 'Editor\'s Choice',
      link: '#'
    },
    {
      id: '3',
      title: 'Smart Watering System',
      description: 'Automated irrigation solution that keeps your plants perfectly hydrated while you\'re away.',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      badge: 'Innovation Award',
      link: '#'
    }
  ];
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Card key={tool.id} className="h-full">
            <img
              src={tool.image}
              alt={tool.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              {tool.name}
            </h3>
            <p className="text-emerald-600 mb-3 leading-relaxed">
              {tool.description}
            </p>
            <div className="bg-emerald-50 p-3 rounded-lg mb-4">
              <h4 className="font-semibold text-emerald-800 mb-1">Usage:</h4>
              <p className="text-emerald-700 text-sm">{tool.usage}</p>
            </div>
            {tool.videoUrl && (
              <button
                onClick={() => setSelectedVideo(tool.videoUrl!)}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span className="text-sm font-medium">Watch Demo Video</span>
              </button>
            )}
          </Card>
        ))}
      </div>

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