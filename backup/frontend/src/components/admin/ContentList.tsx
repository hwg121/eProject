import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  FileText, Star, Calendar, Tag
} from 'lucide-react';
import Card from '../UI/Card';
import { ContentItem } from '../../types/admin';

interface ContentListProps {
  contentData: ContentItem[];
  categories: {[key: string]: string[]};
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string, type: string) => void;
  onView: (item: ContentItem) => void;
  isDarkMode: boolean;
}

const ContentList: React.FC<ContentListProps> = ({
  contentData,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onEdit,
  onDelete,
  onView,
  isDarkMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [activeTab, setActiveTab] = useState<'all' | 'technique' | 'video'>('all');

  const filteredContent = contentData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category?.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContent = sortedContent.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technique': 'bg-emerald-100 text-emerald-800',
      'Video': 'bg-red-100 text-red-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'Technique':
        return '🌿';
      case 'Video':
        return '🎥';
      default:
        return '📄';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Only use predefined categories for Content Management (rich content)
  const allCategories = ['Technique', 'Video'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Content List
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your content library
          </p>
        </div>
      </div>

      {/* Content Type Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'all', label: 'All Content', icon: '📄', count: contentData.length },
          { 
            id: 'technique', 
            label: 'Techniques', 
            icon: '🌿', 
            count: contentData.filter(item => item.category?.toLowerCase() === 'technique').length 
          },
          { 
            id: 'video', 
            label: 'Videos', 
            icon: '🎥', 
            count: contentData.filter(item => item.category?.toLowerCase() === 'video').length 
          }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'all' | 'technique' | 'video')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? isDarkMode
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-emerald-700 shadow-lg'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeTab === tab.id
                ? isDarkMode
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-100 text-emerald-700'
                : isDarkMode
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Content
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {contentData.length}
              </p>
            </div>
            <FileText className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </Card>
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Published
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {contentData.filter(c => c.status === 'published').length}
              </p>
            </div>
            <Eye className={`w-8 h-8 text-green-500`} />
          </div>
        </Card>
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Featured
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {contentData.filter(c => c.featured).length}
              </p>
            </div>
            <Star className={`w-8 h-8 text-yellow-500`} />
          </div>
        </Card>
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Categories
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {allCategories.length}
              </p>
            </div>
            <Tag className={`w-8 h-8 text-blue-500`} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
              <option value="views">Most Views</option>
              <option value="likes">Most Likes</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content Table */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {paginatedContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No content found
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Content
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Author
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Created
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedContent.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                          {getContentIcon(item.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                            {item.title}
                          </h3>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.author || item.instructor || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => onView(item)}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          } transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onEdit(item)}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-blue-600 text-white hover:bg-blue-500' 
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          } transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onDelete(item.id, item.category)}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-red-600 text-white hover:bg-red-500' 
                              : 'bg-red-500 text-white hover:bg-red-600'
                          } transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedContent.length)} of {sortedContent.length} results
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                } transition-colors`}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === currentPage
                      ? 'bg-emerald-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  } transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}
              
              <motion.button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                } transition-colors`}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContentList;
