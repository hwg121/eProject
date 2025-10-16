import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { RefreshCw } from 'lucide-react';
import ProductList from './ProductList';
import { productService } from '../../services/api';
import useInfiniteScroll, { useScrollTrigger } from '../../hooks/useInfiniteScroll';

interface Product {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'archived';
  description: string;
  image?: string;
  link?: string;
  price?: number;
  rating?: number;
  featured?: boolean;
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

interface ProductListWithInfiniteScrollProps {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  categories: string[];
  isDarkMode: boolean;
  statusFilter?: 'all' | 'published' | 'archived';
  onBulkDelete?: (ids: string[]) => void;
  onBulkStatusChange?: (ids: string[], status: string) => void;
  showConfirmDialog?: (title: string, message: string, onConfirm: () => void, type?: 'warning' | 'success' | 'info' | 'error') => void;
}

/**
 * ProductList with built-in infinite scroll
 * 
 * Features:
 * - Automatically loads products from API in pages
 * - Infinite scroll when user reaches bottom
 * - Maintains all existing ProductList features
 * - Optimized performance with pagination
 */
const ProductListWithInfiniteScroll: React.FC<ProductListWithInfiniteScrollProps> = ({
  onEdit,
  onDelete,
  onView,
  categories,
  isDarkMode,
  statusFilter = 'all',
  onBulkDelete,
  onBulkStatusChange,
  showConfirmDialog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // API parameters based on filters
  const apiParams = useMemo(() => ({
    status: statusFilter,
    ...(selectedCategory !== 'all' && { category: selectedCategory }),
    ...(searchTerm && { search: searchTerm }),
  }), [statusFilter, selectedCategory, searchTerm]);

  // Infinite scroll hook
  const {
    data: products,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    meta
  } = useInfiniteScroll<Product>({
    apiFunction: productService.getAll,
    initialParams: apiParams,
    perPage: 20, // Load 20 products at a time
    enabled: true,
  });

  // Scroll trigger ref for infinite loading
  const triggerRef = useScrollTrigger(loadMore, hasMore, loading, 300);

  // Note: Hook already handles param changes internally via useEffect
  // No need to manually call refresh() here to avoid duplicate loads

  // Handle error
  if (error && !loading && products.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Failed to load products</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshCw className="w-4 h-4" />}
          onClick={refresh}
          sx={{
            bgcolor: '#10b981',
            '&:hover': { bgcolor: '#059669' },
            textTransform: 'none'
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      {/* Product List Component */}
      <ProductList
        products={products}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        categories={categories}
        isDarkMode={isDarkMode}
        onBulkDelete={onBulkDelete}
        onBulkStatusChange={onBulkStatusChange}
        showConfirmDialog={showConfirmDialog}
      />

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <Box
          ref={triggerRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            minHeight: '100px'
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress
                size={40}
                thickness={4}
                sx={{
                  color: '#10b981',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontWeight: 500
                }}
              >
                Loading more products...
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* End of List Message */}
      {!hasMore && products.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 4,
            borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontWeight: 600
            }}
          >
            🎉 You've reached the end
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? '#6b7280' : '#9ca3af',
            }}
          >
            {meta && `Showing all ${meta.total} product${meta.total !== 1 ? 's' : ''}`}
          </Typography>
        </Box>
      )}

      {/* Initial Loading State */}
      {loading && products.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            zIndex: 10,
            minHeight: '400px'
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#10b981',
              mb: 2
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              fontWeight: 600,
              mb: 1
            }}
          >
            Loading Products
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? '#94a3b8' : '#64748b',
            }}
          >
            Please wait...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductListWithInfiniteScroll;

