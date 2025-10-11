import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
              title: videoData.title || '',
              description: videoData.description || '',
              content: videoData.content || videoData.transcript || '',
              author: videoData.author || videoData.instructor || '',
              publishedAt: videoData.published_at || videoData.created_at || new Date().toISOString(),
              tags: videoData.tags || videoData.categories || [],
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
      content={`
        <h2>Video Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Basic Details</h3>
            <ul class="space-y-2">
              <li><strong>Instructor:</strong> ${video.author}</li>
              <li><strong>Duration:</strong> ${video.duration}</li>
              <li><strong>Views:</strong> ${video.views.toLocaleString()}</li>
              <li><strong>Likes:</strong> ${video.likes.toLocaleString()}</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Video Stats</h3>
            <ul class="space-y-2">
              <li><strong>Published:</strong> ${new Date(video.publishedAt).toLocaleDateString()}</li>
              <li><strong>Category:</strong> Gardening Tutorial</li>
              <li><strong>Difficulty:</strong> All Levels</li>
              <li><strong>Language:</strong> English</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold mb-4">Video Description</h3>
        <p class="mb-6">${video.description}</p>
        
        <h3 class="text-xl font-semibold mb-4">What You'll Learn</h3>
        <ul class="space-y-2 mb-6">
          <li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>Step-by-step gardening techniques</li>
          <li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>Visual demonstrations and examples</li>
          <li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>Professional tips and tricks</li>
          <li class="flex items-center"><span class="text-emerald-600 mr-2">✓</span>Common mistakes to avoid</li>
        </ul>
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
