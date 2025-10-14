import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Hash, FileText, Video, Package, Filter, ChevronRight } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import TagChip from '../components/UI/TagChip';
import { tagService } from '../services/api';
import { useResponsiveDesign } from '../utils/responsiveDesign';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articles_count?: number;
  videos_count?: number;
  products_count?: number;
  total_count?: number;
}

interface Content {
  id: number;
  type: 'article' | 'video' | 'product';
  title?: string;
  name?: string;
  slug: string;
  excerpt?: string;
  description?: string;
  featured_image?: string;
  thumbnail?: string;
  category?: string;
  instructor?: string;
  price?: number;
  rating?: number;
  views?: number;
  likes?: number;
  created_at: string;
}

const TagArchive: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isMobile } = useResponsiveDesign();
  const [tag, setTag] = useState<Tag | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'articles' | 'videos' | 'products'>('all');

  useEffect(() => {
    const loadTagData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch tag details
        const tagResponse = await tagService.getBySlug(slug);
        
        
        // Check multiple possible response formats
        if (tagResponse && (tagResponse as any).success && (tagResponse as any).data) {
          setTag((tagResponse as any).data);
        } else if (tagResponse && (tagResponse as any).id) {
          // Direct tag object response
          setTag(tagResponse as any);
        } else {
          setError('Tag not found');
          setTag(null);
        }

        // Fetch tag contents
        const contentsResponse = await tagService.getContents(slug, {
          type: filterType,
          per_page: 50,
        });
        
        
        if (contentsResponse && (contentsResponse as any).success && (contentsResponse as any).data) {
          // Contents API returns: {success: true, data: {tag: {...}, contents: [...]}}
          const contentsData = (contentsResponse as any).data;
          if (contentsData && contentsData.contents && Array.isArray(contentsData.contents)) {
            setContents(contentsData.contents);
          } else {
            setContents([]);
          }
        } else {
          setContents([]);
        }
      } catch (err) {
        setError('Failed to load tag data');
        setTag(null);
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    loadTagData();
  }, [slug, filterType]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'product':
        return <Package className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentUrl = (content: Content) => {
    switch (content.type) {
      case 'article':
        return `/article/${content.slug}`;
      case 'video':
        return `/video/${content.slug}`;
      case 'product':
        return `/product/${content.slug}`;
      default:
        return '#';
    }
  };

  const getContentTitle = (content: Content) => {
    return content.title || content.name || 'Untitled';
  };

  if (!slug) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="inline w-4 h-4 mx-2" />
          <Link to="/tags" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
            Tags
          </Link>
          <ChevronRight className="inline w-4 h-4 mx-2" />
          <span className="text-gray-900 dark:text-white font-medium">
            {tag?.name || slug}
          </span>
        </nav>

        {loading ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 dark:border-emerald-800 mx-auto mb-6"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-emerald-600 dark:border-t-emerald-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">Loading content...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Discovering amazing content</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 max-w-md mx-auto">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Oops! Something went wrong</p>
              <p className="text-sm text-red-600 dark:text-red-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : !tag ? (
          <Card className="p-16 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-700/50">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hash className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Tag Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              The tag you're looking for doesn't exist or may have been removed.
            </p>
            <Link
              to="/tags"
              className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Browse All Tags
            </Link>
          </Card>
        ) : (
        <>
          {/* Tag Header */}
          <Card className="p-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <TagChip
                  id={tag.id}
                  name={tag.name}
                  slug={tag.slug}
                  clickable={false}
                  size="large"
                  className="mb-6"
                />
                {tag.description && (
                  <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {tag.description}
                  </p>
                )}
                <div className="flex items-center space-x-6 text-sm">
                  {tag.articles_count !== undefined && tag.articles_count > 0 && (
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">
                        {tag.articles_count} {tag.articles_count === 1 ? 'Article' : 'Articles'}
                      </span>
                    </div>
                  )}
                  {tag.videos_count !== undefined && tag.videos_count > 0 && (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                      <Video className="w-5 h-5" />
                      <span className="font-medium">
                        {tag.videos_count} {tag.videos_count === 1 ? 'Video' : 'Videos'}
                      </span>
                    </div>
                  )}
                  {tag.products_count !== undefined && tag.products_count > 0 && (
                    <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                      <Package className="w-5 h-5" />
                      <span className="font-medium">
                        {tag.products_count} {tag.products_count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Filter Tabs */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-700/50">
            <div className="flex items-center space-x-3 overflow-x-auto">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex-shrink-0">
                <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All ({tag.total_count || 0})
              </button>
              <button
                onClick={() => setFilterType('articles')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  filterType === 'articles'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Articles ({tag.articles_count || 0})
              </button>
              <button
                onClick={() => setFilterType('videos')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  filterType === 'videos'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Videos ({tag.videos_count || 0})
              </button>
              <button
                onClick={() => setFilterType('products')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  filterType === 'products'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Products ({tag.products_count || 0})
              </button>
            </div>
          </Card>

          {/* Content Grid */}
          {contents.length === 0 ? (
            <Card className="p-12 text-center">
              <Hash className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2 text-gray-700">
                No content found
              </p>
              <p className="text-sm text-gray-600">
                There's no {filterType !== 'all' ? filterType : 'content'} with this tag yet.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contents.map((content) => (
                <Link key={`${content.type}-${content.id}`} to={getContentUrl(content)} className="block h-full">
                  <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                    {/* Content Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                        content.type === 'article' 
                          ? 'bg-blue-100 text-blue-700'
                          : content.type === 'video'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {getContentIcon(content.type)}
                        <span className="capitalize">{content.type}</span>
                      </div>
                    </div>

                    {/* Featured Image/Thumbnail */}
                    {(content.featured_image || content.thumbnail) && (
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <img
                          src={content.featured_image || content.thumbnail}
                          alt={getContentTitle(content)}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-emerald-800 mb-3 group-hover:text-emerald-600 transition-colors">
                      {getContentTitle(content)}
                    </h3>

                    {/* Description/Excerpt */}
                    {(content.excerpt || content.description) && (
                      <p className="text-emerald-600 mb-4 leading-relaxed line-clamp-3">
                        {content.excerpt || content.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
                      <div className="flex items-center space-x-4">
                        {content.views !== undefined && (
                          <span>{content.views} views</span>
                        )}
                        {content.rating !== undefined && content.rating > 0 && (
                          <span className="text-yellow-500">
                            ⭐ {Number(content.rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                      {content.price !== undefined && content.price > 0 && (
                        <span className="text-emerald-600 font-semibold">
                          ${Number(content.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};

export default TagArchive;
