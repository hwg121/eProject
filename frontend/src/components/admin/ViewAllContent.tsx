import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, SortAsc, SortDesc,
  BookOpen, Video, Package, Wrench, Sprout, ShoppingBag, FileText, TrendingUp,
  Eye, Star, Heart
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';
import Toast from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';
import { ViewsChip, LikesChip, RatingChip, EditButton, DeleteButton } from '../ui/ContentIcons';
import { articlesService, videosService, productService } from '../../services/api';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Checkbox,
  Avatar,
  LinearProgress,
  Button,
  IconButton
} from '@mui/material';

interface ContentItem {
  id: string;
  title: string;
  slug?: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'pot' | 'accessory' | 'suggestion';
  status: 'published' | 'draft' | 'archived';
  views: number;
  likes: number;
  rating: number;
  author: string;
  created_at: string;
  updated_at: string;
  thumbnail?: string;
  category?: string;
}

type SortField = 'views' | 'likes' | 'rating' | 'created_at' | 'title';
type SortOrder = 'asc' | 'desc';
type ContentType = 'all' | 'article' | 'video' | 'book' | 'tool' | 'pot' | 'accessory' | 'suggestion';

const ViewAllContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce 300ms for smooth UX
  const [selectedType, setSelectedType] = useState<ContentType>('all');
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'warning' | 'error' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };
  
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void, type: 'warning' | 'error' | 'info' = 'warning') => {
    setConfirmDialog({ open: true, title, message, onConfirm, type });
  };

  const loadAllContent = useCallback(async () => {
    setLoading(true);
    try {
      // Add timeout for API calls to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      );
      
      const apiPromise = Promise.all([
        articlesService.getAll({ per_page: 100 }), // Get more items for comprehensive view
        videosService.getAll({ per_page: 100 }),
        productService.getAll({ per_page: 100 })
      ]);
      
      const [articlesResponse, videosResponse, productsResponse] = await Promise.race([
        apiPromise,
        timeoutPromise
      ]) as any[];

      let allContent: ContentItem[] = [];

      // Transform articles - services now return arrays directly
      if (Array.isArray(articlesResponse)) {
        const articles = articlesResponse.map((article: any) => ({
          id: `article_${article.id}`,
          title: article.title || 'Untitled Article',
          slug: article.slug,
          type: 'article' as const,
          status: article.status || 'published',
          views: Number(article.views) || 0,
          likes: Number(article.likes) || 0,
          rating: Number(article.rating) || 0, // Ensure rating is a number
          author: 'Admin', // Articles don't have author field in ArticleResource
          created_at: article.created_at,
          updated_at: article.updated_at,
          thumbnail: article.featured_image || article.cover,
          category: 'Article'
        }));
        allContent = [...allContent, ...articles];
      }

      // Transform videos - services now return arrays directly
      if (Array.isArray(videosResponse)) {
        const videos = videosResponse.map((video: any) => ({
          id: `video_${video.id}`,
          title: video.title || 'Untitled Video',
          slug: video.slug,
          type: 'video' as const,
          status: video.status || 'published',
          views: Number(video.views) || 0,
          likes: Number(video.likes) || 0,
          rating: Number(video.rating) || 0, // Ensure rating is a number
          author: video.instructor || 'Unknown',
          created_at: video.created_at,
          updated_at: video.updated_at,
          thumbnail: video.thumbnail || video.featured_image,
          category: 'Video'
        }));
        allContent = [...allContent, ...videos];
      }

      // Transform products - services now return arrays directly
      if (Array.isArray(productsResponse)) {
        const products = productsResponse.map((product: any) => ({
          id: `product_${product.id}`,
          title: product.name || product.title || 'Untitled Product',
          slug: product.slug,
          type: product.category || 'suggestion', // Use category field from ProductResource
          status: product.status || 'published',
          views: Number(product.views) || 0,
          likes: Number(product.likes) || 0,
          rating: Number(product.rating) || 0, // Ensure rating is a number
          author: 'Admin', // Products don't have author field
          created_at: product.created_at,
          updated_at: product.updated_at,
          thumbnail: product.image || product.featured_image,
          category: product.category === 'book' ? 'Book' : 
                   product.category === 'tool' ? 'Tool' :
                   product.category === 'pot' ? 'Pot' :
                   product.category === 'accessory' ? 'Accessory' : 'Suggestion'
        }));
        allContent = [...allContent, ...products];
      }

      setContent(allContent);
      
    } catch (error: any) {
      console.error('❌ Error loading content:', error);
      let errorMessage = 'Failed to load content';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllContent();
  }, [loadAllContent]);

  const getTypeIcon = (type: string, category?: string) => {
    // Use category if available, otherwise use type
    const key = category || type;
    switch (key) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'Book': return <BookOpen className="h-4 w-4" />;
      case 'Tool': return <Wrench className="h-4 w-4" />;
      case 'Pot': return <Sprout className="h-4 w-4" />;
      case 'Accessory': return <ShoppingBag className="h-4 w-4" />;
      case 'Suggestion': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string, category?: string) => {
    // Use category if available, otherwise use type
    const key = category || type;
    switch (key) {
      case 'article': return { bg: '#3b82f6', text: '#ffffff' }; // Blue - Articles/Techniques
      case 'video': return { bg: '#ef4444', text: '#ffffff' }; // Red - Videos
      case 'Book': return { bg: '#8b5cf6', text: '#ffffff' }; // Purple - Books
      case 'Tool': return { bg: '#f97316', text: '#ffffff' }; // Orange - Tools
      case 'Pot': return { bg: '#10b981', text: '#ffffff' }; // Green - Pots
      case 'Accessory': return { bg: '#06b6d4', text: '#ffffff' }; // Cyan - Accessories
      case 'Suggestion': return { bg: '#14b8a6', text: '#ffffff' }; // Teal - Suggestions
      default: return { bg: '#6b7280', text: '#ffffff' }; // Gray - Default
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return { bg: '#10b981', text: '#ffffff', icon: '✓' };
      case 'draft': return { bg: '#f59e0b', text: '#ffffff', icon: '📝' };
      case 'archived': return { bg: '#6b7280', text: '#ffffff', icon: '📦' };
      default: return { bg: '#6b7280', text: '#ffffff', icon: '?' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Filter and sort content with memoization for performance
  const filteredContent = useMemo(() => {
    return content
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                             item.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        let matchesType = false;
        if (selectedType === 'all') {
          matchesType = true;
        } else if (selectedType === 'article' || selectedType === 'video') {
          matchesType = item.type === selectedType;
        } else {
          // For product categories, match by category field
          matchesType = item.category === selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
        }
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        if (sortField === 'views') {
          comparison = Number(b.views) - Number(a.views);
        } else if (sortField === 'likes') {
          comparison = Number(b.likes) - Number(a.likes);
        } else if (sortField === 'rating') {
          comparison = Number(b.rating) - Number(a.rating);
        } else if (sortField === 'created_at') {
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortField === 'title') {
          comparison = a.title.localeCompare(b.title);
        }
        
        return sortOrder === 'asc' ? -comparison : comparison;
      });
  }, [content, debouncedSearchTerm, selectedType, sortField, sortOrder]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }, [sortField, sortOrder]);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Helper function to get service for type
  const getServiceForType = (type: string) => {
    const typeKey = type.toLowerCase();
    switch (typeKey) {
      case 'article':
        return articlesService;
      case 'video':
        return videosService;
      case 'book':
      case 'tool':
      case 'pot':
      case 'accessory':
      case 'suggestion':
        return productService;
      default:
        return null;
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = () => {
    if (selectedItems.length === 0 || !bulkStatus) return;
    
    showConfirmDialog(
      'Change Status',
      `Are you sure you want to change the status of ${selectedItems.length} item(s) to "${bulkStatus}"?`,
      async () => {
        try {
          const selectedContent = content.filter(item => selectedItems.includes(item.id));
          const itemsByType = selectedContent.reduce((acc, item) => {
            const type = item.type || item.category;
            if (!acc[type]) acc[type] = [];
            acc[type].push(item);
            return acc;
          }, {} as Record<string, ContentItem[]>);

          for (const [type, items] of Object.entries(itemsByType)) {
            for (const item of items) {
              const actualId = item.id.replace(/^(article|video|product)_/, '');
              const service = getServiceForType(type);
              if (service) {
                await service.update(actualId, { status: bulkStatus });
              }
            }
          }

          showToast(`Successfully updated ${selectedItems.length} item(s) to ${bulkStatus}`, 'success');
          setSelectedItems([]);
          setBulkStatus('');
          await loadAllContent();
        } catch (error) {
          console.error('Bulk status change error:', error);
          showToast('Failed to update some items', 'error');
        }
      },
      'warning'
    );
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    showConfirmDialog(
      'Delete Items',
      `Are you sure you want to delete ${selectedItems.length} selected item(s)? This action cannot be undone.`,
      async () => {
        try {
          const selectedContent = content.filter(item => selectedItems.includes(item.id));
          const itemsByType = selectedContent.reduce((acc, item) => {
            const type = item.type || item.category;
            if (!acc[type]) acc[type] = [];
            acc[type].push(item);
            return acc;
          }, {} as Record<string, ContentItem[]>);

          for (const [type, items] of Object.entries(itemsByType)) {
            for (const item of items) {
              const actualId = item.id.replace(/^(article|video|product)_/, '');
              const service = getServiceForType(type);
              if (service) {
                await service.delete(actualId);
              }
            }
          }

          showToast(`Successfully deleted ${selectedItems.length} item(s)`, 'success');
          setSelectedItems([]);
          await loadAllContent();
        } catch (error) {
          console.error('Bulk delete error:', error);
          showToast('Failed to delete some items', 'error');
        }
      },
      'error'
    );
  };
  
  const handleEdit = (item: ContentItem) => {
    // Emit custom event để AdminDashboard handle
    const event = new CustomEvent('viewall-edit', { 
      detail: { 
        item,
        actualId: item.id.replace(/^(article|video|product)_/, ''),
        category: item.type === 'article' ? 'technique' : item.type === 'video' ? 'video' : item.category?.toLowerCase()
      } 
    });
    window.dispatchEvent(event);
  };
  
  const handleDelete = async (item: ContentItem) => {
    const actualId = item.id.replace(/^(article|video|product)_/, '');
    const contentType = item.type === 'article' ? 'Article' : 
                       item.type === 'video' ? 'Video' : 
                       `${item.category}`;
    
    showConfirmDialog(
      'Delete Content',
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
      async () => {
        try {
          if (item.type === 'article') {
            await articlesService.delete(actualId);
          } else if (item.type === 'video') {
            await videosService.delete(actualId);
          } else {
            await productService.delete(actualId);
          }
          
          showToast(`${contentType} deleted successfully`, 'success');
          
          // Reload content
          await loadAllContent();
        } catch (error: any) {
          console.error('Delete error:', error);
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete content';
          showToast(errorMessage, 'error');
        }
      },
      'error'
    );
  };

  // Memoize type tabs to avoid recalculation
  const typeTabs = useMemo(() => [
    { value: 'all', label: 'All', count: content.length },
    { value: 'article', label: 'Articles', count: content.filter(c => c.type === 'article').length },
    { value: 'video', label: 'Videos', count: content.filter(c => c.type === 'video').length },
    { value: 'book', label: 'Books', count: content.filter(c => c.category === 'Book').length },
    { value: 'tool', label: 'Tools', count: content.filter(c => c.category === 'Tool').length },
    { value: 'pot', label: 'Pots', count: content.filter(c => c.category === 'Pot').length },
    { value: 'accessory', label: 'Accessories', count: content.filter(c => c.category === 'Accessory').length },
    { value: 'suggestion', label: 'Suggestions', count: content.filter(c => c.category === 'Suggestion').length },
  ], [content]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      overflow: 'visible'
    }}>
      <PageHeader
        title="Content Analytics"
        description="Browse and analyze all content performance across your website"
        Icon={TrendingUp}
      />

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        {[
          { 
            label: 'Total Items', 
            value: content.length, 
            icon: FileText, 
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          },
          { 
            label: 'Published', 
            value: content.filter(c => c.status === 'published').length, 
            icon: Eye, 
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
          },
          { 
            label: 'Total Views', 
            value: content.reduce((sum, c) => sum + Number(c.views), 0).toLocaleString(), 
            icon: TrendingUp, 
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
          },
          { 
            label: 'Avg Rating', 
            value: content.length > 0 
              ? (content.reduce((sum, c) => sum + Number(c.rating), 0) / content.length).toFixed(1)
              : '0.0', 
            icon: Star, 
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              sx={{ 
                background: isDarkMode ? '#1e293b' : '#ffffff',
                borderRadius: 2,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${stat.color}30`,
                  borderColor: stat.color
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: isDarkMode ? '#94a3b8' : '#64748b', 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.65rem', sm: '0.7rem' }
                    }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      color: isDarkMode ? '#fff' : '#1e293b',
                      mt: 0.5,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    background: stat.gradient,
                    borderRadius: 2,
                    p: { xs: 1, sm: 1.5 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#ffffff' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Controls */}
      <Card sx={{
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        mb: 3,
        borderRadius: 2
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {/* Search and Sort */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              placeholder="Search content by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="h-4 w-4" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { xs: '100%', sm: 300 } }}
            />
            
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 }, flex: { xs: 1, sm: 'initial' } }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                label="Sort By"
                onChange={(e) => setSortField(e.target.value as SortField)}
              >
                <MenuItem value="views">Views</MenuItem>
                <MenuItem value="likes">Likes</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="created_at">Created Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              onClick={() => handleSort(sortField)}
              sx={{ 
                bgcolor: '#10b981',
                color: 'white',
                '&:hover': { bgcolor: '#059669' }
              }}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </IconButton>
          </Box>

          {/* Type Tabs */}
          <Tabs
            value={selectedType}
            onChange={(_, value) => setSelectedType(value as ContentType)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              '& .MuiTab-root': {
                color: isDarkMode ? '#94a3b8' : '#64748b',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                minHeight: 56,
                '&.Mui-selected': {
                  color: '#10b981'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#10b981',
                height: 3
              }
            }}
          >
            {typeTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{tab.label}</span>
                    <Chip
                      label={tab.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: selectedType === tab.value ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                        color: selectedType === tab.value ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card sx={{
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{
            border: 'none',
            boxShadow: 'none',
            bgcolor: 'transparent',
            overflowX: 'auto',
            maxWidth: '100%'
          }}>
            <Table sx={{ minWidth: { xs: 800, md: 1200 } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                      indeterminate={selectedItems.length > 0 && selectedItems.length < filteredContent.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Content</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('views')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Eye className="h-4 w-4" />
                      Views
                      {sortField === 'views' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('likes')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Heart className="h-4 w-4" />
                      Likes
                      {sortField === 'likes' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('rating')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star className="h-4 w-4" />
                      Rating
                      {sortField === 'rating' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Created
                      {sortField === 'created_at' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', mb: 1 }}>
                        No content found
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'No content available for the selected type'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContent.map((item, index) => {
                    const typeColors = getTypeColor(item.type, item.category);
                    const statusColors = getStatusColor(item.status);
                    
                    return (
                      <TableRow
                        key={item.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.03)'
                          }
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={item.thumbnail}
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: typeColors.bg,
                                color: typeColors.text
                              }}
                            >
                              {getTypeIcon(item.type, item.category)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {item.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                                {item.slug}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              bgcolor: typeColors.bg,
                              color: typeColors.text,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <StatusBadge 
                            status={item.status as 'published' | 'archived' | 'inactive'} 
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <ViewsChip value={Number(item.views)} isDarkMode={isDarkMode} />
                        </TableCell>
                        
                        <TableCell>
                          <LikesChip value={Number(item.likes)} isDarkMode={isDarkMode} />
                        </TableCell>
                        
                        <TableCell>
                          <RatingChip value={Number(item.rating)} isDarkMode={isDarkMode} />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ color: isDarkMode ? '#e2e8f0' : '#374151' }}>
                            {item.author}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                            {formatDate(item.created_at)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <EditButton tooltip="Edit" onClick={() => handleEdit(item)} />
                            <DeleteButton tooltip="Delete" onClick={() => handleDelete(item)} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Paper 
          elevation={3}
          sx={{ 
            mt: 3, 
            p: 2, 
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
            {selectedItems.length} item(s) selected
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

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        type={confirmDialog.type}
      />
    </Box>
  );
};

export default ViewAllContent;
