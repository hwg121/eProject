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
    <div className="space-y-8">
      <PageHeader
        title="Browse Tags"
        subtitle="Discover content organized by topics and interests"
        icon={<Hash className="h-10 w-10" />}
      />

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </Card>

      {/* Popular Tags */}
      {popularTags.length > 0 && !searchQuery && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-900">Popular Tags</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <TagChip
                  id={tag.id}
                  name={tag.name}
                  slug={tag.slug}
                  size="large"
                />
                {tag.total_count && tag.total_count > 0 && (
                  <span className="text-sm text-gray-600">
                    ({tag.total_count})
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading tags...</p>
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tags.map((tag) => (
              <Link key={tag.id} to={`/tags/${tag.slug}`} className="block h-full">
                <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <TagChip
                      id={tag.id}
                      name={tag.name}
                      slug={tag.slug}
                      clickable={false}
                      size="medium"
                    />
                  </div>

                  {tag.description && (
                    <p className="text-emerald-600 mb-4 leading-relaxed line-clamp-2">
                      {tag.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-emerald-500">
                    {tag.articles_count !== undefined && tag.articles_count > 0 && (
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{tag.articles_count}</span>
                      </div>
                    )}
                    {tag.videos_count !== undefined && tag.videos_count > 0 && (
                      <div className="flex items-center space-x-1">
                        <Video className="w-4 h-4" />
                        <span>{tag.videos_count}</span>
                      </div>
                    )}
                    {tag.products_count !== undefined && tag.products_count > 0 && (
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4" />
                        <span>{tag.products_count}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TagsList;
