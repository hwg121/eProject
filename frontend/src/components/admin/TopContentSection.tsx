import React from 'react';
import { TrendingUp } from 'lucide-react';
import { TopContentItem } from '../../types/admin';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Grow,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

interface TopContentSectionProps {
  topContent: TopContentItem[];
  isDarkMode: boolean;
}

const TopContentSection: React.FC<TopContentSectionProps> = ({ topContent, isDarkMode }) => {
  const getRankBadge = (index: number) => {
    const icons = ['🥇', '🥈', '🥉', '🎯', '⭐'];
    return {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: icons[index] || '⭐'
    };
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'article':
      case 'technique':
        return { bg: '#dcfce7', color: '#16a34a' };
      case 'video':
        return { bg: '#fee2e2', color: '#dc2626' };
      case 'book':
        return { bg: '#f3e8ff', color: '#9333ea' };
      default:
        return { bg: '#fef3c7', color: '#d97706' };
    }
  };

  const maxViews = Math.max(...topContent.map(c => c.views), 1);

  return (
    <Grow in={true} timeout={800}>
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
            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #fb923c 100%)',
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
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)',
                }}
              >
                <TrendingUp className="h-6 w-6" style={{ color: 'white' }} />
              </Avatar>
              <Typography 
                variant="h5" 
                fontWeight={700}
                sx={{ 
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                }}
              >
          Top Performing Content
              </Typography>
            </Box>
            <Chip
              icon={<TrophyIcon />}
              label="Hall of Fame"
              size="small"
              sx={{
                bgcolor: '#fef3c7',
                color: '#d97706',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          </Box>

          <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

          {/* Table */}
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{
              background: 'transparent',
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '0.75rem', pb: 2 }}>
                    RANK
                  </TableCell>
                  <TableCell sx={{ border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '0.75rem', pb: 2 }}>
                    CONTENT
                  </TableCell>
                  <TableCell align="center" sx={{ border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '0.75rem', pb: 2 }}>
                    VIEWS
                  </TableCell>
                  <TableCell align="center" sx={{ border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '0.75rem', pb: 2 }}>
                    LIKES
                  </TableCell>
                  <TableCell align="center" sx={{ border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '0.75rem', pb: 2 }}>
                    TYPE
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topContent.map((content, index) => {
                  const rank = getRankBadge(index);
                  const typeColor = getTypeColor(content.type);
                  const viewsPercentage = (content.views / maxViews) * 100;

                  return (
                    <Grow key={content.id} in={true} timeout={400 + index * 100}>
                      <TableRow
                        sx={{
                          background: isDarkMode
                            ? 'rgba(30, 41, 59, 0.5)'
                            : 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            background: isDarkMode
                              ? 'rgba(30, 41, 59, 0.8)'
                              : 'rgba(241, 245, 249, 1)',
                            boxShadow: isDarkMode
                              ? '0 4px 12px rgba(0,0,0,0.3)'
                              : '0 4px 12px rgba(0,0,0,0.08)',
                          },
                          '& td': {
                            border: 'none',
                          },
                          '& td:first-of-type': {
                            borderRadius: '12px 0 0 12px',
                          },
                          '& td:last-of-type': {
                            borderRadius: '0 12px 12px 0',
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              background: rank.bg,
                              fontWeight: 800,
                              fontSize: '1.25rem',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                          >
                            {rank.icon}
                          </Avatar>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box>
                            <Typography 
                              variant="body1" 
                              fontWeight={600}
                              sx={{ 
                                color: isDarkMode ? '#f1f5f9' : '#1e293b',
                                mb: 0.5
                              }}
                            >
                {content.title}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={viewsPercentage}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: isDarkMode ? '#1e293b' : '#e2e8f0',
                                '& .MuiLinearProgress-bar': {
                                  background: rank.bg,
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Chip
                            icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                            label={content.views.toLocaleString()}
                            size="small"
                            sx={{
                              bgcolor: isDarkMode ? '#374151' : '#e2e8f0',
                              color: isDarkMode ? '#d1d5db' : '#475569',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Chip
                            icon={<FavoriteIcon sx={{ fontSize: 16, color: '#ef4444' }} />}
                            label={content.likes.toLocaleString()}
                            size="small"
                            sx={{
                              bgcolor: isDarkMode ? '#374151' : '#e2e8f0',
                              color: isDarkMode ? '#d1d5db' : '#475569',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Chip
                            label={content.type}
                            size="small"
                            sx={{
                              bgcolor: typeColor.bg,
                              color: typeColor.color,
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </Grow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
    </Card>
    </Grow>
  );
};

export default TopContentSection;
