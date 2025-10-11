import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  Package, Star, DollarSign, Tag, Filter
} from 'lucide-react';
import { apiClient } from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Pagination,
  Grow,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as ToolIcon,
  MenuBook as BookIcon,
  LocalFlorist as PotIcon,
  Extension as AccessoryIcon,
  Lightbulb as SuggestionIcon,
  Category as AllIcon
} from '@mui/icons-material';

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
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  const formatPrice = (price?: number | string | null) => {
    // Check for null, undefined, or empty string
    if (price === null || price === undefined || price === '') return 'Free';
    
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if conversion failed or price is 0
    if (isNaN(numPrice) || numPrice <= 0) return 'Free';
    
    return `$${numPrice.toFixed(2)}`;
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
      <Paper 
        elevation={2}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#10b981',
              height: 3,
            },
            '& .MuiTab-root': {
              minHeight: 64,
            },
          }}
        >
          <Tab
            value="all"
            icon={<AllIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>All Products</span>
                <Chip 
                  label={products.length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'all' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'all' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
          <Tab
            value="tool"
            icon={<ToolIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Tools</span>
                <Chip 
                  label={products.filter(item => item.category === 'tool').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'tool' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'tool' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
          <Tab
            value="book"
            icon={<BookIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Books</span>
                <Chip 
                  label={products.filter(item => item.category === 'book').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'book' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'book' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
          <Tab
            value="pot"
            icon={<PotIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Pots</span>
                <Chip 
                  label={products.filter(item => item.category === 'pot').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'pot' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'pot' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
          <Tab
            value="accessory"
            icon={<AccessoryIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Accessories</span>
                <Chip 
                  label={products.filter(item => item.category === 'accessory').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'accessory' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'accessory' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
          <Tab
            value="suggestion"
            icon={<SuggestionIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Suggestions</span>
                <Chip 
                  label={products.filter(item => item.category === 'suggestion').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'suggestion' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'suggestion' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
        </Tabs>
      </Paper>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card sx={{ background: isDarkMode ? '#1e293b' : '#ffffff', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Archived</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                {products.filter(p => p.status === 'archived').length}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#6b728020', width: 44, height: 44 }}>
              <Package className="w-5 h-5" style={{ color: '#6b7280' }} />
            </Avatar>
          </Box>
        </Card>
        <Card sx={{ background: isDarkMode ? '#1e293b' : '#ffffff', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Published</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                {products.filter(p => p.status === 'published').length}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#10b98120', width: 44, height: 44 }}>
              <Eye className="w-5 h-5" style={{ color: '#10b981' }} />
            </Avatar>
          </Box>
        </Card>
        <Card sx={{ background: isDarkMode ? '#1e293b' : '#ffffff', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Featured</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                {products.filter(p => p.is_featured).length}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#fbbf2420', width: 44, height: 44 }}>
              <Star className="w-5 h-5" style={{ color: '#fbbf24' }} />
            </Avatar>
          </Box>
        </Card>
        <Card sx={{ background: isDarkMode ? '#1e293b' : '#ffffff', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Avg Rating</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                {products.length > 0 
                  ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
                  : '0.0'
                }
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#3b82f620', width: 44, height: 44 }}>
              <Star className="w-5 h-5" style={{ color: '#3b82f6' }} />
            </Avatar>
          </Box>
        </Card>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                '&:hover fieldset': { borderColor: '#10b981' },
                '&.Mui-focused fieldset': { borderColor: '#10b981' },
              },
            }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ '&.Mui-focused': { color: '#10b981' } }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              sx={{
                bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
              }}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="title">Title A-Z</MenuItem>
              <MenuItem value="views">Most Views</MenuItem>
              <MenuItem value="likes">Most Likes</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Products Table */}
      <TableContainer 
        component={Paper} 
        elevation={3}
        sx={{ 
          borderRadius: 2,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          overflow: 'hidden'
        }}
      >
        {paginatedProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📦</Typography>
            <Typography variant="h6" fontWeight={600} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', mb: 1 }}>
              No products found
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Views</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Rating</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {paginatedProducts.map((product, index) => (
                <TableRow
                    key={product.id}
                  sx={{
                    '&:hover': {
                      bgcolor: isDarkMode ? '#0f172a' : '#f1f5f9',
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                      <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                        {getProductIcon(product.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                              {product.name || product.title}
                            </h3>
                            {product.featured && (
                              <Chip 
                                label="Featured" 
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  bgcolor: '#fbbf24',
                                  color: '#78350f',
                                  '& .MuiChip-label': { px: 1, py: 0 }
                                }}
                              />
                            )}
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                            {product.description}
                          </p>
                        </div>
                      </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: product.category === 'tool' ? '#fef3c7' : 
                                product.category === 'book' ? '#ede9fe' :
                                product.category === 'pot' ? '#dcfce7' :
                                product.category === 'accessory' ? '#dbeafe' : '#fef3c7',
                        color: product.category === 'tool' ? '#92400e' : 
                               product.category === 'book' ? '#7c3aed' :
                               product.category === 'pot' ? '#16a34a' :
                               product.category === 'accessory' ? '#2563eb' : '#92400e',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      size="small"
                      color={product.status === 'published' ? 'success' : 'warning'}
                      sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<VisibilityIcon sx={{ fontSize: 14, color: '#3b82f6 !important' }} />}
                      label={product.views || 0}
                      size="small"
                      sx={{
                        bgcolor: isDarkMode ? '#374151' : '#e5e7eb',
                        color: isDarkMode ? '#d1d5db' : '#6b7280',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                        {formatPrice(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<Star className="w-3 h-3 text-yellow-500 fill-current" />}
                      label={product.rating || 0}
                      size="small"
                      sx={{
                        bgcolor: isDarkMode ? '#374151' : '#fef3c7',
                        color: isDarkMode ? '#d1d5db' : '#92400e',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': {
                          color: '#fbbf24',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title={product.link ? "Open Product Link" : "View Product"}>
                        <IconButton
                          onClick={async () => {
                            if (product.link) {
                              // Track view before opening link
                              try {
                                await apiClient.trackView('product', Number(product.id));
                              } catch (error) {
                                console.error('Failed to track view:', error);
                              }
                              window.open(product.link, '_blank');
                            } else {
                              onView(product);
                            }
                          }}
                          size="small"
                          sx={{
                            color: '#6b7280',
                            '&:hover': { bgcolor: isDarkMode ? '#374151' : '#e5e7eb' }
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Product">
                        <IconButton
                          onClick={() => onEdit(product)}
                          size="small"
                          sx={{
                            color: '#3b82f6',
                            '&:hover': { bgcolor: '#dbeafe' }
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton
                          onClick={() => onDelete(product.id)}
                          size="small"
                          sx={{
                            color: '#ef4444',
                            '&:hover': { bgcolor: '#fee2e2' }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              mt: 3, 
              background: isDarkMode ? '#1e293b' : '#ffffff', 
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            {/* Rows per page selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                Rows per page:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  sx={{
                    bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                  }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Current range display */}
            <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length}
            </Typography>

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                sx={{
                  color: currentPage === 1 ? (isDarkMode ? '#374151' : '#d1d5db') : (isDarkMode ? '#94a3b8' : '#64748b'),
                  '&:hover': {
                    bgcolor: currentPage === 1 ? 'transparent' : (isDarkMode ? '#374151' : '#e5e7eb'),
                  },
                  '&.Mui-disabled': {
                    color: isDarkMode ? '#374151' : '#d1d5db',
                  }
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </IconButton>
              
              <IconButton
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                sx={{
                  color: currentPage === totalPages ? (isDarkMode ? '#374151' : '#d1d5db') : (isDarkMode ? '#94a3b8' : '#64748b'),
                  '&:hover': {
                    bgcolor: currentPage === totalPages ? 'transparent' : (isDarkMode ? '#374151' : '#e5e7eb'),
                  },
                  '&.Mui-disabled': {
                    color: isDarkMode ? '#374151' : '#d1d5db',
                  }
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </IconButton>
            </Box>
          </Paper>
        )}
      </TableContainer>
    </div>
  );
};

export default ProductList;
