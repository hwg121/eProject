import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Star, 
  Plus, Search, Edit, Trash2, Eye,
  TrendingUp, Activity,
  FileText, DollarSign, Heart,
  MessageSquare,
  Shield, AlertTriangle,
  ChevronRight, Package, Upload,
  ChevronDown
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/UI/Card';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardCharts from '../components/admin/DashboardCharts';

// Import new components
import StatisticsSection from '../components/admin/StatisticsSection';
import RecentActivitySection from '../components/admin/RecentActivitySection';
import TopContentSection from '../components/admin/TopContentSection';
import UserManagementSection from '../components/admin/UserManagementSection';
import MessagesSection from '../components/admin/MessagesSection';
import ContentManagementSection from '../components/admin/ContentManagementSection';
import ContentForm from '../components/admin/ContentForm';

// Import types and utils
import { 
  ContentItem, 
  ContactMessage, 
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
  transformEssentialToContentItem,
  transformPotToContentItem,
  transformAccessoryToContentItem,
  transformSuggestionToContentItem,
  transformAboutUsToContentItem,
  formatTimeAgo,
  generateSlug,
  generateProductSlug,
  sortContent,
  validateForm,
  validateProductForm,
  validateAvatarFile
} from '../utils/adminUtils';

import { publicService, contactService, userService, productService, articlesService, videosService, booksService, toolsService, essentialsService, potsService, accessoriesService, suggestionsService, aboutUsService } from '../services/api.ts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [propertiesExpanded, setPropertiesExpanded] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Only for admin to change user passwords
    phone: '',
    state: '',
    address: '',
    city: '',
    zip_code: '',
    company: '',
    role: user?.role || 'admin',
    status: 'active',
    is_banned: false,
    is_email_verified: true,
    avatar: null as File | null,
    avatarPreview: null as string | null
  });

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSortBy, setUserSortBy] = useState('name-asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Content state
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [books, setBooks] = useState<ContentItem[]>([]);
  const [tools, setTools] = useState<ContentItem[]>([]);
  const [essentials, setEssentials] = useState<ContentItem[]>([]);
  const [pots, setPots] = useState<ContentItem[]>([]);
  const [accessories, setAccessories] = useState<ContentItem[]>([]);
  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);
  const [aboutUs, setAboutUs] = useState<ContentItem[]>([]);
  const [products, setProducts] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [currentContentType, setCurrentContentType] = useState('');

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  // Stats state
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalViews: 0,
    totalArticles: 0,
    totalVideos: 0,
    totalBooks: 0,
    totalSuggestions: 0,
    totalAboutUs: 0,
    totalContactMessages: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    avgRating: 0
  });

  // Recent activity and top content
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [topContent, setTopContent] = useState<TopContentItem[]>([]);

  // Categories
  const [categories, setCategories] = useState<{[key: string]: string[]}>({
    articles: [],
    techniques: [],
    books: [],
    suggestions: [],
    videos: [],
    tools: [],
    essentials: [],
    pots: [],
    accessories: [],
    'about-us': []
  });

  // Product form state
  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    slug: '',
    link: '',
    brand: '',
    material: '',
    size: '',
    color: '',
    isWaterproof: false,
    isDurable: false,
    publish: false,
    cover: null as File | null
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

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await publicService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load data with fallback
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const loadDataWithFallback = async (serviceCall: () => Promise<any>, fallback: any[] = []) => {
        try {
          const response = await serviceCall();
          return response.success ? response.data : fallback;
        } catch (error) {
          console.error('Error loading data:', error);
          return fallback;
        }
      };

      // Load all content data
      const [articlesData, videosData, booksData, toolsData, essentialsData, potsData, accessoriesData, suggestionsData, aboutUsData, contactMessagesData, usersData] = await Promise.all([
        loadDataWithFallback(() => articlesService.getAll()),
        loadDataWithFallback(() => videosService.getAll()),
        loadDataWithFallback(() => booksService.getAll()),
        loadDataWithFallback(() => toolsService.getAll()),
        loadDataWithFallback(() => essentialsService.getAll()),
        loadDataWithFallback(() => potsService.getAll()),
        loadDataWithFallback(() => accessoriesService.getAll()),
        loadDataWithFallback(() => suggestionsService.getAll()),
        loadDataWithFallback(() => aboutUsService.getAll()),
        loadDataWithFallback(() => contactService.getAll()),
        loadDataWithFallback(() => userService.getAll())
      ]);

      // Transform data
      setArticles(articlesData.map(transformArticleToContentItem));
      setVideos(videosData.map(transformVideoToContentItem));
      setBooks(booksData.map(transformBookToContentItem));
      setTools(toolsData.map(transformToolToContentItem));
      setEssentials(essentialsData.map(transformEssentialToContentItem));
      setPots(potsData.map(transformPotToContentItem));
      setAccessories(accessoriesData.map(transformAccessoryToContentItem));
      setSuggestions(suggestionsData.map(transformSuggestionToContentItem));
      setAboutUs(aboutUsData.map(transformAboutUsToContentItem));
      setContactMessages(contactMessagesData);
      setUsers(usersData);

      // Calculate stats
      const totalArticles = articlesData.length;
      const totalVideos = videosData.length;
      const totalBooks = booksData.length;
      const totalSuggestions = suggestionsData.length;
      const totalAboutUs = aboutUsData.length;
      const totalContactMessages = contactMessagesData.length;
      const totalUsers = usersData.length;

      const totalViews = [...articlesData, ...videosData, ...booksData, ...toolsData, ...essentialsData, ...potsData, ...accessoriesData, ...suggestionsData, ...aboutUsData]
        .reduce((sum, item) => sum + (item.views || 0), 0);

      const avgRating = [...booksData, ...suggestionsData, ...accessoriesData]
        .reduce((sum, item) => sum + (item.rating || 0), 0) / 
        [...booksData, ...suggestionsData, ...accessoriesData].length || 0;

      setStats({
        totalUsers,
        totalViews,
        totalArticles,
        totalVideos,
        totalBooks,
        totalSuggestions,
        totalAboutUs,
        totalContactMessages,
        monthlyGrowth: 12.5,
        weeklyGrowth: 8.3,
        avgRating: avgRating || 4.5
      });

      // Generate recent activity
      const activity: ActivityItem[] = [
        { id: '1', action: 'New article published', user: 'Admin', time: '2 hours ago', type: 'content' },
        { id: '2', action: 'User registered', user: 'John Doe', time: '4 hours ago', type: 'user' },
        { id: '3', action: 'Video uploaded', user: 'Admin', time: '6 hours ago', type: 'media' },
        { id: '4', action: 'Comment received', user: 'Jane Smith', time: '8 hours ago', type: 'content' },
        { id: '5', action: 'Book added to library', user: 'Admin', time: '1 day ago', type: 'content' }
      ];
      setRecentActivity(activity);

      // Generate top content
      const allContent = [
        ...articlesData.map(transformArticleToContentItem),
        ...videosData.map(transformVideoToContentItem),
        ...booksData.map(transformBookToContentItem)
      ];
      const topContentData = allContent
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          title: item.title,
          views: item.views || 0,
          likes: item.likes || 0,
          type: item.category.toLowerCase()
        }));
      setTopContent(topContentData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load some data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handler functions
  const handleCreate = (type: string) => {
    setCurrentContentType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ContentItem, type: string) => {
    setCurrentContentType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // Delete logic here based on type
      // Reload data after deletion
      await loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSave = async (formData: Partial<ContentItem>) => {
    try {
      // Save logic here based on currentContentType
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleMessageStatusChange = async (messageId: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      // Update message status logic here
      await loadData();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      // Delete message logic here
      await loadData();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleUserProfileChange = (field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveUserProfile = async () => {
    try {
      // Save user profile logic here
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleRemoveAvatar = () => {
    setUserProfile(prev => ({
      ...prev,
      avatar: null,
      avatarPreview: null
    }));
  };

  const handleEditUser = (userItem: User) => {
    setUserProfile({
      id: userItem.id,
      name: userItem.name,
      email: userItem.email,
      password: '',
      phone: '',
      state: '',
      address: '',
      city: '',
      zip_code: '',
      company: '',
      role: userItem.role,
      status: userItem.status,
      is_banned: userItem.status === 'banned',
      is_email_verified: true,
      avatar: null,
      avatarPreview: null
    });
    setActiveTab('user-profile');
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // Delete user logic here
      await loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
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

  if (loading) {
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Dashboard</h2>
            <p className="text-gray-600">
              Please wait while we load your dashboard data...
            </p>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
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
      <div className="relative z-20 flex min-h-screen">
        <AdminSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={user?.role || 'admin'}
        />
        <div className="flex-1 p-6">
          {/* Mobile Navigation */}
          <div className={`lg:hidden ${isDarkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm`}>
            <div className="flex items-center justify-between p-4">
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Admin Panel
              </h1>
              <div className="flex items-center space-x-2">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="overview">Overview</option>
                  <option value="articles">Articles</option>
                  <option value="techniques">Techniques</option>
                  <option value="books">Books</option>
                  <option value="videos">Videos</option>
                  <option value="suggestions">Suggestions</option>
                  <option value="tools">Tools</option>
                  <option value="essentials">Essentials</option>
                  <option value="pots">Pots</option>
                  <option value="accessories">Accessories</option>
                  <option value="users">Users</option>
                  <option value="messages">Messages</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-8">
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

          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
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
                   activeTab === 'essentials' ? 'Essentials Management' :
                   activeTab === 'pots' ? 'Pots Management' :
                   activeTab === 'accessories' ? 'Accessories Management' :
                   activeTab === 'users' ? 'Users Management' :
                   activeTab === 'user-profile' ? 'User Profile' :
                   activeTab === 'user-list' ? 'All Users List' :
                   activeTab === 'user-create' ? 'Create User' :
                   activeTab === 'messages' ? 'Messages Management' :
                   'Admin Panel'}
                </h1>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back, <span className="font-semibold text-emerald-500">{user.name}</span>!
                </p>
              </div>
             {/* Header with Search and Avatar */}
             <div className={`flex items-center space-x-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg mt-4`}>
                 {/* Search Bar */}
                 <div className="flex-1 relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                   </div>
                   <input
                     type="text"
                     placeholder="Search..."
                     className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                       isDarkMode 
                         ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                         : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                     }`}
                   />
                 </div>

                 {/* Avatar Dropdown */}
                 <div className="relative avatar-dropdown">
                     <button
                       onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                       className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     >
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                         {user?.name?.charAt(0).toUpperCase() || 'A'}
                       </div>
                     </button>

                     {/* Dropdown Menu */}
                     {avatarDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                         <div className="py-2">
                           {/* Greeting */}
                           <div className="px-4 py-2 border-b border-gray-100">
                             <p className="text-sm font-medium text-gray-900">
                               👋 Hey, {user?.name || 'Admin'}
                             </p>
                           </div>
                           
                           {/* Menu Items */}
                           <button 
                             onClick={() => {
                               setActiveTab('user-profile');
                               setAvatarDropdownOpen(false);
                             }}
                             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                           >
                             Profile Settings
                           </button>
                           
                           <button 
                             onClick={() => {
                               // Handle logout - redirect to home page
                               setAvatarDropdownOpen(false);
                               window.location.href = '/';
                             }}
                             className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                           >
                             Log Out
                           </button>
                         </div>
                       </div>
                     )}
                 </div>
               </div>
          </div>
        </motion.div>

      {/* Quick Stats */}
      {activeTab === 'overview' && (
        <StatisticsSection stats={stats} isDarkMode={isDarkMode} />
      )}

          {/* Charts and Analytics */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DashboardCharts stats={stats} />
            </motion.div>
          )}

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <RecentActivitySection 
            recentActivity={recentActivity} 
            isDarkMode={isDarkMode} 
          />

          {/* Top Content */}
          <TopContentSection 
            topContent={topContent} 
            isDarkMode={isDarkMode} 
          />
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <UserManagementSection
          activeTab={activeTab}
          user={user}
          userProfile={userProfile}
          users={users}
          userSearchTerm={userSearchTerm}
          userStatusFilter={userStatusFilter}
          userRoleFilter={userRoleFilter}
          userSortBy={userSortBy}
          selectedUsers={selectedUsers}
          filteredUsers={filteredUsers}
          isDarkMode={isDarkMode}
          onUserProfileChange={handleUserProfileChange}
          onSaveUserProfile={handleSaveUserProfile}
          onAvatarUpload={handleAvatarUpload}
          onRemoveAvatar={handleRemoveAvatar}
          onLoadUsers={loadUsers}
          onUserStatusFilterChange={setUserStatusFilter}
          onUserRoleFilterChange={setUserRoleFilter}
          onUserSortByChange={setUserSortBy}
          onUserSearchTermChange={setUserSearchTerm}
          onSelectedUsersChange={setSelectedUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* User Profile */}
      {activeTab === 'user-profile' && (
        <UserManagementSection
          activeTab={activeTab}
          user={user}
          userProfile={userProfile}
          users={users}
          userSearchTerm={userSearchTerm}
          userStatusFilter={userStatusFilter}
          userRoleFilter={userRoleFilter}
          userSortBy={userSortBy}
          selectedUsers={selectedUsers}
          filteredUsers={filteredUsers}
          isDarkMode={isDarkMode}
          onUserProfileChange={handleUserProfileChange}
          onSaveUserProfile={handleSaveUserProfile}
          onAvatarUpload={handleAvatarUpload}
          onRemoveAvatar={handleRemoveAvatar}
          onLoadUsers={loadUsers}
          onUserStatusFilterChange={setUserStatusFilter}
          onUserRoleFilterChange={setUserRoleFilter}
          onUserSortByChange={setUserSortBy}
          onUserSearchTermChange={setUserSearchTerm}
          onSelectedUsersChange={setSelectedUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* User List */}
      {activeTab === 'user-list' && (
        <UserManagementSection
          activeTab={activeTab}
          user={user}
          userProfile={userProfile}
          users={users}
          userSearchTerm={userSearchTerm}
          userStatusFilter={userStatusFilter}
          userRoleFilter={userRoleFilter}
          userSortBy={userSortBy}
          selectedUsers={selectedUsers}
          filteredUsers={filteredUsers}
          isDarkMode={isDarkMode}
          onUserProfileChange={handleUserProfileChange}
          onSaveUserProfile={handleSaveUserProfile}
          onAvatarUpload={handleAvatarUpload}
          onRemoveAvatar={handleRemoveAvatar}
          onLoadUsers={loadUsers}
          onUserStatusFilterChange={setUserStatusFilter}
          onUserRoleFilterChange={setUserRoleFilter}
          onUserSortByChange={setUserSortBy}
          onUserSearchTermChange={setUserSearchTerm}
          onSelectedUsersChange={setSelectedUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* Messages Management */}
      {activeTab === 'messages' && (
        <MessagesSection
          contactMessages={contactMessages}
          isDarkMode={isDarkMode}
          onMessageStatusChange={handleMessageStatusChange}
          onDeleteMessage={handleDeleteMessage}
        />
      )}

      {/* Content Management */}
      {['articles', 'videos', 'books', 'tools', 'essentials', 'pots', 'accessories', 'suggestions', 'content-list', 'content-create'].includes(activeTab) && (
        <ContentManagementSection
          activeTab={activeTab}
          contentData={[
            ...articles,
            ...videos,
            ...books,
            ...tools,
            ...essentials,
            ...pots,
            ...accessories,
            ...suggestions
          ]}
          categories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          isModalOpen={isModalOpen}
          currentContentType={currentContentType}
          editingItem={editingItem}
          detailsExpanded={detailsExpanded}
          propertiesExpanded={propertiesExpanded}
          isDarkMode={isDarkMode}
          onSearchTermChange={setSearchTerm}
          onSelectedCategoryChange={setSelectedCategory}
          onSortByChange={setSortBy}
          onCreateClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onModalClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDetailsExpandedChange={setDetailsExpanded}
          onPropertiesExpandedChange={setPropertiesExpanded}
        />
      )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
