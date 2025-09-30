import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Users, ThumbsUp } from 'lucide-react';
import DetailPage from '../components/UI/DetailPage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';
import { publicService } from '../services/api';
import { ApiVideo } from '../types/api';

interface Video {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  duration: string;
  videoUrl: string;
}

const VideoDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const data = await publicService.getVideos();
          const videoData = findItemBySlug<ApiVideo>(data as ApiVideo[], slug!, 'slug', 'title');
          if (videoData) {
            const video: Video = {
              id: videoData.id?.toString() || slug!,
              title: videoData.title || 'Untitled Video',
              description: videoData.description || 'No description available.',
              content: videoData.content || videoData.transcript || `
                <h2>Video Content</h2>
                <p>This video covers important gardening techniques and tips.</p>
              `,
              author: videoData.author || videoData.instructor || 'Unknown Author',
              publishedAt: videoData.published_at || videoData.created_at || new Date().toISOString(),
              tags: videoData.tags || videoData.categories || ['General'],
              imageUrl: videoData.thumbnail || videoData.imageUrl || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
              views: videoData.views || 0,
              likes: videoData.likes || 0,
              duration: videoData.duration || '12:30',
              videoUrl: videoData.embed_url || videoData.video_url || 'https://example.com/video.mp4'
            };
            setVideo(video);
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load video from server');
          return;
        }
        
        // If no video found, set error
        setError('Video not found');
      } catch (err) {
        setError('Failed to load video');
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVideo();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Video not found</h1>
          <button
            onClick={() => navigate('/videos')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Videos
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      type="video"
      title={video.title}
      description={video.description}
      content={video.content}
      author={video.author}
      publishedAt={video.publishedAt}
      tags={video.tags}
      imageUrl={video.imageUrl}
      views={video.views}
      likes={video.likes}
      backUrl="/videos"
      rating={4.7}
      duration={video.duration}
      relatedContent={[
        { id: '2', title: 'Organic Soil Preparation', type: 'video', slug: 'organic-soil-preparation' },
        { id: '3', title: 'Pruning Techniques', type: 'video', slug: 'pruning-techniques' },
        { id: '4', title: 'Watering Systems', type: 'video', slug: 'watering-systems' }
      ]}
    >
      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black rounded-2xl overflow-hidden"
      >
        <div className="relative aspect-video bg-gradient-to-br from-emerald-900 to-green-900 flex items-center justify-center">
          <motion.button
            className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-8 w-8" />
            <span className="text-xl font-semibold">Play Video</span>
          </motion.button>
          
          {/* Video Duration */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {video.duration}
          </div>
        </div>
      </motion.div>

      {/* Video Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4 mt-6"
      >
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-800">{video.duration}</div>
          <div className="text-sm text-emerald-600">Duration</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">{video.views.toLocaleString()}</div>
          <div className="text-sm text-blue-600">Views</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <ThumbsUp className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-800">{video.likes.toLocaleString()}</div>
          <div className="text-sm text-red-600">Likes</div>
        </div>
      </motion.div>
    </DetailPage>
  );
};

export default VideoDetail;
