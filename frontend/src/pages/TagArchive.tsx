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
        
        // Fetch tag details
        const tagResponse = await tagService.getBySlug(slug);
        if (tagResponse && typeof tagResponse === 'object' && 'success' in tagResponse && (tagResponse as any).success && (tagResponse as any).data) {
          setTag((tagResponse as any).data);
        }

        // Fetch tag contents
        const contentsResponse = await tagService.getContents(slug, {
          type: filterType,
          per_page: 50,
        });
        
        if (contentsResponse && typeof contentsResponse === 'object' && 'success' in contentsResponse && (contentsResponse as any).success && (contentsResponse as any).data) {
          setContents((contentsResponse as any).data.contents || []);
        }
      } catch (err) {
        setError('Failed to load tag data');
        console.error('Error loading tag data:', err);
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
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-emerald-500 transition-colors">
          Home
        </Link>
        <ChevronRight className="inline w-4 h-4 mx-2" />
        <Link to="/tags" className="hover:text-emerald-500 transition-colors">
          Tags
        </Link>
        <ChevronRight className="inline w-4 h-4 mx-2" />
        <span className="text-gray-900">
          {tag?.name || slug}
        </span>
      </nav>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading content...</p>
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
      ) : !tag ? (
        <Card className="p-12 text-center">
          <Hash className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2 text-gray-700">Tag Not Found</h2>
          <p className="text-sm mb-6 text-gray-600">
            The tag you're looking for doesn't exist.
          </p>
          <Link
            to="/tags"
            className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          >
            Browse All Tags
          </Link>
        </Card>
      ) : (
        <>
          {/* Tag Header */}
          <Card className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <TagChip
                  id={tag.id}
                  name={tag.name}
                  slug={tag.slug}
                  clickable={false}
                  size="large"
                  className="mb-4"
                />
                {tag.description && (
                  <p className="text-lg mb-4 text-gray-600">
                    {tag.description}
                  </p>
                )}
                <div className="flex items-center space-x-6 text-sm">
                  {tag.articles_count !== undefined && tag.articles_count > 0 && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">
                        {tag.articles_count} {tag.articles_count === 1 ? 'Article' : 'Articles'}
                      </span>
                    </div>
                  )}
                  {tag.videos_count !== undefined && tag.videos_count > 0 && (
                    <div className="flex items-center space-x-2">
                      <Video className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700">
                        {tag.videos_count} {tag.videos_count === 1 ? 'Video' : 'Videos'}
                      </span>
                    </div>
                  )}
                  {tag.products_count !== undefined && tag.products_count > 0 && (
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">
                        {tag.products_count} {tag.products_count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Filter Tabs */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-5 h-5 flex-shrink-0 text-gray-600" />
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({tag.total_count || 0})
              </button>
              <button
                onClick={() => setFilterType('articles')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterType === 'articles'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Articles ({tag.articles_count || 0})
              </button>
              <button
                onClick={() => setFilterType('videos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterType === 'videos'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Videos ({tag.videos_count || 0})
              </button>
              <button
                onClick={() => setFilterType('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterType === 'products'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
  );
};

export default TagArchive;
