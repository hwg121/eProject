import React from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, FileText, Star } from 'lucide-react';
import Card from '../UI/Card';
import { AdminStats } from '../../types/admin';

interface StatisticsSectionProps {
  stats: AdminStats;
  isDarkMode: boolean;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ stats, isDarkMode }) => {
  const statisticsData = [
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
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {statisticsData.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="text-center p-4 sm:p-6" gradient={true} glow={true}>
            <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${stat.color} text-white mb-3 sm:mb-4`}>
              <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
              {stat.value}
            </h3>
            <p className={`font-medium mb-1 sm:mb-2 text-sm sm:text-base ${isDarkMode ? 'text-emerald-200' : 'text-gray-600'}`}>
              {stat.label}
            </p>
            <span className={`text-xs sm:text-sm font-semibold ${stat.changeColor || 'text-green-500'}`}>
              {stat.change}
            </span>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatisticsSection;
