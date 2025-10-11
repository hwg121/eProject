import React, { useState } from 'react';
import { Activity, FileEdit, Trash2, Upload, LogIn, UserPlus, UserCog } from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Fade,
  Grow,
  Paper,
  Divider
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  ManageAccounts as ManageAccountsIcon,
  Assessment as ActivityIcon
} from '@mui/icons-material';

interface ActivityLog {
  id: number;
  user_name: string;
  user_ip: string | null;
  activity_type: 'public' | 'security';
  action: string;
  entity_type: string | null;
  entity_name: string | null;
  description: string | null;
  created_at: string;
  metadata?: any;
}

interface RecentActivitySectionProps {
  publicActivities: ActivityLog[];
  securityActivities: ActivityLog[];
  isDarkMode: boolean;
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ 
  publicActivities, 
  securityActivities, 
  isDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState<'public' | 'security'>('public');

  // Debug logging

  // Helper function to format time ago
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  // Helper function to format exact date
  const getExactDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get activity icon
  const getActivityIcon = (action: string, entityType: string | null) => {
    if (action === 'login') return LogIn;
    if (action === 'created' && entityType === 'user') return UserPlus;
    if (action === 'updated' && entityType === 'user') return UserCog;
    if (action === 'deleted') return Trash2;
    if (action === 'updated') return FileEdit;
    if (action === 'created') return Upload;
    return Activity;
  };

  // Helper function to get activity color
  const getActivityColor = (action: string): 'error' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' => {
    if (action === 'deleted') return 'error';
    if (action === 'created' || action === 'login') return 'success';
    if (action === 'updated') return 'primary';
    return 'secondary';
  };

  // Helper function to get MUI icon
  const getMuiIcon = (action: string, entityType: string | null) => {
    if (action === 'login') return <LoginIcon />;
    if (action === 'created' && entityType === 'user') return <PersonAddIcon />;
    if (action === 'updated' && entityType === 'user') return <ManageAccountsIcon />;
    if (action === 'deleted') return <DeleteIcon />;
    if (action === 'updated') return <EditIcon />;
    if (action === 'created') return <AddIcon />;
    return <ActivityIcon />;
  };

  const renderActivities = (activities: ActivityLog[]) => {
    if (activities.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
            No activities found
          </Typography>
        </Box>
      );
    }

    return (
      <Timeline
        sx={{
          '& .MuiTimelineItem-root:before': {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {activities.map((activity, index) => {
          const color = getActivityColor(activity.action);
          const icon = getMuiIcon(activity.action, activity.entity_type);
          const timeAgo = getTimeAgo(activity.created_at);
          const exactDate = getExactDate(activity.created_at);

          return (
            <Fade key={activity.id} in={true} timeout={300 + index * 100}>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot 
                    color={color}
                    sx={{
                      boxShadow: `0 4px 12px ${
                        color === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                        color === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                        color === 'primary' ? 'rgba(59, 130, 246, 0.3)' :
                        'rgba(156, 163, 175, 0.3)'
                      }`,
                    }}
                  >
                    {icon}
                  </TimelineDot>
                  {index < activities.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      mb: 2,
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: isDarkMode
                          ? '0 8px 24px rgba(0,0,0,0.4)'
                          : '0 8px 24px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      fontWeight={600}
                      sx={{ 
                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        mb: 1
                      }}
                    >
                      {activity.description || `${activity.user_name} ${activity.action} ${activity.entity_type}: ${activity.entity_name}`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        avatar={<Avatar sx={{ bgcolor: 'transparent', width: 20, height: 20 }}>👤</Avatar>}
                        label={activity.user_name}
                        size="small"
                        sx={{
                          bgcolor: isDarkMode ? '#374151' : '#e2e8f0',
                          color: isDarkMode ? '#d1d5db' : '#475569',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                      {activity.user_ip && activeTab === 'security' && (
                        <Chip
                          label={`IP: ${activity.user_ip}`}
                          size="small"
                          sx={{
                            bgcolor: isDarkMode ? '#374151' : '#e2e8f0',
                            color: isDarkMode ? '#d1d5db' : '#475569',
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDarkMode ? '#94a3b8' : '#64748b',
                          fontSize: '0.75rem'
                        }}
                      >
                        {exactDate} ({timeAgo})
                      </Typography>
                    </Box>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            </Fade>
          );
        })}
      </Timeline>
    );
  };

  return (
    <Grow in={true} timeout={600}>
      <Card
        sx={{
          position: 'relative !important',
          overflow: 'visible !important',
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
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Activity className="h-6 w-6" style={{ color: 'white' }} />
              </Avatar>
              <Typography 
                variant="h5" 
                fontWeight={700}
                sx={{ 
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                }}
              >
                Recent Activity
              </Typography>
            </Box>
            <Chip
              label={`${(activeTab === 'public' ? publicActivities : securityActivities).length} items`}
              size="small"
              sx={{
                bgcolor: '#dcfce7',
                color: '#16a34a',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          </Box>

          <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

          {/* MUI Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                backgroundColor: '#10b981',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              value="public"
              label="Public Activity"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                color: isDarkMode ? '#94a3b8' : '#64748b',
                '&.Mui-selected': {
                  color: '#10b981',
                },
              }}
            />
            <Tab
              value="security"
              label="Security Activity"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                color: isDarkMode ? '#94a3b8' : '#64748b',
                '&.Mui-selected': {
                  color: '#10b981',
                },
              }}
            />
          </Tabs>

          {/* Activity Timeline */}
          <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 1 }}>
            {activeTab === 'public' ? renderActivities(publicActivities) : renderActivities(securityActivities)}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default RecentActivitySection;
