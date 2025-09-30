import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Tag, Eye, Heart, Share2, BookOpen, Play, Wrench, Leaf, Package,
  Clock, Star, Download, Bookmark, MessageCircle, ThumbsUp, ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';

interface DetailPageProps {
  type: 'article' | 'video' | 'book' | 'tool' | 'essential' | 'pot' | 'accessory';
  title: string;
  description: string;
  content: string;
  author?: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
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
  relatedContent?: Array<{
    id: string;
    title: string;
    type: string;
    thumbnail?: string;
    slug?: string;
  }>;
}

const DetailPage: React.FC<DetailPageProps> = ({
  type,
  title,
  description,
  content,
  author,
  publishedAt,
  tags,
  imageUrl,
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
  relatedContent
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const getTypeIcon = () => {
    switch (type) {
      case 'article': return <BookOpen className="h-6 w-6" />;
      case 'video': return <Play className="h-6 w-6" />;
      case 'book': return <BookOpen className="h-6 w-6" />;
      case 'tool': return <Wrench className="h-6 w-6" />;
      case 'essential': return <Leaf className="h-6 w-6" />;
      case 'pot': return <Package className="h-6 w-6" />;
      case 'accessory': return <Package className="h-6 w-6" />;
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
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent">
      {/* Enhanced Header */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
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
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.div>

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
                  {author && (
                    <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{author}</span>
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
                  {views && (
                    <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300">
                      <Eye className="h-4 w-4 mr-2" />
                      <span>{views.toLocaleString()} views</span>
                    </div>
                  )}
                  {price && (
                    <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                      <span>${price}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="overflow-hidden shadow-2xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <div className="relative aspect-video bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 overflow-hidden rounded-t-3xl">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-black/50" />
                  
                  {/* Play button for videos */}
                  {type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        className="w-20 h-20 bg-white/95 dark:bg-slate-800/95 rounded-full flex items-center justify-center shadow-2xl hover:bg-white dark:hover:bg-slate-700 transition-colors group backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="h-8 w-8 text-emerald-600 dark:text-emerald-400 ml-1 group-hover:scale-110 transition-transform" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
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
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div 
                          className="prose prose-lg max-w-none prose-emerald dark:prose-invert" 
                          style={{ 
                            color: 'rgb(100 116 139)',
                            '--tw-prose-body': 'rgb(100 116 139)',
                            '--tw-prose-headings': 'rgb(30 41 59)',
                            '--tw-prose-lead': 'rgb(100 116 139)',
                            '--tw-prose-links': 'rgb(16 185 129)',
                            '--tw-prose-bold': 'rgb(30 41 59)',
                            '--tw-prose-counters': 'rgb(100 116 139)',
                            '--tw-prose-bullets': 'rgb(100 116 139)',
                            '--tw-prose-hr': 'rgb(226 232 240)',
                            '--tw-prose-quotes': 'rgb(100 116 139)',
                            '--tw-prose-quote-borders': 'rgb(226 232 240)',
                            '--tw-prose-captions': 'rgb(100 116 139)',
                            '--tw-prose-code': 'rgb(30 41 59)',
                            '--tw-prose-pre-code': 'rgb(30 41 59)',
                            '--tw-prose-pre-bg': 'rgb(248 250 252)',
                            '--tw-prose-th-borders': 'rgb(226 232 240)',
                            '--tw-prose-td-borders': 'rgb(226 232 240)',
                            '--tw-prose-invert-body': 'rgb(255 255 255)',
                            '--tw-prose-invert-headings': 'rgb(255 255 255)',
                            '--tw-prose-invert-lead': 'rgb(255 255 255)',
                            '--tw-prose-invert-links': 'rgb(16 185 129)',
                            '--tw-prose-invert-bold': 'rgb(255 255 255)',
                            '--tw-prose-invert-counters': 'rgb(255 255 255)',
                            '--tw-prose-invert-bullets': 'rgb(255 255 255)',
                            '--tw-prose-invert-hr': 'rgb(226 232 240)',
                            '--tw-prose-invert-quotes': 'rgb(255 255 255)',
                            '--tw-prose-invert-quote-borders': 'rgb(226 232 240)',
                            '--tw-prose-invert-captions': 'rgb(255 255 255)',
                            '--tw-prose-invert-code': 'rgb(255 255 255)',
                            '--tw-prose-invert-pre-code': 'rgb(255 255 255)',
                            '--tw-prose-invert-pre-bg': 'rgb(15 23 42)',
                            '--tw-prose-invert-th-borders': 'rgb(226 232 240)',
                            '--tw-prose-invert-td-borders': 'rgb(226 232 240)',
                          } as React.CSSProperties}
                        >
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
                      </motion.div>
                    )}
                    
                    {activeTab === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {category && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Category</h4>
                              <p className="text-emerald-600 dark:text-emerald-300">{category}</p>
                            </div>
                          )}
                          {brand && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Brand</h4>
                              <p className="text-emerald-600 dark:text-emerald-300">{brand}</p>
                            </div>
                          )}
                          {inStock !== undefined && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Availability</h4>
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
                      </motion.div>
                    )}
                    
                    {activeTab === 'reviews' && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center py-12">
                          <MessageCircle className="h-12 w-12 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-2">No reviews yet</h3>
                          <p className="text-emerald-600 dark:text-emerald-300">Be the first to review this {type}!</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>

            {/* Additional Content */}
            {children && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {children}
              </motion.div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6 flex items-center">
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isLiked
                        ? 'bg-red-500 dark:bg-red-600 text-white'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Download className="h-5 w-5 mr-2" />
                    Download
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-200 rounded-full text-sm font-medium hover:from-emerald-200 hover:to-green-200 dark:hover:from-emerald-900/50 dark:hover:to-green-900/50 transition-all duration-300 cursor-pointer border border-emerald-200 dark:border-emerald-700"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Statistics
                </h3>
                <div className="space-y-4">
                  {views && (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                      <span className="text-emerald-700 dark:text-emerald-200 font-medium">Views</span>
                      <span className="text-emerald-800 dark:text-emerald-200 font-bold">{views.toLocaleString()}</span>
                    </div>
                  )}
                  {likes && (
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
                      <span className="text-red-700 dark:text-red-200 font-medium">Likes</span>
                      <span className="text-red-800 dark:text-red-200 font-bold">{likes.toLocaleString()}</span>
                    </div>
                  )}
                  {rating && (
                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-800">
                      <span className="text-yellow-700 dark:text-yellow-200 font-medium">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 dark:text-yellow-500 fill-current mr-1" />
                        <span className="text-yellow-800 dark:text-yellow-200 font-bold">{rating}/5</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Related Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="shadow-xl bg-white/90 dark:bg-slate-800/80 dark:backdrop-blur-sm border-0 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">Related {type}s</h3>
                <div className="space-y-4">
                  {relatedContent && relatedContent.length > 0 ? (
                    relatedContent.slice(0, 3).map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 5 }}
                        className="flex items-center space-x-3 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-700"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-green-200 dark:from-emerald-800 dark:to-green-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          {getTypeIcon()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-emerald-800 dark:text-emerald-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 capitalize">{item.type}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-emerald-400 dark:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))
                  ) : (
                    [1, 2, 3].map((item) => (
                      <motion.div
                        key={item}
                        whileHover={{ x: 5 }}
                        className="flex items-center space-x-3 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-700"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-green-200 dark:from-emerald-800 dark:to-green-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          {getTypeIcon()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-emerald-800 dark:text-emerald-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Related {type} {item}
                          </h4>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">Short description...</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-emerald-400 dark:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
