import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../../components/UI/PageHeader';
import StatusBadge from '../../components/UI/StatusBadge';
import Toast from '../../components/UI/Toast';
import { staffMemberService } from '../../services/api.ts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { validateText, validateNumber, hasErrors } from '../../utils/validation';

interface StaffMember {
  id?: string;
  name: string;
  role: string;
  short_bio: string;
  avatar?: string;
  display_order: number;
  is_active: boolean;
}

const AdminStaffManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState<StaffMember>({
    name: '',
    role: '',
    short_bio: '',
    display_order: 0,
    is_active: true
  });
  
  const [errors, setErrors] = useState<{[key: string]: string | null}>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: isDarkMode ? '#fff' : '#000',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)'
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#10b981'
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? '#94a3b8' : '#64748b',
      '&.Mui-focused': {
        color: '#10b981'
      }
    }
  };

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      setLoading(true);

      const response: any = await staffMemberService.getAll();

      // Updated to handle direct array response (no wrapper)
      if (Array.isArray(response)) {
        setStaffMembers(response);
      } else {
        console.error('Invalid response format:', response);
        setStaffMembers([]);
      }
    } catch (err: any) {
      console.error('AdminStaffManagement - Load error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Failed to load staff members. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission.';
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const maxOrder = staffMembers.length > 0 
      ? Math.max(...staffMembers.map(s => s.display_order)) 
      : 0;
    
    setFormData({
      name: '',
      role: '',
      short_bio: '',
      display_order: maxOrder + 1,
      is_active: true
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: StaffMember) => {
    setFormData(item);
    setAvatarFile(null);
    setAvatarPreview(item.avatar || '');
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffMemberService.delete(id);
        showToast('Staff member deleted successfully!', 'success');
        loadStaffMembers();
      } catch (err: any) {
        console.error('AdminStaffManagement - Delete error:', err);
        
        // Handle different types of errors
        let errorMessage = 'Failed to delete staff member. Please try again.';
        
        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err?.response?.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (err?.response?.status === 403) {
          errorMessage = 'Access denied. You do not have permission.';
        } else if (err?.response?.status === 404) {
          errorMessage = 'Staff member not found.';
        }
        
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    newErrors.name = validateText(formData.name, 2, 100, 'Name', true);
    newErrors.role = validateText(formData.role, 2, 50, 'Role', true);
    newErrors.short_bio = validateText(formData.short_bio, 10, 1000, 'Bio', true);
    newErrors.display_order = validateNumber(formData.display_order, 0, 1000, 'Display Order', false);
    
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }
    
    setErrors({});
    
    try {
      setSaving(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('short_bio', formData.short_bio);
      submitData.append('display_order', formData.display_order.toString());
      submitData.append('is_active', formData.is_active ? '1' : '0');
      
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      if (isEditing && editingId) {
        submitData.append('_method', 'PUT');
        await staffMemberService.update(editingId, submitData);
        showToast('Staff member updated successfully!', 'success');
      } else {
        await staffMemberService.create(submitData);
        showToast('Staff member created successfully!', 'success');
      }
      
      setShowForm(false);
      loadStaffMembers();
    } catch (err: any) {
      console.error('AdminStaffManagement - Save error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Failed to save staff member. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation failed. Please check your input.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Staff member with this name already exists.';
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newStaff = [...staffMembers];
    [newStaff[index - 1], newStaff[index]] = [newStaff[index], newStaff[index - 1]];
    
    const orders = newStaff.map((staff, idx) => ({
      id: staff.id!,
      display_order: idx + 1
    }));
    
    console.log('Reorder request (moveUp):', orders);
    try {
      await staffMemberService.reorder(orders);
      setSnackbar({ open: true, message: 'Staff order updated successfully', severity: 'success' });
      loadStaffMembers();
    } catch (err: any) {
      console.error('Error reordering staff:', err);
      setSnackbar({ open: true, message: `Failed to reorder: ${err.message || 'Unknown error'}`, severity: 'error' });
    }
  };

  const moveDown = async (index: number) => {
    if (index === staffMembers.length - 1) return;
    const newStaff = [...staffMembers];
    [newStaff[index], newStaff[index + 1]] = [newStaff[index + 1], newStaff[index]];
    
    const orders = newStaff.map((staff, idx) => ({
      id: staff.id!,
      display_order: idx + 1
    }));
    
    console.log('Reorder request (moveDown):', orders);
    try {
      await staffMemberService.reorder(orders);
      setSnackbar({ open: true, message: 'Staff order updated successfully', severity: 'success' });
      loadStaffMembers();
    } catch (err: any) {
      console.error('Error reordering staff:', err);
      setSnackbar({ open: true, message: `Failed to reorder: ${err.message || 'Unknown error'}`, severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} sx={{ color: '#10b981' }} />
        <Typography variant="h6" sx={{ color: '#10b981' }}>
          Loading staff members...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>

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

      {/* Header with Action Button - Responsive */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 4, 
        mt: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#047857', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Staff Members
          </Typography>
          <Chip 
            label={`${staffMembers.length}/5`} 
            color={staffMembers.length >= 5 ? 'error' : 'success'}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus className="h-4 w-4 sm:h-5 sm:w-5" />}
          onClick={handleCreate}
          disabled={staffMembers.length >= 5}
          sx={{
            bgcolor: '#10b981',
            '&:hover': {
              bgcolor: '#059669',
            },
            '&:disabled': {
              bgcolor: '#d1d5db',
            },
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 1.5 },
            minHeight: '44px',
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Add Staff Member
        </Button>
      </Box>

      {/* MUI Table for Staff Members - Responsive */}
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'auto',
          background: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'white',
          backdropFilter: 'blur(10px)',
          maxHeight: { xs: '70vh', sm: '80vh' }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#f3f4f6' }}>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '60px', sm: '80px' }
              }}>Order</TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '60px', sm: '80px' }
              }}>Avatar</TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '100px', sm: '120px' }
              }}>Name</TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '80px', sm: '100px' }
              }}>Role</TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '120px', sm: '150px' },
                display: { xs: 'none', md: 'table-cell' }
              }}>Bio</TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '60px', sm: '80px' }
              }}>Status</TableCell>
              <TableCell align="center" sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                color: isDarkMode ? '#e2e8f0' : '#334155',
                minWidth: { xs: '80px', sm: '100px' }
              }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffMembers.map((item, index) => (
              <TableRow 
                key={item.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f9fafb' 
                  },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Chip 
                    label={`#${item.display_order}`} 
                    size="small"
                    sx={{ 
                      bgcolor: '#d1fae5',
                      color: '#047857',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Avatar
                    src={item.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name)}
                    alt={item.name}
                    sx={{ 
                      width: { xs: 40, sm: 56 }, 
                      height: { xs: 40, sm: 56 },
                      border: '3px solid #d1fae5'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body1" 
                    fontWeight={600} 
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#047857',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? '#94a3b8' : '#059669', 
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {item.role}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? '#94a3b8' : '#6b7280',
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.short_bio}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge 
                    status={item.is_active ? 'active' : 'inactive'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 0.25, sm: 0.5 }, 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <Tooltip title="Move Up">
                      <span>
                        <IconButton
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          size="small"
                          sx={{ 
                            color: '#10b981',
                            '&:hover': { bgcolor: '#d1fae5' },
                            minWidth: '32px',
                            minHeight: '32px'
                          }}
                        >
                          <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move Down">
                      <span>
                        <IconButton
                          onClick={() => moveDown(index)}
                          disabled={index === staffMembers.length - 1}
                          size="small"
                          sx={{ 
                            color: '#10b981',
                            '&:hover': { bgcolor: '#d1fae5' },
                            minWidth: '32px',
                            minHeight: '32px'
                          }}
                        >
                          <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(item)}
                        size="small"
                        sx={{ 
                          color: '#3b82f6',
                          '&:hover': { bgcolor: '#dbeafe' },
                          minWidth: '32px',
                          minHeight: '32px'
                        }}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(item.id!)}
                        size="small"
                        sx={{ 
                          color: '#ef4444',
                          '&:hover': { bgcolor: '#fee2e2' },
                          minWidth: '32px',
                          minHeight: '32px'
                        }}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MUI Dialog for Form */}
      <Dialog 
        open={showForm} 
        onClose={() => setShowForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: { xs: '95vh', sm: '90vh' },
            background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            m: { xs: 1, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#f0fdf4', 
          color: isDarkMode ? '#fff' : '#047857',
          fontWeight: 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          borderBottom: '2px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#d1fae5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 2, sm: 3 }
        }}>
          <span>{isEditing ? 'Edit Staff Member' : 'Add Staff Member'}</span>
          <IconButton
            onClick={() => setShowForm(false)}
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
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
              {/* Avatar Upload */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: isDarkMode ? '#fff' : '#047857' }}>
                  Avatar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={avatarPreview}
                    alt="Preview"
                    sx={{
                      width: 96,
                      height: 96,
                      border: '3px solid #d1fae5',
                      bgcolor: avatarPreview ? 'transparent' : '#e5e7eb'
                    }}
                  >
                    {!avatarPreview && <ImageIcon className="h-10 w-10 text-gray-400" />}
                  </Avatar>
                  <Box>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<Upload className="h-5 w-5" />}
                      sx={{
                        bgcolor: '#10b981',
                        '&:hover': { bgcolor: '#059669' },
                        textTransform: 'none',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      Upload Avatar
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </Button>
                    <Typography variant="caption" display="block" sx={{ color: '#6b7280' }}>
                      JPG, PNG or GIF. Max 3MB.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: null });
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                  inputProps={{ minLength: 2, maxLength: 100 }}
                  placeholder="Enter staff member name"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Role"
                  required
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ ...formData, role: e.target.value });
                    setErrors({ ...errors, role: null });
                  }}
                  error={!!errors.role}
                  helperText={errors.role}
                  inputProps={{ minLength: 2, maxLength: 50 }}
                  placeholder="e.g., CEO, Developer, Designer"
                  sx={textFieldStyles}
                />
              </Box>

              <TextField
                fullWidth
                label="Short Bio"
                required
                multiline
                rows={4}
                value={formData.short_bio}
                onChange={(e) => {
                  setFormData({ ...formData, short_bio: e.target.value });
                  setErrors({ ...errors, short_bio: null });
                }}
                error={!!errors.short_bio}
                helperText={errors.short_bio}
                inputProps={{ minLength: 10, maxLength: 1000 }}
                placeholder="Brief description about this staff member"
                sx={textFieldStyles}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Display Order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => {
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 });
                    setErrors({ ...errors, display_order: null });
                  }}
                  error={!!errors.display_order}
                  helperText={errors.display_order}
                  inputProps={{ min: 0, max: 1000 }}
                  sx={textFieldStyles}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      sx={{
                        color: '#10b981',
                        '&.Mui-checked': {
                          color: '#10b981',
                        },
                      }}
                    />
                  }
                  label="Active"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      color: '#047857',
                      fontWeight: 600
                    } 
                  }}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            px: { xs: 2, sm: 3 }, 
            py: { xs: 2, sm: 2 }, 
            bgcolor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#f9fafb', 
            borderTop: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Button
              onClick={() => setShowForm(false)}
              sx={{ 
                color: isDarkMode ? '#94a3b8' : '#6b7280',
                textTransform: 'none',
                fontWeight: 600,
                minHeight: '44px',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save className="h-4 w-4 sm:h-5 sm:w-5" />}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                minHeight: '44px',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Toast Notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default AdminStaffManagement;

