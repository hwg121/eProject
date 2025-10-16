import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  Package, Star, DollarSign, Tag, Filter
} from 'lucide-react';
import { apiClient } from '../../services/api';
import StatusBadge from '../ui/StatusBadge';
import { ViewsChip, RatingChip, EditButton, DeleteButton } from '../ui/ContentIcons';
import QuickStatusButtons from './QuickStatusButtons';
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
  Badge,
  Checkbox,
  Button
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
  status: 'draft' | 'pending' | 'published' | 'archived';
  description: string;
  image?: string;
  link?: string;
  price?: number;
  rating?: number;
  featured?: boolean; // Changed from is_featured to match transform functions
  is_featured?: boolean; // Keep for backward compatibility
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
  onBulkDelete?: (ids: string[]) => void;
  onBulkStatusChange?: (ids: string[], status: string) => void;
  showConfirmDialog?: (title: string, message: string, onConfirm: () => void, type?: 'warning' | 'success' | 'info' | 'error') => void;
  onQuickStatusChange?: (id: string, newStatus: string) => Promise<void>;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onQuickStatusChange,
  onEdit,
  onDelete,
  onView,
  categories,
  isDarkMode,
  onBulkDelete,
  onBulkStatusChange,
  showConfirmDialog
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState<'all' | 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');

  const filteredProducts = products.filter((product) => {
    const productTitle = product.name || product.title || '';
    const matchesSearch = productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || product.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'latest': {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return isNaN(dateB) ? (isNaN(dateA) ? 0 : 1) : (isNaN(dateA) ? -1 : dateB - dateA);
      }
      case 'oldest': {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return isNaN(dateA) ? (isNaN(dateB) ? 0 : 1) : (isNaN(dateB) ? -1 : dateA - dateB);
      }
      case 'title': {
        const titleA = a.name || a.title || '';
        const titleB = b.name || b.title || '';
        return titleA.localeCompare(titleB, undefined, { numeric: true, sensitivity: 'base' });
      }
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'price-low': {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        return priceA - priceB;
      }
      case 'price-high': {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        return priceB - priceA;
      }
      case 'archived':
        return a.status === 'archived' ? -1 : b.status === 'archived' ? 1 : 0;
      case 'published':
        return a.status === 'published' ? -1 : b.status === 'published' ? 1 : 0;
      case 'featured':
        return ((b.featured || b.is_featured) ? 1 : 0) - ((a.featured || a.is_featured) ? 1 : 0);
      case 'rating': {
        const ratingA = Number(a.rating) || 0;
        const ratingB = Number(b.rating) || 0;
        return ratingB - ratingA;
      }
      case 'none':
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

  // Bulk selection handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    const performDelete = () => {
      if (onBulkDelete) {
        onBulkDelete(selectedIds);
        setSelectedIds([]);
      }
    };

    if (showConfirmDialog) {
      showConfirmDialog(
        'Delete Products',
        `Are you sure you want to delete ${selectedIds.length} selected product${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
        performDelete,
        'error'
      );
    } else {
      performDelete();
    }
  };

  const handleBulkStatusChange = () => {
    if (selectedIds.length === 0 || !bulkStatus) return;
    
    const performStatusChange = () => {
      if (onBulkStatusChange) {
        onBulkStatusChange(selectedIds, bulkStatus);
        setSelectedIds([]);
        setBulkStatus('');
      }
    };

    if (showConfirmDialog) {
      showConfirmDialog(
        'Change Status',
        `Are you sure you want to change the status of ${selectedIds.length} product${selectedIds.length > 1 ? 's' : ''} to "${bulkStatus}"?`,
        performStatusChange,
        'warning'
      );
    } else {
      performStatusChange();
    }
  };

  const isAllSelected = paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < paginatedProducts.length;

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
          borderRadius: { xs: 1, sm: 2 },
          background: isDarkMode ? '#1e293b' : '#ffffff',
          overflow: { xs: 'auto', sm: 'hidden' }
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#10b981',
              height: 3,
            },
            '& .MuiTab-root': {
              minHeight: { xs: 56, sm: 64 },
              minWidth: { xs: 110, sm: 130 },
              px: { xs: 1.5, sm: 2 },
            },
            '& .MuiTabs-scrollButtons': {
              color: '#10b981',
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
        {[
          { label: 'Archived', value: products.filter(p => p.status === 'archived').length, icon: Package, color: '#6b7280', sortKey: 'archived' },
          { label: 'Published', value: products.filter(p => p.status === 'published').length, icon: Eye, color: '#10b981', sortKey: 'published' },
          { label: 'Featured', value: products.filter(p => (p as any).featured || p.is_featured).length, icon: Star, color: '#fbbf24', sortKey: 'featured' },
          { 
            label: 'Avg Rating', 
            value: products.length > 0 
              ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
              : '0.0',
            icon: Star, 
            color: '#3b82f6',
            sortKey: 'rating'
          },
        ].map((stat, index) => (
          <Grow key={index} in={true} timeout={300 + index * 100}>
            <Card 
              onClick={() => setSortBy(stat.sortKey)}
              sx={{ 
                background: isDarkMode ? '#1e293b' : '#ffffff', 
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: sortBy === stat.sortKey ? `2px solid ${stat.color}` : '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${stat.color}30`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>{stat.label}</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${stat.color}20`, width: 44, height: 44 }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </Avatar>
              </Box>
            </Card>
          </Grow>
        ))}
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3, background: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1.5, sm: 2 } }}>
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
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="title">Title A-Z</MenuItem>
              <MenuItem value="views">Most Views</MenuItem>
              <MenuItem value="likes">Most Likes</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="rating">Highest Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 2, 
            background: isDarkMode ? '#1e293b' : '#ffffff', 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
            {selectedIds.length} product(s) selected
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Change Status</InputLabel>
              <Select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                label="Change Status"
                sx={{
                  bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                }}
              >
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              size="small"
              onClick={handleBulkStatusChange}
              disabled={!bulkStatus}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                textTransform: 'none'
              }}
            >
              Apply Status
            </Button>
            
            <Button
              variant="contained"
              size="small"
              onClick={handleBulkDelete}
              sx={{
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' },
                textTransform: 'none'
              }}
            >
              Delete Selected
            </Button>
          </Box>
        </Paper>
      )}

      {/* Products Table */}
      <TableContainer 
        component={Paper} 
        elevation={3}
        sx={{ 
          borderRadius: { xs: 1, sm: 2 },
          background: isDarkMode ? '#1e293b' : '#ffffff',
          overflow: 'auto',
          maxWidth: '100%',
          // Responsive scrollbar
          '&::-webkit-scrollbar': {
            height: { xs: 6, sm: 8 },
            width: { xs: 6, sm: 8 },
          },
          '&::-webkit-scrollbar-track': {
            background: isDarkMode ? '#0f172a' : '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#10b981',
            borderRadius: 4,
            '&:hover': {
              background: '#059669',
            },
          },
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
          <Table sx={{ minWidth: { xs: 900, md: 1100 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                    sx={{
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      '&.Mui-checked': { color: '#10b981' },
                      '&.MuiCheckbox-indeterminate': { color: '#10b981' },
                    }}
                  />
                </TableCell>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                      sx={{
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        '&.Mui-checked': { color: '#10b981' },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name || product.title || 'Product'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getProductIcon(product.category)
                        )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 
                              className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}
                              style={{ maxWidth: '500px' }}
                              title={product.name || product.title}
                            >
                              {(product.name || product.title || '').length > 100 
                                ? `${(product.name || product.title).substring(0, 100)}...` 
                                : (product.name || product.title)}
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
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                             style={{
                               overflow: 'hidden',
                               textOverflow: 'ellipsis',
                               whiteSpace: 'nowrap',
                               maxWidth: '300px'
                             }}>
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
                    <div style={{fontSize: '10px', color: '#666', marginBottom: '2px'}}>
                      Debug: {product.status} (type: {typeof product.status})
                    </div>
                    <StatusBadge 
                      status={product.status as 'draft' | 'pending' | 'published' | 'archived'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <ViewsChip value={product.views || 0} isDarkMode={isDarkMode} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                        {formatPrice(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RatingChip value={product.rating || 0} isDarkMode={isDarkMode} />
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
                      {onQuickStatusChange ? (
                        <QuickStatusButtons
                          item={product}
                          onStatusChange={onQuickStatusChange}
                          onEdit={() => onEdit(product)}
                          onDelete={() => onDelete(product.id)}
                          isDarkMode={isDarkMode}
                        />
                      ) : (
                        <>
                          <EditButton tooltip="Edit Product" onClick={() => onEdit(product)} />
                          <DeleteButton tooltip="Delete Product" onClick={() => onDelete(product.id)} />
                        </>
                      )}
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
