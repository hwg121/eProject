import React, { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, X, Calendar, User, MessageSquare, Search, Filter, CheckSquare, Square, MoreVertical, CheckCircle, Clock, Reply, ChevronUp, ChevronDown } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useTheme } from '../../contexts/ThemeContext';
import { contactService } from '../../services/api.ts';
import { ViewButton, EditButton, DeleteButton } from '../../components/ui/ContentIcons';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Grow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Divider,
  MenuItem
} from '@mui/material';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
}

const AdminContactMessages: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Bulk actions
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    loadMessages();
  }, []);

  // Filter and sort messages
  useEffect(() => {
    let filtered = [...messages];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(searchLower) ||
        message.email.toLowerCase().includes(searchLower) ||
        message.subject.toLowerCase().includes(searchLower) ||
        message.message.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMessages(filtered);
    
    // Reset select all when filtered results change
    setSelectAll(false);
    setSelectedMessages([]);
  }, [messages, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data: any = await contactService.getAll();
      setMessages(data || []);
    } catch (err) {
      setError('Failed to load contact messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetail(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      try {
        await contactService.update(message.id, { status: 'read' });
        loadMessages();
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await contactService.delete(id);
          loadMessages();
        } catch (err) {
          setError('Failed to delete message');
          console.error('Error deleting message:', err);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleStatusChange = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await contactService.update(id, { status: newStatus });
      loadMessages();
    } catch (err) {
      setError('Failed to update message status');
      console.error('Error updating status:', err);
    }
  };

  const handleBulkDelete = async () => {
    setConfirmDialog({
      open: true,
      title: 'Delete Selected Messages',
      message: `Are you sure you want to delete ${selectedMessages.length} selected messages? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await Promise.all(selectedMessages.map(id => contactService.delete(id)));
          setSelectedMessages([]);
          setSelectAll(false);
          loadMessages();
        } catch (err) {
          setError('Failed to delete selected messages');
          console.error('Error bulk deleting:', err);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleBulkStatusChange = async (newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await Promise.all(selectedMessages.map(id => contactService.update(id, { status: newStatus })));
      setSelectedMessages([]);
      setSelectAll(false);
      loadMessages();
    } catch (err) {
      setError('Failed to update selected messages');
      console.error('Error bulk updating status:', err);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMessages([]);
      setSelectAll(false);
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id));
      setSelectAll(true);
    }
  };

  const handleSelectMessage = (id: string) => {
    if (selectedMessages.includes(id)) {
      const newSelected = selectedMessages.filter(msgId => msgId !== id);
      setSelectedMessages(newSelected);
      setSelectAll(false);
    } else {
      const newSelected = [...selectedMessages, id];
      setSelectedMessages(newSelected);
      setSelectAll(newSelected.length === filteredMessages.length);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      unread: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800'
    };
    return badges[status as keyof typeof badges] || badges.read;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} sx={{ color: '#10b981' }} />
        <Typography variant="h6" sx={{ color: '#10b981' }}>
          Loading messages...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>

      {/* Snackbar for errors */}
      <Toast
        open={!!error}
        message={error || ''}
        severity="error"
        onClose={() => setError(null)}
        position={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
      />

      {/* Search and Filter Controls */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 3, sm: 4 }, 
        mt: { xs: 2, sm: 3 },
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        {/* Search */}
        <TextField
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search className="w-4 h-4 mr-2 text-gray-400" />
          }}
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        
        {/* Status Filter */}
        <TextField
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="unread">Unread</MenuItem>
          <MenuItem value="read">Read</MenuItem>
          <MenuItem value="replied">Replied</MenuItem>
        </TextField>
        
        {/* Sort */}
        <TextField
          select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="created_at">Date</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </TextField>
        
        {/* Sort Order */}
        <Button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          variant="outlined"
          startIcon={sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          sx={{ minWidth: 100 }}
        >
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </Button>
      </Box>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          p: 2, 
          bgcolor: '#f0fdf4', 
          borderRadius: 2, 
          border: '1px solid #d1fae5',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Typography variant="body2" sx={{ color: '#047857', fontWeight: 600 }}>
            {selectedMessages.length} selected
          </Typography>
          <Button
            onClick={() => handleBulkStatusChange('read')}
            size="small"
            startIcon={<Eye className="w-4 h-4" />}
            sx={{ color: '#3b82f6' }}
          >
            Mark as Read
          </Button>
          <Button
            onClick={() => handleBulkStatusChange('replied')}
            size="small"
            startIcon={<Reply className="w-4 h-4" />}
            sx={{ color: '#10b981' }}
          >
            Mark as Replied
          </Button>
          <Button
            onClick={() => handleBulkStatusChange('unread')}
            size="small"
            startIcon={<Clock className="w-4 h-4" />}
            sx={{ color: '#f59e0b' }}
          >
            Mark as Unread
          </Button>
          <Button
            onClick={handleBulkDelete}
            size="small"
            startIcon={<Trash2 className="w-4 h-4" />}
            sx={{ color: '#ef4444' }}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      {/* Stats - Responsive */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 3, sm: 4 }
      }}>
        {[
          { label: 'Unread Messages', value: messages.filter(m => m.status === 'unread').length, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
          { label: 'Replied', value: messages.filter(m => m.status === 'replied').length, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
          { label: 'Total Messages', value: messages.length, color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280 0%, #475569 100%)' },
        ].map((stat, index) => (
          <Grow key={index} in={true} timeout={300 + index * 100}>
            <Card sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 24px ${stat.color}30`,
              }
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 3 }
              }}>
                <Typography 
                  variant="h3" 
                  fontWeight={800}
                  sx={{
                    background: stat.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Box>

      {/* Messages List - Responsive */}
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              color: '#047857',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            All Messages ({filteredMessages.length})
          </Typography>
          
          {/* Select All */}
          <Button
            onClick={handleSelectAll}
            startIcon={selectAll ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            variant="outlined"
            size="small"
            sx={{ 
              color: '#047857',
              borderColor: '#047857',
              '&:hover': { borderColor: '#059669', bgcolor: '#f0fdf4' }
            }}
          >
            {selectAll ? 'Deselect All' : 'Select All'}
          </Button>
        </Box>
        
        {filteredMessages.length === 0 ? (
          <Paper elevation={2} sx={{ 
            p: { xs: 6, sm: 12 }, 
            textAlign: 'center', 
            borderRadius: 3 
          }}>
            <Mail className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {messages.length === 0 ? 'No messages yet' : 'No messages match your filters'}
            </Typography>
            {messages.length > 0 && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                variant="outlined"
                sx={{ mt: 2, color: '#10b981', borderColor: '#10b981' }}
              >
                Clear Filters
              </Button>
            )}
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            {filteredMessages.map((message, index) => (
              <Grow key={message.id} in={true} timeout={200 + index * 50}>
                <Card sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between', 
                      alignItems: { xs: 'stretch', sm: 'flex-start' },
                      gap: { xs: 2, sm: 0 }
                    }}>
                      {/* Checkbox */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mr: { xs: 0, sm: 2 },
                        mb: { xs: 1, sm: 0 }
                      }}>
                        <IconButton
                          onClick={() => handleSelectMessage(message.id)}
                          size="small"
                          sx={{ 
                            color: selectedMessages.includes(message.id) ? '#10b981' : '#d1d5db',
                            '&:hover': { bgcolor: '#f0fdf4' }
                          }}
                        >
                          {selectedMessages.includes(message.id) ? 
                            <CheckSquare className="w-4 h-4" /> : 
                            <Square className="w-4 h-4" />
                          }
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: { xs: 1, sm: 1.5 }, 
                          mb: { xs: 1.5, sm: 2 }, 
                          flexWrap: 'wrap' 
                        }}>
                          <Chip
                            label={message.status}
                            size="small"
                            color={
                              message.status === 'unread' ? 'primary' :
                              message.status === 'replied' ? 'success' : 'default'
                            }
                            sx={{ 
                              fontWeight: 700, 
                              textTransform: 'capitalize',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          />
                          <Chip
                            icon={<Calendar className="w-3 h-3" />}
                            label={new Date(message.created_at).toLocaleString()}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          sx={{ 
                            color: '#047857', 
                            mb: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            lineHeight: 1.3
                          }}
                        >
                          {message.subject}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: { xs: 1, sm: 2 }, 
                          mb: { xs: 1.5, sm: 2 }, 
                          flexWrap: 'wrap' 
                        }}>
                          <Chip
                            icon={<User className="w-3 h-3" />}
                            label={message.name}
                            size="small"
                            sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem' }}
                          />
                          <Chip
                            icon={<Mail className="w-3 h-3" />}
                            label={message.email}
                            size="small"
                            sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem' }}
                          />
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            lineHeight: 1.4
                          }}
                        >
                          {message.message}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.5, sm: 1 }, 
                        ml: { xs: 0, sm: 2 },
                        mt: { xs: 2, sm: 0 },
                        justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                        flexWrap: 'wrap'
                      }}>
                        {/* Status Change Buttons */}
                        {message.status !== 'read' && (
                          <Tooltip title="Mark as Read">
                            <IconButton
                              onClick={() => handleStatusChange(message.id, 'read')}
                              size="small"
                              sx={{ 
                                color: '#3b82f6', 
                                '&:hover': { bgcolor: '#dbeafe' },
                                minWidth: '32px',
                                minHeight: '32px'
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {message.status !== 'replied' && (
                          <Tooltip title="Mark as Replied">
                            <IconButton
                              onClick={() => handleStatusChange(message.id, 'replied')}
                              size="small"
                              sx={{ 
                                color: '#10b981', 
                                '&:hover': { bgcolor: '#d1fae5' },
                                minWidth: '32px',
                                minHeight: '32px'
                              }}
                            >
                              <Reply className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {message.status !== 'unread' && (
                          <Tooltip title="Mark as Unread">
                            <IconButton
                              onClick={() => handleStatusChange(message.id, 'unread')}
                              size="small"
                              sx={{ 
                                color: '#f59e0b', 
                                '&:hover': { bgcolor: '#fef3c7' },
                                minWidth: '32px',
                                minHeight: '32px'
                              }}
                            >
                              <Clock className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleView(message)}
                            size="small"
                            sx={{ 
                              color: '#6b7280', 
                              '&:hover': { bgcolor: '#f3f4f6' },
                              minWidth: '32px',
                              minHeight: '32px'
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(message.id)}
                            size="small"
                            sx={{ 
                              color: '#ef4444', 
                              '&:hover': { bgcolor: '#fee2e2' },
                              minWidth: '32px',
                              minHeight: '32px'
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Box>
        )}
      </Box>

      {/* Detail Modal - Responsive */}
      <Dialog
        open={showDetail && !!selectedMessage}
        onClose={() => setShowDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: { xs: '95vh', sm: '90vh' },
            m: { xs: 1, sm: 2 }
          }
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle sx={{ 
              bgcolor: '#f0fdf4', 
              color: '#047857',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              borderBottom: '2px solid #d1fae5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: { xs: 2, sm: 3 }
            }}>
              <span>Message Details</span>
              <IconButton
                onClick={() => setShowDetail(false)}
                size="small"
                sx={{ 
                  color: '#6b7280', 
                  '&:hover': { bgcolor: '#d1fae5' },
                  minWidth: '32px',
                  minHeight: '32px'
                }}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ 
              pt: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
              pb: { xs: 2, sm: 3 }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    label={selectedMessage.status}
                    size="small"
                    color={
                      selectedMessage.status === 'unread' ? 'primary' :
                      selectedMessage.status === 'replied' ? 'success' : 'default'
                    }
                    sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                  />
                  <Chip
                    icon={<Calendar className="w-3 h-3" />}
                    label={new Date(selectedMessage.created_at).toLocaleString()}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Name</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: '#047857' }}>{selectedMessage.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Email</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: '#047857' }}>{selectedMessage.email}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>Subject</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#047857' }}>{selectedMessage.subject}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Message</Typography>
                  <Paper sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Typography variant="body2" sx={{ color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                      {selectedMessage.message}
                    </Typography>
                  </Paper>
                </Box>

                {selectedMessage.admin_reply && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Admin Reply</Typography>
                    <Paper sx={{ bgcolor: '#f0fdf4', p: 2, borderRadius: 2, border: '1px solid #d1fae5' }}>
                      <Typography variant="body2" sx={{ color: '#047857', whiteSpace: 'pre-wrap', mb: 1 }}>
                        {selectedMessage.admin_reply}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Replied on: {selectedMessage.replied_at ? new Date(selectedMessage.replied_at).toLocaleString() : 'N/A'}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
              <Button
                onClick={() => setShowDetail(false)}
                variant="contained"
                sx={{
                  bgcolor: '#10b981',
                  '&:hover': { bgcolor: '#059669' },
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="error"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        isDarkMode={isDarkMode}
      />
    </Box>
  );
};

export default AdminContactMessages;

