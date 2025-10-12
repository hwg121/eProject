import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../services/api';
import ImageUpload from '../ImageUpload';
import SecurityPasswordModal from './SecurityPasswordModal';
import StatusBadge from '../UI/StatusBadge';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface UserEditFormProps {
  userData: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
  currentUserRole?: string;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  userData,
  onSave,
  onCancel,
  currentUserRole = 'admin'
}) => {
  const { isDarkMode } = useTheme();
  
  // Dark mode TextField styles
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: isDarkMode ? '#fff' : '#000',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#10b981'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#10b981'
      }
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? '#94a3b8' : '#64748b',
      '&.Mui-focused': {
        color: '#10b981'
      }
    }
  };
  
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
  
  const [formData, setFormData] = useState({
    id: userData?.id || '',
    name: userData?.name || '',
    email: userData?.email || '',
    password: '',
    phone: userData?.phone || '',
    phone_country_code: userData?.phone_country_code || 'VN',
    country: userData?.country || 'VN',
    address: userData?.address || '',
    city: userData?.city || '',
    zip_code: userData?.zip_code || '',
    role: userData?.role || 'moderator',
    status: userData?.status || 'active',
    is_banned: userData?.is_banned || false,
    avatar: userData?.avatar || '',
    avatar_public_id: userData?.avatar_public_id || ''
  });

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  
  const originalRole = userData?.role || 'moderator';

  // Update formData when userData changes (e.g., after F5/reload)
  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        phone: userData.phone || '',
        phone_country_code: userData.phone_country_code || 'VN',
        country: userData.country || 'VN',
        address: userData.address || '',
        city: userData.city || '',
        zip_code: userData.zip_code || '',
        role: userData.role || 'moderator',
        status: userData.status || 'active',
        is_banned: userData.is_banned || false,
        avatar: userData.avatar || '',
        avatar_public_id: userData.avatar_public_id || ''
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if editing admin or changing to admin - require security password
    const isChangingToAdmin = formData.role === 'admin';
    const isAlreadyAdmin = originalRole === 'admin';
    
    if (isChangingToAdmin || isAlreadyAdmin) {
      setPendingData(formData);
      setShowSecurityModal(true);
    } else {
      onSave(formData);
    }
  };
  
  const handleSecurityConfirm = (securityPassword: string) => {
    if (pendingData) {
      // Add security password to data
      const dataWithSecurity = {
        ...pendingData,
        security_password: securityPassword
      };
      onSave(dataWithSecurity);
      setShowSecurityModal(false);
      setPendingData(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 3 }}
      >
        <Link underline="hover" color="inherit" href="#">
          <Typography variant="body2">Dashboard</Typography>
        </Link>
        <Link underline="hover" color="inherit" href="#">
          <Typography variant="body2">User Management</Typography>
        </Link>
        <Typography variant="body2" color="primary" fontWeight={600}>Edit User</Typography>
      </Breadcrumbs>

      {/* Main Profile Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 3 }}>
        {/* Left Column - User Status and Actions */}
        <Card 
          elevation={3}
          sx={{ 
            borderRadius: 3,
            background: isDarkMode 
              ? 'rgba(30, 41, 59, 0.6)' 
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDarkMode 
                ? '0 12px 40px rgba(16, 185, 129, 0.3)' 
                : '0 12px 40px rgba(16, 185, 129, 0.15)',
              transform: 'translateY(-4px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* User Status */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <StatusBadge 
                status={formData.status as 'active' | 'inactive'}
                size="medium"
              />
            </Box>

            {/* Profile Picture */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: isDarkMode ? '#fff' : '#1e293b' }}>
                Profile Picture
              </Typography>
              <ImageUpload
                value={formData.avatar}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
                onError={(error) => showToast(error, 'error')}
                folder="user-avatar"
                modelType="user"
                maxSize={3}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Account Settings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: isDarkMode ? '#fff' : '#1e293b' }}>
                Account Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_banned}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        is_banned: e.target.checked,
                        status: e.target.checked ? 'banned' : 'active'
                      }));
                    }}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ef4444',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ef4444',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ color: isDarkMode ? '#fff' : '#000' }}>Banned</Typography>
                    <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Disable account access</Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                type="submit"
                form="user-edit-form"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.5,
                }}
              >
                Save Changes
              </Button>
              <Button 
                onClick={onCancel}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  '&:hover': { 
                    borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                    bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.5,
                }}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Right Column - User Details Form */}
        <Card 
          elevation={3}
          sx={{ 
            borderRadius: 3,
            background: isDarkMode 
              ? 'rgba(30, 41, 59, 0.6)' 
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDarkMode 
                ? '0 12px 40px rgba(16, 185, 129, 0.3)' 
                : '0 12px 40px rgba(16, 185, 129, 0.15)',
              transform: 'translateY(-4px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: isDarkMode ? '#fff' : '#1e293b' }}>
              User Details
            </Typography>
            
            <form id="user-edit-form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password (leave blank to keep current)"
                  helperText="Leave blank to keep current password"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  sx={textFieldStyles}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#047857' } }}>Country</InputLabel>
                  <Select
                    value={formData.country || 'VN'}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    label="Country"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                    }}
                  >
                    <MenuItem value="VN">🇻🇳 Vietnam</MenuItem>
                    <MenuItem value="US">🇺🇸 United States</MenuItem>
                    <MenuItem value="UK">🇬🇧 United Kingdom</MenuItem>
                    <MenuItem value="JP">🇯🇵 Japan</MenuItem>
                    <MenuItem value="KR">🇰🇷 South Korea</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Address"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Zip Code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                  placeholder="Zip/code"
                  sx={textFieldStyles}
                />

                {currentUserRole === 'admin' && (
                  <FormControl fullWidth>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#047857' } }}>Role</InputLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      label="Role"
                      sx={{
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      }}
                    >
                      <MenuItem value="moderator">Moderator</MenuItem>
                      <MenuItem value="admin">Admin (Requires Security Password)</MenuItem>
                    </Select>
                    {(formData.role === 'admin' || originalRole === 'admin') && (
                      <Typography variant="caption" sx={{ mt: 1, color: '#d97706', display: 'block' }}>
                        ⚠️ Admin operations require security password verification
                      </Typography>
                    )}
                  </FormControl>
                )}

                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#047857' } }}>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    label="Status"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="banned">Banned</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
      
      {/* Security Password Modal */}
      <SecurityPasswordModal
        isOpen={showSecurityModal}
        onClose={() => {
          setShowSecurityModal(false);
          setPendingData(null);
        }}
        onConfirm={handleSecurityConfirm}
        title="Admin Operation Requires Verification"
        message="Editing admin users requires owner verification. Only the website owner should have this password."
      />
      
      {/* Toast Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserEditForm;
