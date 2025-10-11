import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Eye, Star, MessageSquare, Activity, FileText, Video, BookOpen, Wrench, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Fade,
  Zoom,
  Button,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  Build as BuildIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

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
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      {/* Content Distribution Chart */}
      <Fade in={true} timeout={600}>
        <Card
          sx={{
            position: 'relative !important',
            background: isDarkMode
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important',
            border: '1px solid !important',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1) !important' : 'rgba(0,0,0,0.08) !important',
            borderRadius: '16px !important',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0,0,0,0.3) !important'
              : '0 8px 32px rgba(0,0,0,0.08) !important',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '16px 16px 0 0',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', mb: 0.5 }}
                >
                  Content Distribution
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                  Content types breakdown
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Eye className="h-5 w-5" style={{ color: 'white' }} />
              </Avatar>
            </Box>

            <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

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
          </CardContent>
        </Card>
      </Fade>

      {/* Quick Actions */}
      <Fade in={true} timeout={800}>
        <Card
          sx={{
            position: 'relative !important',
            background: isDarkMode
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important',
            border: '1px solid !important',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1) !important' : 'rgba(0,0,0,0.08) !important',
            borderRadius: '16px !important',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0,0,0,0.3) !important'
              : '0 8px 32px rgba(0,0,0,0.08) !important',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px 16px 0 0',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', mb: 0.5 }}
                >
                  Quick Actions
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                  Common admin tasks
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Activity className="h-5 w-5" style={{ color: 'white' }} />
              </Avatar>
            </Box>

            <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { 
                  label: 'Add Article', 
                  icon: ArticleIcon,
                  description: 'Create new article',
                  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#10b981',
                  action: 'create-article'
                },
                { 
                  label: 'Upload Video', 
                  icon: VideoIcon,
                  description: 'Add new video',
                  gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#3b82f6',
                  action: 'create-video'
                },
                { 
                  label: 'Add Product', 
                  icon: BuildIcon,
                  description: 'Add new product',
                  gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                  color: '#a855f7',
                  action: 'create-product'
                }
              ].map((action, index) => (
                <Zoom key={action.label} in={true} timeout={500 + index * 150}>
                  <Tooltip title={action.description} arrow>
                    <Button
                      onClick={() => onNavigate && onNavigate('content', action.action)}
                      sx={{
                        position: 'relative',
                        background: `${action.gradient} !important`,
                        color: 'white !important',
                        p: 2,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        boxShadow: `0 4px 16px ${action.color}40 !important`,
                        transition: 'all 0.3s ease !important',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.03)',
                          boxShadow: `0 8px 24px ${action.color}60 !important`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '60px',
                          height: '60px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%',
                          transform: 'translate(30px, -30px)',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '50px',
                          height: '50px',
                          background: 'rgba(255,255,255,0.08)',
                          borderRadius: '50%',
                          transform: 'translate(-25px, 25px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          bgcolor: 'rgba(255,255,255,0.25)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <action.icon sx={{ fontSize: 28 }} />
                        <AddIcon 
                          sx={{ 
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            fontSize: 18,
                            bgcolor: 'white',
                            color: action.color,
                            borderRadius: '50%',
                            p: '2px'
                          }} 
                        />
                      </Box>
                      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <Typography variant="body2" fontWeight={700}>
                          {action.label}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                          {action.description}
                        </Typography>
                      </Box>
                    </Button>
                  </Tooltip>
                </Zoom>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default DashboardCharts;
