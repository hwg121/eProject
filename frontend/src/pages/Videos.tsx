import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, User, ArrowRight } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';

const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const data = await publicService.getVideos();
        console.log('Videos data:', data); // Debug log
        
        // Only use real API data
        if (data && data.length > 0) {
          setVideos(data);
        } else {
          setError('No videos available');
        }
      } catch (err) {
        setError('Failed to load videos');
        console.error('Error loading videos:', err);
        
        // Set fallback data even on error
        const mockVideos = [
          {
            id: '1',
            title: 'Container Gardening for Beginners',
            description: 'Learn how to start your own container garden with this comprehensive step-by-step guide.',
            thumbnail: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
            duration: '12:30',
            author: 'Mike Garden',
            embed_url: 'https://example.com/video1'
          }
        ];
        setVideos(mockVideos);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Educational Videos"
        subtitle="Learn from expert gardeners with our collection of instructional videos"
        icon={<Play className="h-10 w-10" />}
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading videos...</p>
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
          {videos.map((video) => (
            <Link key={video.id} to={`/video/${video.slug || generateSlug(video.title)}`} className="block h-full">
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={video.thumbnail || '/image.png'}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {video.duration || '12:30'}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-emerald-600 mb-4 leading-relaxed">
                  {video.description?.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center justify-between text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>By: {video.author || 'Expert'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration || '12:30'}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-800">Educational Video</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-emerald-600 hover:text-emerald-800 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Educational gardening video"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Categories */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <h3 className="text-2xl font-bold mb-6">📹 Video Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">🌱 Beginner Basics</h4>
            <ul className="space-y-1 text-purple-100">
              <li>• Getting started with gardening</li>
              <li>• Essential tools overview</li>
              <li>• Understanding soil types</li>
              <li>• Watering techniques</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌿 Advanced Techniques</h4>
            <ul className="space-y-1 text-purple-100">
              <li>• Grafting and propagation</li>
              <li>• Season extension methods</li>
              <li>• Integrated pest management</li>
              <li>• Specialized growing systems</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🏠 Indoor Gardening</h4>
            <ul className="space-y-1 text-purple-100">
              <li>• Houseplant care guides</li>
              <li>• Hydroponic setups</li>
              <li>• Grow light systems</li>
              <li>• Air plant arrangements</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <h3 className="text-2xl font-bold mb-4">💡 Quick Video Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">⏰ Time-Saving Tips</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Watch at 1.25x speed for efficiency</li>
              <li>• Take notes on key timestamps</li>
              <li>• Bookmark favorite videos</li>
              <li>• Practice alongside the video</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">📝 Learning Best Practices</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Start with beginner videos</li>
              <li>• Rewatch complex techniques</li>
              <li>• Apply knowledge immediately</li>
              <li>• Join discussion communities</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Videos;