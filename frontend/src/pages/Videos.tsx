import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, User, ArrowRight, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import Carousel from '../components/UI/Carousel';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';
import { useResponsiveDesign } from '../utils/responsiveDesign';

const Videos: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;

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
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = videos.slice(startIndex, endIndex);

  // Featured videos will be the first 3 videos from the database
  const featuredVideos = videos.slice(0, 3).map(video => ({
    id: video.id.toString(),
    title: video.title,
    description: video.description?.substring(0, 150) + '...',
    image: video.featured_image || video.thumbnail || '/image.png',
    badge: 'Featured',
    link: `/video/${video.slug || generateSlug(video.title)}`
  }));

  return (
    <div className="space-y-8">
      {/* Beautiful Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 dark:from-emerald-600 dark:via-green-700 dark:to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-white shadow-2xl overflow-hidden backdrop-blur-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-block"
          >
            <div className="bg-white/20 dark:bg-white/30 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex items-center space-x-2 shadow-lg border border-white/30">
              <Play className="h-4 md:h-5 w-4 md:w-5 animate-pulse" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">Educational Videos</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight px-2 sm:px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-50 to-white">
              Learn Gardening Through Videos
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed max-w-4xl mx-auto font-light px-2 sm:px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Master gardening techniques with our comprehensive video tutorials. From basic planting to advanced techniques, learn from expert gardeners.
          </motion.p>
        </div>
      </motion.section>

      {/* Featured Videos Carousel */}
      {!loading && !error && videos.length > 0 && (
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Featured Videos</h2>
            <p className="text-emerald-600 text-lg">
              Watch our most popular educational gardening videos
            </p>
          </div>
          
          <Carousel 
            items={featuredVideos}
            autoPlay={true}
            interval={8000}
            showDots={true}
            showArrows={true}
            className="shadow-xl"
          />
        </section>
      )}

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentVideos.map((video) => (
            <Link key={video.id} to={`/video/${video.slug || generateSlug(video.title)}`} className="block h-full">
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={video.featured_image || video.thumbnail || '/image.png'}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {video.is_featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg z-10">
                      <Star className="h-3.5 w-3.5 fill-white" />
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-emerald-600 mb-4 leading-relaxed">
                  {video.description?.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center justify-start text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>By: {video.author || 'Expert'}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </>
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