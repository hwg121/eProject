import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  Package, Star, DollarSign, Tag, Filter
} from 'lucide-react';
import Card from '../UI/Card';

interface Product {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'draft' | 'archived';
  description: string;
  image?: string;
  link?: string;
  price?: number;
  rating?: number;
  is_featured?: boolean;
  is_published?: boolean;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  categories: string[];
  isDarkMode: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onEdit,
  onDelete,
  onView,
  categories,
  isDarkMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [activeTab, setActiveTab] = useState<'all' | 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion'>('all');

  const filteredProducts = products.filter((product) => {
    const productTitle = product.name || product.title || '';
    const matchesSearch = productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || product.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

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
      'tool': 'bg-orange-100 text-orange-800',
      'book': 'bg-purple-100 text-purple-800',
      'pot': 'bg-green-100 text-green-800',
      'accessory': 'bg-blue-100 text-blue-800',
      'suggestion': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'tool':
        return '🔧';
      case 'book':
        return '📚';
      case 'pot':
        return '🪴';
      case 'accessory':
        return '🏷️';
      case 'suggestion':
        return '💡';
      default:
        return '📦';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Product List
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your product catalog
          </p>
        </div>
      </div>

      {/* Product Category Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'all', label: 'All Products', icon: '📦', count: products.length },
          { 
            id: 'tool', 
            label: 'Tools', 
            icon: '🔧', 
            count: products.filter(item => item.category === 'tool').length 
          },
          { 
            id: 'book', 
            label: 'Books', 
            icon: '📚', 
            count: products.filter(item => item.category === 'book').length 
          },
          { 
            id: 'pot', 
            label: 'Pots', 
            icon: '🪴', 
            count: products.filter(item => item.category === 'pot').length 
          },
          { 
            id: 'accessory', 
            label: 'Accessories', 
            icon: '🏷️', 
            count: products.filter(item => item.category === 'accessory').length 
          },
          { 
            id: 'suggestion', 
            label: 'Suggestions', 
            icon: '💡', 
            count: products.filter(item => item.category === 'suggestion').length 
          }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'all' | 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-200'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
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
                Total Products
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {products.length}
              </p>
            </div>
            <Package className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </Card>
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Published
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {products.filter(p => p.status === 'published').length}
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
                {products.filter(p => p.is_featured).length}
              </p>
            </div>
            <Star className={`w-8 h-8 text-yellow-500`} />
          </div>
        </Card>
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Rating
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {products.length > 0 
                  ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <Star className={`w-8 h-8 text-blue-500`} />
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
                placeholder="Search products..."
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
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No products found
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
                    Product
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Price
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rating
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                            {product.name || product.title}
                          </h3>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getProductIcon(product.category)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(product.category)}`}>
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {product.rating || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => {
                            if (product.link) {
                              window.open(product.link, '_blank');
                            } else {
                              onView(product);
                            }
                          }}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          } transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={product.link ? "Open Product Link" : "View Product"}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onEdit(product)}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-blue-600 text-white hover:bg-blue-500' 
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          } transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onDelete(product.id)}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-red-600 text-white hover:bg-red-500' 
                              : 'bg-red-500 text-white hover:bg-red-600'
                          } transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete Product"
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} results
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

export default ProductList;
