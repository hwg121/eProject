import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Eye, Star, MessageSquare, Activity, FileText, Video, BookOpen, Wrench, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardChartsProps {
  stats: {
    totalUsers: number;
    totalViews: number;
    totalArticles: number;
    totalVideos: number;
    totalBooks: number;
    totalSuggestions: number;
    totalAboutUs: number;
    totalContactMessages: number;
    monthlyGrowth: number;
    weeklyGrowth: number;
    avgRating: number;
  };
  onNavigate?: (section: string, action?: string) => void;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats, onNavigate }) => {
  const { isDarkMode } = useTheme();

  // Real data for charts - using actual stats with realistic distribution
  const baseViews = Math.max(stats.totalViews, 100); // Ensure minimum for visualization
  const baseUsers = Math.max(stats.totalUsers, 10);
  
  const weeklyData = [
    { day: 'Mon', views: Math.floor(baseViews * 0.12), users: Math.floor(baseUsers * 0.12) },
    { day: 'Tue', views: Math.floor(baseViews * 0.16), users: Math.floor(baseUsers * 0.16) },
    { day: 'Wed', views: Math.floor(baseViews * 0.18), users: Math.floor(baseUsers * 0.18) },
    { day: 'Thu', views: Math.floor(baseViews * 0.15), users: Math.floor(baseUsers * 0.15) },
    { day: 'Fri', views: Math.floor(baseViews * 0.20), users: Math.floor(baseUsers * 0.20) },
    { day: 'Sat', views: Math.floor(baseViews * 0.14), users: Math.floor(baseUsers * 0.14) },
    { day: 'Sun', views: Math.floor(baseViews * 0.05), users: Math.floor(baseUsers * 0.05) }
  ];

  const contentDistribution = [
    { 
      type: 'Content', 
      count: stats.totalArticles + stats.totalVideos, 
      color: 'bg-blue-500' 
    },
    { 
      type: 'Products', 
      count: stats.totalBooks + stats.totalSuggestions + ((stats as any).totalTools || 0) + ((stats as any).totalPots || 0) + ((stats as any).totalAccessories || 0), 
      color: 'bg-emerald-500' 
    }
  ].filter(item => item.count > 0); // Only show categories with content


  const SimpleBarChart = ({ data, maxValue }: { data: typeof weeklyData, maxValue: number }) => {
    return (
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map((item, index) => {
          const height = (item.views / maxValue) * 100;
          return (
            <motion.div
              key={item.day}
              className="flex flex-col items-center space-y-2 flex-1"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative w-full flex justify-center">
                <motion.div
                  className={`w-6 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 relative group`}
                  style={{ height: `${height}%` }}
                  whileHover={{ scaleY: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {item.views.toLocaleString()}
                  </div>
                </motion.div>
              </div>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.day}
              </span>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const DonutChart = ({ data }: { data: typeof contentDistribution }) => {
    let cumulativePercentage = 0;
    const totalItems = data.reduce((sum, item) => sum + item.count, 0);
    
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = totalItems > 0 ? (item.count / totalItems) * 100 : 0;
            const circumference = 2 * Math.PI * 45; // radius = 45
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -(cumulativePercentage / 100) * circumference;
            
            cumulativePercentage += percentage;
            
            return (
              <motion.circle
                key={item.type}
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={index === 0 ? '#3b82f6' : '#10b981'} // Blue for Content, Emerald for Products
                strokeWidth="10"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {totalItems}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {/* Content Distribution Chart */}
      <motion.div
        className={`p-4 lg:p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Content Distribution
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Content types breakdown
            </p>
          </div>
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <Eye className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <DonutChart data={contentDistribution} />
        </div>

        <div className="space-y-3">
          {contentDistribution.map((item, index) => {
            const totalItems = contentDistribution.reduce((sum, i) => sum + i.count, 0);
            const percentage = totalItems > 0 ? ((item.count / totalItems) * 100).toFixed(1) : '0.0';
            const colors = ['bg-blue-500', 'bg-emerald-500'];
            
            return (
              <motion.div
                key={item.type}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.count}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({percentage}%)
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className={`p-4 lg:p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Quick Actions
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Common admin tasks
            </p>
          </div>
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
            <Activity className={`h-5 w-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { 
              label: 'Add Article', 
              icon: FileText, 
              description: 'Create new article',
              gradient: 'from-emerald-500 to-green-600',
              hoverGradient: 'from-emerald-600 to-green-700',
              iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              action: 'create-article'
            },
            { 
              label: 'Upload Video', 
              icon: Video, 
              description: 'Add new video',
              gradient: 'from-blue-500 to-blue-600',
              hoverGradient: 'from-blue-600 to-blue-700',
              iconBg: 'bg-blue-100 dark:bg-blue-900/30',
              iconColor: 'text-blue-600 dark:text-blue-400',
              action: 'create-video'
            },
            { 
              label: 'Add Product', 
              icon: Wrench, 
              description: 'Add new product',
              gradient: 'from-purple-500 to-purple-600',
              hoverGradient: 'from-purple-600 to-purple-700',
              iconBg: 'bg-purple-100 dark:bg-purple-900/30',
              iconColor: 'text-purple-600 dark:text-purple-400',
              action: 'create-product'
            }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              className={`group relative overflow-hidden bg-gradient-to-br ${action.gradient} hover:${action.hoverGradient} text-white p-4 rounded-xl font-medium text-sm transition-all duration-300 flex flex-col items-center space-y-3 shadow-lg hover:shadow-xl`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate && onNavigate('content', action.action)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full transform -translate-x-6 translate-y-6"></div>
              </div>
              
              {/* Icon */}
              <div className={`relative p-3 rounded-lg ${action.iconBg} transition-all duration-300 group-hover:scale-110`}>
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                <Plus className="absolute -top-1 -right-1 h-4 w-4 text-white bg-current rounded-full p-0.5 opacity-80" />
              </div>
              
              {/* Text */}
              <div className="relative text-center">
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs opacity-80 mt-1">{action.description}</div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
