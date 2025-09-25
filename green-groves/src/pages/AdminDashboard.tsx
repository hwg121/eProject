import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, BookOpen, Video, Lightbulb, Star, Plus, Search, CreditCard as Edit, Trash2, Eye, Calendar, Wrench, Leaf, Package, Sparkles, TrendingUp, Activity, Globe, Clock, Award, Target, FileText, Image, Link, Tag, DollarSign, Heart, Settings, Bell, Download, Upload, RefreshCw, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/UI/Card';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const [stats] = useState({
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

      {/* Navigation Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
            { id: 'techniques', label: 'Techniques', icon: Lightbulb, color: 'from-green-500 to-emerald-600', link: '/admin/techniques' },
            { id: 'tools', label: 'Tools', icon: Wrench, color: 'from-blue-500 to-indigo-600', link: '/admin/tools' },
            { id: 'essentials', label: 'Essentials', icon: Leaf, color: 'from-green-500 to-emerald-600', link: '/admin/essentials' },
            { id: 'pots', label: 'Pots', icon: Package, color: 'from-amber-500 to-orange-600', link: '/admin/pots' },
            { id: 'accessories', label: 'Accessories', icon: Sparkles, color: 'from-pink-500 to-rose-600', link: '/admin/accessories' },
            { id: 'about', label: 'About Pages', icon: FileText, color: 'from-indigo-500 to-purple-600', link: '/admin/about' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                if (tab.link) {
                  window.location.href = tab.link;
                } else {
                  setActiveTab(tab.id);
                }
              }}
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

          {/* Quick Actions */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                Quick Actions
              </h3>
              <Settings className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add Technique', icon: Lightbulb, link: '/admin/techniques', color: 'from-green-500 to-emerald-600' },
                { label: 'Add Tool', icon: Wrench, link: '/admin/tools', color: 'from-blue-500 to-indigo-600' },
                { label: 'Add Video', icon: Video, link: '/admin/videos', color: 'from-red-500 to-pink-600' },
                { label: 'Add Book', icon: BookOpen, link: '/admin/books', color: 'from-purple-500 to-violet-600' }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => window.location.href = action.link}
                  className={`p-4 rounded-xl text-white bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <action.icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-semibold">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;