import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailPage from '../components/ui/DetailPage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { findItemBySlug } from '../utils/slug';
import { publicService, videosService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ApiVideo } from '../types/api';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

interface Video {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: Tag[];
  views: number;
  likes: number;
  rating: number;
  duration: string;
  videoUrl: string;
  embedUrl: string;
}

const VideoDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin/moderator
        const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');
        
        // Try to fetch from API
        try {
          // If admin, fetch all videos (including archived)
          // If public, fetch only published videos
          const response = isAdmin 
            ? await videosService.getAll({ per_page: 1000 })
            : await publicService.getVideos();
          
          // Handle API response format: {success: true, data: [...]}
          let videosData: ApiVideo[] = [];
          if (response && typeof response === 'object' && 'success' in response && (response as any).success && (response as any).data) {
            // Check if data is paginated or direct array
            const dataField = (response as any).data;
            if (Array.isArray(dataField)) {
              videosData = dataField;
            } else if (dataField && Array.isArray(dataField.data)) {
              // Paginated response
              videosData = dataField.data;
            }
          } else if (Array.isArray(response)) {
            videosData = response;
          }
          
          const videoData = findItemBySlug<ApiVideo>(videosData, slug!, 'slug', 'title');
          if (videoData) {
            // Convert ApiTag[] to TagData[] for DetailPage compatibility
            const convertedTags = Array.isArray(videoData.tags) 
              ? videoData.tags.map(tag => ({
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug,
                  description: tag.description || null
                }))
              : [];

            const video: Video = {
              id: videoData.id?.toString() || slug!,
              title: videoData.title || '',
              description: videoData.description || '',
              content: videoData.content || videoData.transcript || '',
              author: videoData.instructor || videoData.author || '',
              publishedAt: videoData.published_at || videoData.created_at || new Date().toISOString(),
              tags: convertedTags,
              views: videoData.views || 0,
              likes: videoData.likes || 0,
              rating: videoData.rating || 0,
              duration: videoData.duration || '',
              videoUrl: videoData.video_url || '',
              embedUrl: videoData.embed_url || ''
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
      content={video.content || `
        <h2>Video Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Basic Details</h3>
            <ul class="space-y-2">
              <li><strong>Instructor:</strong> ${video.author}</li>
              <li><strong>Duration:</strong> ${video.duration || 'N/A'}</li>
              <li><strong>Views:</strong> ${video.views.toLocaleString()}</li>
              <li><strong>Likes:</strong> ${video.likes.toLocaleString()}</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Video Stats</h3>
            <ul class="space-y-2">
              <li><strong>Published:</strong> ${new Date(video.publishedAt).toLocaleDateString()}</li>
              <li><strong>Category:</strong> Gardening Tutorial</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Video Description</h3>
        <p class="mb-6">${video.description}</p>
      `}
      author={video.author}
      publishedAt={video.publishedAt}
      tags={video.tags}
      views={video.views || 0}
      likes={video.likes || 0}
      backUrl="/videos"
      rating={video.rating || 0}
      contentId={parseInt(video.id)}
      duration={video.duration}
      videoUrl={video.videoUrl}
      embedUrl={video.embedUrl}
      images={[]}
      relatedContent={[]}
    >
      {/* Video Stats - Additional stats below the main content */}
    </DetailPage>
  );
};

export default VideoDetail;
