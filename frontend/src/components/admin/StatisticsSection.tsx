import React from 'react';
import { Users, Eye, FileText, Star } from 'lucide-react';
import { AdminStats } from '../../types/admin';
import { CampaignStatsResponse } from '../../services/campaignService';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar,
  Chip,
  LinearProgress,
  Grow,
  Zoom
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatisticsSectionProps {
  stats: AdminStats;
  isDarkMode: boolean;
  campaignStats?: CampaignStatsResponse | null;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ stats, isDarkMode, campaignStats }) => {
  const statisticsData = [
    { 
      label: 'Total Visitors', 
      value: stats.totalVisitors || stats.totalUsers, 
      icon: Users, 
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea',
      change: campaignStats?.visitors?.growth ?? stats.visitorGrowth ?? stats.monthlyGrowth,
      subtitle: 'Website Visitors',
      progress: campaignStats?.visitors?.progress ?? 85
    },
    { 
      label: 'Total Views', 
      value: stats.totalViews, 
      icon: Eye, 
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#10b981',
      change: campaignStats?.views?.growth ?? stats.weeklyGrowth,
      subtitle: 'Page Views',
      progress: campaignStats?.views?.progress ?? 85
    },
    { 
      label: 'Content Items', 
      value: stats.totalArticles + stats.totalVideos + stats.totalBooks + stats.totalSuggestions + (stats.totalTools || 0) + (stats.totalPots || 0) + (stats.totalAccessories || 0), 
      icon: FileText, 
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb',
      change: campaignStats?.content?.growth ?? stats.monthlyGrowth,
      subtitle: 'All Content & Products',
      progress: campaignStats?.content?.progress ?? 60
    },
    { 
      label: 'Avg Rating', 
      value: stats.avgRating, 
      icon: Star, 
      bgGradient: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
      color: '#ffa726',
      change: campaignStats?.rating?.growth ?? (stats.avgRating - 4.0),
      subtitle: 'Customer Rating',
      progress: campaignStats?.rating?.progress ?? (stats.avgRating / 5) * 100
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid !important', 
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        lg: 'repeat(4, 1fr)' 
      }, 
      gap: 3,
      mb: 4,
      width: '100%',
      '& .MuiCard-root': {
        boxShadow: '0 10px 40px rgba(0,0,0,0.1) !important',
      }
    }}>
      {statisticsData.map((stat, index) => (
        <Grow
          key={index}
          in={true}
          timeout={500 + index * 200}
        >
          <Card
            sx={{
              position: 'relative !important',
              overflow: 'visible !important',
              background: `${isDarkMode 
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'} !important`,
              border: '1px solid !important',
              borderColor: `${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} !important`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
              cursor: 'pointer !important',
              borderRadius: '16px !important',
              boxShadow: `0 8px 32px ${stat.color}20 !important`,
              '&:hover': {
                transform: 'translateY(-16px) scale(1.03) !important',
                boxShadow: `0 24px 80px ${stat.color}60 !important`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: stat.bgGradient,
                borderRadius: '16px 16px 0 0',
                zIndex: 1,
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Icon with animated gradient background */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Zoom in={true} timeout={700 + index * 200}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      background: `${stat.bgGradient} !important`,
                      boxShadow: `0 12px 32px ${stat.color}60 !important`,
                      border: '3px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <stat.icon className="h-8 w-8" style={{ color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                  </Avatar>
                </Zoom>
                
                {/* Change indicator */}
                <Chip
                  icon={stat.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${stat.change >= 0 ? '+' : ''}${stat.change.toFixed(1)}%`}
                  size="small"
                  sx={{
                    bgcolor: stat.change >= 0 ? '#dcfce7' : '#fee2e2',
                    color: stat.change >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    '& .MuiChip-icon': {
                      color: stat.change >= 0 ? '#16a34a' : '#dc2626',
                    }
                  }}
                />
              </Box>

              {/* Value */}
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.25rem', sm: '2.75rem' },
                  background: `${stat.bgGradient} !important`,
                  WebkitBackgroundClip: 'text !important',
                  WebkitTextFillColor: 'transparent !important',
                  backgroundClip: 'text !important',
                  mb: 0.5,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  textShadow: `0 0 30px ${stat.color}40`,
                  filter: 'brightness(1.1)',
                }}
              >
                {stat.label === 'Avg Rating' 
                  ? stat.value.toFixed(1) 
                  : stat.value.toLocaleString()}
              </Typography>

              {/* Label */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  mb: 2
                }}
              >
                {stat.label}
              </Typography>

              {/* Progress bar */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: isDarkMode ? '#64748b' : '#94a3b8', fontSize: '0.7rem' }}>
                    {stat.subtitle}
                  </Typography>
                  <Typography variant="caption" sx={{ color: stat.color, fontWeight: 700, fontSize: '0.7rem' }}>
                    {stat.progress.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stat.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: `${isDarkMode ? '#1e293b' : '#e2e8f0'} !important`,
                    overflow: 'hidden',
                    '& .MuiLinearProgress-bar': {
                      background: `${stat.bgGradient} !important`,
                      borderRadius: 4,
                      boxShadow: `0 0 10px ${stat.color}60`,
                      animation: 'progress 2.5s ease-in-out',
                      '@keyframes progress': {
                        '0%': {
                          transform: 'translateX(-100%)',
                          opacity: 0,
                        },
                        '50%': {
                          opacity: 0.8,
                        },
                        '100%': {
                          transform: 'translateX(0)',
                          opacity: 1,
                        },
                      },
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grow>
      ))}
    </Box>
  );
};

export default StatisticsSection;
