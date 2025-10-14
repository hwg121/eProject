import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from '../components/UI/DarkModeToggle';
import Card from '../components/UI/Card';
import AdminSidebar from '../components/admin/AdminSidebar';
import Toast from '../components/UI/Toast';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import DashboardCharts from '../components/admin/DashboardCharts';
import {
  Avatar,
  Menu as MuiMenu,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Paper,
  Chip,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert
} from '@mui/material';
import { createAdminTheme } from '../theme/adminTheme';

// Import new components
import StatisticsSection from '../components/admin/StatisticsSection';
import RecentActivitySection from '../components/admin/RecentActivitySection';
import TopContentSection from '../components/admin/TopContentSection';
import UserManagementSection from '../components/admin/UserManagementSection';
import UserEditForm from '../components/admin/UserEditForm';
import ContentManagementSection from '../components/admin/ContentManagementSection';
import ContentForm from '../components/admin/ContentForm';
import ProductManagement from '../components/admin/ProductManagement';
import MobileAdminNav from '../components/admin/MobileAdminNav';
import TagManagement from '../components/admin/TagManagement';
import { ContentItem } from '../types/admin';

// Import Site Settings components
import AdminHeroSection from './admin/AdminHeroSection';
import AdminStaffManagement from './admin/AdminStaffManagement';
import AdminMapSettings from './admin/AdminMapSettings';
import AdminContactSettings from './admin/AdminContactSettings';
import AdminContactMessages from './admin/AdminContactMessages';
import AdminCampaignSettings from './admin/AdminCampaignSettings';
import AdminSecuritySettings from './admin/AdminSecuritySettings';

// Import types and utils
import { 
  ActivityItem, 
  TopContentItem, 
  AdminStats, 
  User 
} from '../types/admin';
import { 
  transformArticleToContentItem,
  transformVideoToContentItem,
  transformBookToContentItem,
  transformToolToContentItem,
  transformPotToContentItem,
  transformAccessoryToContentItem,
  transformSuggestionToContentItem,
  validateAvatarFile
} from '../utils/adminUtils';

import { contactService, userService, articlesService, videosService, booksService, toolsService, potsService, accessoriesService, suggestionsService, productService, activityLogService } from '../services/api.ts';
import { visitorService } from '../services/visitorService';
import { campaignService, CampaignStatsResponse } from '../services/campaignService';

const AdminDashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Debug: Log activeTab changes
  useEffect(() => {
    console.log('📍 activeTab changed to:', activeTab);
  }, [activeTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Removed isLoggedOut state - using authentication context instead
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Only for admin to change user passwords
    phone: user?.phone || '',
    phone_country_code: user?.phone_country_code || '',
    country: user?.country || '',
    address: user?.address || '',
    city: user?.city || '',
    zip_code: user?.zip_code || '',
    role: (user?.role === 'admin' || user?.role === 'moderator') ? user.role : 'admin',
    status: user?.status || 'active',
    is_banned: user?.is_banned || false,
    avatar: user?.avatar || null,
    avatar_public_id: user?.avatar_public_id || null,
    avatarPreview: user?.avatar || null
  });

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSortBy, setUserSortBy] = useState('name-asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Content state
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [currentContentType, setCurrentContentType] = useState('');
  
  // Debug currentContentType changes
  React.useEffect(() => {
    console.log('currentContentType changed to:', currentContentType);
  }, [currentContentType]);

  // Product state
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSelectedCategory, setProductSelectedCategory] = useState('all');
  const [productSortBy, setProductSortBy] = useState('latest');

  // Contact messages state

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  // Toast state (using Toast component)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    type?: 'warning' | 'success' | 'info' | 'error';
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });

  const showConfirmDialog = (
    title: string, 
    message: string, 
    onConfirm: () => void,
    type: 'warning' | 'success' | 'info' | 'error' = 'warning'
  ) => {
    setConfirmDialog({ open: true, title, message, type, onConfirm });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleConfirmDialogConfirm = () => {
    confirmDialog.onConfirm();
    handleConfirmDialogClose();
  };

  // Navigation handler for Quick Actions
  const handleSectionChange = (section: string, action?: string) => {
    console.log('handleSectionChange called with:', section, action);
    if (section === 'content') {
      if (action === 'create-article') {
        setActiveTab('content-create');
        setCurrentContentType('Technique'); // Use 'Technique' to match ContentCreate
        setEditingItem(null); // Reset editing state when creating new
      } else if (action === 'create-video') {
        setActiveTab('content-create');
        setCurrentContentType('Video'); // Use 'Video' to match ContentCreate
        setEditingItem(null); // Reset editing state when creating new
      } else if (action === 'create-product') {
        setActiveTab('product-create');
        setEditingItem(null); // Reset editing state when creating new
      }
    } else if (section === 'content-list') {
      setActiveTab('content-list');
    } else if (section === 'product-list') {
      setActiveTab('product-list');
    } else {
      // Direct tab navigation
      setActiveTab(section);
    }
  };

  // Handler for Top Content item click
  const handleTopContentClick = (item: TopContentItem) => {
    const baseUrl = import.meta.env.VITE_APP_URL || 'http://103.252.93.249:80';
    
    // Check content type and navigate accordingly
    if (item.type === 'article' || item.type === 'technique' || item.type === 'Technique') {
      // Navigate to article detail page
      window.open(`${baseUrl}/article/${item.slug || item.id}`, '_blank');
    } else if (item.type === 'video' || item.type === 'Video') {
      // Navigate to video detail page
      window.open(`${baseUrl}/video/${item.slug || item.id}`, '_blank');
    } else if (['tool', 'book', 'pot', 'accessory', 'suggestion'].includes(item.type.toLowerCase())) {
      // Product - open link if available, otherwise show message
      if (item.link) {
        window.open(item.link, '_blank');
      } else {
        showToast('This product does not have an external link', 'info');
      }
    }
  };

  // Stats state
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVisitors: 0,
    visitorGrowth: 0,
    totalViews: 0,
    totalArticles: 0,
    totalVideos: 0,
    totalBooks: 0,
    totalSuggestions: 0,
    totalContactMessages: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    avgRating: 0
  });
  
  // Campaign stats state
  const [campaignStats, setCampaignStats] = useState<CampaignStatsResponse | null>(null);

  // Recent activity and top content
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [publicActivities, setPublicActivities] = useState<any[]>([]);
  const [securityActivities, setSecurityActivities] = useState<any[]>([]);
  const [topContent, setTopContent] = useState<TopContentItem[]>([]);

  // Categories
  const [categories, setCategories] = useState<{[key: string]: string[]}>({
    articles: [],
    techniques: [],
    books: [],
    suggestions: [],
    videos: [],
    tools: [],
    pots: [],
    accessories: []
  });

  // Click outside handler for avatar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.avatar-dropdown')) {
        setAvatarDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [avatarDropdownOpen]);

  // Helper functions for time calculations
  const getTimeAgo = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown time';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  const getTimeInMinutes = (timeString: string): number => {
    if (timeString.includes('minutes ago')) {
      return parseInt(timeString.replace(' minutes ago', ''));
    }
    if (timeString.includes('hours ago')) {
      return parseInt(timeString.replace(' hours ago', '')) * 60;
    }
    if (timeString.includes('days ago')) {
      return parseInt(timeString.replace(' days ago', '')) * 60 * 24;
    }
    if (timeString.includes('weeks ago')) {
      return parseInt(timeString.replace(' weeks ago', '')) * 60 * 24 * 7;
    }
    return 999999; // For "Just now" or unknown times
  };

  // Load categories
  const loadCategories = async () => {
    try {
      // Load categories from API - for now empty until API is ready
      setCategories({
        articles: [],
        techniques: [],
        books: [],
        suggestions: [],
        videos: [],
        tools: [],
        pots: [],
        accessories: []
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load data with fallback and timeout
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user has logged out or no token
      const token = localStorage.getItem('auth_token');
      const hasLoggedOut = localStorage.getItem('user_logged_out') === 'true';
      
      if (!token || hasLoggedOut) {
        setLoading(false);
        return;
      }

      // Add timeout wrapper for the entire loadData operation
      const loadDataWithTimeout = async () => {
        return Promise.race([
          loadDataInternal(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Loading timeout after 30 seconds')), 30000)
          )
        ]);
      };

      await loadDataWithTimeout();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Internal load data function
  const loadDataInternal = async () => {
    try {
      const loadDataWithFallback = async (serviceCall: () => Promise<unknown>) => {
        try {
          const response = await serviceCall() as {success?: boolean, data?: unknown[]};
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          } else if (response && response.data && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
          } catch (error) {
            return [];
          }
        };

      // Load all content data using admin endpoints
      console.log('AdminDashboard - Starting to load data...');
      const [articlesData, videosData, allProductsData, contactMessagesData, usersData, publicActivitiesData, securityActivitiesData] = await Promise.all([
          loadDataWithFallback(() => articlesService.getAll({ status: 'all' })), // Explicitly request all articles including archived
          loadDataWithFallback(() => videosService.getAll({ status: 'all' })), // Explicitly request all videos including archived
          loadDataWithFallback(() => productService.getAll({ status: 'all' })), // Explicitly request all products including archived
          loadDataWithFallback(() => contactService.getAll()),
          loadDataWithFallback(() => userService.getAll()),
          loadDataWithFallback(() => activityLogService.getPublicActivities(20)),
          loadDataWithFallback(() => activityLogService.getSecurityActivities(20))
      ]);
      
      console.log('AdminDashboard - Loaded data:', {
        articles: articlesData?.length || 0,
        videos: videosData?.length || 0,
        products: allProductsData?.length || 0,
        contacts: contactMessagesData?.length || 0,
        users: usersData?.length || 0
      });
      
      // Debug authentication
      console.log('AdminDashboard - Auth debug:', {
        isAuthenticated,
        user: user ? { id: user.id, role: user.role, name: user.name } : null,
        token: localStorage.getItem('auth_token') ? 'present' : 'missing'
      });

      // Load visitor statistics
      const visitorStats = await visitorService.getVisitorStatistics();
      
      // Load campaign stats
      try {
        const campaignStatsData = await campaignService.getStatsOverview();
        setCampaignStats(campaignStatsData);
      } catch (error) {
        console.error('Error loading campaign stats:', error);
        // Don't fail the entire load if campaign stats fail
      }
      
      console.log('AdminDashboard - Loaded products:', allProductsData);
      
      // Debug products by status
      const archivedProducts = allProductsData.filter((p: any) => p.status === 'archived');
      const publishedProducts = allProductsData.filter((p: any) => p.status === 'published');
      console.log('AdminDashboard - Products by status:', {
        total: allProductsData.length,
        archived: archivedProducts.length,
        published: publishedProducts.length,
        archivedSample: archivedProducts.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name, status: p.status })),
        allProductsSample: allProductsData.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name, status: p.status }))
      });
      
      // Debug specific product with rating
      if (allProductsData.length > 0) {
        const firstProduct = allProductsData[0];
        console.log('AdminDashboard - First product rating debug:', {
          id: firstProduct.id,
          name: firstProduct.name,
          rating: firstProduct.rating,
          type: typeof firstProduct.rating
        });
      }

      // Split products by category
      const booksData = allProductsData.filter((product: any) => product.category === 'book');
      const toolsData = allProductsData.filter((product: any) => product.category === 'tool');
      const potsData = allProductsData.filter((product: any) => product.category === 'pot');
      const accessoriesData = allProductsData.filter((product: any) => product.category === 'accessory');
      const suggestionsData = allProductsData.filter((product: any) => product.category === 'suggestion');

      // Transform data with error handling
      setArticles(Array.isArray(articlesData) ? articlesData.map((item: any) => {
        try {
          return transformArticleToContentItem(item);
        } catch (error) {
          console.error('Error transforming article:', item, error);
          return null;
        }
      }).filter(Boolean) : []);
      setVideos(Array.isArray(videosData) ? videosData.map((item: any) => {
        try {
          return transformVideoToContentItem(item);
        } catch (error) {
          console.error('Error transforming video:', item, error);
          return null;
        }
      }).filter(Boolean) : []);
      
      // Set products for Product Management (Tools/Pots/Accessories/Suggestions/Books)
      setProducts([
        ...(Array.isArray(toolsData) ? toolsData.map(transformToolToContentItem) : []),
        ...(Array.isArray(potsData) ? potsData.map(transformPotToContentItem) : []),
        ...(Array.isArray(accessoriesData) ? accessoriesData.map(transformAccessoryToContentItem) : []),
        ...(Array.isArray(suggestionsData) ? suggestionsData.map(transformSuggestionToContentItem) : []),
        ...(Array.isArray(booksData) ? booksData.map(transformBookToContentItem) : [])
      ]);
      
      // Handle users data structure (has data and meta properties)
      if (usersData && typeof usersData === 'object' && 'data' in usersData) {
        setUsers((usersData as any).data as User[]);
      } else {
        setUsers(usersData as User[]);
      }

      // Calculate stats from real API data - only count published content
      const totalArticles = Array.isArray(articlesData) ? articlesData.filter((item: any) => item.status === 'published').length : 0;
      const totalVideos = Array.isArray(videosData) ? videosData.filter((item: any) => item.status === 'published').length : 0;
      const totalBooks = Array.isArray(booksData) ? booksData.filter((item: any) => item.status === 'published').length : 0;
      const totalTools = Array.isArray(toolsData) ? toolsData.filter((item: any) => item.status === 'published').length : 0;
      const totalPots = Array.isArray(potsData) ? potsData.filter((item: any) => item.status === 'published').length : 0;
      const totalAccessories = Array.isArray(accessoriesData) ? accessoriesData.filter((item: any) => item.status === 'published').length : 0;
      const totalSuggestions = Array.isArray(suggestionsData) ? suggestionsData.filter((item: any) => item.status === 'published').length : 0;
      const totalContactMessages = Array.isArray(contactMessagesData) ? contactMessagesData.length : 0;
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0;

      console.log('AdminDashboard - Published content counts:', {
        articles: totalArticles,
        videos: totalVideos,
        books: totalBooks,
        tools: totalTools,
        pots: totalPots,
        accessories: totalAccessories,
        suggestions: totalSuggestions,
        'CONTENT TOTAL (A+V)': totalArticles + totalVideos,
        'PRODUCT TOTAL (B+T+P+Ac+S)': totalBooks + totalTools + totalPots + totalAccessories + totalSuggestions,
        'GRAND TOTAL': totalArticles + totalVideos + totalBooks + totalTools + totalPots + totalAccessories + totalSuggestions
      });

      // Calculate total views from published content only
      const publishedArticles = Array.isArray(articlesData) ? articlesData.filter((item: any) => item.status === 'published') : [];
      const publishedVideos = Array.isArray(videosData) ? videosData.filter((item: any) => item.status === 'published') : [];
      const publishedBooks = Array.isArray(booksData) ? booksData.filter((item: any) => item.status === 'published') : [];
      const publishedTools = Array.isArray(toolsData) ? toolsData.filter((item: any) => item.status === 'published') : [];
      const publishedPots = Array.isArray(potsData) ? potsData.filter((item: any) => item.status === 'published') : [];
      const publishedAccessories = Array.isArray(accessoriesData) ? accessoriesData.filter((item: any) => item.status === 'published') : [];
      const publishedSuggestions = Array.isArray(suggestionsData) ? suggestionsData.filter((item: any) => item.status === 'published') : [];
      
      const totalViews = [
        ...publishedArticles,
        ...publishedVideos,
        ...publishedBooks,
        ...publishedTools,
        ...publishedPots,
        ...publishedAccessories,
        ...publishedSuggestions
      ].reduce((sum, item) => sum + (item.views || 0), 0);

      // Calculate average rating from published content only (rating >= 1)
      const ratedContent = [
        ...publishedArticles,
        ...publishedVideos,
        ...publishedBooks,
        ...publishedSuggestions,
        ...publishedAccessories,
        ...publishedTools,
        ...publishedPots
      ].filter(item => {
        const rating = parseFloat(item.rating);
        return !isNaN(rating) && rating >= 1;
      });
      
      const avgRating = ratedContent.length > 0 
        ? ratedContent.reduce((sum, item) => {
            const rating = parseFloat(item.rating);
            return sum + (isNaN(rating) ? 0 : rating);
          }, 0) / ratedContent.length 
        : 0;

      // Calculate growth percentages from real data
      const totalContent = totalArticles + totalVideos + totalBooks + totalSuggestions + totalTools + totalPots + totalAccessories;
      
      // Calculate real growth based on content creation (simplified calculation)
      // In a real app, you'd compare with previous month/week data
      const monthlyGrowth = totalContent > 0 ? Math.min(25, Math.max(0, (totalContent / 10) * 2)) : 0;
      const weeklyGrowth = totalContent > 0 ? Math.min(15, Math.max(0, (totalContent / 20) * 3)) : 0;
      
      // Calculate visitor growth based on actual visitor count
      const visitorGrowth = visitorStats.totalVisitors > 0 
        ? Math.min(20, Math.max(0, (visitorStats.totalVisitors / 100) * 0.5))
        : 0;

      setStats({
        totalUsers,
        totalVisitors: visitorStats.totalVisitors,
        visitorGrowth,
        totalViews,
        totalArticles,
        totalVideos,
        totalBooks,
        totalSuggestions,
        totalContactMessages,
        monthlyGrowth,
        weeklyGrowth,
        avgRating,
        // Add product counts for charts
        totalTools,
        totalPots,
        totalAccessories
      } as AdminStats);

      // Set activity logs from API

      setPublicActivities(Array.isArray(publicActivitiesData) ? publicActivitiesData : []);
      setSecurityActivities(Array.isArray(securityActivitiesData) ? securityActivitiesData : []);

      // Generate recent activity from real data (legacy - keeping for compatibility)
      const activity: ActivityItem[] = [];
      
      // Add recent articles
      if (Array.isArray(articlesData) && articlesData.length > 0) {
        const recentArticles = articlesData
          .sort((a: any, b: any) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime())
          .slice(0, 2);
        recentArticles.forEach(article => {
          activity.push({
            id: `article-${article.id}`,
            action: `New article published: ${article.title}`,
            user: 'Admin',
            time: getTimeAgo(article.created_at || article.updated_at),
            type: 'content'
          });
        });
      }
      
      // Add recent videos
      if (Array.isArray(videosData) && videosData.length > 0) {
        const recentVideos = videosData
          .sort((a: any, b: any) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime())
          .slice(0, 1);
        recentVideos.forEach(video => {
          activity.push({
            id: `video-${video.id}`,
            action: `Video uploaded: ${video.title}`,
            user: 'Admin',
            time: getTimeAgo(video.created_at || video.updated_at),
            type: 'media'
          });
        });
      }
      
      // Add recent products
      if (Array.isArray(allProductsData) && allProductsData.length > 0) {
        const recentProducts = allProductsData
          .sort((a: any, b: any) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime())
          .slice(0, 2);
        recentProducts.forEach(product => {
          activity.push({
            id: `product-${product.id}`,
            action: `New ${product.category} added: ${product.name}`,
            user: 'Admin',
            time: getTimeAgo(product.created_at || product.updated_at),
            type: 'content'
          });
        });
      }
      
      // Sort by time and take top 5
      const sortedActivity = activity
        .sort((a, b) => {
          const timeA = getTimeInMinutes(a.time);
          const timeB = getTimeInMinutes(b.time);
          return timeA - timeB;
        })
        .slice(0, 5);
      
      setRecentActivity(sortedActivity);

      // Generate top content from real data
      const allContent = [
        ...(Array.isArray(articlesData) ? articlesData.map(transformArticleToContentItem) : []),
        ...(Array.isArray(videosData) ? videosData.map(transformVideoToContentItem) : []),
        ...(Array.isArray(booksData) ? booksData.map(transformBookToContentItem) : []),
        ...(Array.isArray(toolsData) ? toolsData.map(transformToolToContentItem) : []),
        ...(Array.isArray(potsData) ? potsData.map(transformPotToContentItem) : []),
        ...(Array.isArray(accessoriesData) ? accessoriesData.map(transformAccessoryToContentItem) : []),
        ...(Array.isArray(suggestionsData) ? suggestionsData.map(transformSuggestionToContentItem) : [])
      ];
      
      const topContentData = allContent
        .filter(item => (item.views || 0) > 0) // Only show content with views
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          title: item.title,
          views: item.views || 0,
          likes: item.likes || 0,
          type: item.category?.toLowerCase() || 'unknown',
          slug: item.slug,
          link: item.link
        }));
      
      // If no content with views, show most recent content
      if (topContentData.length === 0) {
        const recentContent = allContent
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5)
          .map(item => ({
            id: item.id,
            title: item.title,
            views: item.views || 0,
            likes: item.likes || 0,
            type: item.category?.toLowerCase() || 'unknown',
            slug: item.slug,
            link: item.link
          }));
        setTopContent(recentContent);
      } else {
        setTopContent(topContentData);
      }

    } catch (error) {
      // Don't show error message, just log it
    }
  };

  // Check logout state and refresh token
  useEffect(() => {
    // Force refresh API client token on mount
    const hasLoggedOut = localStorage.getItem('user_logged_out') === 'true';
    if (!hasLoggedOut) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Import apiClient and refresh token
        import('../services/api').then(({ apiClient }) => {
          // apiClient.forceRefreshToken(); // Method doesn't exist
        });
      }
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (user && isAuthenticated) {
      // Double check token before making API calls
      const token = localStorage.getItem('auth_token');
      const hasLoggedOut = localStorage.getItem('user_logged_out') === 'true';
      
      if (!token || hasLoggedOut) {
        return;
      }

      // Add small delay to ensure token is properly set
      setTimeout(() => {
        loadData();
        loadCategories();
        // Also load users separately to ensure they are loaded
        loadUsers();
      }, 100);
    } else if (!isAuthenticated) {
      // User not authenticated - handled by AuthContext
    }
  }, [user, isAuthenticated]);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(userSearchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(userSearchTerm.toLowerCase());
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handler functions

  const handleEdit = (item: ContentItem | null, type: string) => {
    if (item) {
      setCurrentContentType(type);
      setEditingItem(item);
      setActiveTab('content-edit'); // Chuyển sang tab edit thay vì mở modal
    } else {
      // Handle cancel case
      setEditingItem(null);
      setActiveTab(type); // Switch to the specified tab (e.g., 'content-list')
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // Map category to service type
      let serviceType = type.toLowerCase();
      if (type === 'Technique') {
        serviceType = 'articles';
      } else if (type === 'Video') {
        serviceType = 'videos';
      }

      // Delete logic based on type
      switch (serviceType) {
        case 'articles':
          await articlesService.delete(id);
          break;
        case 'videos':
          await videosService.delete(id);
          break;
        case 'books':
          await booksService.delete(id);
          break;
        case 'tools':
          await toolsService.delete(id);
          break;
        case 'pots':
          await potsService.delete(id);
          break;
        case 'accessories':
          await accessoriesService.delete(id);
          break;
        case 'suggestions':
          await suggestionsService.delete(id);
          break;
        default:
          console.error('Unknown content type:', type);
          return;
      }
      
      // Reload data after deletion
      await loadData();
      showToast('Item deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Error deleting item:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to delete item. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async (ids: string[], types: string[]) => {
    try {
      const deletePromises = ids.map((id, index) => {
        const type = types[index];
        let serviceType = type.toLowerCase();
        if (type === 'Technique') serviceType = 'articles';
        else if (type === 'Video') serviceType = 'videos';

        switch (serviceType) {
          case 'articles': return articlesService.delete(id);
          case 'videos': return videosService.delete(id);
          case 'books': return booksService.delete(id);
          case 'tools': return toolsService.delete(id);
          case 'pots': return potsService.delete(id);
          case 'accessories': return accessoriesService.delete(id);
          case 'suggestions': return suggestionsService.delete(id);
          default: return Promise.resolve();
        }
      });

      await Promise.all(deletePromises);
      await loadData();
      showToast(`Successfully deleted ${ids.length} items!`, 'success');
    } catch (error: any) {
      console.error('Error bulk deleting:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to delete some items. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // Bulk status change handler
  const handleBulkStatusChange = async (ids: string[], status: string) => {
    try {
      console.log('handleBulkStatusChange called with:', { ids, status });
      
      const updatePromises = ids.map(id => {
        // Find item in articles, videos, or products
        const item = [...articles, ...videos, ...products].find(i => i.id === id);
        if (!item) {
          console.log('Item not found for id:', id);
          return Promise.resolve();
        }

        const type = item.category;
        let serviceType = type?.toLowerCase();
        if (type === 'Technique') serviceType = 'articles';
        else if (type === 'Video') serviceType = 'videos';
        // For products, use productService directly
        else if (['tool', 'book', 'pot', 'accessory', 'suggestion'].includes(type?.toLowerCase() || '')) {
          console.log('Updating product:', id, 'to status:', status);
          return productService.update(id, { status });
        }

        const updateData = { status };
        console.log('Updating', serviceType, 'item:', id, 'to status:', status);

        switch (serviceType) {
          case 'articles': 
            console.log('Calling articlesService.update for:', id);
            return articlesService.update(id, updateData).catch(error => {
              console.error('Error updating article:', id, error);
              throw error;
            });
          case 'videos': 
            console.log('Calling videosService.update for:', id);
            return videosService.update(id, updateData).catch(error => {
              console.error('Error updating video:', id, error);
              throw error;
            });
          default: 
            console.log('Unknown serviceType:', serviceType, 'for item:', id);
            return Promise.resolve();
        }
      });

      console.log('Executing', updatePromises.length, 'update promises');
      await Promise.all(updatePromises);
      console.log('All updates completed, reloading data');
      await loadData();
      showToast(`Successfully updated ${ids.length} items to ${status}!`, 'success');
    } catch (error: any) {
      console.error('Error bulk updating status:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to update some items. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // Bulk delete handler for products
  const handleProductBulkDelete = async (ids: string[]) => {
    try {
      const deletePromises = ids.map(id => productService.delete(id));
      await Promise.all(deletePromises);
      await loadData();
      showToast(`Successfully deleted ${ids.length} products!`, 'success');
    } catch (error: any) {
      console.error('Error bulk deleting products:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to delete some products. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // Bulk status change handler for products
  const handleProductBulkStatusChange = async (ids: string[], status: string) => {
    try {
      const updatePromises = ids.map(id => productService.update(id, { status }));
      await Promise.all(updatePromises);
      await loadData();
      showToast(`Successfully updated ${ids.length} products to ${status}!`, 'success');
    } catch (error: any) {
      console.error('Error bulk updating products:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to update some products. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // Helper function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Handle view content
  const handleViewContent = (item: ContentItem) => {
    const slug = item.slug || generateSlug(item.title);
    const baseUrl = window.location.origin;
    
    if (item.category?.toLowerCase() === 'technique' || item.category?.toLowerCase() === 'articles') {
      window.open(`${baseUrl}/article/${slug}`, '_blank');
    } else if (item.category?.toLowerCase() === 'video' || item.category?.toLowerCase() === 'videos') {
      window.open(`${baseUrl}/video/${slug}`, '_blank');
    } else {

      showToast('View functionality not implemented for this content type', 'info');
    }
  };

  const handleSave = async (formData: Partial<ContentItem>) => {
    try {
      console.log('AdminDashboard - handleSave called with:', formData);
      // Priority: formData.category > currentContentType from formData > state currentContentType
      const categoryFromForm = formData.category || (formData as any).currentContentType || currentContentType;
      
      console.log('AdminDashboard.handleSave - Input:', {
        formDataCategory: formData.category,
        currentContentTypeFromForm: (formData as any).currentContentType,
        stateCurrentContentType: currentContentType,
        selectedCategory: categoryFromForm,
        editingItem: !!editingItem,
        formData
      });
      
      // Generate slug if not provided
      if (!formData.slug && formData.title) {
        formData.slug = generateSlug(formData.title);
      }
      
      // Normalize category to service type (plural form)
      let serviceType = categoryFromForm;
      
      // Handle all variations of article/technique
      if (categoryFromForm === 'article' || categoryFromForm === 'Technique' || categoryFromForm === 'technique' || categoryFromForm === 'articles') {
        serviceType = 'articles';
      }
      // Handle all variations of video
      else if (categoryFromForm === 'video' || categoryFromForm === 'Video' || categoryFromForm === 'videos') {
        serviceType = 'videos';
      }
      
      console.log('AdminDashboard.handleSave - Normalized serviceType:', serviceType, 'from category:', categoryFromForm);
      
      // Save logic based on currentContentType
      if (editingItem) {
        // Update existing item
        switch (serviceType) {
          case 'articles':
            await articlesService.update(editingItem.id, formData);
            break;
          case 'videos':
            await videosService.update(editingItem.id, formData);
            break;
          case 'books':
            await booksService.update(editingItem.id, formData);
            break;
          case 'tools':
            await toolsService.update(editingItem.id, formData);
            break;
          case 'pots':
            await potsService.update(editingItem.id, formData);
            break;
          case 'accessories':
            await accessoriesService.update(editingItem.id, formData);
            break;
          case 'suggestions':
            await suggestionsService.update(editingItem.id, formData);
            break;
          default:
            console.error('Unknown content type:', currentContentType, '(normalized to:', serviceType, ')');
            return;
        }
      } else {
        // Create new item
        console.log('AdminDashboard.handleSave - Creating new item with serviceType:', serviceType);
        
        switch (serviceType) {
          case 'articles':
            console.log('AdminDashboard.handleSave - Calling articlesService.create with:', formData);
            const articleResult = await articlesService.create(formData);
            console.log('AdminDashboard.handleSave - articlesService.create result:', articleResult);
            if (!articleResult || (articleResult as any).success === false) {
              throw new Error((articleResult as any).message || 'Failed to create article');
            }
            break;
          case 'videos':
            console.log('AdminDashboard.handleSave - Calling videosService.create with:', formData);
            const videoResult = await videosService.create(formData);
            console.log('AdminDashboard.handleSave - videosService.create result:', videoResult);
            if (!videoResult || (videoResult as any).success === false) {
              throw new Error((videoResult as any).message || 'Failed to create video');
            }
            break;
          case 'books':
            await booksService.create(formData);
            break;
          case 'tools':
            await toolsService.create(formData);
            break;
          case 'pots':
            await potsService.create(formData);
            break;
          case 'accessories':
            await accessoriesService.create(formData);
            break;
          case 'suggestions':
            await suggestionsService.create(formData);
            break;
          default:
            console.error('Unknown content type:', currentContentType, '(normalized to:', serviceType, ')');
            return;
        }
      }
      
      // Reset editing state
      setEditingItem(null);
      
      // Reload data
      await loadData();
      
      // Redirect to content-list after successful save
      setActiveTab('content-list');
      
      // Show success message
      showToast(editingItem ? 'Content updated successfully!' : 'Content created successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving content:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save content. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      
      // RE-THROW error so child form can catch it if needed
      throw error;
    }
  };


  const handleUserProfileChange = useCallback((field: string, value: unknown) => {

    setUserProfile(prev => {
      const newProfile = {
        ...prev,
        [field]: value
      };

      return newProfile;
    });
  }, []);

  // Product handlers
  const handleProductCreate = async (productData: any) => {
    try {
      // Determine the service based on category
      const category = productData.category?.toLowerCase();
      let response;
      
      switch (category) {
        case 'tool':
          response = await toolsService.create(productData);
          break;
        case 'pot':
          response = await potsService.create(productData);
          break;
        case 'accessory':
          response = await accessoriesService.create(productData);
          break;
        case 'suggestion':
          response = await suggestionsService.create(productData);
          break;
        case 'book':
          response = await booksService.create(productData);
          break;
        default:
          const error = new Error('Unknown product category: ' + category);
          showToast(error.message, 'error');
          throw error;
      }
      
      // Reload products data
      await loadData();
      showToast('Product created successfully!', 'success');
      
      // Navigate back to list
      setActiveTab('product-list');
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to create product. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      
      // RE-THROW error so child form can catch it if needed
      throw error;
    }
  };

  const handleProductEditClick = async (product: any) => {
    try {
      // Fetch fresh product data from API instead of using cached data
      console.log('Fetching fresh product data for ID:', product.id);
      const response = await productService.getById(product.id);
      console.log('Fresh product data:', response);
      
      // Extract data from response
      const freshProduct = response && typeof response === 'object' && 'data' in response 
        ? (response as any).data 
        : response;
      
      setEditingProduct(freshProduct);
      setActiveTab('product-edit');
    } catch (error: any) {
      console.error('Error fetching product data:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to load product data. Using cached data.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'warning');
      // Fallback to cached data if fetch fails
      setEditingProduct(product);
      setActiveTab('product-edit');
    }
  };

  const handleProductEditCancel = () => {
    setEditingProduct(null);
    setActiveTab('product-list');
  };

  const handleProductEdit = async (updatedProduct: any) => {
    try {
      console.log('AdminDashboard - Updating product:', updatedProduct);
      
      // Use productService directly instead of category-specific services
      const result = await productService.update(updatedProduct.id, updatedProduct);
      console.log('AdminDashboard - Update result:', result);
      
      // Reload products data
      await loadData();
      console.log('AdminDashboard - Data reloaded');
      
      // Reset editing state and go back to list
      setEditingProduct(null);
      setActiveTab('product-list');
      
      showToast('Product updated successfully!', 'success');
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to update product. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      
      // RE-THROW error so child form can catch it if needed
      throw error;
    }
  };

  const handleProductDelete = async (id: string, category?: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      // Find the product to get its category
      const product = products.find(p => p.id === id);
      const productCategory = category || product?.category?.toLowerCase();
      
      switch (productCategory) {
        case 'tool':
          await toolsService.delete(id);
          break;
        case 'pot':
          await potsService.delete(id);
          break;
        case 'accessory':
          await accessoriesService.delete(id);
          break;
        case 'suggestion':
          await suggestionsService.delete(id);
          break;
        case 'book':
          await booksService.delete(id);
          break;
        default:
          console.error('Unknown product category:', productCategory);
          return;
      }
      
      // Reload products data
      await loadData();
      showToast('Product deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to delete product. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  const handleProductView = (product: any) => {
    // Create a detailed view modal or navigate to product detail page
    const productInfo = `
Product Details:
Name: ${product.name || product.title}
Category: ${product.category}
Status: ${product.status}
Description: ${product.description}
Price: ${product.price ? `$${product.price}` : 'Free'}
Rating: ${product.rating || 'N/A'}
Views: ${product.views || 0}
Likes: ${product.likes || 0}
Created: ${product.createdAt}
Updated: ${product.updatedAt}
    `;
    
    showToast(productInfo, 'info');
  };

  const handleSaveUserProfile = useCallback(async () => {
    try {
    // Create payload WITHOUT password field (password should be handled separately)
    const payload: any = {
      name: userProfile.name || '',
      email: userProfile.email || '',
      avatar: userProfile.avatar || null,
      avatar_public_id: userProfile.avatar_public_id || null
    };
    
    // Add other fields if needed
    if (userProfile.phone) payload.phone = userProfile.phone;
    if (userProfile.phone_country_code) payload.phone_country_code = userProfile.phone_country_code;
    if (userProfile.country) payload.country = userProfile.country;
    if (userProfile.address) payload.address = userProfile.address;
    if (userProfile.city) payload.city = userProfile.city;
    if (userProfile.zip_code) payload.zip_code = userProfile.zip_code;
    if (userProfile.role) payload.role = userProfile.role;
    if (userProfile.status) payload.status = userProfile.status;
    
    // Only add password if it's provided and not empty
    if (userProfile.password && userProfile.password.trim() !== '') {
      payload.password = userProfile.password;
    }

      // Debug: Check if avatar data is in payload

      // Update user profile
      const response = await userService.updateProfile(payload);

      showToast('User profile updated successfully!', 'success');
      
      // Update local state with response data
      if (response.success && response.data) {
        setUserProfile(prev => ({
          ...prev,
          ...response.data,
          avatarPreview: response.data.avatar || prev.avatarPreview
        }));
        
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('greengroves_user') || '{}');
        localStorage.setItem('greengroves_user', JSON.stringify({
          ...currentUser,
          ...response.data
        }));
      }
    } catch (error: any) {
      console.error('Error saving user profile:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save user profile. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  }, [userProfile]);

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateAvatarFile(file)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserProfile(prev => ({
          ...prev,
          avatar: file,
          avatarPreview: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveAvatar = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      avatar: null,
      avatarPreview: null
    }));
  }, []);

  const handleEditUser = useCallback((userItem: any | null) => {
    if (!userItem) {
      // Handle cancel case - switch back to user-list
      setActiveTab('user-list');
      setEditingUser(null);
      return;
    }
    
    // Set the user to edit and switch to edit tab
    setEditingUser(userItem);
    setActiveTab('user-edit');
  }, []);

  const handleCreateUser = useCallback(async (userData: any) => {
    try {
      // Clean user data (remove preview fields and confirmPassword)
      const { avatarPreview, confirmPassword, ...cleanData } = userData;
      
      // Create user with JSON data
      await userService.create(cleanData);
      showToast('User created successfully!', 'success');
      
      // Reload data
      await loadData();
      
      // Switch back to user list
      setActiveTab('user-list');
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to create user. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      
      // RE-THROW error so child form can catch it
      throw error;
    }
  }, [loadData]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // Delete user
      await userService.delete(userId);
      showToast('User deleted successfully!', 'success');
      
      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to delete user. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  }, []);

  const handleSaveUserEdit = useCallback(async (userData: any) => {
    try {
      if (!editingUser?.id) {
        showToast('No user selected for editing', 'warning');
        throw new Error('No user selected for editing');
      }

      // Clean user data (remove preview fields and empty password)
      const { avatarPreview, password, ...cleanData } = userData;
      
      // Only include password if it's provided and not empty
      const updateData = password && password.trim() !== '' 
        ? { ...cleanData, password } 
        : cleanData;

      // Update user with JSON data
      await userService.update(editingUser.id, updateData);
      showToast('User updated successfully!', 'success');
      
      // Reload data
      await loadData();
      
      // Switch back to user list
      setActiveTab('user-list');
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to update user. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      
      // RE-THROW error so child form can catch it
      throw error;
    }
  }, [editingUser, loadData]);

  const handleCancelUserEdit = useCallback(() => {
    setEditingUser(null);
    setActiveTab('user-list');
  }, []);

  const loadUsers = async () => {
    try {
      // Check if user has logged out or no token
      const token = localStorage.getItem('auth_token');
      const hasLoggedOut = localStorage.getItem('user_logged_out') === 'true';
      
      if (!token || hasLoggedOut) {

        return;
      }

      const response = await userService.getAll();

      // Handle response structure
      if (response && typeof response === 'object' && 'data' in response) {
        setUsers(response.data as User[]);
      } else if (Array.isArray(response)) {
        setUsers(response as User[]);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  // Error states
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'}`}>
        <Card className="text-center p-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access the admin dashboard.
            </p>
            <a
              href="/login"
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Go to Login
            </a>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin' && user.role !== 'moderator') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'}`}>
        <Card className="text-center p-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Checking Permissions...</h2>
            <p className="text-gray-600">
              Verifying your access rights to the admin dashboard.
            </p>
          </motion.div>
        </Card>
      </div>
    );
  }

  // Show error if loading failed
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'}`}>
        <Card className="text-center p-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Failed</h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => {
                setError(null);
                loadData();
              }}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'}`}>
        <Card className="text-center p-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Dashboard</h2>
            <p className="text-gray-600">
              Please wait while we load your dashboard data...
            </p>
          </motion.div>
        </Card>
      </div>
    );
  }

  const muiTheme = createAdminTheme(isDarkMode);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-emerald-600/8 via-green-500/10 to-teal-600/6' 
              : 'bg-gradient-to-br from-emerald-300/10 via-green-200/15 to-teal-300/10'
          }`}
          animate={{
            x: [-100, 100, -100],
            y: [50, -50, 50],
            scale: [1.2, 0.8, 1.2],
            rotate: [0, 360, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute top-2/3 right-1/4 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-bl from-emerald-600/8 via-green-500/10 to-teal-600/6' 
              : 'bg-gradient-to-bl from-emerald-300/10 via-green-200/15 to-teal-300/10'
          }`}
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1.2, 0.8, 1.2],
            rotate: [0, -360, -720],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Static particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-emerald-400/20' : 'bg-emerald-300/30'
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
          
      {/* Admin Content */}
      <div className="relative z-20 flex flex-col lg:flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <AdminSidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={stats}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            userRole={user?.role || 'admin'}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8">
          {/* Mobile Navigation */}
          <div className="lg:hidden mb-4">
            <MobileAdminNav 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isDarkMode={isDarkMode}
              userRole={user?.role || 'admin'}
            />
          </div>
          
          {/* Content Container with responsive spacing */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 max-w-full overflow-hidden">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Some data could not be loaded from the server. The dashboard will show available data.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Loading dashboard data...
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please wait while we fetch the latest data.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header with MUI */}
          <Paper 
            elevation={2}
            sx={{ 
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden',
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#1f2937',
                      mb: 1
                    }}
                  >
                    {activeTab === 'overview' ? 'Dashboard Overview' : 
                     activeTab === 'content-list' ? 'All Content List' :
                     activeTab === 'content-details' ? 'Content Details' :
                     activeTab === 'content-create' ? 'Create Content' :
                     activeTab === 'content-edit' ? 'Edit Content' :
                     activeTab === 'product-list' ? 'All Products List' :
                     activeTab === 'product-details' ? 'Product Details' :
                     activeTab === 'product-create' ? 'Create Product' :
                     activeTab === 'product-edit' ? 'Edit Product' :
                     activeTab === 'articles' ? 'Articles Management' :
                     activeTab === 'techniques' ? 'Techniques Management' :
                     activeTab === 'books' ? 'Books Management' :
                     activeTab === 'videos' ? 'Videos Management' :
                     activeTab === 'suggestions' ? 'Suggestions Management' :
                     activeTab === 'tools' ? 'Tools Management' :
                     activeTab === 'pots' ? 'Pots Management' :
                     activeTab === 'accessories' ? 'Accessories Management' :
                     activeTab === 'users' ? 'Users Management' :
                     activeTab === 'user-profile' ? 'User Profile' :
                     activeTab === 'user-list' ? 'All Users List' :
                     activeTab === 'user-create' ? 'Create User' :
                     'Admin Panel'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  >
                    Welcome back, <Chip 
                      label={user.name} 
                      size="small"
                      sx={{ 
                        bgcolor: '#10b981',
                        color: 'white',
                        fontWeight: 600,
                        ml: 0.5
                      }}
                    />
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {/* Dark Mode Toggle */}
                  <DarkModeToggle />

                  {/* MUI Avatar with Dropdown */}
                  <IconButton
                    onClick={(e) => {
                      setAvatarDropdownOpen(true);
                      // Store the anchor element for MUI Menu
                      (e.currentTarget as any).avatarAnchor = e.currentTarget;
                    }}
                    sx={{
                      p: 0,
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      transition: 'transform 0.2s',
                    }}
                  >
                    <Avatar
                      src={user?.avatar || userProfile.avatar || undefined}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#10b981',
                        background: user?.avatar || userProfile.avatar ? 'none' : 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
                        fontWeight: 700,
                      }}
                    >
                      {!user?.avatar && !userProfile.avatar && (user?.name?.charAt(0).toUpperCase() || 'A')}
                    </Avatar>
                  </IconButton>

                  {/* MUI Menu for Avatar Dropdown */}
                  <MuiMenu
                    anchorEl={document.querySelector('.MuiIconButton-root:last-of-type')}
                    open={avatarDropdownOpen}
                    onClose={() => setAvatarDropdownOpen(false)}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>
                      <Typography variant="body2" fontWeight={600}>
                        👋 Hey, {user?.name || 'Admin'}
                      </Typography>
                    </Box>
                    <MenuItem 
                      onClick={() => {
                        setActiveTab('user-profile');
                        setAvatarDropdownOpen(false);
                      }}
                      sx={{ py: 1.5 }}
                    >
                      Profile Settings
                    </MenuItem>
                    <MenuItem 
                      onClick={async () => {
                        setAvatarDropdownOpen(false);
                        await logout();
                        window.location.href = '/';
                      }}
                      sx={{ 
                        py: 1.5,
                        color: '#dc2626',
                        '&:hover': {
                          bgcolor: '#fef2f2',
                        }
                      }}
                    >
                      Log Out
                    </MenuItem>
                  </MuiMenu>
                </Box>
              </Box>
            </Box>
          </Paper>

      {/* Quick Stats */}
      {activeTab === 'overview' && (
        <StatisticsSection 
          stats={stats} 
          isDarkMode={isDarkMode} 
          campaignStats={campaignStats}
          onCardClick={user?.role === 'admin' ? () => setActiveTab('campaign-settings') : undefined}
        />
      )}

          {/* Charts and Analytics */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DashboardCharts stats={stats} onNavigate={handleSectionChange} />
            </motion.div>
          )}

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Recent Activity */}
          <RecentActivitySection 
            publicActivities={publicActivities} 
            securityActivities={securityActivities}
            isDarkMode={isDarkMode} 
          />

          {/* Top Content */}
          <TopContentSection 
            topContent={topContent} 
            isDarkMode={isDarkMode}
            onItemClick={handleTopContentClick}
          />
        </div>
      )}

      {/* User Management - Profile for all, List/Create for admin only */}
      {activeTab === 'user-profile' && (
        <UserManagementSection
          activeTab={activeTab}
          userProfile={userProfile}
          filteredUsers={filteredUsers}
          userSearchTerm={userSearchTerm}
          onUserProfileChange={handleUserProfileChange}
          onSaveUserProfile={handleSaveUserProfile}
          onLoadUsers={loadUsers}
          onUserSearchTermChange={setUserSearchTerm}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onCreateUser={handleCreateUser}
          currentUserRole={user?.role}
        />
      )}
      
      {/* User Management - Admin only sections */}
      {(activeTab === 'users' || activeTab === 'user-list' || activeTab === 'user-create') && user?.role === 'admin' && (
        <UserManagementSection
          activeTab={activeTab}
          userProfile={userProfile}
          filteredUsers={filteredUsers}
          userSearchTerm={userSearchTerm}
          onUserProfileChange={handleUserProfileChange}
          onSaveUserProfile={handleSaveUserProfile}
          onLoadUsers={loadUsers}
          onUserSearchTermChange={setUserSearchTerm}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onCreateUser={handleCreateUser}
          currentUserRole={user?.role}
          currentUserId={user?.id}
        />
      )}

      {/* User Edit Form */}
      {activeTab === 'user-edit' && user?.role === 'admin' && editingUser && (
        <UserEditForm
          userData={editingUser}
          onSave={handleSaveUserEdit}
          onCancel={handleCancelUserEdit}
          currentUserRole={user?.role}
          currentUserId={user?.id}
        />
      )}

      {/* Tag Management */}
      {activeTab === 'tags' && (
        <TagManagement isDarkMode={isDarkMode} />
      )}

      {/* Content Management - Only Techniques and Videos */}
      {['articles', 'videos', 'content-list', 'content-create', 'content-edit'].includes(activeTab) && (
        <ContentManagementSection
          activeTab={activeTab}
          contentData={[
            ...articles,
            ...videos
          ]}
          categories={{ 'Technique': [], 'Video': [] }}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          isDarkMode={isDarkMode}
          editingItem={editingItem}
          currentContentType={currentContentType || 'Technique'} // Default to Technique if undefined
          onSearchTermChange={setSearchTerm}
          onSelectedCategoryChange={setSelectedCategory}
          onSortByChange={setSortBy}
          onEdit={(item, type) => handleEdit(item, type || activeTab)}
          onDelete={handleDelete}
          onView={handleViewContent}
          onCreate={handleSave}
          onCancelCreate={() => setActiveTab('content-list')}
          onCancelEdit={() => {
            setEditingItem(null);
            setActiveTab('content-list');
          }}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          showConfirmDialog={showConfirmDialog}
        />
      )}

      {/* Product Management - Tools/Pots/Accessories/Suggestions/Books */}
      {['product-list', 'product-create', 'product-edit', 'tools', 'pots', 'accessories', 'books', 'suggestions'].includes(activeTab) && (
        <ProductManagement
          activeTab={activeTab}
          isDarkMode={isDarkMode}
          products={products}
          searchTerm={productSearchTerm}
          setSearchTerm={setProductSearchTerm}
          selectedCategory={productSelectedCategory}
          setSelectedCategory={setProductSelectedCategory}
          sortBy={productSortBy}
          setSortBy={setProductSortBy}
          onEdit={handleProductEdit}
          onDelete={handleProductDelete}
          onView={handleProductView}
          onCreate={handleProductCreate}
          categories={['tool', 'book', 'pot', 'accessory', 'suggestion']}
          onEditClick={handleProductEditClick}
          editingProduct={editingProduct}
          onEditCancel={handleProductEditCancel}
          onCancelCreate={() => setActiveTab('product-list')}
          onBulkDelete={handleProductBulkDelete}
          onBulkStatusChange={handleProductBulkStatusChange}
          showConfirmDialog={showConfirmDialog}
        />
      )}

      {/* Site Settings Pages */}
      {activeTab === 'hero-section' && <AdminHeroSection />}
      {activeTab === 'staff-management' && <AdminStaffManagement />}
      {activeTab === 'map-settings' && <AdminMapSettings />}
      {activeTab === 'contact-settings' && user?.role === 'admin' && <AdminContactSettings />}
      {activeTab === 'contact-messages' && <AdminContactMessages />}
      {activeTab === 'campaign-settings' && user?.role === 'admin' && <AdminCampaignSettings />}
      {activeTab === 'security-settings' && user?.role === 'admin' && <AdminSecuritySettings />}

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ContentForm
                type={currentContentType}
                item={editingItem}
                categories={categories[currentContentType as keyof typeof categories] || []}
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
        autoHideDuration={4000}
        position={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={handleConfirmDialogConfirm}
        onCancel={handleConfirmDialogClose}
        isDarkMode={isDarkMode}
      />
          </div>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default AdminDashboard;
