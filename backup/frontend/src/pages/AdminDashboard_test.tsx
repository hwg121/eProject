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
import ImageUpload from '../components/ImageUpload.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';
import Card from '../components/UI/Card.tsx';
import AdminSidebar from '../components/admin/AdminSidebar.tsx';
import DashboardCharts from '../components/admin/DashboardCharts.tsx';
import { publicService, contactService, userService, productService, articlesService, videosService, booksService, toolsService, essentialsService, potsService, accessoriesService, suggestionsService, aboutUsService } from '../services/api.ts';

interface ContentItem {
  id: string;
  title: string;
  author?: string;
  instructor?: string;
  category: string;
  status: 'published' | 'draft';
  views?: number;
  likes?: number;
  rating?: number;
  link?: string;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  isWaterproof?: boolean;
  isDurable?: boolean;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  type?: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
  buyLink?: string;
  borrowLink?: string;
  slug?: string;
  cover?: string;
  content?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  embedCode?: string;
  duration?: string;
  isbn?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  type: string;
}

interface TopContentItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  type: string;
}

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
    role: 'admin',
    status: 'active',
    avatar: null as File | null,
    avatarPreview: null as string | null,
    is_email_verified: true,
    is_banned: false
  });

  // User list states - will be loaded from backend
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userSortBy, setUserSortBy] = useState('name-asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    cover: null as File | null,
    publish: true,
    category: '',
    tags: '',
    author: '',
    slug: '',
    link: ''
  });

  // Edit state
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    content: '',
    cover: null as File | null,
    publish: true,
    category: '',
    tags: '',
    author: '',
    slug: ''
  });
  const [editCoverPreview, setEditCoverPreview] = useState<string>('');
  const [editDetailsExpanded, setEditDetailsExpanded] = useState(true);
  const [editPropertiesExpanded, setEditPropertiesExpanded] = useState(true);

  // Product form state
  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    content: '',
    cover: null as File | null,
    publish: true,
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
    isDurable: false
  });
  const [productCoverPreview, setProductCoverPreview] = useState<string>('');

  // Rich text editor state
  const [selectedFormat, setSelectedFormat] = useState('Paragraph');
  const [editorHistory, setEditorHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  
  // Cover image state
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [currentContentType, setCurrentContentType] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.avatar-dropdown')) {
          setAvatarDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [avatarDropdownOpen]);

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Product state
  const [products, setProducts] = useState<ContentItem[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [productSortBy, setProductSortBy] = useState('latest');
  const [editingProduct, setEditingProduct] = useState<ContentItem | null>(null);
  const [productDetailsExpanded, setProductDetailsExpanded] = useState(false);
  const [productPropertiesExpanded, setProductPropertiesExpanded] = useState(false);

  // Real data from database
  const [stats, setStats] = useState({
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
    avgRating: 0,
    totalRevenue: 0,
    activeUsers: 0,
    conversionRate: 0
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [topContent, setTopContent] = useState<TopContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real content data from database
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [techniques, setTechniques] = useState<ContentItem[]>([]);
  const [books, setBooks] = useState<ContentItem[]>([]);
  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);
  const [tools, setTools] = useState<ContentItem[]>([]);
  const [essentials, setEssentials] = useState<ContentItem[]>([]);
  const [pots, setPots] = useState<ContentItem[]>([]);
  const [accessories, setAccessories] = useState<ContentItem[]>([]);
  const [aboutUs, setAboutUs] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);

  // Load users from backend - will be called in main loadData function

  // Load categories from backend
  const loadCategories = async () => {
    try {
      const categoriesData = await publicService.getCategories?.() || [];

      if (Array.isArray(categoriesData)) {
        const categoriesMap: {[key: string]: string[]} = {
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
        };

        // Map categories by type
        categoriesData.forEach((category: any) => {
          const type = category.type || 'articles';
          if (categoriesMap[type]) {
            categoriesMap[type].push(category.name);
          }
        });

        setCategories(categoriesMap);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Keep empty categories if API fails
    }
  };

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all content data with individual error handling
        const loadDataWithFallback = async (serviceCall: () => Promise<any>, fallback: any[] = []) => {
          try {
            const data = await serviceCall();
            return Array.isArray(data) ? data : fallback;
          } catch (error) {
            console.error('Error loading data:', error);
            return fallback;
          }
        };

        const [articlesData, videosData, booksData, toolsData, essentialsData, potsData, accessoriesData, suggestionsData, aboutUsData, contactMessagesData, usersData, categoriesData] = await Promise.all([
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
          loadDataWithFallback(() => userService.getAll()),
          loadDataWithFallback(() => publicService.getCategories?.() || [])
        ]);

        // Debug logging

        // Ensure data is arrays and transform
        const safeArticles = Array.isArray(articlesData) ? articlesData : [];
        const safeVideos = Array.isArray(videosData) ? videosData : [];
        const safeBooks = Array.isArray(booksData) ? booksData : [];
        const safeTools = Array.isArray(toolsData) ? toolsData : [];
        const safeEssentials = Array.isArray(essentialsData) ? essentialsData : [];
        const safePots = Array.isArray(potsData) ? potsData : [];
        const safeAccessories = Array.isArray(accessoriesData) ? accessoriesData : [];
        const safeSuggestions = Array.isArray(suggestionsData) ? suggestionsData : [];
        const safeAboutUs = Array.isArray(aboutUsData) ? aboutUsData : [];

        // Transform and set data
        setTechniques(safeArticles.map(transformArticleToContentItem));
        setVideos(safeVideos.map(transformVideoToContentItem));
        setBooks(safeBooks.map(transformBookToContentItem));
        setTools(safeTools.map(transformToolToContentItem));
        setEssentials(safeEssentials.map(transformEssentialToContentItem));
        setPots(safePots.map(transformPotToContentItem));
        setAccessories(safeAccessories.map(transformAccessoryToContentItem));
        setSuggestions(safeSuggestions.map(transformSuggestionToContentItem));
        setAboutUs(safeAboutUs.map(transformAboutUsToContentItem));
        setContactMessages(Array.isArray(contactMessagesData) ? contactMessagesData as ContactMessage[] : []);
        setUsers(Array.isArray(usersData) ? usersData : []);

        // Process categories data
        if (Array.isArray(categoriesData)) {
          const categoriesMap: {[key: string]: string[]} = {
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
          };

          // Map categories by type
          categoriesData.forEach((category: any) => {
            const type = category.type || 'articles';
            if (categoriesMap[type]) {
              categoriesMap[type].push(category.name);
            }
          });

          setCategories(categoriesMap);
        }

        // Load products (combine tools, essentials, pots, accessories)
        const allProducts = [
          ...safeTools.map(transformToolToContentItem),
          ...safeEssentials.map(transformEssentialToContentItem),
          ...safePots.map(transformPotToContentItem),
          ...safeAccessories.map(transformAccessoryToContentItem)
        ];
        setProducts(allProducts);

        // Calculate real stats from backend data
        const totalArticles = safeArticles.length;
        const totalVideos = safeVideos.length;
        const totalBooks = safeBooks.length;
        const totalSuggestions = safeSuggestions.length;
        const totalAboutUs = safeAboutUs.length;
        const totalContactMessages = contactMessages.length;
        const totalUsers = Array.isArray(usersData) ? usersData.length : 0;

          // Calculate total views from real data
          const totalViews = [
          ...safeArticles.map((a: any) => a.views || 0),
          ...safeVideos.map((v: any) => v.views || 0),
          ...safeBooks.map((b: any) => b.views || 0),
          ...safeSuggestions.map((s: any) => s.views || 0),
          ...safeAboutUs.map((a: any) => a.views || 0)
          ].reduce((sum, views) => sum + views, 0);

          // Calculate average rating from real data
          const allRatings = [
          ...safeArticles.map((a: any) => a.rating || 0),
          ...safeVideos.map((v: any) => v.rating || 0),
          ...safeBooks.map((b: any) => b.rating || 0),
          ...safeSuggestions.map((s: any) => s.rating || 0),
          ...safeAboutUs.map((a: any) => a.rating || 0)
        ].filter(rating => rating > 0);
        
        const avgRating = allRatings.length > 0 ? 
          allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length : 0;

        // Calculate growth percentages based on real data (set to 0 for now as we don't have historical data)
        const monthlyGrowth = 0;
        const weeklyGrowth = 0;

        // Use real user count from backend
        const totalUsersCount = Array.isArray(usersData) ? usersData.length : 0;

        setStats({
          totalUsers: totalUsersCount,
          totalViews,
          totalArticles,
          totalVideos,
          totalBooks,
          totalSuggestions,
          totalAboutUs,
          totalContactMessages,
          monthlyGrowth,
          weeklyGrowth,
          avgRating: Math.round(avgRating * 10) / 10,
          totalRevenue: 0, // No sales data available
          activeUsers: totalUsersCount, // All users are considered active
          conversionRate: 0 // No conversion data available
        });

        // Generate recent activity from real backend data
        const recentItems: ActivityItem[] = [
          ...safeArticles.slice(0, 2).map((item: any) => ({
            id: `article-${item.id}`,
            action: `Published article: ${item.title}`,
            user: item.author?.name || 'Admin',
            time: formatTimeAgo(item.created_at || item.createdAt),
            type: 'content'
          })),
          ...safeVideos.slice(0, 2).map((item: any) => ({
            id: `video-${item.id}`,
            action: `Uploaded video: ${item.title}`,
            user: item.instructor || 'Admin',
            time: formatTimeAgo(item.created_at || item.createdAt),
            type: 'media'
          })),
          ...safeBooks.slice(0, 1).map((item: any) => ({
            id: `book-${item.id}`,
            action: `Added book: ${item.title}`,
            user: item.author || 'Admin',
            time: formatTimeAgo(item.created_at || item.createdAt),
            type: 'content'
          })),
          ...(Array.isArray(usersData) ? usersData : []).slice(0, 1).map((item: any) => ({
            id: `user-${item.id}`,
            action: `New user registered: ${item.name}`,
            user: item.name,
            time: formatTimeAgo(item.created_at || item.createdAt),
            type: 'user'
          })),
          ...contactMessages.slice(0, 1).map((item: ContactMessage) => ({
            id: `contact-${item.id}`,
            action: `New message: ${item.subject}`,
            user: item.name,
            time: formatTimeAgo(item.createdAt),
            type: 'contact'
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

        setRecentActivity(recentItems);

        // Generate top content from real data
        const topItems = [
          ...safeArticles.map((item: any) => ({
            id: `article-${item.id}`,
            title: item.title,
            views: item.views || 0,
            likes: item.likes || 0,
            type: 'article'
          })),
          ...safeVideos.map((item: any) => ({
            id: `video-${item.id}`,
            title: item.title,
            views: item.views || 0,
            likes: item.likes || 0,
            type: 'video'
          })),
          ...safeBooks.map((item: any) => ({
            id: `book-${item.id}`,
            title: item.title,
            views: item.views || 0,
            likes: item.likes || 0,
            type: 'book'
          })),
          ...safeSuggestions.map((item: any) => ({
            id: `suggestion-${item.id}`,
            title: item.title,
            views: item.views || 0,
            likes: item.likes || 0,
            type: 'suggestion'
          }))
        ].sort((a, b) => b.views - a.views).slice(0, 4);

        setTopContent(topItems);

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Contact messages are now loaded from backend in the main loadData function

  // Helper functions to transform data
  const transformArticleToContentItem = (article: any): ContentItem => ({
    id: article.id.toString(),
    title: article.title,
    author: article.author?.name || 'Admin',
    category: article.category?.name || 'General',
    status: article.status || 'published',
    views: article.views || 0,
    likes: article.likes || 0,
    createdAt: article.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: article.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    featured: article.featured || false,
    description: article.excerpt || article.body?.substring(0, 150) + '...',
    tags: article.tags || [],
    imageUrl: article.image || '/image.png'
  });

  const transformVideoToContentItem = (video: any): ContentItem => ({
    id: video.id.toString(),
    title: video.title,
    instructor: video.instructor || 'Admin',
    category: video.category || 'Techniques',
    status: video.status || 'published',
    views: video.views || 0,
    likes: video.likes || 0,
    rating: video.rating || 0,
    createdAt: video.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: video.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: video.description,
    videoUrl: video.embed_url,
    imageUrl: video.thumbnail || '/image.png'
  });

  const transformBookToContentItem = (book: any): ContentItem => ({
    id: book.id.toString(),
    title: book.title,
    author: book.author || 'Unknown Author',
    category: 'General',
    status: 'published',
    rating: book.rating || 4.5,
    price: book.price || 0,
    createdAt: book.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: book.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: book.description,
    imageUrl: book.image || '/image.png'
  });

  const transformToolToContentItem = (tool: any): ContentItem => ({
    id: tool.id.toString(),
    title: tool.name,
    category: tool.category || 'Tools',
    status: tool.status || 'published',
    link: tool.link,
    brand: tool.brand,
    material: tool.material,
    size: tool.size,
    color: tool.color,
    isWaterproof: tool.is_waterproof || false,
    isDurable: tool.is_durable || false,
    views: tool.views || 0,
    likes: tool.likes || 0,
    createdAt: tool.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: tool.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: tool.description,
    content: tool.content,
    cover: tool.cover,
    imageUrl: tool.images_json ? JSON.parse(tool.images_json)[0] : '/image.png'
  });

  const transformEssentialToContentItem = (essential: any): ContentItem => ({
    id: essential.id.toString(),
    title: essential.name,
    category: essential.category || 'Essentials',
    status: essential.status || 'published',
    link: essential.link,
    brand: essential.brand,
    material: essential.material,
    size: essential.size,
    color: essential.color,
    isWaterproof: essential.is_waterproof || false,
    isDurable: essential.is_durable || false,
    views: essential.views || 0,
    likes: essential.likes || 0,
    createdAt: essential.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: essential.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: essential.description,
    content: essential.content,
    cover: essential.cover,
    imageUrl: essential.image || '/image.png'
  });

  const transformPotToContentItem = (pot: any): ContentItem => ({
    id: pot.id.toString(),
    title: pot.name,
    category: pot.category || 'Pots',
    status: pot.status || 'published',
    link: pot.link,
    brand: pot.brand,
    material: pot.material,
    size: pot.size,
    color: pot.color,
    isWaterproof: pot.is_waterproof || false,
    isDurable: pot.is_durable || false,
    views: pot.views || 0,
    likes: pot.likes || 0,
    createdAt: pot.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: pot.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: pot.description,
    content: pot.content,
    cover: pot.cover,
    imageUrl: pot.image || '/image.png'
  });

  const transformAccessoryToContentItem = (accessory: any): ContentItem => ({
    id: accessory.id.toString(),
    title: accessory.name,
    category: accessory.category || 'Accessories',
    status: accessory.status || 'published',
    link: accessory.link,
    brand: accessory.brand,
    material: accessory.material,
    size: accessory.size,
    color: accessory.color,
    isWaterproof: accessory.is_waterproof || false,
    isDurable: accessory.is_durable || false,
    views: accessory.views || 0,
    likes: accessory.likes || 0,
    rating: accessory.rating || 4.5,
    createdAt: accessory.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: accessory.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: accessory.description,
    content: accessory.content,
    cover: accessory.cover,
    imageUrl: accessory.image || '/image.png'
  });

  const transformSuggestionToContentItem = (suggestion: any): ContentItem => ({
    id: suggestion.id.toString(),
    title: suggestion.title,
    category: suggestion.category || 'Suggestions',
    status: 'published',
    rating: suggestion.rating || 4.5,
    views: suggestion.views || 0,
    likes: suggestion.likes || 0,
    createdAt: suggestion.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: suggestion.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: suggestion.description,
    imageUrl: suggestion.image || '/image.png',
    featured: suggestion.is_featured || false,
    difficulty: suggestion.difficulty_level || 'beginner',
    tags: suggestion.tags || []
  });

  const transformAboutUsToContentItem = (aboutUs: any): ContentItem => ({
    id: aboutUs.id.toString(),
    title: aboutUs.title,
    category: 'About Us',
    status: aboutUs.is_active ? 'published' : 'draft',
    rating: 5.0,
    views: 0,
    likes: 0,
    createdAt: aboutUs.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: aboutUs.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: aboutUs.description,
    imageUrl: aboutUs.image || '/image.png',
    featured: aboutUs.is_active || false,
    author: 'Admin',
    tags: []
  });

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Categories will be loaded from backend
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

  // Product categories will use the same categories from backend
  const productCategories = categories;

  const getContentData = (type: string) => {
    switch (type) {
      case 'articles': return articles;
      case 'techniques': return techniques;
      case 'books': return books;
      case 'suggestions': return suggestions;
      case 'videos': return videos;
      case 'tools': return tools;
      case 'essentials': return essentials;
      case 'pots': return pots;
      case 'accessories': return accessories;
      case 'about-us': return aboutUs;
      default: return [];
    }
  };

  const setContentData = (type: string, data: ContentItem[]) => {
    switch (type) {
      case 'articles': setArticles(data); break;
      case 'techniques': setTechniques(data); break;
      case 'books': setBooks(data); break;
      case 'suggestions': setSuggestions(data); break;
      case 'videos': setVideos(data); break;
      case 'tools': setTools(data); break;
      case 'essentials': setEssentials(data); break;
      case 'pots': setPots(data); break;
      case 'accessories': setAccessories(data); break;
      case 'about-us': setAboutUs(data); break;
    }
  };

  const sortContent = (content: ContentItem[]) => {
    try {
      return [...content].sort((a, b) => {
        switch (sortBy) {
          case 'latest':
            return new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime();
          case 'oldest':
            return new Date(a.createdAt || new Date()).getTime() - new Date(b.createdAt || new Date()).getTime();
          case 'views':
            return (b.views || 0) - (a.views || 0);
          case 'title':
            return (a.title || '').localeCompare(b.title || '');
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting content:', error);
      return content; // Return original array if sorting fails
    }
  };

  const filteredContent = getContentData(activeTab).filter((item: ContentItem) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.instructor && item.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Product filtering and sorting
  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(productSearchTerm.toLowerCase());
    const matchesCategory = selectedProductCategory === 'all' || item.category === selectedProductCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (productSortBy) {
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
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const handleCreate = (type: string) => {
    setCurrentContentType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Rich text editor functions
  const addToHistory = (content: string) => {
    const newHistory = editorHistory.slice(0, historyIndex + 1);
    newHistory.push(content);
    setEditorHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleContentChange = (newContent: string) => {
    setFormData({...formData, content: newContent});
    addToHistory(newContent);
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    const editor = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editor) {
      editor.focus();
      
      switch (format) {
        case 'Paragraph':
          document.execCommand('formatBlock', false, 'p');
          break;
        case 'Heading 1':
          document.execCommand('formatBlock', false, 'h1');
          break;
        case 'Heading 2':
          document.execCommand('formatBlock', false, 'h2');
          break;
        case 'Heading 3':
          document.execCommand('formatBlock', false, 'h3');
          break;
        case 'Heading 4':
          document.execCommand('formatBlock', false, 'h4');
          break;
        case 'Heading 5':
          document.execCommand('formatBlock', false, 'h5');
          break;
        case 'Heading 6':
          document.execCommand('formatBlock', false, 'h6');
          break;
        case 'Quote':
          document.execCommand('formatBlock', false, 'blockquote');
          break;
        case 'Code':
          document.execCommand('formatBlock', false, 'pre');
          break;
        default:
          document.execCommand('formatBlock', false, 'p');
      }
    }
  };

  const applyFormatting = (format: string) => {
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
    }
  };

  const applyList = (type: 'bullet' | 'number' | 'quote') => {
    switch (type) {
      case 'bullet':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'number':
        document.execCommand('insertOrderedList', false);
        break;
      case 'quote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
    }
  };

  const insertContent = (type: 'link' | 'image' | 'table') => {
    switch (type) {
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          const text = window.getSelection()?.toString() || 'Link text';
          document.execCommand('createLink', false, url);
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          const img = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto;">`;
          document.execCommand('insertHTML', false, img);
        }
        break;
      case 'table':
        const table = `
          <table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
            <tr>
              <td style="padding: 8px;">Header 1</td>
              <td style="padding: 8px;">Header 2</td>
              <td style="padding: 8px;">Header 3</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Row 1</td>
              <td style="padding: 8px;">Data</td>
              <td style="padding: 8px;">Data</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Row 2</td>
              <td style="padding: 8px;">Data</td>
              <td style="padding: 8px;">Data</td>
            </tr>
          </table>
        `;
        document.execCommand('insertHTML', false, table);
        break;
    }
  };

  const handleUndo = () => {
    document.execCommand('undo', false);
  };

  const handleRedo = () => {
    document.execCommand('redo', false);
  };

  const clearFormatting = () => {
    document.execCommand('removeFormat', false);
  };

  // Cover image handlers
  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({...formData, cover: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({...formData, cover: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeCover = () => {
    setFormData({...formData, cover: null});
    setCoverPreview('');
  };

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      alert('Title is required!');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Description is required!');
      return false;
    }
    if (!formData.content.trim()) {
      alert('Content is required!');
      return false;
    }
    if (!formData.category) {
      alert('Category is required!');
      return false;
    }
    return true;
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // User profile handlers
  const handleUserProfileChange = (field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveAvatar = () => {
    setUserProfile(prev => ({
      ...prev,
      avatar: null,
      avatarPreview: null
    }));
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, JPG, PNG, GIF)');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (3MB limit)
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {

        setUserProfile(prev => ({
          ...prev,
          avatar: file,
          avatarPreview: event.target?.result as string
        }));
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading file. Please try again.');
        e.target.value = ''; // Clear the input
      };
      reader.readAsDataURL(file);
    } else {

    }
  };

  const handleSaveUserProfile = async () => {
    try {
      // Show loading state
      const submitButton = document.querySelector('button[onClick="handleSaveUserProfile"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Updating...';
      }

      const formData = new FormData();
      formData.append('name', userProfile.name);
      formData.append('email', userProfile.email);
      formData.append('phone', userProfile.phone);
      formData.append('state', userProfile.state);
      formData.append('address', userProfile.address);
      formData.append('city', userProfile.city);
      formData.append('zip_code', userProfile.zip_code);
      formData.append('company', userProfile.company);
      formData.append('role', userProfile.role);
      formData.append('status', userProfile.status);
      formData.append('is_email_verified', userProfile.is_email_verified.toString());
      formData.append('is_banned', userProfile.is_banned.toString());
      
      // Only append password if it's provided (for admin changing user passwords)
      if (userProfile.password && user?.role === 'admin') {
        formData.append('password', userProfile.password);
      }
      
      if (userProfile.avatar) {

        formData.append('avatar', userProfile.avatar, userProfile.avatar.name);
      } else {

      }

      // Call real API to update user profile
      // If we have a specific user ID, use update method, otherwise use updateProfile
      const response = userProfile.id && userProfile.id !== user?.id 
        ? await userService.update(userProfile.id, formData)
        : await userService.updateProfile(formData);

      alert('User profile saved successfully!');
      
            // Update the user state
            // setUser({ ...user, ...userProfile }); // This will be handled by auth context
      
      // Refresh users list
      // Users will be refreshed in main loadData function
      
    } catch (error) {
      console.error('Error saving user profile:', error);
      
      // More detailed error handling
      let errorMessage = 'Error saving user profile. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'User not found.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You do not have permission to update this user.';
        } else if (error.message.includes('422')) {
          errorMessage = 'Invalid data provided. Please check your input. This might be due to invalid avatar format or size.';
        } else if (error.message.includes('413')) {
          errorMessage = 'Avatar file is too large. Please choose a smaller file (max 3MB).';
        } else if (error.message.includes('415')) {
          errorMessage = 'Invalid avatar format. Please use JPEG, JPG, PNG, or GIF.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      // Reset button state
      const submitButton = document.querySelector('button[onClick="handleSaveUserProfile"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Save changes';
      }
    }
  };

  // Users are loaded in main loadData function

  // User list filtering and sorting
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (userSortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (userSortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Handle edit user
  const handleEditUser = (userItem: any) => {
    setUserProfile({
      id: userItem.id,
      name: userItem.name,
      email: userItem.email,
      password: '',
      phone: userItem.phone || '',
      state: userItem.state || '',
      address: userItem.address || '',
      city: userItem.city || '',
      zip_code: userItem.zip_code || '',
      company: userItem.company || '',
      role: userItem.role,
      status: userItem.status,
      avatar: null,
      avatarPreview: userItem.avatar || null, // Load existing avatar if available
      is_email_verified: userItem.is_email_verified || true,
      is_banned: userItem.status === 'banned'
    });
    setActiveTab('user-profile');
  };

  // Handle create user
  const handleCreateUser = async () => {
    // This would need form data from the create user form
    // For now, just refresh users
    loadUsers();
    setActiveTab('user-list');
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userService.delete(userId);
        setUsers(users.filter(user => user.id !== userId));
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
        alert('User deleted successfully!');
        // Refresh users from backend
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  // Handle product update
  const handleProductUpdate = async () => {
    if (!validateProductForm() || !editingProduct) return;

    try {
      const formData = new FormData();
      formData.append('title', productFormData.title);
      formData.append('description', productFormData.description);
      formData.append('content', productFormData.content);
      formData.append('category', productFormData.category);
      formData.append('tags', productFormData.tags);
      formData.append('author', productFormData.author);
      formData.append('slug', productFormData.slug || generateProductSlug(productFormData.title));
      formData.append('link', productFormData.link);
      formData.append('brand', productFormData.brand);
      formData.append('material', productFormData.material);
      formData.append('size', productFormData.size);
      formData.append('color', productFormData.color);
      formData.append('is_waterproof', productFormData.isWaterproof.toString());
      formData.append('is_durable', productFormData.isDurable.toString());
      formData.append('status', productFormData.publish ? 'published' : 'draft');
      
      if (productFormData.cover) {
        formData.append('cover', productFormData.cover);
      }

      // Call real API to update product
      const response = await productService.update(editingProduct.id, formData);

      // Reset form
      setProductFormData({
        title: '',
        description: '',
        content: '',
        cover: null,
        publish: true,
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
        isDurable: false
      });
      setProductCoverPreview('');
      setEditingProduct(null);
      setActiveTab('product-list');
      
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Auto-generate slug if not provided
      if (!formData.slug) {
        setFormData({...formData, slug: generateSlug(formData.title)});
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('tags', formData.tags);
      submitData.append('author', formData.author);
      submitData.append('slug', formData.slug || generateSlug(formData.title));
      submitData.append('publish', formData.publish.toString());
      
      if (formData.cover) {
        submitData.append('cover', formData.cover);
      }

      // Determine content type and call appropriate API
      let response;
      switch (currentContentType) {
        case 'articles':
          response = await articlesService.create(submitData);
          break;
        case 'videos':
          response = await videosService.create(submitData);
          break;
        case 'books':
          response = await booksService.create(submitData);
          break;
        case 'tools':
          response = await toolsService.create(submitData);
          break;
        case 'essentials':
          response = await essentialsService.create(submitData);
          break;
        case 'pots':
          response = await potsService.create(submitData);
          break;
        case 'accessories':
          response = await accessoriesService.create(submitData);
          break;
        case 'suggestions':
          response = await suggestionsService.create(submitData);
          break;
        case 'techniques':
          response = await suggestionsService.create(submitData); // techniques uses suggestions API
          break;
        case 'about-us':
          response = await aboutUsService.create(submitData);
          break;
        default:
          throw new Error('Unknown content type');
      }

      alert('Content created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        cover: null,
        publish: true,
        category: '',
        tags: '',
        author: '',
        slug: ''
      });
      setCoverPreview('');
      setSelectedFormat('Paragraph');
      
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Error creating content. Please try again.');
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setFormData({...formData, content: content});
  };

  // Edit handlers
  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item);
    setActiveTab('content-edit');
    
    // Populate edit form with existing data
    setEditFormData({
      title: item.title,
      description: item.description || '',
      content: item.content || '',
      cover: null,
      publish: item.status === 'published',
      category: item.category.toLowerCase(),
      tags: item.tags?.join(', ') || '',
      author: item.author || '',
      slug: item.slug || generateSlug(item.title)
    });
    
    // Set existing cover preview if available
    if (item.cover) {
      setEditCoverPreview(item.cover);
    }
  };

  // Product handlers
  const handleProductCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFormData(prev => ({ ...prev, cover: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProductCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProductCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setProductFormData(prev => ({ ...prev, cover: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProductCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProductCoverDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeProductCover = () => {
    setProductFormData(prev => ({ ...prev, cover: null }));
    setProductCoverPreview('');
  };

  const generateProductSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const validateProductForm = () => {
    if (!productFormData.title.trim()) {
      alert('Product name is required!');
      return false;
    }
    if (!productFormData.description.trim()) {
      alert('Description is required!');
      return false;
    }
    if (!productFormData.category) {
      alert('Category is required!');
      return false;
    }
    return true;
  };

  const handleProductSubmit = async () => {
    if (!validateProductForm()) return;

    try {
      const formData = new FormData();
      formData.append('title', productFormData.title);
      formData.append('description', productFormData.description);
      formData.append('content', productFormData.content);
      formData.append('category', productFormData.category);
      formData.append('tags', productFormData.tags);
      formData.append('author', productFormData.author);
      formData.append('slug', productFormData.slug || generateProductSlug(productFormData.title));
      formData.append('link', productFormData.link);
      formData.append('brand', productFormData.brand);
      formData.append('material', productFormData.material);
      formData.append('size', productFormData.size);
      formData.append('color', productFormData.color);
      formData.append('isWaterproof', productFormData.isWaterproof.toString());
      formData.append('isDurable', productFormData.isDurable.toString());
      formData.append('status', productFormData.publish ? 'published' : 'draft');
      
      if (productFormData.cover) {
        formData.append('cover', productFormData.cover);
      }

      // Call real API to create product
      const response = await productService.create(formData);

      // Reset form
      setProductFormData({
        title: '',
        description: '',
        content: '',
        cover: null,
        publish: true,
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
        isDurable: false
      });
      setProductCoverPreview('');
      
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    }
  };

  const handleEditProduct = (item: ContentItem) => {
    setEditingProduct(item);
    setProductFormData({
      title: item.title || '',
      description: item.description || '',
      content: item.content || '',
      cover: null,
      publish: true,
      category: item.category || '',
      tags: item.tags?.join(', ') || '',
      author: item.author || '',
      slug: item.slug || '',
      link: item.link || '',
      brand: item.brand || '',
      material: item.material || '',
      size: item.size || '',
      color: item.color || '',
      isWaterproof: item.isWaterproof || false,
      isDurable: item.isDurable || false
    });
    setProductCoverPreview(item.cover || '');
    setActiveTab('product-edit');
  };

  const handleEditCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditFormData({...editFormData, cover: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCoverDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setEditFormData({...editFormData, cover: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCoverDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeEditCover = () => {
    setEditFormData({...editFormData, cover: null});
    setEditCoverPreview('');
  };

  const validateEditForm = () => {
    const errors = [];
    
    if (!editFormData.title.trim()) {
      errors.push('Title is required');
    } else if (editFormData.title.length < 3) {
      errors.push('Title must be at least 3 characters long');
    }
    
    if (!editFormData.description.trim()) {
      errors.push('Description is required');
    } else if (editFormData.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (!editFormData.content.trim()) {
      errors.push('Content is required');
    } else if (editFormData.content.length < 20) {
      errors.push('Content must be at least 20 characters long');
    }
    
    if (!editFormData.category) {
      errors.push('Category is required');
    }
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n• ' + errors.join('\n• '));
      return false;
    }
    
    return true;
  };

  const handleUpdateSubmit = async () => {
    if (!validateEditForm() || !editingItem) return;

    // Show loading state
    const submitButton = document.querySelector('button[onClick="handleUpdateSubmit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Updating...';
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('id', editingItem.id.toString());
      submitData.append('title', editFormData.title);
      submitData.append('description', editFormData.description);
      submitData.append('content', editFormData.content);
      submitData.append('category', editFormData.category);
      submitData.append('tags', editFormData.tags);
      submitData.append('author', editFormData.author);
      submitData.append('slug', editFormData.slug || generateSlug(editFormData.title));
      submitData.append('publish', editFormData.publish.toString());
      
      if (editFormData.cover) {
        submitData.append('cover', editFormData.cover);
      }

      // Determine content type and call appropriate API
      let response;
      switch (currentContentType) {
        case 'articles':
          response = await articlesService.update(editingItem.id, submitData);
          break;
        case 'videos':
          response = await videosService.update(editingItem.id, submitData);
          break;
        case 'books':
          response = await booksService.update(editingItem.id, submitData);
          break;
        case 'tools':
          response = await toolsService.update(editingItem.id, submitData);
          break;
        case 'essentials':
          response = await essentialsService.update(editingItem.id, submitData);
          break;
        case 'pots':
          response = await potsService.update(editingItem.id, submitData);
          break;
        case 'accessories':
          response = await accessoriesService.update(editingItem.id, submitData);
          break;
        case 'suggestions':
          response = await suggestionsService.update(editingItem.id, submitData);
          break;
        case 'techniques':
          response = await suggestionsService.update(editingItem.id, submitData); // techniques uses suggestions API
          break;
        case 'about-us':
          response = await aboutUsService.update(editingItem.id, submitData);
          break;
        default:
          throw new Error('Unknown content type');
      }

      alert('Content updated successfully!');
      
      // Reset edit form and go back to list
      setEditingItem(null);
      setActiveTab('content-list');
      setEditFormData({
        title: '',
        description: '',
        content: '',
        cover: null,
        publish: true,
        category: '',
        tags: '',
        author: '',
        slug: ''
      });
      setEditCoverPreview('');
      
    } catch (error) {
      console.error('Error updating content:', error);
      
      // More detailed error handling
      let errorMessage = 'Error updating content. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Content not found. It may have been deleted.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You do not have permission to update this content.';
        } else if (error.message.includes('422')) {
          errorMessage = 'Invalid data provided. Please check your input.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      // Reset button state
      const submitButton = document.querySelector('button[onClick="handleUpdateSubmit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Update post';
      }
    }
  };

  const handleEdit = (item: ContentItem, type: string) => {
    setCurrentContentType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Show loading state
        const deleteButton = document.querySelector(`button[data-delete-id="${id}"]`) as HTMLButtonElement;
        if (deleteButton) {
          deleteButton.disabled = true;
          deleteButton.textContent = 'Deleting...';
        }

        // Call appropriate API based on type
        let response;
        switch (type) {
          case 'articles':
            response = await articlesService.delete(id);
            break;
          case 'videos':
            response = await videosService.delete(id);
            break;
          case 'books':
            response = await booksService.delete(id);
            break;
          case 'tools':
            response = await toolsService.delete(id);
            break;
          case 'essentials':
            response = await essentialsService.delete(id);
            break;
          case 'pots':
            response = await potsService.delete(id);
            break;
          case 'accessories':
            response = await accessoriesService.delete(id);
            break;
          case 'suggestions':
            response = await suggestionsService.delete(id);
            break;
          case 'techniques':
            response = await suggestionsService.delete(id); // techniques uses suggestions API
            break;
          case 'about-us':
            response = await aboutUsService.delete(id);
            break;
          default:
            throw new Error('Unknown content type for delete');
        }

        alert(`${type} deleted successfully!`);
        
        // Refresh the content list
        await loadContentData();
        
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        
        // More detailed error handling
        let errorMessage = `Failed to delete ${type}. Please try again.`;
        
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            errorMessage = 'Item not found. It may have been already deleted.';
          } else if (error.message.includes('403')) {
            errorMessage = 'You do not have permission to delete this item.';
          } else if (error.message.includes('500')) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.message.includes('Network')) {
            errorMessage = 'Network error. Please check your connection.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        }
        
        alert(errorMessage);
      } finally {
        // Reset button state
        const deleteButton = document.querySelector(`button[data-delete-id="${id}"]`) as HTMLButtonElement;
        if (deleteButton) {
          deleteButton.disabled = false;
          deleteButton.textContent = 'Delete';
        }
      }
    }
  };

  // Function to load content data from API
  const loadContentData = async () => {
    try {
      switch (currentContentType) {
        case 'articles':
          const articles = await articlesService.getAll();
          setArticles(Array.isArray(articles) ? articles : []);
          break;
        case 'videos':
          const videos = await videosService.getAll();
          setVideos(Array.isArray(videos) ? videos : []);
          break;
        case 'books':
          const books = await booksService.getAll();
          setBooks(Array.isArray(books) ? books : []);
          break;
        case 'tools':
          const tools = await toolsService.getAll();
          setTools(Array.isArray(tools) ? tools : []);
          break;
        case 'essentials':
          const essentials = await essentialsService.getAll();
          setEssentials(Array.isArray(essentials) ? essentials : []);
          break;
        case 'pots':
          const pots = await potsService.getAll();
          setPots(Array.isArray(pots) ? pots : []);
          break;
        case 'accessories':
          const accessories = await accessoriesService.getAll();
          setAccessories(Array.isArray(accessories) ? accessories : []);
          break;
        case 'suggestions':
          const suggestions = await suggestionsService.getAll();
          setSuggestions(Array.isArray(suggestions) ? suggestions : []);
          break;
        case 'about-us':
          const aboutUs = await aboutUsService.getAll();
          setAboutUs(Array.isArray(aboutUs) ? aboutUs : []);
          break;
        default:

      }
    } catch (error) {
      console.error('Error loading content data:', error);
    }
  };

  const handleSave = async (formData: Partial<ContentItem>) => {
    try {
      // Show loading state
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = editingItem ? 'Updating...' : 'Creating...';
      }

      // Determine if we need FormData or JSON based on content type
      const needsFormData = ['tools', 'essentials', 'pots', 'accessories', 'suggestions', 'books'].includes(currentContentType);
      
      let submitData;
      if (needsFormData) {
        // Use FormData for file uploads
        submitData = new FormData();
        submitData.append('title', formData.title || '');
        submitData.append('description', formData.description || '');
        submitData.append('content', formData.content || '');
        submitData.append('category', formData.category || '');
        submitData.append('tags', Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags || '');
        submitData.append('author', formData.author || '');
        submitData.append('slug', formData.slug || generateSlug(formData.title || ''));
        submitData.append('publish', 'true');
        
        // Add additional fields
        if (formData.videoUrl) submitData.append('video_url', formData.videoUrl);
        if (formData.buyLink) submitData.append('buy_link', formData.buyLink);
        if (formData.borrowLink) submitData.append('borrow_link', formData.borrowLink);
        if (formData.embedCode) submitData.append('embed_code', formData.embedCode);
        if (formData.duration) submitData.append('duration', formData.duration);
        if (formData.isbn) submitData.append('isbn', formData.isbn);
        if (formData.difficulty) submitData.append('difficulty', formData.difficulty);
        if (formData.rating) submitData.append('rating', formData.rating.toString());
        if (formData.price) submitData.append('price', formData.price.toString());
        if (formData.featured !== undefined) submitData.append('featured', formData.featured.toString());
        if (formData.type) submitData.append('type', formData.type);
      } else {
        // Use JSON for simple data
        submitData = {
          title: formData.title || '',
          description: formData.description || '',
          content: formData.content || '',
          category: formData.category || '',
          tags: Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags || '',
          author: formData.author || '',
          slug: formData.slug || generateSlug(formData.title || ''),
          publish: true,
          video_url: formData.videoUrl || '',
          buy_link: formData.buyLink || '',
          borrow_link: formData.borrowLink || '',
          embed_code: formData.embedCode || '',
          duration: formData.duration || '',
          isbn: formData.isbn || '',
          difficulty: formData.difficulty || '',
          rating: formData.rating || 0,
          price: formData.price || 0,
          featured: formData.featured || false,
          type: formData.type || 'general'
        };
      }

      let response;
    if (editingItem) {
      // Update existing item
        switch (currentContentType) {
          case 'articles':
            response = await articlesService.update(editingItem.id, submitData);
            break;
          case 'videos':
            response = await videosService.update(editingItem.id, submitData);
            break;
          case 'books':
            response = await booksService.update(editingItem.id, submitData);
            break;
          case 'tools':
            response = await toolsService.update(editingItem.id, submitData);
            break;
          case 'essentials':
            response = await essentialsService.update(editingItem.id, submitData);
            break;
          case 'pots':
            response = await potsService.update(editingItem.id, submitData);
            break;
          case 'accessories':
            response = await accessoriesService.update(editingItem.id, submitData);
            break;
          case 'suggestions':
            response = await suggestionsService.update(editingItem.id, submitData);
            break;
          case 'techniques':
            response = await suggestionsService.update(editingItem.id, submitData); // techniques uses suggestions API
            break;
          case 'about-us':
            response = await aboutUsService.update(editingItem.id, submitData);
            break;
          default:
            throw new Error('Unknown content type for update');
        }
    } else {
      // Create new item
        switch (currentContentType) {
          case 'articles':
            response = await articlesService.create(submitData);
            break;
          case 'videos':
            response = await videosService.create(submitData);
            break;
          case 'books':
            response = await booksService.create(submitData);
            break;
          case 'tools':
            response = await toolsService.create(submitData);
            break;
          case 'essentials':
            response = await essentialsService.create(submitData);
            break;
          case 'pots':
            response = await potsService.create(submitData);
            break;
          case 'accessories':
            response = await accessoriesService.create(submitData);
            break;
          case 'suggestions':
            response = await suggestionsService.create(submitData);
            break;
          case 'techniques':
            response = await suggestionsService.create(submitData); // techniques uses suggestions API
            break;
          case 'about-us':
            response = await aboutUsService.create(submitData);
            break;
          default:
            throw new Error('Unknown content type for create');
        }
      }

      alert(`${editingItem ? 'Content updated' : 'Content created'} successfully!`);
      
      // Refresh the content list
      await loadContentData();
    
    setIsModalOpen(false);
    setEditingItem(null);
      
    } catch (error) {
      console.error(`Error ${editingItem ? 'updating' : 'creating'} content:`, error);
      
      // More detailed error handling
      let errorMessage = `Error ${editingItem ? 'updating' : 'creating'} content. Please try again.`;
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Content not found. It may have been deleted.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.message.includes('422')) {
          errorMessage = 'Invalid data provided. Please check your input.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      // Reset button state
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = editingItem ? 'Update' : 'Create';
      }
    }
  };

  const handleMessageStatusChange = async (messageId: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      // Call backend API to update message status
      await contactService.updateStatus(messageId, newStatus);
      
      // Update local state
    const updatedMessages = contactMessages.map(msg =>
      msg.id === messageId
        ? { ...msg, status: newStatus, updatedAt: new Date().toISOString() }
        : msg
    );
    setContactMessages(updatedMessages);
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        // Call backend API to delete message
        await contactService.delete(messageId);
        
        // Update local state
      const updatedMessages = contactMessages.filter(msg => msg.id !== messageId);
      setContactMessages(updatedMessages);
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      }
    }
  };

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
            <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
            <p className={`text-red-600 mb-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              You need to be logged in to access the admin dashboard.
            </p>
            <motion.button
              onClick={() => window.location.href = '/login'}
              className="bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Login
            </motion.button>
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
                <BarChart3 className="h-8 w-8 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
              Loading Dashboard
            </h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Please wait while we load your data...
            </p>
            <div className="mt-4 flex justify-center space-x-1">
              <motion.div 
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

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
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Error Loading Dashboard
            </h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {error}
            </p>
            <div className="space-y-3">
              <motion.button 
                onClick={() => window.location.reload()}
                className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
              <motion.button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go Home
              </motion.button>
            </div>
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
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { 
              label: 'Total Users', 
              value: stats.totalUsers.toLocaleString(), 
              icon: Users, 
              color: 'from-blue-500 to-indigo-600', 
              change: stats.totalUsers > 0 ? `+${stats.monthlyGrowth}%` : '0%',
              changeColor: stats.totalUsers > 0 ? 'text-green-500' : 'text-gray-500'
            },
            { 
              label: 'Total Views', 
              value: stats.totalViews.toLocaleString(), 
              icon: Eye, 
              color: 'from-green-500 to-emerald-600', 
              change: stats.totalViews > 0 ? `+${stats.weeklyGrowth}%` : '0%',
              changeColor: stats.totalViews > 0 ? 'text-green-500' : 'text-gray-500'
            },
            { 
              label: 'Content Items', 
              value: (stats.totalArticles + stats.totalVideos + stats.totalBooks + stats.totalSuggestions + stats.totalAboutUs + stats.totalContactMessages).toLocaleString(), 
              icon: FileText, 
              color: 'from-purple-500 to-violet-600', 
              change: (stats.totalArticles + stats.totalVideos + stats.totalBooks + stats.totalSuggestions + stats.totalAboutUs + stats.totalContactMessages) > 0 ? `+${stats.monthlyGrowth}%` : '0%',
              changeColor: (stats.totalArticles + stats.totalVideos + stats.totalBooks + stats.totalSuggestions + stats.totalAboutUs + stats.totalContactMessages) > 0 ? 'text-green-500' : 'text-gray-500'
            },
            { 
              label: 'Avg Rating', 
              value: stats.avgRating.toString(), 
              icon: Star, 
              color: 'from-yellow-500 to-orange-600', 
              change: stats.avgRating > 0 ? `+${(stats.avgRating - 4.0).toFixed(1)}` : '0.0',
              changeColor: stats.avgRating > 4.0 ? 'text-green-500' : stats.avgRating < 4.0 ? 'text-red-500' : 'text-gray-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center" gradient={true} glow={true}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} text-white mb-4`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                  {stat.value}
                </h3>
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-emerald-200' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <span className={`text-sm font-semibold ${stat.changeColor || 'text-green-500'}`}>
                  {stat.change}
                </span>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                Recent Activity
              </h3>
              <Activity className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-800/30 backdrop-blur-sm border border-gray-700/20' : 'bg-gray-50'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'content' ? 'bg-green-500' :
                    activity.type === 'media' ? 'bg-purple-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                      {activity.action}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-emerald-300' : 'text-gray-600'}`}>
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Content */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                Top Performing Content
              </h3>
              <TrendingUp className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={content.id} className={`flex items-center space-x-4 p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-800/30 backdrop-blur-sm border border-gray-700/20' : 'bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                      {content.title}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-emerald-300' : 'text-gray-600'}`}>
                        <Eye className="h-4 w-4" />
                        <span>{content.views.toLocaleString()}</span>
                      </span>
                      <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-emerald-300' : 'text-gray-600'}`}>
                        <Heart className="h-4 w-4" />
                        <span>{content.likes.toLocaleString()}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        content.type === 'article' ? 'bg-green-100 text-green-800' :
                        content.type === 'video' ? 'bg-red-100 text-red-800' :
                        content.type === 'book' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
              Users Management
            </h3>
            <a
              href="/admin/users"
              className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Manage Users</span>
            </a>
          </div>
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">User Management</h3>
            <p className="text-emerald-600 mb-6">
              Manage user accounts, permissions, roles, and user information.
            </p>
            <a
              href="/admin/users"
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to User Management
            </a>
          </div>
        </Card>
      )}

      {/* User Profile */}
      {activeTab === 'user-profile' && (
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Section - User Info and Controls */}
            <div className="lg:col-span-1 space-y-4">
              {/* Status Tag */}
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  userProfile.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userProfile.status === 'active' ? 'Active' : 'Banned'}
                </span>
              </div>

              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 relative group cursor-pointer">
                  {userProfile.avatarPreview ? (
                    <img 
                      src={userProfile.avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleAvatarUpload}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Avatar Actions */}
                <div className="flex justify-center space-x-2 mb-2">
                  <label className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                    isDarkMode 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}>
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                  
                  {userProfile.avatarPreview && (
                    <button
                      onClick={handleRemoveAvatar}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        isDarkMode 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif • max 3 Mb
                </p>
                
                {userProfile.avatar && (
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Selected: {userProfile.avatar.name} ({(userProfile.avatar.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Toggle Controls */}
              <div className="space-y-3">
                {/* Banned Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Banned
                    </label>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Apply disable account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={userProfile.is_banned}
                      onChange={(e) => {
                        handleUserProfileChange('is_banned', e.target.checked);
                        handleUserProfileChange('status', e.target.checked ? 'banned' : 'active');
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Email Verified Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email verified
                    </label>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Disabling this will automatically send the user a verification email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={userProfile.is_email_verified}
                      onChange={(e) => handleUserProfileChange('is_email_verified', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Delete User Button */}
              <div className="pt-4">
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Delete user
                </button>
              </div>
            </div>

            {/* Right Section - Profile Details Form */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1 */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Full name
                    </label>
              <input
                type="text"
                      value={userProfile.name}
                      onChange={(e) => handleUserProfileChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

                  {/* Phone Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Phone number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-2xl">🇻🇳</span>
                      </div>
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => handleUserProfileChange('phone', e.target.value)}
                        placeholder="(+84) 123 456 789"
                        className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className={`text-gray-400 hover:text-gray-600 ${isDarkMode ? 'hover:text-gray-300' : ''}`}>×</span>
                      </button>
                    </div>
                  </div>

                  {/* State/Region */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      State/region
                    </label>
                    <input
                      type="text"
                      value={userProfile.state}
                      onChange={(e) => handleUserProfileChange('state', e.target.value)}
                      placeholder="Virginia"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={userProfile.address}
                      onChange={(e) => handleUserProfileChange('address', e.target.value)}
                      placeholder="908 Jack Locks"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Company
                    </label>
                    <input
                      type="text"
                      value={userProfile.company}
                      onChange={(e) => handleUserProfileChange('company', e.target.value)}
                      placeholder="Gleichner, Mueller and Tromp"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  {/* Email Address */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleUserProfileChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Password - Only for Admin */}
                  {user?.role === 'admin' && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Password
                      </label>
                      <input
                        type="password"
                        value={userProfile.password}
                        onChange={(e) => handleUserProfileChange('password', e.target.value)}
                        placeholder="Leave empty to keep current password"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Only admins can change user passwords
                      </p>
                    </div>
                  )}

                  {/* City */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      City
                    </label>
                    <input
                      type="text"
                      value={userProfile.city}
                      onChange={(e) => handleUserProfileChange('city', e.target.value)}
                      placeholder="Rancho Cordova"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Zip/Code */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Zip/code
                    </label>
                    <input
                      type="text"
                      value={userProfile.zip_code}
                      onChange={(e) => handleUserProfileChange('zip_code', e.target.value)}
                      placeholder="85807"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Role
                    </label>
            <select
                      value={userProfile.role}
                      onChange={(e) => handleUserProfileChange('role', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="user">User</option>
            </select>
                  </div>
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSaveUserProfile}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* User List */}
      {activeTab === 'user-list' && (
        <Card>
          {/* Breadcrumb and Refresh Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User</span>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>List</span>
            </div>
            <button
              onClick={loadUsers}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Refresh Users
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={() => setUserStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                userStatusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({users.length})
            </button>
            <button 
              onClick={() => setUserStatusFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                userStatusFilter === 'active'
                  ? 'bg-green-500 text-white'
                  : 'text-green-600 hover:bg-green-50'
              }`}
            >
              Active ({users.filter(u => u.status === 'active').length})
            </button>
            <button 
              onClick={() => setUserStatusFilter('banned')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                userStatusFilter === 'banned'
                  ? 'bg-red-500 text-white'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Banned ({users.filter(u => u.status === 'banned').length})
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Role:
              </label>
              <select 
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-center gap-2">
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <button className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4">
                    <button 
                      onClick={() => setUserSortBy(userSortBy === 'name-asc' ? 'name-desc' : 'name-asc')}
                      className={`flex items-center gap-1 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Name
                      {userSortBy === 'name-asc' && <span className="text-emerald-500">↑</span>}
                      {userSortBy === 'name-desc' && <span className="text-emerald-500">↓</span>}
                    </button>
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone number
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Company
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Role
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem) => (
                  <tr 
                    key={userItem.id} 
                    className={`border-b hover:bg-gray-50 ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200'}`}
                  >
                    <td className="py-4 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedUsers.includes(userItem.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, userItem.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== userItem.id));
                          }
                        }}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {userItem.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {userItem.name}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {userItem.phone || '(+84) 123 456 789'}
                    </td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {userItem.company || 'Green Groves'}
                    </td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <span className="capitalize">{userItem.role}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userItem.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditUser(userItem)}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(userItem.id)}
                          className={`p-2 rounded-lg hover:bg-red-100 ${isDarkMode ? 'hover:bg-red-900' : ''}`}
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No users found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search or filter criteria.
              </p>
                          </div>
                        )}
        </Card>
      )}

      {/* Create User */}
      {activeTab === 'user-create' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
              Create User
            </h3>
                          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Role *
                  </label>
                  <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option value="">Select role</option>
                    <option value="admin">Administrator</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">Regular User</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password *
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter password"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setActiveTab('user-list')}
                    className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateUser}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Content Details */}
      {activeTab === 'content-details' && (
        <Card>
          <div className="text-center py-12">
            <FileText className={`mx-auto h-12 w-12 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`mt-4 text-lg font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Content Details
            </h3>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Select content from the list to view its details.
            </p>
          </div>
        </Card>
      )}

      {/* Product Details */}
      {activeTab === 'product-details' && (
        <Card>
          <div className="text-center py-12">
            <Package className={`mx-auto h-12 w-12 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`mt-4 text-lg font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Product Details
            </h3>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Select a product from the list to view its details.
            </p>
          </div>
        </Card>
      )}

      {/* Product List */}
      {activeTab === 'product-list' && (
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Product Management</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>List</span>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <select
              value={selectedProductCategory}
              onChange={(e) => setSelectedProductCategory(e.target.value)}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="tools">Tools</option>
              <option value="essentials">Essentials</option>
              <option value="pots">Pots</option>
              <option value="accessories">Accessories</option>
            </select>
            <select
              value={productSortBy}
              onChange={(e) => setProductSortBy(e.target.value)}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
              <option value="views">Most Views</option>
              <option value="likes">Most Likes</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-emerald-500'
                    : 'bg-white border-gray-200 hover:border-emerald-500'
                }`}
                onClick={() => {
                  if (item.link) {
                    window.open(item.link, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm mb-3 line-clamp-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  <div className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
                    item.category === 'tools' ? 'bg-blue-100 text-blue-700' :
                    item.category === 'essentials' ? 'bg-green-100 text-green-700' :
                    item.category === 'pots' ? 'bg-orange-100 text-orange-700' :
                    item.category === 'accessories' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.category}
                  </div>
                </div>

                {item.cover && (
                  <div className="mb-4">
                    <img
                      src={item.cover}
                            alt={item.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>{item.views || 0} views</span>
                    <span>{item.likes || 0} likes</span>
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-emerald-600 hover:text-emerald-700 underline"
                      >
                        View Product
                      </a>
                    )}
                  </div>
                  <span>{item.createdAt.split('T')[0]}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(item);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.link) {
                        window.open(item.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className={`mx-auto h-12 w-12 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`mt-4 text-lg font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                No products found
              </h3>
              <p className={`mt-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Create Product */}
      {activeTab === 'product-create' && (
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Product Management</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Create</span>
          </div>

          <div className="space-y-6">
            {/* Details Card */}
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setProductDetailsExpanded(!productDetailsExpanded)}
              >
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Details
                </h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${
                  productDetailsExpanded ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {productDetailsExpanded && (
                <div className="mt-6 space-y-4">
                        <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productFormData.title}
                      onChange={(e) => {
                        setProductFormData(prev => ({ ...prev, title: e.target.value }));
                        if (!productFormData.slug) {
                          setProductFormData(prev => ({ ...prev, slug: generateProductSlug(e.target.value) }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Description *
                    </label>
                    <textarea
                      value={productFormData.description}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Content
                    </label>
                    <div className={`border rounded-lg ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      {/* Rich Text Editor Toolbar */}
                      <div className={`p-3 border-b ${
                        isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Format buttons */}
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => document.execCommand('bold', false)}
                              className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                              title="Bold"
                            ><strong>B</strong></button>
                            <button 
                              onClick={() => document.execCommand('italic', false)}
                              className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                              title="Italic"
                            ><em>I</em></button>
                            <button 
                              onClick={() => document.execCommand('underline', false)}
                              className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                              title="Underline"
                            ><u>U</u></button>
                          </div>
                          <div className="w-px h-6 bg-gray-400"></div>
                          <div className="flex items-center space-x-1">
                            <select
                              value={selectedFormat}
                              onChange={(e) => handleFormatChange(e.target.value)}
                              className={`px-2 py-1 rounded text-sm ${
                                isDarkMode 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            >
                              <option value="Paragraph">Paragraph</option>
                              <option value="H1">Heading 1</option>
                              <option value="H2">Heading 2</option>
                              <option value="H3">Heading 3</option>
                              <option value="H4">Heading 4</option>
                              <option value="H5">Heading 5</option>
                              <option value="H6">Heading 6</option>
                              <option value="blockquote">Quote</option>
                              <option value="pre">Code</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Editor */}
                      <div
                        contentEditable
                        onInput={(e) => {
                          const content = e.currentTarget.innerHTML;
                          setProductFormData(prev => ({ ...prev, content }));
                          saveToHistory(content);
                        }}
                        className={`p-4 min-h-[200px] focus:outline-none ${
                          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                        style={{ minHeight: '200px' }}
                        dangerouslySetInnerHTML={{ __html: productFormData.content }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Cover Image
                    </label>
                    {productCoverPreview ? (
                      <div className="relative">
                        <img
                          src={productCoverPreview}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={removeProductCover}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        onDrop={handleProductCoverDrop}
                        onDragOver={handleProductCoverDragOver}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 hover:border-emerald-500' 
                            : 'border-gray-300 hover:border-emerald-500'
                        }`}
                        onClick={() => document.getElementById('product-cover-upload')?.click()}
                      >
                        <Upload className={`mx-auto h-12 w-12 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <p className={`mt-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Click to upload or drag and drop
                        </p>
                        <input
                          id="product-cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleProductCoverUpload}
                          className="hidden"
                        />
                          </div>
                        )}
                      </div>
                </div>
              )}
            </div>

            {/* Properties Card */}
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setProductPropertiesExpanded(!productPropertiesExpanded)}
              >
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Properties
                </h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${
                  productPropertiesExpanded ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {productPropertiesExpanded && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Category *
                      </label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Select category</option>
                        <option value="tools">Tools</option>
                        <option value="essentials">Essentials</option>
                        <option value="pots">Pots</option>
                        <option value="accessories">Accessories</option>
            </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Product Link
                      </label>
                      <input
                        type="url"
                        value={productFormData.link}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, link: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="https://example.com/product"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Brand
                      </label>
                      <input
                        type="text"
                        value={productFormData.brand}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, brand: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter brand"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Material
                      </label>
                      <input
                        type="text"
                        value={productFormData.material}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, material: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter material"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Size
                      </label>
                      <input
                        type="text"
                        value={productFormData.size}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, size: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter size"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Color
                      </label>
                      <input
                        type="text"
                        value={productFormData.color}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, color: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter color"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productFormData.isWaterproof}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, isWaterproof: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Waterproof
                            </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productFormData.isDurable}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, isDurable: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Durable
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tags
                    </label>
                    <input
                      type="text"
                      value={productFormData.tags}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Author
                    </label>
                    <input
                      type="text"
                      value={productFormData.author}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, author: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Slug
                    </label>
                    <input
                      type="text"
                      value={productFormData.slug}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="product-url-slug"
                    />
                  </div>
                </div>
                          )}
                        </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleProductSubmit}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Create Product
              </button>
                      </div>
          </div>
        </Card>
      )}

      {/* Edit Product */}
      {activeTab === 'product-edit' && editingProduct && (
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Product Management</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Edit</span>
          </div>

          <div className="space-y-6">
            {/* Details Card */}
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setProductDetailsExpanded(!productDetailsExpanded)}
              >
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Details
                </h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${
                  productDetailsExpanded ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {productDetailsExpanded && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productFormData.title}
                      onChange={(e) => {
                        setProductFormData(prev => ({ ...prev, title: e.target.value }));
                        if (!productFormData.slug) {
                          setProductFormData(prev => ({ ...prev, slug: generateProductSlug(e.target.value) }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Description *
                    </label>
                    <textarea
                      value={productFormData.description}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Cover Image
                    </label>
                    {productCoverPreview ? (
                      <div className="relative">
                        <img
                          src={productCoverPreview}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={removeProductCover}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        onDrop={handleProductCoverDrop}
                        onDragOver={handleProductCoverDragOver}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 hover:border-emerald-500' 
                            : 'border-gray-300 hover:border-emerald-500'
                        }`}
                        onClick={() => document.getElementById('edit-product-cover-upload')?.click()}
                      >
                        <Upload className={`mx-auto h-12 w-12 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <p className={`mt-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Click to upload or drag and drop
                        </p>
                        <input
                          id="edit-product-cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleProductCoverUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Properties Card */}
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setProductPropertiesExpanded(!productPropertiesExpanded)}
              >
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Properties
                </h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${
                  productPropertiesExpanded ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {productPropertiesExpanded && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Category *
                      </label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Select category</option>
                        <option value="tools">Tools</option>
                        <option value="essentials">Essentials</option>
                        <option value="pots">Pots</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Product Link
                      </label>
                      <input
                        type="url"
                        value={productFormData.link}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, link: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="https://example.com/product"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Brand
                      </label>
                      <input
                        type="text"
                        value={productFormData.brand}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, brand: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter brand"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Material
                      </label>
                      <input
                        type="text"
                        value={productFormData.material}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, material: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter material"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Size
                      </label>
                      <input
                        type="text"
                        value={productFormData.size}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, size: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter size"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Color
                      </label>
                      <input
                        type="text"
                        value={productFormData.color}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, color: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter color"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productFormData.isWaterproof}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, isWaterproof: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Waterproof
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productFormData.isDurable}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, isDurable: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Durable
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tags
                    </label>
                    <input
                      type="text"
                      value={productFormData.tags}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Author
                    </label>
                    <input
                      type="text"
                      value={productFormData.author}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, author: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Slug
                    </label>
                    <input
                      type="text"
                      value={productFormData.slug}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="product-url-slug"
                    />
                  </div>
                          </div>
                        )}
                          </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleProductUpdate}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Update Product
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Content */}
      {activeTab === 'content-create' && (
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Content Management</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Create</span>
                          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Create a new post
            </h1>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Details Section */}
            <motion.div
              className={`rounded-lg border transition-all duration-200 ${
                      isDarkMode 
                  ? 'border-gray-700 bg-gray-800/30' 
                  : 'border-gray-200 bg-white'
                    }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
              >
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
                    Details
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Title, short description, image...
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: detailsExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {detailsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700">
                      {/* Title */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Post title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setFormData({
                              ...formData, 
                              title: title,
                              slug: formData.slug || generateSlug(title)
                            });
                          }}
                          placeholder="Post title"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        {!formData.title && (
                          <p className="text-red-500 text-sm mt-1">Title is required!</p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Description"
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Content
                        </label>
                        <div className={`border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {/* Toolbar */}
                          <div className={`p-3 border-b ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                            {/* First Row */}
                            <div className="flex items-center space-x-2 mb-2">
                              <select 
                                value={selectedFormat}
                                onChange={(e) => handleFormatChange(e.target.value)}
                                className={`px-3 py-1.5 text-sm border rounded font-medium ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                              >
                                <option>Paragraph</option>
                                <option>Heading 1</option>
                                <option>Heading 2</option>
                                <option>Heading 3</option>
                                <option>Heading 4</option>
                                <option>Heading 5</option>
                                <option>Heading 6</option>
                                <option>Quote</option>
                                <option>Code</option>
                              </select>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => applyFormatting('bold')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Bold"
                                >B</button>
                                <button 
                                  onClick={() => applyFormatting('italic')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 italic ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Italic"
                                >I</button>
                                <button 
                                  onClick={() => applyFormatting('underline')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 underline ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Underline"
                                >U</button>
                                <button 
                                  onClick={() => applyFormatting('strikethrough')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 line-through ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Strikethrough"
                                >S</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => applyList('bullet')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Bullet List"
                                >•</button>
                                <button 
                                  onClick={() => applyList('number')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Numbered List"
                                >1.</button>
                                <button 
                                  onClick={() => applyList('quote')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Quote"
                                >"</button>
                              </div>
                            </div>
                            
                            {/* Second Row */}
                      <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => document.execCommand('justifyLeft', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Align Left"
                                >←</button>
                                <button 
                                  onClick={() => document.execCommand('justifyCenter', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Align Center"
                                >→</button>
                                <button 
                                  onClick={() => document.execCommand('justifyRight', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Align Right"
                                >→</button>
                                <button 
                                  onClick={() => document.execCommand('justifyFull', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Justify"
                                >≡</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => insertContent('link')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Link"
                                >🔗</button>
                                <button 
                                  onClick={() => insertContent('image')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Image"
                                >🖼️</button>
                                <button 
                                  onClick={() => insertContent('table')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Table"
                                >⊞</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={handleUndo}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Undo"
                                >↶</button>
                                <button 
                                  onClick={handleRedo}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Redo"
                                >↷</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={clearFormatting}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Clear Formatting"
                                >Tx</button>
                                <button 
                                  onClick={() => {
                                    const editor = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
                                    if (editor) {
                                      editor.focus();
                                      editor.style.minHeight = '400px';
                                    }
                                  }}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Fullscreen"
                                >⛶</button>
                              </div>
                            </div>
                          </div>
                          {/* Content Area */}
                          <div
                            contentEditable
                            onInput={handleEditorInput}
                            onFocus={() => setIsEditorFocused(true)}
                            onBlur={() => setIsEditorFocused(false)}
                            dangerouslySetInnerHTML={{ __html: formData.content || '<p><br></p>' }}
                            className={`w-full px-4 py-3 border-0 rounded-b-lg focus:ring-0 resize-none min-h-[200px] ${
                              isDarkMode 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-white text-gray-900'
                            } ${
                              isEditorFocused ? 'outline-none' : ''
                            }`}
                            style={{
                              fontFamily: 'inherit',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              outline: 'none'
                            }}
                          />
                          
                          {/* Rich text editor styles */}
                          <style dangerouslySetInnerHTML={{
                            __html: `
                              [contenteditable="true"] h1 {
                                font-size: 2em !important;
                                font-weight: bold !important;
                                margin: 0.67em 0 !important;
                                line-height: 1.2 !important;
                              }
                              [contenteditable="true"] h2 {
                                font-size: 1.5em !important;
                                font-weight: bold !important;
                                margin: 0.75em 0 !important;
                                line-height: 1.3 !important;
                              }
                              [contenteditable="true"] h3 {
                                font-size: 1.17em !important;
                                font-weight: bold !important;
                                margin: 0.83em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] h4 {
                                font-size: 1em !important;
                                font-weight: bold !important;
                                margin: 1.12em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] h5 {
                                font-size: 0.83em !important;
                                font-weight: bold !important;
                                margin: 1.5em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] h6 {
                                font-size: 0.75em !important;
                                font-weight: bold !important;
                                margin: 1.67em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] blockquote {
                                border-left: 4px solid #ccc !important;
                                margin: 1em 0 !important;
                                padding-left: 1em !important;
                                font-style: italic !important;
                                color: #666 !important;
                              }
                              [contenteditable="true"] pre {
                                background-color: #f4f4f4 !important;
                                padding: 1em !important;
                                border-radius: 4px !important;
                                font-family: monospace !important;
                                overflow-x: auto !important;
                                margin: 1em 0 !important;
                              }
                              [contenteditable="true"] p {
                                margin: 1em 0 !important;
                              }
                            `
                          }} />
                        </div>
                      </div>

                      {/* Cover */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Cover
                        </label>
                        
                        {coverPreview ? (
                          // Show preview when image is uploaded
                          <div className="relative">
                            <img 
                              src={coverPreview} 
                              alt="Cover preview" 
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <button
                              onClick={removeCover}
                              className={`absolute top-2 right-2 p-1.5 rounded-full ${
                                isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                              } shadow-lg`}
                              title="Remove cover"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          // Show upload area when no image
                          <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                              isDarkMode ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                            onDrop={handleCoverDrop}
                            onDragOver={handleCoverDragOver}
                            onClick={() => document.getElementById('cover-upload')?.click()}
                          >
                            <input
                              id="cover-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleCoverUpload}
                              className="hidden"
                            />
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                                  isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                                }`}>
                                  <FileText className={`h-8 w-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </div>
                              </div>
                              <div>
                                <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                  Drop or select a file
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Drag a file here, or <span className="text-emerald-600 underline">browse</span> your device.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Properties Section */}
            <motion.div
              className={`rounded-lg border transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-700 bg-gray-800/30' 
                  : 'border-gray-200 bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => setPropertiesExpanded(!propertiesExpanded)}
              >
                        <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
                    Properties
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Additional functions and attributes...
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: propertiesExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {propertiesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700">
                      {/* Category */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Category *
                        </label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="techniques">Techniques</option>
                          <option value="suggestions">Suggestions</option>
                          <option value="books">Books</option>
                          <option value="videos">Videos</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Tags
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          placeholder="Add tags (comma separated)"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Author */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Author
                        </label>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          placeholder="Author name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          URL Slug
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: e.target.value})}
                          placeholder="url-slug (auto-generated from title)"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Featured */}
                      <div className="flex items-center space-x-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                          <span className={`ml-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              Featured
                            </span>
                        </label>
                      </div>

                      {/* SEO Settings */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          SEO Settings
                        </label>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Meta title"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                          <textarea
                            placeholder="Meta description"
                            rows={2}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
                        </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Publish Toggle */}
            <div className="flex items-center space-x-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.publish}
                  onChange={(e) => setFormData({...formData, publish: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                <span className={`ml-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Publish
                </span>
              </label>
                      </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                        <motion.button
                className={`px-6 py-2.5 border rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Preview
                        </motion.button>
                        <motion.button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create post
                        </motion.button>
                      </div>
          </div>
        </Card>
      )}

      {/* All Content List */}
      {activeTab === 'content-list' && (
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Content Management</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>List</span>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="techniques">Techniques</option>
              <option value="suggestions">Suggestions</option>
              <option value="books">Books</option>
              <option value="videos">Videos</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="latest">Sort By: Latest</option>
              <option value="oldest">Sort By: Oldest</option>
              <option value="views">Sort By: Most Views</option>
              <option value="title">Sort By: Title A-Z</option>
            </select>
          </div>

          {/* Content Type Filters */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                All ({articles.length + techniques.length + books.length + videos.length + suggestions.length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Published ({articles.filter(a => a.status === 'published').length + techniques.filter(t => t.status === 'published').length + books.filter(b => b.status === 'published').length + videos.filter(v => v.status === 'published').length + suggestions.filter(s => s.status === 'published').length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Draft ({articles.filter(a => a.status === 'draft').length + techniques.filter(t => t.status === 'draft').length + books.filter(b => b.status === 'draft').length + videos.filter(v => v.status === 'draft').length + suggestions.filter(s => s.status === 'draft').length})
              </span>
            </div>
          </div>

          {/* Combined Content List */}
          <div className="space-y-4">
            {/* Techniques */}
            {techniques.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Techniques ({techniques.length})
                </h3>
                <div className="grid gap-4">
                  {sortContent(techniques.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedCategory === 'all' || selectedCategory === 'techniques')
                  )).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'published'
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                          </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{item.views || 0} views</span>
                            <span>{item.likes || 0} likes</span>
                            <span>{item.createdAt.split('T')[0]}</span>
                          </div>
                          <button
                            onClick={() => handleEditItem(item)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              isDarkMode
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
          </div>
                          </div>
                        )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Suggestions ({suggestions.length})
                </h3>
                <div className="grid gap-4">
                  {sortContent(suggestions.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedCategory === 'all' || selectedCategory === 'suggestions')
                  )).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{item.views || 0} views</span>
                            <span>{item.likes || 0} likes</span>
                            <span>{item.createdAt.split('T')[0]}</span>
                          </div>
                          <button
                            onClick={() => handleEditItem(item)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              isDarkMode
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                          </div>
                        )}

            {/* Books */}
            {books.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Books ({books.length})
                </h3>
                <div className="grid gap-4">
                  {sortContent(books.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedCategory === 'all' || selectedCategory === 'books')
                  )).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                      </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{item.views || 0} views</span>
                            <span>{item.likes || 0} likes</span>
                            <span>{item.createdAt.split('T')[0]}</span>
                          </div>
                          <button
                            onClick={() => handleEditItem(item)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              isDarkMode
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Videos ({videos.length})
                </h3>
                <div className="grid gap-4">
                  {sortContent(videos.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedCategory === 'all' || selectedCategory === 'videos')
                  )).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                      </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{item.views || 0} views</span>
                            <span>{item.likes || 0} likes</span>
                            <span>{item.createdAt.split('T')[0]}</span>
                          </div>
                          <button
                            onClick={() => handleEditItem(item)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              isDarkMode
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
          </div>
              </div>
            )}

            {/* No content message */}
            {techniques.length === 0 && suggestions.length === 0 && books.length === 0 && videos.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No content found. Create your first content!
              </p>
            </div>
          )}
          </div>
        </Card>
      )}

      {/* Edit Content */}
      {activeTab === 'content-edit' && editingItem && (
        <Card>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Edit Content
              </h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Editing: {editingItem.title}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('content-list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              ← Back to List
            </button>
          </div>

          {/* Edit Form */}
          <div className="space-y-6">
            {/* Details Section */}
            <motion.div
              className={`border rounded-xl overflow-hidden ${
                isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Header */}
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => setEditDetailsExpanded(!editDetailsExpanded)}
              >
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
                    Details
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Basic content information and rich text editing...
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: editDetailsExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {editDetailsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700">
                      {/* Title */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Post title *
                        </label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setEditFormData({
                              ...editFormData, 
                              title: title,
                              slug: editFormData.slug || generateSlug(title)
                            });
                          }}
                          placeholder="Post title"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Description *
                        </label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                          placeholder="Description"
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                          required
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Content *
                        </label>
                        <div className={`border rounded-lg overflow-hidden ${
                          isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                        }`}>
                          {/* Rich Text Editor Toolbar */}
                          <div className={`p-3 border-b ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                            {/* First Row */}
                            <div className="flex items-center space-x-2 mb-2">
                              <select 
                                value={selectedFormat}
                                onChange={(e) => handleFormatChange(e.target.value)}
                                className={`px-3 py-1.5 text-sm border rounded font-medium ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                              >
                                <option>Paragraph</option>
                                <option>Heading 1</option>
                                <option>Heading 2</option>
                                <option>Heading 3</option>
                                <option>Heading 4</option>
                                <option>Heading 5</option>
                                <option>Heading 6</option>
                                <option>Quote</option>
                                <option>Code</option>
                              </select>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => applyFormatting('bold')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Bold"
                                >B</button>
                                <button 
                                  onClick={() => applyFormatting('italic')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 italic ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Italic"
                                >I</button>
                                <button 
                                  onClick={() => applyFormatting('underline')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 underline ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Underline"
                                >U</button>
                                <button 
                                  onClick={() => applyFormatting('strikethrough')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 line-through ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Strikethrough"
                                >S</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => applyList('bullet')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Bullet List"
                                >•</button>
                                <button 
                                  onClick={() => applyList('number')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Numbered List"
                                >1.</button>
                                <button 
                                  onClick={() => applyList('quote')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Quote"
                                >"</button>
                              </div>
                            </div>
                            
                            {/* Second Row */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => document.execCommand('justifyLeft', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Align Left"
                                >←</button>
                                <button 
                                  onClick={() => document.execCommand('justifyCenter', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Align Center"
                                >→</button>
                                <button 
                                  onClick={() => document.execCommand('justifyRight', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Align Right"
                                >→</button>
                                <button 
                                  onClick={() => document.execCommand('justifyFull', false)}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Justify"
                                >≡</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => insertContent('link')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Link"
                                >🔗</button>
                                <button 
                                  onClick={() => insertContent('image')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Image"
                                >🖼️</button>
                                <button 
                                  onClick={() => insertContent('table')}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Table"
                                >⊞</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={handleUndo}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Undo"
                                >↶</button>
                                <button 
                                  onClick={handleRedo}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Redo"
                                >↷</button>
                              </div>
                              <div className="w-px h-6 bg-gray-400"></div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={clearFormatting}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Clear Formatting"
                                >Tx</button>
                                <button 
                                  onClick={() => {
                                    const editor = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
                                    if (editor) {
                                      editor.focus();
                                      editor.style.minHeight = '400px';
                                    }
                                  }}
                                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} 
                                  title="Fullscreen"
                                >⛶</button>
                              </div>
                            </div>
                          </div>
                          {/* Content Area */}
                          <div
                            contentEditable
                            onInput={(e) => {
                              const content = e.currentTarget.innerHTML;
                              setEditFormData({...editFormData, content: content});
                            }}
                            onFocus={() => setIsEditorFocused(true)}
                            onBlur={() => setIsEditorFocused(false)}
                            dangerouslySetInnerHTML={{ __html: editFormData.content || '<p><br></p>' }}
                            className={`w-full px-4 py-3 border-0 rounded-b-lg focus:ring-0 resize-none min-h-[200px] ${
                              isDarkMode 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-white text-gray-900'
                            } ${
                              isEditorFocused ? 'outline-none' : ''
                            }`}
                            style={{
                              fontFamily: 'inherit',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              outline: 'none',
                              direction: 'ltr',
                              textAlign: 'left'
                            }}
                            dir="ltr"
                          />
                          
                          {/* Rich text editor styles */}
                          <style dangerouslySetInnerHTML={{
                            __html: `
                              [contenteditable="true"] h1 {
                                font-size: 2em !important;
                                font-weight: bold !important;
                                margin: 0.67em 0 !important;
                                line-height: 1.2 !important;
                              }
                              [contenteditable="true"] h2 {
                                font-size: 1.5em !important;
                                font-weight: bold !important;
                                margin: 0.75em 0 !important;
                                line-height: 1.3 !important;
                              }
                              [contenteditable="true"] h3 {
                                font-size: 1.17em !important;
                                font-weight: bold !important;
                                margin: 0.83em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] h4 {
                                font-size: 1em !important;
                                font-weight: bold !important;
                                margin: 1.12em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] h5 {
                                font-size: 0.83em !important;
                                font-weight: bold !important;
                                margin: 1.5em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] h6 {
                                font-size: 0.75em !important;
                                font-weight: bold !important;
                                margin: 1.67em 0 !important;
                                line-height: 1.4 !important;
                              }
                              [contenteditable="true"] blockquote {
                                border-left: 4px solid #ccc !important;
                                margin: 1em 0 !important;
                                padding-left: 1em !important;
                                font-style: italic !important;
                                color: #666 !important;
                              }
                              [contenteditable="true"] pre {
                                background-color: #f4f4f4 !important;
                                padding: 1em !important;
                                border-radius: 4px !important;
                                font-family: monospace !important;
                                overflow-x: auto !important;
                                margin: 1em 0 !important;
                              }
                              [contenteditable="true"] p {
                                margin: 1em 0 !important;
                              }
                            `
                          }} />
                        </div>
                      </div>

                      {/* Cover */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Cover
                        </label>
                        
                        {editCoverPreview ? (
                          // Show preview when image is uploaded
                          <div className="relative">
                            <img 
                              src={editCoverPreview} 
                              alt="Cover preview" 
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <button
                              onClick={removeEditCover}
                              className={`absolute top-2 right-2 p-1.5 rounded-full ${
                                isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                              } shadow-lg`}
                              title="Remove cover"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          // Show upload area when no image
                          <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                              isDarkMode ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                            onDrop={handleEditCoverDrop}
                            onDragOver={handleEditCoverDragOver}
                            onClick={() => document.getElementById('edit-cover-upload')?.click()}
                          >
                            <input
                              id="edit-cover-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleEditCoverUpload}
                              className="hidden"
                            />
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                                  isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                                }`}>
                                  <FileText className={`h-8 w-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </div>
                              </div>
                              <div>
                                <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                  Drop or select a file
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Drag a file here, or <span className="text-emerald-600 underline">browse</span> your device.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Properties Section */}
            <motion.div
              className={`border rounded-xl overflow-hidden ${
                isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Section Header */}
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => setEditPropertiesExpanded(!editPropertiesExpanded)}
              >
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
                    Properties
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Additional functions and attributes...
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: editPropertiesExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {editPropertiesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700">
                      {/* Category */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Category *
                        </label>
                        <select 
                          value={editFormData.category}
                          onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="techniques">Techniques</option>
                          <option value="suggestions">Suggestions</option>
                          <option value="books">Books</option>
                          <option value="videos">Videos</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Tags
                        </label>
                        <input
                          type="text"
                          value={editFormData.tags}
                          onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                          placeholder="Add tags (comma separated)"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Author */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          Author
                        </label>
                        <input
                          type="text"
                          value={editFormData.author}
                          onChange={(e) => setEditFormData({...editFormData, author: e.target.value})}
                          placeholder="Author name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          URL Slug
                        </label>
                        <input
                          type="text"
                          value={editFormData.slug}
                          onChange={(e) => setEditFormData({...editFormData, slug: e.target.value})}
                          placeholder="url-slug (auto-generated from title)"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Publish Toggle */}
            <div className="flex items-center space-x-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={editFormData.publish}
                  onChange={(e) => setEditFormData({...editFormData, publish: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                <span className={`ml-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Publish
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                className={`px-6 py-2.5 border rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('content-list')}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleUpdateSubmit}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Update post
              </motion.button>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Messages Management */}
      {activeTab === 'messages' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
              Contact Messages ({contactMessages.length})
            </h3>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                Unread: {contactMessages.filter(msg => msg.status === 'unread').length}
              </span>
            </div>
          </div>

          {contactMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No messages yet. When users submit the contact form, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contactMessages
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((message) => (
                <motion.div
                  key={message.id}
                  className={`border rounded-lg p-6 transition-all duration-300 ${
                    message.status === 'unread'
                      ? isDarkMode
                        ? 'border-emerald-500/30 bg-emerald-900/20'
                        : 'border-emerald-200 bg-emerald-50'
                      : isDarkMode
                        ? 'border-gray-700 bg-gray-800/30'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {message.subject}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          message.status === 'unread'
                            ? 'bg-red-100 text-red-800'
                            : message.status === 'read'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <strong>From:</strong> {message.name} ({message.email})
                      </div>
                      <div className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={message.status}
                         onChange={(e) => handleMessageStatusChange(message.id, e.target.value as 'unread' | 'read' | 'replied')}
                        className={`px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <motion.button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700/30' : 'bg-white'
                  }`}>
                    <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {message.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
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

// Content Form Component
interface ContentFormProps {
  type: string;
  item: ContentItem | null;
  categories: string[];
  onSave: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ type, item, categories, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<ContentItem>>(
    item || {
      title: '',
      author: '',
      instructor: '',
      category: categories[0] || '',
      status: 'draft',
      description: '',
      tags: '',
      imageUrl: '',
      videoUrl: '',
      buyLink: '',
      borrowLink: '',
      embedCode: '',
      duration: '',
      isbn: '',
      difficulty: 'beginner',
      rating: 5,
      price: 0,
      featured: false,
      type: 'general'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      tags: formData.tags 
        ? Array.isArray(formData.tags) 
          ? formData.tags 
          : formData.tags.split(',').map((tag: string) => tag.trim())
        : [],
      rating: parseFloat(formData.rating) || 0,
      price: parseFloat(formData.price) || 0
    };
    onSave(processedData);
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1, -1)}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        {type !== 'suggestions' && (
          <div>
            <label className={labelClass}>
              {type === 'videos' ? 'Instructor' : 'Author'} *
            </label>
            <input
              type="text"
              value={type === 'videos' ? formData.instructor : formData.author}
              onChange={(e) => setFormData({ 
                ...formData, 
                [type === 'videos' ? 'instructor' : 'author']: e.target.value 
              })}
              className={inputClass}
              required
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputClass}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {(type === 'books' || type === 'suggestions') && (
          <>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Product Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/product"
              />
            </div>
          </>
        )}

        {type === 'videos' && (
          <div>
            <label className={labelClass}>Duration</label>
            <input
              type="text"
              placeholder="e.g., 12:45"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className={inputClass}
            />
          </div>
        )}

        {type === 'books' && (
          <div>
            <label className={labelClass}>ISBN</label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className={inputClass}
            />
          </div>
        )}

        {type === 'techniques' && (
          <div>
            <label className={labelClass}>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className={inputClass}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        )}

        {type === 'suggestions' && (
          <div>
            <label className={labelClass}>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={inputClass}
            >
              <option value="tool">Tool</option>
              <option value="accessory">Accessory</option>
              <option value="book">Book</option>
              <option value="general">General</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`${inputClass} h-32 resize-none`}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            type="text"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className={inputClass}
            placeholder="e.g., organic, beginner, indoor"
          />
        </div>

        <div>
          <label className={labelClass}>Featured Image</label>
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            onError={(error) => alert(error)}
            className="mt-1"
            placeholder="Upload featured image"
          />
        </div>

        {type === 'videos' && (
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className={inputClass}
            />
          </div>
        )}

        {(type === 'books' || type === 'suggestions') && (
          <>
            <div>
              <label className={labelClass}>Buy Link</label>
              <input
                type="url"
                value={formData.buyLink}
                onChange={(e) => setFormData({ ...formData, buyLink: e.target.value })}
                className={inputClass}
              />
            </div>
            {type === 'books' && (
              <div>
                <label className={labelClass}>Borrow Link</label>
                <input
                  type="url"
                  value={formData.borrowLink}
                  onChange={(e) => setFormData({ ...formData, borrowLink: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}
          </>
        )}
      </div>

      {type === 'videos' && (
        <div>
          <label className={labelClass}>Embed Code</label>
          <textarea
            value={formData.embedCode}
            onChange={(e) => setFormData({ ...formData, embedCode: e.target.value })}
            className={`${inputClass} h-24 resize-none`}
            placeholder="<iframe src='...'></iframe>"
          />
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className={labelClass.replace('block', 'inline')}>Featured</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <motion.button
          type="button"
          onClick={onCancel}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {item ? 'Update' : 'Create'}
        </motion.button>
      </div>
    </form>
  );
};

export default AdminDashboard;