import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, BookOpen, Video, Lightbulb, Star, 
  Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Wrench, Leaf, Package, Sparkles,
  TrendingUp, Activity, Globe, Clock, Award, Target,
  FileText, Image, Link, Tag, DollarSign, Heart,
  Settings, Bell, Download, Upload, RefreshCw, MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/UI/Card';

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
  price?: number;
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
  embedCode?: string;
  duration?: string;
  isbn?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [currentContentType, setCurrentContentType] = useState<string>('');

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Mock data with more detailed information
  const [stats, setStats] = useState({
    totalUsers: 15247,
    totalViews: 892456,
    totalArticles: 156,
    totalVideos: 89,
    totalBooks: 234,
    totalSuggestions: 178,
    monthlyGrowth: 12.5,
    weeklyGrowth: 3.2,
    avgRating: 4.7,
    totalRevenue: 45678,
    activeUsers: 8934,
    conversionRate: 2.8
  });

  const [recentActivity] = useState([
    { id: 1, action: 'New user registered', user: 'Sarah Johnson', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Article published', user: 'Mike Garden', time: '15 minutes ago', type: 'content' },
    { id: 3, action: 'Video uploaded', user: 'Emma Nature', time: '1 hour ago', type: 'media' },
    { id: 4, action: 'Book review added', user: 'John Smith', time: '2 hours ago', type: 'review' },
    { id: 5, action: 'New suggestion created', user: 'Lisa Green', time: '3 hours ago', type: 'content' }
  ]);

  const [topContent] = useState([
    { id: 1, title: 'Container Gardening Basics', views: 12456, likes: 892, type: 'article' },
    { id: 2, title: 'Pruning Techniques Video', views: 9834, likes: 567, type: 'video' },
    { id: 3, title: 'The Well-Tended Garden', views: 7654, likes: 432, type: 'book' },
    { id: 4, title: 'Best Garden Tools 2024', views: 6543, likes: 321, type: 'suggestion' }
  ]);

  // Mock content data
  const [techniques, setTechniques] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Container Gardening for Small Spaces',
      author: 'Sarah Green',
      category: 'Beginner',
      status: 'published',
      views: 12456,
      likes: 892,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      featured: true,
      difficulty: 'beginner',
      description: 'Learn how to maximize your garden productivity in small spaces',
      tags: ['container', 'small-space', 'urban'],
      imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
    },
    {
      id: '2',
      title: 'Advanced Composting Techniques',
      author: 'Mike Garden',
      category: 'Advanced',
      status: 'draft',
      views: 0,
      likes: 0,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      featured: false,
      difficulty: 'advanced',
      description: 'Master the art of composting with advanced methods',
      tags: ['composting', 'organic', 'soil'],
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [books, setBooks] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'The Well-Tended Perennial Garden',
      author: 'Tracy DiSabato-Aust',
      category: 'Perennials',
      status: 'published',
      rating: 4.8,
      price: 24.95,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
      description: 'A comprehensive guide to growing beautiful perennial gardens',
      isbn: '978-1604692556',
      buyLink: 'https://example.com/buy',
      borrowLink: 'https://example.com/borrow',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [suggestions, setSuggestions] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Best Pruning Shears 2024',
      category: 'Tools',
      status: 'published',
      rating: 4.6,
      price: 29.99,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15',
      featured: true,
      type: 'tool',
      description: 'Top-rated pruning shears for professional results',
      buyLink: 'https://example.com/buy-shears',
      imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
    }
  ]);

  const [tools, setTools] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Professional Pruning Shears',
      category: 'Cutting Tools',
      status: 'published',
      price: 29.99,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      description: 'High-quality steel pruning shears for precise cuts',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [essentials, setEssentials] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Organic Compost',
      category: 'Soil Amendment',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      description: 'Rich organic compost for healthy plant growth',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [pots, setPots] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Ceramic Garden Pot',
      category: 'Ceramic',
      status: 'published',
      price: 24.99,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      description: 'Beautiful ceramic pot perfect for indoor and outdoor plants',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [accessories, setAccessories] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Solar Garden Lights',
      category: 'Lighting',
      status: 'published',
      price: 29.99,
      rating: 4.7,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      description: 'Beautiful solar-powered LED lights for garden decoration',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [aboutPages, setAboutPages] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'About Green Groves',
      category: 'Company',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      description: 'Learn about Green Groves - your trusted gardening companion',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  const [videos, setVideos] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Pruning Techniques for Beginners',
      instructor: 'Emma Nature',
      category: 'Techniques',
      status: 'published',
      views: 9834,
      likes: 567,
      duration: '12:45',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10',
      description: 'Learn basic pruning techniques for healthy plants',
      videoUrl: 'https://youtube.com/watch?v=example',
      embedCode: '<iframe src="..."></iframe>',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    }
  ]);

  // Load contact messages from localStorage
  useEffect(() => {
    const loadContactMessages = () => {
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      setContactMessages(messages);
    };
    
    loadContactMessages();
    
    // Listen for storage changes to update messages in real-time
    const handleStorageChange = () => {
      loadContactMessages();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const categories = {
    techniques: ['Beginner', 'Intermediate', 'Advanced', 'Seasonal', 'Indoor', 'Outdoor'],
    books: ['Beginner Guides', 'Advanced Techniques', 'Plant Science', 'Garden Design', 'Organic Gardening'],
    suggestions: ['Tools', 'Accessories', 'Books', 'Seeds', 'Fertilizers'],
    videos: ['Techniques', 'Plant Care', 'Garden Design', 'Seasonal Tips', 'Tool Reviews'],
    tools: ['Cutting Tools', 'Hand Tools', 'Power Tools', 'Watering', 'Soil Tools'],
    essentials: ['Soil Amendment', 'Growing Medium', 'Fertilizer', 'Seeds', 'Plant Food'],
    pots: ['Ceramic', 'Plastic', 'Terracotta', 'Metal', 'Wood', 'Fiberglass'],
    accessories: ['Lighting', 'Decorative', 'Functional', 'Watering', 'Support', 'Storage'],
    about: ['Company', 'Team', 'Mission', 'History', 'Contact']
  };

  const getContentData = (type: string) => {
    switch (type) {
      case 'techniques': return techniques;
      case 'books': return books;
      case 'suggestions': return suggestions;
      case 'videos': return videos;
      case 'tools': return tools;
      case 'essentials': return essentials;
      case 'pots': return pots;
      case 'accessories': return accessories;
      case 'about': return aboutPages;
      default: return [];
    }
  };

  const setContentData = (type: string, data: ContentItem[]) => {
    switch (type) {
      case 'techniques': setTechniques(data); break;
      case 'books': setBooks(data); break;
      case 'suggestions': setSuggestions(data); break;
      case 'videos': setVideos(data); break;
      case 'tools': setTools(data); break;
      case 'essentials': setEssentials(data); break;
      case 'pots': setPots(data); break;
      case 'accessories': setAccessories(data); break;
      case 'about': setAboutPages(data); break;
    }
  };

  const filteredContent = getContentData(activeTab).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.instructor && item.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleDelete = (id: string, type: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const currentData = getContentData(type);
      const updatedData = currentData.filter(item => item.id !== id);
      setContentData(type, updatedData);
    }
  };

  const handleSave = (formData: any) => {
    const currentData = getContentData(currentContentType);
    
    if (editingItem) {
      // Update existing item
      const updatedData = currentData.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      );
      setContentData(currentContentType, updatedData);
    } else {
      // Create new item
      const newItem: ContentItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0
      };
      setContentData(currentContentType, [...currentData, newItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleMessageStatusChange = (messageId: string, newStatus: 'unread' | 'read' | 'replied') => {
    const updatedMessages = contactMessages.map(msg =>
      msg.id === messageId
        ? { ...msg, status: newStatus, updatedAt: new Date().toISOString() }
        : msg
    );
    setContactMessages(updatedMessages);
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updatedMessages = contactMessages.filter(msg => msg.id !== messageId);
      setContactMessages(updatedMessages);
      localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need to be logged in to access the admin dashboard.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${
          isDarkMode 
            ? 'from-emerald-300 to-green-300' 
            : 'from-emerald-800 to-green-700'
        }`}>
          Admin Dashboard
        </h1>
        <p className={`text-xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
          Welcome back, {user.name}! Manage your gardening platform.
        </p>
      </motion.div>

      {/* Quick Stats */}
      {activeTab === 'overview' && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'from-blue-500 to-indigo-600', change: '+12.5%' },
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'from-green-500 to-emerald-600', change: '+8.2%' },
            { label: 'Content Items', value: (stats.totalArticles + stats.totalVideos + stats.totalBooks + stats.totalSuggestions).toLocaleString(), icon: FileText, color: 'from-purple-500 to-violet-600', change: '+15.3%' },
            { label: 'Avg Rating', value: stats.avgRating.toString(), icon: Star, color: 'from-yellow-500 to-orange-600', change: '+0.2' }
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
                <span className="text-green-500 text-sm font-semibold">
                  {stat.change}
                </span>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
            { id: 'techniques', label: 'Techniques', icon: Lightbulb, color: 'from-green-500 to-emerald-600' },
            { id: 'books', label: 'Books', icon: BookOpen, color: 'from-purple-500 to-violet-600' },
            { id: 'suggestions', label: 'Suggestions', icon: Star, color: 'from-yellow-500 to-orange-600' },
            { id: 'videos', label: 'Videos', icon: Video, color: 'from-red-500 to-pink-600' },
            { id: 'tools', label: 'Tools', icon: Wrench, color: 'from-blue-500 to-indigo-600' },
            { id: 'essentials', label: 'Essentials', icon: Leaf, color: 'from-green-500 to-emerald-600' },
            { id: 'pots', label: 'Pots', icon: Package, color: 'from-amber-500 to-orange-600' },
            { id: 'accessories', label: 'Accessories', icon: Sparkles, color: 'from-pink-500 to-rose-600' },
            { id: 'about', label: 'About Pages', icon: FileText, color: 'from-indigo-500 to-purple-600' },
            { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'from-indigo-500 to-purple-600' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? `text-white bg-gradient-to-r ${tab.color} shadow-lg`
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {activeTab !== 'overview' && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.id === 'messages' ? contactMessages.length : getContentData(tab.id).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </Card>

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

      {/* Content Management */}
      {activeTab !== 'overview' && activeTab !== 'messages' && (
        <Card>
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
              {activeTab === 'messages' ? (
                <>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </>
              ) : (
                categories[activeTab as keyof typeof categories]?.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))
              )}
            </select>
            {activeTab !== 'messages' && (
              <motion.button
                onClick={() => handleCreate(activeTab)}
                className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                <span>Create New</span>
              </motion.button>
            )}
          </div>

          {/* Content Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title
                  </th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {activeTab === 'videos' ? 'Instructor' : 'Author'}
                  </th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stats
                  </th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => (
                  <motion.tr
                    key={item.id}
                    className={`border-b hover:bg-opacity-50 transition-colors ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-800' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {item.title}
                          </p>
                          {item.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.author || item.instructor || '-'}
                    </td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.category}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="space-y-1">
                        {item.views !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{item.views.toLocaleString()}</span>
                          </div>
                        )}
                        {item.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        {item.price && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${item.price}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleEdit(item, activeTab)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(item.id, activeTab)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No content found. Create your first {activeTab.slice(0, -1)}!
              </p>
            </div>
          )}
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
                        onChange={(e) => handleMessageStatusChange(message.id, e.target.value as any)}
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
  );
};

// Content Form Component
interface ContentFormProps {
  type: string;
  item: ContentItem | null;
  categories: string[];
  onSave: (data: any) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ type, item, categories, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<any>(
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
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
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
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={inputClass}
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
          <label className={labelClass}>Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className={inputClass}
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