import React, { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, X, Calendar, User, MessageSquare } from 'lucide-react';
import PageHeader from '../../components/UI/PageHeader';
import { contactService } from '../../services/api.ts';
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
  Divider
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

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
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.delete(id);
        loadMessages();
      } catch (err) {
        setError('Failed to delete message');
        console.error('Error deleting message:', err);
      }
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
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Contact Messages"
        subtitle="View and manage contact form submissions"
        icon={<Mail className="h-10 w-10" />}
      />

      {/* Snackbar for errors */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4, mt: 3 }}>
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
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="h3" 
                  fontWeight={800}
                  sx={{
                    background: stat.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Box>

      {/* Messages List */}
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#047857' }}>
          All Messages
        </Typography>
        {messages.length === 0 ? (
          <Paper elevation={2} sx={{ p: 12, textAlign: 'center', borderRadius: 3 }}>
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <Typography variant="body1" sx={{ color: '#64748b' }}>No messages yet</Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((message, index) => (
              <Grow key={message.id} in={true} timeout={200 + index * 50}>
                <Card sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            label={message.status}
                            size="small"
                            color={
                              message.status === 'unread' ? 'primary' :
                              message.status === 'replied' ? 'success' : 'default'
                            }
                            sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                          />
                          <Chip
                            icon={<Calendar className="w-3 h-3" />}
                            label={new Date(message.created_at).toLocaleString()}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#047857', mb: 2 }}>
                          {message.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
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
                        <Typography variant="body2" sx={{ color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {message.message}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => handleView(message)}
                            size="small"
                            sx={{ color: '#10b981', '&:hover': { bgcolor: '#d1fae5' } }}
                          >
                            <Eye className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(message.id)}
                            size="small"
                            sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Trash2 className="h-5 w-5" />
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

      {/* Detail Modal */}
      <Dialog
        open={showDetail && !!selectedMessage}
        onClose={() => setShowDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle sx={{ 
              bgcolor: '#f0fdf4', 
              color: '#047857',
              fontWeight: 700,
              fontSize: '1.5rem',
              borderBottom: '2px solid #d1fae5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Message Details</span>
              <IconButton
                onClick={() => setShowDetail(false)}
                size="small"
                sx={{ color: '#6b7280', '&:hover': { bgcolor: '#d1fae5' } }}
              >
                <X className="h-5 w-5" />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
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
    </Box>
  );
};

export default AdminContactMessages;

