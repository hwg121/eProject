import React, { useState, useEffect, useCallback } from 'react';
// Removed framer-motion to fix motion context errors
import { 
  ArrowLeft, Calendar, User, Tag, Eye, Share2, BookOpen, Play, Wrench, Leaf, Package,
  Clock, Star, Bookmark, MessageCircle, ExternalLink, ChevronDown, ChevronUp, Heart, ThumbsUp, Image
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import TagChip from './TagChip';
import { interactionService, tagService } from '../../services/api';

interface TagData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

interface DetailPageProps {
  type: 'article' | 'video' | 'book' | 'tool' | 'essential' | 'pot' | 'accessory' | 'technique' | 'suggestion';
  title: string;
  description: string;
  content: string;
  author?: string;
  instructor?: string; // For videos and techniques
  publishedAt: string;
  tags: TagData[] | string[];
  views?: number;
  likes?: number;
  backUrl: string;
  children?: React.ReactNode;
  rating?: number;
  duration?: string;
  price?: number;
  category?: string;
  brand?: string;
  inStock?: boolean;
  contentId?: number; // Add content ID for API calls
  relatedContent?: Array<{
    id: string;
    title: string;
    type: string;
    thumbnail?: string;
    slug?: string;
  }>;
  // Additional fields for rich content
  videoUrl?: string;
  embedUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  material?: string;
  size?: string;
  color?: string;
  isWaterproof?: boolean;
  isDurable?: boolean;
  images?: string[];
  featured?: boolean;
}

const DetailPage: React.FC<DetailPageProps> = ({
  type,
  title,
  description,
  content,
  author,
  instructor,
  publishedAt,
  tags,
  views,
  likes,
  backUrl,
  children,
  rating,
  duration,
  price,
  category,
  brand,
  inStock,
  contentId,
  relatedContent,
  videoUrl,
  embedUrl,
  difficulty,
  material,
  size,
  color,
  isWaterproof,
  isDurable,
  images,
  featured
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [currentLikeCount, setCurrentLikeCount] = useState(Number(likes) || 0);
  const [currentRating, setCurrentRating] = useState(Number(rating) || 0);
  const [currentViewCount, setCurrentViewCount] = useState(Number(views) || 0);
  const [tagBasedRelatedContent, setTagBasedRelatedContent] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const loadUserInteractions = useCallback(async () => {
    try {
      const response = await interactionService.getUserInteractions(type, contentId!);
      if (response.success && 'is_liked' in response) {
        setIsLiked(response.is_liked || false);
        setUserRating(response.user_rating || 0);
      } else {

        // Keep default values (false for isLiked, 0 for userRating)
      }
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  }, [type, contentId]);

  // Load tag-based related content
  const loadTagBasedRelatedContent = useCallback(async () => {
    if (!tags || tags.length === 0) return;
    
    try {
      setLoadingRelated(true);
      
      // Get first tag to find related content
      const firstTag = Array.isArray(tags) && tags.length > 0 ? tags[0] : null;
      if (!firstTag) return;
      
      const tagSlug = typeof firstTag === 'object' ? firstTag.slug : firstTag.toLowerCase().replace(/\s+/g, '-');
      
      console.log('🔍 [DetailPage] Loading related content for tag:', tagSlug);
      
      const response = await tagService.getContents(tagSlug);
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        // Filter out current content and limit to 3 items
        const relatedItems = response.data
          .filter((item: any) => item && item.id && item.id !== contentId)
          .slice(0, 3);
        
        console.log('🔍 [DetailPage] Found related content:', relatedItems.length);
        setTagBasedRelatedContent(relatedItems);
      } else {
        console.log('🔍 [DetailPage] No related content found for tag:', tagSlug);
        setTagBasedRelatedContent([]);
      }
    } catch (error) {
      console.error('Error loading related content:', error);
    } finally {
      setLoadingRelated(false);
    }
  }, [tags, contentId]);

  const loadContentStats = useCallback(async () => {
    try {
      const response = await interactionService.getContentStats(type, contentId!);
      if (response.success && 'like_count' in response) {
        setCurrentLikeCount(Number(response.like_count) || 0);
        setCurrentRating(Number(response.average_rating) || 0);
        setCurrentViewCount(Number(response.view_count) || 0);
      } else {

        // Keep existing values from props
      }
    } catch (error) {
      console.error('Error loading content stats:', error);
    }
  }, [type, contentId]);

  const trackView = useCallback(async () => {
    if (!contentId) return;
    
    try {
      const response = await interactionService.trackView(type, contentId);
      if (response.success && 'view_count' in response) {
        setCurrentViewCount(Number(response.view_count) || 0);
      } else {

      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [type, contentId]);

  // Load user interactions when component mounts
  useEffect(() => {
    if (contentId) {
      loadUserInteractions();
      loadContentStats();
      trackView(); // Track view when component mounts
    }
  }, [contentId, type, loadUserInteractions, loadContentStats, trackView]);

  useEffect(() => {
    loadTagBasedRelatedContent();
  }, [loadTagBasedRelatedContent]);

  const handleToggleLike = async () => {
    if (!contentId) {

      return;
    }

    try {
      const response = await interactionService.toggleLike(type, contentId);

      if (response.success && 'is_liked' in response) {
        setIsLiked(response.is_liked || false);
        setCurrentLikeCount(Number(response.like_count) || 0);
      } else {
        console.error('Failed to toggle like:', response.message);
        // Don't update state if API call failed
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Don't update state if API call failed
    }
  };

  const handleSubmitRating = async (rating: number) => {
    if (!contentId) {

      return;
    }

    try {
      const response = await interactionService.submitRating(type, contentId, rating);

      if (response.success && 'rating' in response) {
        setUserRating(Number(response.rating) || 0);
        setCurrentRating(Number(response.average_rating) || 0);
      } else {
        console.error('Failed to submit rating:', response.message);
        // Don't update state if API call failed
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Don't update state if API call failed
    }
  };
  const getTypeIcon = () => {
    switch (type) {
      case 'article': return <BookOpen className="h-6 w-6" />;
      case 'video': return <Play className="h-6 w-6" />;
      case 'book': return <BookOpen className="h-6 w-6" />;
      case 'tool': return <Wrench className="h-6 w-6" />;
      case 'essential': return <Leaf className="h-6 w-6" />;
      case 'pot': return <Package className="h-6 w-6" />;
      case 'accessory': return <Package className="h-6 w-6" />;
      case 'technique': return <Wrench className="h-6 w-6" />;
      case 'suggestion': return <Leaf className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'article': return 'from-blue-500 to-indigo-500';
      case 'video': return 'from-red-500 to-pink-500';
      case 'book': return 'from-purple-500 to-violet-500';
      case 'tool': return 'from-orange-500 to-red-500';
      case 'essential': return 'from-green-500 to-emerald-500';
      case 'pot': return 'from-amber-500 to-orange-500';
      case 'accessory': return 'from-teal-500 to-cyan-500';
      case 'technique': return 'from-indigo-500 to-blue-500';
      case 'suggestion': return 'from-emerald-500 to-green-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent">
      {/* Enhanced Header */}
       <div className="relative overflow-hidden">
        {/* Background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-800/80 dark:via-green-800/80 dark:to-teal-800/80 dark:backdrop-blur-sm rounded-3xl mx-4 my-8">
          <div className="absolute inset-0 opacity-10 dark:opacity-20 rounded-3xl">
            <div className="absolute inset-0 rounded-3xl" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>
        
        <div className="relative z-10 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-3xl p-8 mx-4">
            {/* Navigation */}
             <div className="flex items-center justify-between mb-8">
              <Link
                to={backUrl}
                className="flex items-center text-white/90 hover:text-white transition-all duration-300 group bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to {type}s</span>
              </Link>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                    isBookmarked 
                      ? 'bg-white/30 text-white shadow-lg' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:shadow-lg'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Title Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className={`p-6 rounded-3xl bg-gradient-to-r ${getTypeColor()} text-white shadow-2xl backdrop-blur-sm`}>
                {getTypeIcon()}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                <h1 className="text-4xl md:text-6xl font-black leading-tight text-white dark:text-slate-100 drop-shadow-lg">
                  {title}
                </h1>
                  {rating && (
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <Star className="h-5 w-5 text-yellow-300 fill-current mr-2" />
                      <span className="font-bold text-lg">{rating}/5</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xl md:text-2xl text-white/90 dark:text-slate-200 max-w-4xl leading-relaxed mb-8 drop-shadow-sm">
                  {description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-white/90 dark:text-slate-200">
                  {(author || instructor) && (
                    <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{author || instructor}</span>
                    </div>
                  )}
                  <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(publishedAt).toLocaleDateString()}</span>
                  </div>
                  {duration && (
                    <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{duration}</span>
                    </div>
                  )}
                  {difficulty && (
                    <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                      <Star className="h-4 w-4 mr-2" />
                      <span className="capitalize">{difficulty}</span>
                    </div>
                  )}
                  {views && (
                    <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                      <Eye className="h-4 w-4 mr-2" />
                      <span>{currentViewCount.toLocaleString()} views</span>
                    </div>
                  )}
                  {price && (
                    <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                      <span>${price}</span>
                    </div>
                  )}
                  {featured && (
                    <div className="flex items-center bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                      <Star className="h-4 w-4 mr-1" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>
                
                {/* Tags Display */}
                {tags && tags.length > 0 && (
                  <div className="mt-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="h-4 w-4 text-white/80" />
                      {tags.map((tag, index) => {
                        // DEBUG: Log tag structure
                        console.log('🔍 [DetailPage] Tag at index', index, ':', tag);
                        console.log('🔍 [DetailPage] Tag type:', typeof tag);
                        console.log('🔍 [DetailPage] Tag keys:', tag ? Object.keys(tag) : 'null');
                        
                        // Handle both Tag objects and strings
                        const isTagObject = typeof tag === 'object' && tag !== null && 'id' in tag;
                        console.log('🔍 [DetailPage] Is tag object:', isTagObject);
                        
                        if (isTagObject) {
                          console.log('🔍 [DetailPage] Rendering TagChip with:', {
                            id: tag.id,
                            name: tag.name,
                            slug: tag.slug
                          });
                          return (
                            <TagChip
                              key={tag.id}
                              id={tag.id}
                              name={tag.name}
                              slug={tag.slug}
                              size="small"
                            />
                          );
                        }
                        // Fallback for string tags (old format)
                        console.log('🔍 [DetailPage] Rendering string tag:', tag);
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Tabs Navigation */}
            <div className="mb-8">
              <Card className="p-0 bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                <div className="flex border-b border-emerald-100 dark:border-slate-700">
                  {['overview', 'details', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium capitalize transition-all duration-300 ${
                        activeTab === tab
                          ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Tab Content */}
            <div>
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <div className="p-8">
                    {activeTab === 'overview' && (
                      <div key="overview">
                        {/* YouTube Video Embed */}
                        {type === 'video' && embedUrl && (
                          <div className="mb-8">
                            <div className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                              <iframe
                                src={embedUrl}
                                title={title}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}

                        {/* Rich Content Display */}
                        <div className="rich-content-display">
                          <style dangerouslySetInnerHTML={{
                            __html: `
                              .rich-content-display {
                                line-height: 1.7;
                                color: rgb(100 116 139);
                              }
                              .rich-content-display h1 {
                                font-size: 2.25rem !important;
                                font-weight: 800 !important;
                                margin: 1.5rem 0 1rem 0 !important;
                                line-height: 1.2 !important;
                                color: rgb(30 41 59) !important;
                                border-bottom: 3px solid #10b981 !important;
                                padding-bottom: 0.5rem !important;
                              }
                              .rich-content-display h2 {
                                font-size: 1.875rem !important;
                                font-weight: 700 !important;
                                margin: 1.25rem 0 0.75rem 0 !important;
                                line-height: 1.3 !important;
                                color: rgb(30 41 59) !important;
                                border-left: 4px solid #10b981 !important;
                                padding-left: 1rem !important;
                                background: linear-gradient(90deg, rgb(16 185 129 / 0.05), transparent) !important;
                                padding: 0.75rem 1rem !important;
                                border-radius: 0.5rem !important;
                              }
                              .rich-content-display h3 {
                                font-size: 1.5rem !important;
                                font-weight: 600 !important;
                                margin: 1rem 0 0.5rem 0 !important;
                                line-height: 1.4 !important;
                                color: rgb(30 41 59) !important;
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.1), rgb(16 185 129 / 0.05)) !important;
                                padding: 0.5rem 1rem !important;
                                border-radius: 0.5rem !important;
                              }
                              .rich-content-display h4 {
                                font-size: 1.25rem !important;
                                font-weight: 600 !important;
                                margin: 0.875rem 0 0.5rem 0 !important;
                                line-height: 1.4 !important;
                                color: rgb(30 41 59) !important;
                              }
                              .rich-content-display h5 {
                                font-size: 1.125rem !important;
                                font-weight: 600 !important;
                                margin: 0.75rem 0 0.5rem 0 !important;
                                line-height: 1.4 !important;
                                color: rgb(30 41 59) !important;
                              }
                              .rich-content-display h6 {
                                font-size: 1rem !important;
                                font-weight: 600 !important;
                                margin: 0.75rem 0 0.5rem 0 !important;
                                line-height: 1.4 !important;
                                color: rgb(30 41 59) !important;
                              }
                              .rich-content-display p {
                                margin: 1rem 0 !important;
                                line-height: 1.7 !important;
                                text-align: justify !important;
                              }
                              .rich-content-display blockquote {
                                border-left: 4px solid #10b981 !important;
                                margin: 1.5rem 0 !important;
                                padding: 1rem 1.5rem !important;
                                font-style: italic !important;
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.05), rgb(16 185 129 / 0.02)) !important;
                                border-radius: 0.5rem !important;
                                position: relative !important;
                              }
                              .rich-content-display blockquote::before {
                                content: '"' !important;
                                font-size: 4rem !important;
                                color: #10b981 !important;
                                position: absolute !important;
                                top: -0.5rem !important;
                                left: 0.5rem !important;
                                line-height: 1 !important;
                              }
                              .rich-content-display ul, .rich-content-display ol {
                                margin: 1rem 0 !important;
                                padding-left: 2rem !important;
                              }
                              .rich-content-display li {
                                margin: 0.5rem 0 !important;
                                line-height: 1.6 !important;
                              }
                              .rich-content-display ul li {
                                list-style-type: disc !important;
                              }
                              .rich-content-display ol li {
                                list-style-type: decimal !important;
                              }
                              .rich-content-display strong {
                                font-weight: 700 !important;
                                color: rgb(30 41 59) !important;
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.1), transparent) !important;
                                padding: 0.125rem 0.25rem !important;
                                border-radius: 0.25rem !important;
                              }
                              .rich-content-display em {
                                font-style: italic !important;
                                color: rgb(16 185 129) !important;
                              }
                              .rich-content-display code {
                                background: linear-gradient(135deg, rgb(248 250 252), rgb(241 245 249)) !important;
                                color: rgb(30 41 59) !important;
                                padding: 0.25rem 0.5rem !important;
                                border-radius: 0.375rem !important;
                                font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace !important;
                                font-size: 0.875rem !important;
                                border: 1px solid rgb(226 232 240) !important;
                                box-shadow: 0 1px 2px rgb(0 0 0 / 0.05) !important;
                              }
                              .rich-content-display pre {
                                background: linear-gradient(135deg, rgb(248 250 252), rgb(241 245 249)) !important;
                                color: rgb(30 41 59) !important;
                                padding: 1.5rem !important;
                                border-radius: 0.75rem !important;
                                overflow-x: auto !important;
                                margin: 1.5rem 0 !important;
                                border: 1px solid rgb(226 232 240) !important;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                              }
                              .rich-content-display pre code {
                                background: none !important;
                                padding: 0 !important;
                                border: none !important;
                                box-shadow: none !important;
                                font-size: 0.875rem !important;
                              }
                              .rich-content-display table {
                                width: 100% !important;
                                border-collapse: collapse !important;
                                margin: 1.5rem 0 !important;
                                border-radius: 0.75rem !important;
                                overflow: hidden !important;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                              }
                              .rich-content-display th, .rich-content-display td {
                                border: 1px solid rgb(226 232 240) !important;
                                padding: 1rem !important;
                                text-align: left !important;
                              }
                              .rich-content-display th {
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.1), rgb(16 185 129 / 0.05)) !important;
                                font-weight: 700 !important;
                                color: rgb(30 41 59) !important;
                              }
                              .rich-content-display tr:nth-child(even) {
                                background-color: rgb(248 250 252) !important;
                              }
                              .rich-content-display img {
                                max-width: 100% !important;
                                height: auto !important;
                                border-radius: 0.75rem !important;
                                margin: 1.5rem 0 !important;
                                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
                                transition: transform 0.3s ease !important;
                              }
                              .rich-content-display img:hover {
                                transform: scale(1.02) !important;
                              }
                              .rich-content-display a {
                                color: rgb(16 185 129) !important;
                                text-decoration: none !important;
                                font-weight: 500 !important;
                                border-bottom: 2px solid transparent !important;
                                transition: all 0.3s ease !important;
                              }
                              .rich-content-display a:hover {
                                color: rgb(5 150 105) !important;
                                border-bottom-color: rgb(16 185 129) !important;
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.05), transparent) !important;
                                padding: 0.125rem 0.25rem !important;
                                border-radius: 0.25rem !important;
                              }
                              .rich-content-display hr {
                                border: none !important;
                                height: 2px !important;
                                background: linear-gradient(90deg, transparent, rgb(16 185 129), transparent) !important;
                                margin: 2rem 0 !important;
                              }
                              .dark .rich-content-display {
                                color: rgb(203 213 225) !important;
                              }
                              .dark .rich-content-display h1, .dark .rich-content-display h2, .dark .rich-content-display h3, 
                              .dark .rich-content-display h4, .dark .rich-content-display h5, .dark .rich-content-display h6 {
                                color: rgb(255 255 255) !important;
                              }
                              .dark .rich-content-display strong {
                                color: rgb(255 255 255) !important;
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.2), transparent) !important;
                              }
                              .dark .rich-content-display code {
                                background: linear-gradient(135deg, rgb(15 23 42), rgb(30 41 59)) !important;
                                color: rgb(255 255 255) !important;
                                border-color: rgb(55 65 81) !important;
                              }
                              .dark .rich-content-display pre {
                                background: linear-gradient(135deg, rgb(15 23 42), rgb(30 41 59)) !important;
                                color: rgb(255 255 255) !important;
                                border-color: rgb(55 65 81) !important;
                              }
                              .dark .rich-content-display th {
                                background: linear-gradient(135deg, rgb(16 185 129 / 0.2), rgb(16 185 129 / 0.1)) !important;
                                color: rgb(255 255 255) !important;
                              }
                              .dark .rich-content-display th, .dark .rich-content-display td {
                                border-color: rgb(55 65 81) !important;
                              }
                              .dark .rich-content-display tr:nth-child(even) {
                                background-color: rgb(30 41 59) !important;
                              }
                            `
                          }} />
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                        
                        {content.length > 1000 && (
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => setShowFullContent(!showFullContent)}
                              className="flex items-center mx-auto px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              {showFullContent ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  Show More
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeTab === 'details' && (
                      <div key="details">
                        <div className="space-y-6">
                          {/* Basic Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category && (
                              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center">
                                  <Tag className="h-4 w-4 mr-2" />
                                  Category
                                </h4>
                                <p className="text-emerald-600 dark:text-emerald-300 capitalize">{category}</p>
                              </div>
                            )}
                            {brand && (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                                  <Package className="h-4 w-4 mr-2" />
                                  Brand
                                </h4>
                                <p className="text-blue-600 dark:text-blue-300">{brand}</p>
                              </div>
                            )}
                            {difficulty && (
                              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                                  <Star className="h-4 w-4 mr-2" />
                                  Difficulty
                                </h4>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  difficulty === 'beginner' 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : difficulty === 'intermediate'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                }`}>
                                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                </span>
                              </div>
                            )}
                            {duration && (
                              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-100 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center">
                                  <Clock className="h-4 w-4 mr-2" />
                                  Duration
                                </h4>
                                <p className="text-orange-600 dark:text-orange-300">{duration}</p>
                              </div>
                            )}
                            {price && (
                              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-100 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                                  <span className="text-lg mr-2">💰</span>
                                  Price
                                </h4>
                                <p className="text-yellow-600 dark:text-yellow-300 font-bold text-lg">${price}</p>
                              </div>
                            )}
                            {inStock !== undefined && (
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                                  <Package className="h-4 w-4 mr-2" />
                                  Availability
                                </h4>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  inStock 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                }`}>
                                  {inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Video/Media Information */}
                          {(type === 'video' || type === 'technique') && (videoUrl || embedUrl) && (
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800 shadow-lg">
                              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center">
                                <Play className="h-5 w-5 mr-2" />
                                Video Information
                              </h4>
                              <div className="space-y-3">
                                {videoUrl && (
                                  <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Video URL:</p>
                                    <a 
                                      href={videoUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline break-all"
                                    >
                                      {videoUrl}
                                    </a>
                                  </div>
                                )}
                                {embedUrl && (
                                  <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Embed URL:</p>
                                    <a 
                                      href={embedUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline break-all"
                                    >
                                      {embedUrl}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Tool/Product Specifications */}
                          {(type === 'tool' || type === 'accessory' || type === 'pot') && (
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-teal-100 dark:border-teal-800 shadow-lg">
                              <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-4 flex items-center">
                                <Wrench className="h-5 w-5 mr-2" />
                                Specifications
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {material && (
                                  <div>
                                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">Material:</p>
                                    <p className="text-teal-600 dark:text-teal-400 capitalize">{material}</p>
                                  </div>
                                )}
                                {size && (
                                  <div>
                                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">Size:</p>
                                    <p className="text-teal-600 dark:text-teal-400">{size}</p>
                                  </div>
                                )}
                                {color && (
                                  <div>
                                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">Color:</p>
                                    <p className="text-teal-600 dark:text-teal-400 capitalize">{color}</p>
                                  </div>
                                )}
                                {isWaterproof !== undefined && (
                                  <div>
                                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">Waterproof:</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      isWaterproof 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                                    }`}>
                                      {isWaterproof ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                )}
                                {isDurable !== undefined && (
                                  <div>
                                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">Durable:</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      isDurable 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                                    }`}>
                                      {isDurable ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Image Gallery */}
                          {images && Array.isArray(images) && images.length > 0 && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-lg">
                              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center">
                                <Image className="h-5 w-5 mr-2" />
                                Image Gallery
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                  <div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group cursor-pointer"
                                  >
                                    <img
                                      src={image}
                                      alt={`${title} - Image ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                      <div key="reviews">
                        <div className="text-center py-12">
                          <MessageCircle className="h-12 w-12 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-2">No reviews yet</h3>
                          <p className="text-emerald-600 dark:text-emerald-300">Be the first to review this {type}!</p>
                        </div>
                      </div>
                    )}
                </div>
              </Card>
            </div>

            {/* Additional Content */}
            {children && (
              <div className="mt-8">
                {children}
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div>
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6 flex items-center">
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  {/* Like Button */}
                  <button
                    onClick={handleToggleLike}
                    disabled={!contentId}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                      isLiked
                        ? 'bg-red-500 dark:bg-red-600 text-white'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'} ({currentLikeCount})
                  </button>

                  {/* Rating Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200">Rate this {type}:</p>
                    <div className="flex items-center justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleSubmitRating(star)}
                          disabled={!contentId}
                          className={`transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            star <= userRating
                              ? 'text-yellow-400 dark:text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <p className="text-xs text-center text-emerald-600 dark:text-emerald-400">
                        You rated {userRating} star{userRating > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Share Button */}
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </Card>
            </div>

            {/* Tags */}
            <div>
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags && Array.isArray(tags) && tags.map((tag, index) => {
                    // Handle both Tag objects and strings
                    const isTagObject = typeof tag === 'object' && tag !== null && 'id' in tag;
                    const tagName = isTagObject ? tag.name : tag;
                    const tagSlug = isTagObject ? tag.slug : tag.toLowerCase().replace(/\s+/g, '-');
                    
                    return (
                      <Link 
                        key={isTagObject ? tag.id : index}
                        to={`/tags/${tagSlug}`}
                        className="inline-block no-underline"
                      >
                        <span
                          className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-200 rounded-full text-sm font-medium hover:from-emerald-200 hover:to-green-200 dark:hover:from-emerald-900/50 dark:hover:to-green-900/50 transition-all duration-300 cursor-pointer border border-emerald-200 dark:border-emerald-700 block hover:scale-105 active:scale-95"
                        >
                          {tagName}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Stats */}
            <div>
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <span className="text-emerald-700 dark:text-emerald-200 font-medium">Views</span>
                    <span className="text-emerald-800 dark:text-emerald-200 font-bold">{currentViewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
                    <span className="text-red-700 dark:text-red-200 font-medium">Likes</span>
                    <span className="text-red-800 dark:text-red-200 font-bold">{currentLikeCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-800">
                    <span className="text-yellow-700 dark:text-yellow-200 font-medium">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 dark:text-yellow-500 fill-current mr-1" />
                      <span className="text-yellow-800 dark:text-yellow-200 font-bold">{(Number(currentRating) || 0).toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Related Content */}
            <div>
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">Related {type}s</h3>
                <div className="space-y-4">
                  {loadingRelated ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400">Loading related content...</span>
                    </div>
                  ) : tagBasedRelatedContent.length > 0 ? (
                    tagBasedRelatedContent.map((item) => {
                      const itemTitle = item?.title || item?.name || 'Untitled';
                      const itemDescription = item?.description || item?.excerpt || 'No description available';
                      const itemSlug = item?.slug || item?.id || '';
                      const itemType = item?.type || type;
                      
                      return (
                        <Link 
                          key={`${itemType}-${item?.id || Math.random()}`}
                          to={getContentUrl({ ...item, type: itemType })}
                          className="no-underline"
                        >
                          <div
                            className="flex items-center space-x-3 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-700 hover:translate-x-1"
                          >
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-green-200 dark:from-emerald-800 dark:to-green-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                              {getTypeIcon(itemType)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-emerald-800 dark:text-emerald-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {itemTitle}
                              </h4>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 line-clamp-2">{itemDescription}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-emerald-400 dark:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-emerald-600 dark:text-emerald-400">No related content found</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
