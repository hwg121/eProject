import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Eye, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Video } from '../../types/content';
import DetailLayout from '../../components/Detail/DetailLayout';
import { ROUTES } from '../../constants';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const { getById } = useContent<Video>('videos');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const video = getById(id!);

  if (!video) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Video not found</h2>
        <p className="text-gray-500">The video you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <DetailLayout
      title={video.title}
      description={video.description}
      imageUrl={video.imageUrl}
      backLink={ROUTES.VIDEOS}
      backLabel="Videos"
      author={video.instructor}
      createdAt={video.createdAt}
      category={video.category}
      views={video.views}
      tags={video.tags}
    >
      <div className="space-y-8">
        {/* Video Player */}
        <div className={`rounded-xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="aspect-video relative">
            {!isPlaying ? (
              <div className="relative w-full h-full">
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-full transition-colors shadow-lg"
                  >
                    <Play className="h-12 w-12" />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{video.duration}</span>
                </div>
              </div>
            ) : (
              <iframe
                src={video.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={video.title}
              />
            )}
          </div>
          
          {/* Video Stats */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-500" />
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>{video.likes.toLocaleString()} likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Description */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            About This Video
          </h3>
          <p className="text-lg leading-relaxed">{video.description}</p>
        </div>

        {/* Instructor Info */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-emerald-50'
        } shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
          }`}>
            About the Instructor
          </h3>
          <p className="text-lg">
            This video is presented by <strong>{video.instructor}</strong>, 
            an experienced gardening expert who specializes in {video.category.toLowerCase()}.
          </p>
        </div>
      </div>
    </DetailLayout>
  );
};

export default VideoDetail;