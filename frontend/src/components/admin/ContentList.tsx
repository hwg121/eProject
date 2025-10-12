import React, { useState } from 'react';
import { 
  Eye, ChevronLeft, ChevronRight,
  FileText, Star
} from 'lucide-react';
import { ContentItem } from '../../types/admin';
import StatusBadge from '../UI/StatusBadge';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Grow
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  Assessment as AllIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

interface ContentListProps {
  contentData: ContentItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string, type: string) => void;
  onView: (item: ContentItem) => void;
  isDarkMode: boolean;
}

const ContentList: React.FC<ContentListProps> = ({
  contentData,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onEdit,
  onDelete,
  onView,
  isDarkMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState<'all' | 'technique' | 'video'>('all');

  const filteredContent = contentData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category?.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
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
      case 'archived':
        return a.status === 'archived' ? -1 : b.status === 'archived' ? 1 : 0;
      case 'published':
        return a.status === 'published' ? -1 : b.status === 'published' ? 1 : 0;
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'rating':
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContent = sortedContent.slice(startIndex, startIndex + itemsPerPage);


  const getContentIcon = (type: string) => {
    switch (type) {
      case 'Technique':
        return '🌿';
      case 'Video':
        return '🎥';
      default:
        return '📄';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };


  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', mb: 0.5 }}>
            Content List
        </Typography>
        <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
            Manage your content library
        </Typography>
      </Box>

      {/* Content Type Tabs */}
      <Paper 
        elevation={2}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#10b981',
              height: 3,
            },
            '& .MuiTab-root': {
              minHeight: 64,
            },
          }}
        >
          <Tab
            value="all"
            icon={<AllIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>All Content</span>
                <Chip 
                  label={contentData.length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'all' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'all' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: '#10b981',
              },
            }}
          />
          <Tab
            value="technique"
            icon={<ArticleIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Techniques</span>
                <Chip 
                  label={contentData.filter(item => item.category?.toLowerCase() === 'technique').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'technique' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'technique' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: '#10b981',
              },
            }}
          />
          <Tab
            value="video"
            icon={<VideoIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Videos</span>
                <Chip 
                  label={contentData.filter(item => item.category?.toLowerCase() === 'video').length} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeTab === 'video' ? '#10b981' : (isDarkMode ? '#374151' : '#e5e7eb'),
                    color: activeTab === 'video' ? 'white' : (isDarkMode ? '#d1d5db' : '#6b7280')
                  }} 
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: '#10b981',
              },
            }}
          />
        </Tabs>
      </Paper>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Archived', value: contentData.filter(c => c.status === 'archived').length, icon: FileText, color: '#6b7280', sortKey: 'archived' },
          { label: 'Published', value: contentData.filter(c => c.status === 'published').length, icon: Eye, color: '#10b981', sortKey: 'published' },
          { label: 'Featured', value: contentData.filter(c => c.featured).length, icon: Star, color: '#fbbf24', sortKey: 'featured' },
          { 
            label: 'Avg Rating', 
            value: (() => {
                  const validRatings = contentData.filter(c => {
                    const rating = Number(c.rating);
                    return !isNaN(rating) && rating > 0;
                  });
                  if (validRatings.length === 0) return '0.0';
                  const avgRating = validRatings.reduce((sum, c) => sum + Number(c.rating), 0) / validRatings.length;
                  return isNaN(avgRating) ? '0.0' : avgRating.toFixed(1);
            })(), 
            icon: Star, 
            color: '#3b82f6',
            sortKey: 'rating'
          },
        ].map((stat, index) => (
          <Grow key={index} in={true} timeout={300 + index * 100}>
            <Card 
              onClick={() => setSortBy(stat.sortKey)}
              sx={{ 
                background: isDarkMode ? '#1e293b' : '#ffffff',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: sortBy === stat.sortKey ? `2px solid ${stat.color}` : '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${stat.color}30`,
                }
              }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, width: 44, height: 44 }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </Avatar>
                </Box>
              </CardContent>
        </Card>
          </Grow>
        ))}
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                '&:hover fieldset': {
                  borderColor: '#10b981',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10b981',
                },
              },
            }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ '&.Mui-focused': { color: '#10b981' } }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              sx={{
                bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                },
              }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="title">Title A-Z</MenuItem>
              <MenuItem value="views">Most Views</MenuItem>
              <MenuItem value="likes">Most Likes</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="rating">Highest Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Content Table */}
      <TableContainer 
        component={Paper} 
        elevation={3}
        sx={{ 
          borderRadius: 2,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          overflow: 'hidden'
        }}
      >
        {paginatedContent.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📄</Typography>
            <Typography variant="h6" fontWeight={600} sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', mb: 1 }}>
              No content found
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Content</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Views</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Likes</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Created</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {paginatedContent.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:hover': {
                        bgcolor: isDarkMode ? '#0f172a' : '#f1f5f9',
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                          {getContentIcon(item.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                              {item.title}
                            </h3>
                            {item.featured && (
                              <Chip 
                                label="Featured" 
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  bgcolor: '#fbbf24',
                                  color: '#78350f',
                                  '& .MuiChip-label': { px: 1, py: 0 }
                                }}
                              />
                            )}
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          bgcolor: item.category === 'Technique' ? '#dcfce7' : '#fee2e2',
                          color: item.category === 'Technique' ? '#16a34a' : '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={item.status as 'published' | 'archived' | 'draft'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<VisibilityIcon sx={{ fontSize: 14, color: '#3b82f6 !important' }} />}
                        label={item.views || 0}
                        size="small"
                        sx={{
                          bgcolor: isDarkMode ? '#374151' : '#e5e7eb',
                          color: isDarkMode ? '#d1d5db' : '#6b7280',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<FavoriteIcon sx={{ fontSize: 16, color: '#ec4899' }} />}
                        label={item.likes || 0}
                        size="small"
                        sx={{
                          bgcolor: isDarkMode ? '#374151' : '#e2e8f0',
                          color: isDarkMode ? '#d1d5db' : '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: '#ec4899',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Star className="w-3 h-3 text-yellow-500 fill-current" />}
                        label={item.rating || 0}
                        size="small"
                        sx={{
                          bgcolor: isDarkMode ? '#374151' : '#fef3c7',
                          color: isDarkMode ? '#d1d5db' : '#92400e',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: '#fbbf24',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        {item.author || item.instructor || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        {formatTimeAgo(item.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="View">
                          <IconButton
                          onClick={() => onView(item)}
                            size="small"
                            sx={{
                              color: '#6b7280',
                              '&:hover': { bgcolor: isDarkMode ? '#374151' : '#e5e7eb' }
                            }}
                          >
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                          onClick={() => onEdit(item)}
                            size="small"
                            sx={{
                              color: '#3b82f6',
                              '&:hover': { bgcolor: '#dbeafe' }
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                          onClick={() => onDelete(item.id, item.category)}
                            size="small"
                            sx={{
                              color: '#ef4444',
                              '&:hover': { bgcolor: '#fee2e2' }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

      </TableContainer>

        {/* Pagination */}
      {sortedContent.length > 0 && (
        <Paper 
          elevation={2}
          sx={{ 
            p: 2, 
            mt: 3, 
            background: isDarkMode ? '#1e293b' : '#ffffff', 
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          {/* Rows per page selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
              Rows per page:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                sx={{
                  bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#10b981',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#10b981',
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Current range display */}
          <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedContent.length)} of {sortedContent.length}
          </Typography>

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              sx={{
                color: currentPage === 1 ? (isDarkMode ? '#374151' : '#d1d5db') : (isDarkMode ? '#94a3b8' : '#64748b'),
                '&:hover': {
                  bgcolor: currentPage === 1 ? 'transparent' : (isDarkMode ? '#374151' : '#e5e7eb'),
                },
                '&.Mui-disabled': {
                  color: isDarkMode ? '#374151' : '#d1d5db',
                }
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </IconButton>
            
            <IconButton
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              sx={{
                color: currentPage === totalPages ? (isDarkMode ? '#374151' : '#d1d5db') : (isDarkMode ? '#94a3b8' : '#64748b'),
                '&:hover': {
                  bgcolor: currentPage === totalPages ? 'transparent' : (isDarkMode ? '#374151' : '#e5e7eb'),
                },
                '&.Mui-disabled': {
                  color: isDarkMode ? '#374151' : '#d1d5db',
                }
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ContentList;
