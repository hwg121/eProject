import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Search, FileText, Video, Package, TrendingUp } from 'lucide-react';
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

const TagsList: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        const response = await tagService.getAll({
          search: searchQuery,
          sortBy: 'name',
          sortOrder: 'asc',
          per_page: 100,
        });
        
        // Handle both array and wrapped responses
        if (response && Array.isArray(response)) {
          setTags(response);
        } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
          setTags((response as any).data);
        } else {
          setTags([]);
        }
      } catch (err) {
        setError('Failed to load tags');
        console.error('Error loading tags:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [searchQuery]);

  // Get popular tags (top 10 by content count)
  const popularTags = [...tags]
    .sort((a, b) => (b.total_count || 0) - (a.total_count || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHeader
          title="Browse Tags"
          subtitle="Discover content organized by topics and interests"
          icon={<Hash className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />}
        />

        {/* Search */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-700/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/90 dark:bg-gray-700/90 border-emerald-200 dark:border-emerald-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </Card>

        {/* Popular Tags */}
        {popularTags.length > 0 && !searchQuery && (
          <Card className="p-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Tags</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {popularTags.map((tag) => (
                <div key={tag.id} className="group relative">
                  <TagChip
                    id={tag.id}
                    name={tag.name}
                    slug={tag.slug}
                    size="large"
                  />
                  {tag.total_count && tag.total_count > 0 && (
                    <span className="ml-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {tag.total_count} items
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 dark:border-emerald-800 mx-auto mb-6"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-emerald-600 dark:border-t-emerald-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">Loading tags...</p>
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
        ) : tags.length === 0 ? (
          <Card className="p-16 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-700/50">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hash className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              {searchQuery ? 'No tags found' : 'No tags available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search terms or browse all tags' : 'Tags will appear here once content is created and tagged'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tags.map((tag) => (
              <Link key={tag.id} to={`/tags/${tag.slug}`} className="block h-full group">
                <Card className="p-6 h-full cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600">
                  <div className="flex items-start justify-between mb-4">
                    <TagChip
                      id={tag.id}
                      name={tag.name}
                      slug={tag.slug}
                      clickable={false}
                      size="medium"
                    />
                    {tag.total_count !== undefined && tag.total_count > 0 && (
                      <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                        {tag.total_count}
                      </span>
                    )}
                  </div>

                  {tag.description && (
                    <p className="text-sm mb-4 line-clamp-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tag.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      {tag.articles_count !== undefined && tag.articles_count > 0 && (
                        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{tag.articles_count}</span>
                        </div>
                      )}
                      {tag.videos_count !== undefined && tag.videos_count > 0 && (
                        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                          <Video className="w-4 h-4" />
                          <span className="font-medium">{tag.videos_count}</span>
                        </div>
                      )}
                      {tag.products_count !== undefined && tag.products_count > 0 && (
                        <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                          <Package className="w-4 h-4" />
                          <span className="font-medium">{tag.products_count}</span>
                        </div>
                      )}
                    </div>
                    {tag.total_count === 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-500 italic">
                        No content yet
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsList;
