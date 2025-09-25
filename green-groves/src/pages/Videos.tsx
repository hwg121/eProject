import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Clock, User, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import { Video } from '../types/content';
import { initialVideos } from '../data/initialData';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

const Videos: React.FC = () => {
  const { getPublished } = useContent<Video>('videos', initialVideos);
  const videos = getPublished();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Educational Videos"
        subtitle="Learn from expert gardeners with our collection of instructional videos"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full group">
              <Link to={`/videos/${video.id}`} className="block">
                <div className="relative mb-4">
                  <img
                    src={video.imageUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {video.duration}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {video.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {video.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{video.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{video.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="mr-1">Watch Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos available</h3>
          <p className="text-gray-500">Check back later for new educational videos.</p>
        </div>
      )}
    </div>
  );
};

export default Videos;