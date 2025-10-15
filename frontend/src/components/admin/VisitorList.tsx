import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Globe, Clock, TrendingUp, Wifi, ArrowUpDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../ui/PageHeader';
import Toast from '../ui/Toast';
import { visitorService } from '../../services/visitorService';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Pagination,
  Avatar,
  Tooltip,
  Grow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel
} from '@mui/material';

interface Visitor {
  id: string;
  ip_hash: string;
  page: string;
  user_agent: string;
  referer: string;
  last_visit: string;
  visit_count: number;
  is_online: boolean;
  is_today: boolean;
}

const VisitorList: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [avgVisits, setAvgVisits] = useState(0);
  const [sortBy, setSortBy] = useState<'last_visit' | 'visit_count' | 'online' | 'page'>('last_visit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const perPage = 50;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const loadVisitors = async (page: number = 1) => {
    setLoading(true);
    try {
      // Load both visitor list and stats
      const [response, statsResponse] = await Promise.all([
        visitorService.getVisitorsList({ per_page: perPage, page }),
        visitorService.getVisitorStatistics()
      ]);
      
      let visitorData = response.success && Array.isArray(response.data) ? response.data : [];
      
      // Apply client-side sorting
      if (visitorData.length > 0) {
        // Calculate page visit counts for sorting
        const pageVisitCounts = visitorData.reduce((acc: Record<string, number>, visitor: Visitor) => {
          acc[visitor.page] = (acc[visitor.page] || 0) + visitor.visit_count;
          return acc;
        }, {});
        
        visitorData.sort((a: Visitor, b: Visitor) => {
          let comparison = 0;
          
          if (sortBy === 'last_visit') {
            comparison = new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime();
          } else if (sortBy === 'visit_count') {
            comparison = b.visit_count - a.visit_count;
          } else if (sortBy === 'online') {
            comparison = (b.is_online ? 1 : 0) - (a.is_online ? 1 : 0);
          } else if (sortBy === 'page') {
            // Sort by total visits to each page
            const pageVisitsA = pageVisitCounts[a.page] || 0;
            const pageVisitsB = pageVisitCounts[b.page] || 0;
            comparison = pageVisitsB - pageVisitsA;
          }
          
          return sortOrder === 'asc' ? -comparison : comparison;
        });
      }
      
      if (response.success && Array.isArray(response.data)) {
        setVisitors(visitorData);
        setTotalPages(response.meta?.last_page || 1);
        setTotalVisitors(response.meta?.total || 0);
        setCurrentPage(page);
      } else {
        setVisitors([]);
        showToast('No visitor data available', 'error');
      }
      
      // Set stats from API
      if (statsResponse) {
        setOnlineUsers(statsResponse.onlineUsers || 0);
        setTodayVisitors(statsResponse.uniqueSessions || 0);
        // Get avg visits from API response if available
        const apiAvg = (statsResponse as any).avgVisitsPerVisitor;
        setAvgVisits(apiAvg || 0);
      }
    } catch (error: any) {
      console.error('Error loading visitors:', error);
      showToast(error.message || 'Failed to load visitors', 'error');
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors(currentPage);
  }, [currentPage, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleSort = (newSortBy: 'last_visit' | 'visit_count' | 'online') => {
    if (sortBy === newSortBy) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc'); // Default to descending for new sort
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getBrowserIcon = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return '🌐 Chrome';
    if (userAgent.includes('Safari')) return '🧭 Safari';
    if (userAgent.includes('Firefox')) return '🦊 Firefox';
    if (userAgent.includes('Edge')) return '🌊 Edge';
    return '🌐 Browser';
  };

  const statsData = [
    { 
      label: 'Total Visitors', 
      value: totalVisitors, 
      icon: Users,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    { 
      label: 'Online Now', 
      value: onlineUsers, 
      icon: Wifi,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#10b981'
    },
    { 
      label: 'Today Visits', 
      value: todayVisitors, 
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    { 
      label: 'Avg Visits', 
      value: avgVisits, 
      icon: Eye,
      gradient: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
      color: '#ffa726'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      overflow: 'visible' // Allow all hover effects to be visible
    }}>
      <PageHeader
        title="Visitor Analytics"
        description="Track and monitor website visitors in real-time"
        Icon={Globe}
      />

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 4, // Increase gap from 3 to 4 (32px) to accommodate hover shadow
        mb: 4,
        p: 2, // Add padding around the entire grid to prevent shadow clipping
        overflow: 'visible' // Allow shadows to be visible
      }}>
        {statsData.map((stat, index) => (
          <Grow key={index} in={true} timeout={300 + index * 100}>
            <Card sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              boxShadow: `0 8px 32px ${stat.color}20`,
              transition: 'all 0.3s ease',
              position: 'relative', // Ensure proper stacking context
              zIndex: 1, // Ensure card is above other elements
              '&:hover': {
                boxShadow: `0 20px 60px ${stat.color}50`, // Larger, more visible shadow
                borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                transform: 'translateY(-4px)', // Bring back subtle lift effect
                zIndex: 10 // Higher z-index on hover to ensure visibility
              }
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{
                    width: { xs: 48, sm: 52, md: 56 },
                    height: { xs: 48, sm: 52, md: 56 },
                    background: stat.gradient,
                    boxShadow: `0 8px 24px ${stat.color}40`
                  }}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'white' }} />
                  </Avatar>
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    background: stat.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}
                >
                  {stat.value.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b', 
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Box>

      {/* Visitors Table */}
      <Card sx={{
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        overflow: 'visible', // Allow hover effects to be visible
        position: 'relative', // Ensure proper containment
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
          zIndex: 5
        }
      }}>
        <CardContent sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 }, // Responsive padding
          '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } },
          overflow: 'visible' // Allow content to breathe
        }}>
          {/* Sort Controls */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#1f2937', width: { xs: '100%', sm: 'auto' } }}>
              Visitor Records
            </Typography>
            <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as any)}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem value="last_visit">Last Visit (Recent)</MenuItem>
                <MenuItem value="visit_count">Visit Count (Most)</MenuItem>
                <MenuItem value="online">Online Status</MenuItem>
                <MenuItem value="page">Most Visited Pages</MenuItem>
              </Select>
            </FormControl>
            <Chip
              label={sortOrder === 'desc' ? 'Descending' : 'Ascending'}
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              icon={<ArrowUpDown className="h-3 w-3" />}
              sx={{
                cursor: 'pointer',
                bgcolor: '#10b981',
                color: 'white',
                fontWeight: 600,
                '&:hover': { bgcolor: '#059669' }
              }}
            />
          </Box>
          
          <TableContainer component={Paper} sx={{ 
            maxHeight: 600,
            width: '100%', // Ensure full width
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderRadius: 2,
            overflow: 'auto', // Allow scrolling but keep content visible
            boxSizing: 'border-box', // Include border in width calculation
            position: 'relative',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            },
            '&::-webkit-scrollbar': { width: '8px', height: '8px' },
            '&::-webkit-scrollbar-thumb': { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderRadius: '4px'
            }
          }}>
            <Table stickyHeader sx={{ width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Visitor ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Page</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Browser</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Referer</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Last Visit</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: isDarkMode ? '#1e293b' : '#f8fafc' }}>Visits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', mb: 1 }}>
                        No visitors found
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                        Visitors will appear here once they access your website
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visitors.map((visitor, index) => (
                    <TableRow
                      key={visitor.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
                          borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                          transform: 'translateY(-1px)', // Subtle lift effect
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                          zIndex: 2
                        }
                      }}
                    >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {visitor.is_online && (
                          <Tooltip title="Online Now">
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#10b981',
                              animation: 'pulse 2s ease-in-out infinite',
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.5 }
                              }
                            }} />
                          </Tooltip>
                        )}
                        {visitor.is_today && !visitor.is_online && (
                          <Chip label="Today" size="small" sx={{ bgcolor: '#fbbf24', color: 'white', fontSize: '0.7rem', height: '20px' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        {visitor.ip_hash}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={visitor.page} 
                        size="small" 
                        sx={{ 
                          bgcolor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                          color: '#10b981',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        {getBrowserIcon(visitor.user_agent)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.8rem', 
                        color: isDarkMode ? '#64748b' : '#94a3b8',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {visitor.referer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock className="h-3 w-3" style={{ color: '#64748b' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                          {formatDate(visitor.last_visit)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={visitor.visit_count} 
                        size="small" 
                        sx={{ 
                          bgcolor: isDarkMode ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.1)',
                          color: '#f97316',
                          fontWeight: 700,
                          minWidth: '40px'
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: isDarkMode ? '#94a3b8' : '#64748b'
                  },
                  '& .Mui-selected': {
                    bgcolor: '#10b981 !important',
                    color: 'white !important'
                  }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </Box>
  );
};

export default VisitorList;

