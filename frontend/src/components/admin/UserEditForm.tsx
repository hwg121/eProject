import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../services/api';
import { validateBio, validateEmail, validatePhone } from '../../utils/validation';
import ImageUpload from '../common/ImageUpload';
import SecurityPasswordModal from './SecurityPasswordModal';
import StatusBadge from '../StatusBadge';
import Toast from '../ui/Toast';
import UserConfirmDialog from '../ui/UserConfirmDialog';
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
  Grid
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface UserEditFormProps {
  userData: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
  currentUserRole?: string;
  currentUserId?: string | number;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  userData,
  onSave,
  onCancel,
  currentUserRole = 'admin',
  currentUserId
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
    bio: userData?.bio || '',
    role: userData?.role || 'moderator',
    status: userData?.status || 'active',
    is_banned: userData?.is_banned || userData?.status === 'banned' || false,
    avatar: userData?.avatar || '',
    avatar_public_id: userData?.avatar_public_id || ''
  });

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showUserConfirmDialog, setShowUserConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<any>(null);
  const [pendingData, setPendingData] = useState<any>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);
  
  const originalRole = userData?.role || 'moderator';
  
  // Check if editing self
  const isEditingSelf = currentUserId && userData?.id && String(currentUserId) === String(userData.id);

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
        bio: userData.bio || '',
        role: userData.role || 'moderator',
        status: userData.status || 'active',
        is_banned: userData.is_banned || userData.status === 'banned' || false,
        avatar: userData.avatar || '',
        avatar_public_id: userData.avatar_public_id || ''
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate email
      const emailValidationError = validateEmail(formData.email, false);
      setEmailError(emailValidationError);
      
      // Validate phone
      const phoneValidationError = validatePhone(formData.phone, false);
      setPhoneError(phoneValidationError);
      
      // Validate bio
      const bioValidationError = validateBio(formData.bio, false, 1000);
      setBioError(bioValidationError);
      
      // If any validation errors, show toast and return
      if (emailValidationError || phoneValidationError || bioValidationError) {
        showToast('Please fix validation errors before saving', 'error');
        return;
      }
      
      // Check if editing admin or changing to admin - require security password
      const isChangingToAdmin = formData.role === 'admin';
      const isAlreadyAdmin = originalRole === 'admin';
      const isChangingPassword = formData.password && formData.password.trim() !== '';
      
      // Require security password if:
      // 1. Editing admin user OR
      // 2. Changing to admin role OR
      // 3. Changing password of any user
      if (isChangingToAdmin || isAlreadyAdmin || isChangingPassword) {
        setPendingData(formData);
        setShowSecurityModal(true);
      } else {
        await onSave(formData);
      }
    } catch (error: any) {
      console.error('UserEditForm - Save error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to save user. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.status === 422) {
        errorMessage = 'Validation failed. Please check your input.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission.';
      } else if (error?.response?.status === 409) {
        errorMessage = 'User with this email already exists.';
      }
      
      // Show error toast
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };
  
  const handleSecurityConfirm = async (securityPassword: string) => {
    try {
      if (pendingData) {
        // Check if changing password
        const isChangingPassword = pendingData.password && pendingData.password.trim() !== '';
        
        // Only show UserConfirmDialog if changing PASSWORD (to allow admin to copy new credentials)
        // If only changing role or other fields, save directly
        if (isChangingPassword) {
          // Changing password - show UserConfirmDialog to display new credentials
          const dataWithFirstLogin = {
            ...pendingData,
            security_password: securityPassword,
            first_login: true // Always set first_login = true when admin changes password
          };
          setConfirmDialogData(dataWithFirstLogin);
          setShowSecurityModal(false); // Close security modal
          setShowUserConfirmDialog(true); // Open confirm dialog
        } else {
          // Not changing password (only role/other fields) - save directly
          const dataWithSecurity = {
            ...pendingData,
            security_password: securityPassword
          };
          
          // Try to save - if backend rejects security password, error will be caught
          await onSave(dataWithSecurity);
          
          // Success - close modal and clear pending data
          setShowSecurityModal(false);
          setPendingData(null);
        }
      }
    } catch (error: any) {
      console.error('UserEditForm - Security confirm error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to save user. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.status === 422) {
        errorMessage = 'Validation failed. Please check your input.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Access denied. Invalid security password.';
      } else if (error?.response?.status === 409) {
        errorMessage = 'User with this email already exists.';
      }
      
      // Show error toast
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      
      // Keep modal open so user can try again - DON'T close modal on error!
      // Modal will stay open and user can re-enter password
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      if (confirmDialogData) {
        // Try to save first, close dialog only on success
        await onSave(confirmDialogData);
        
        // Success - close dialog and clear data
        setShowUserConfirmDialog(false);
        setConfirmDialogData(null);
        setPendingData(null);
      }
    } catch (error: any) {
      console.error('UserEditForm - Confirm update error:', error);
      
      let errorMessage = 'Failed to save user. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.status === 403) {
        errorMessage = 'Access denied. Invalid security password.';
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      
      // Keep dialog open on error so user sees the issue
      // They can click Cancel to close it
    }
  };

  const handleCancelConfirm = () => {
    setShowUserConfirmDialog(false);
    setConfirmDialogData(null);
  };

  const handleCopyUserInfo = () => {
    if (confirmDialogData) {
      const userInfo = `Name: ${confirmDialogData.name}\nEmail: ${confirmDialogData.email}\n${confirmDialogData.password ? `Password: ${confirmDialogData.password}\n` : ''}Role: ${confirmDialogData.role}`;
      navigator.clipboard.writeText(userInfo).then(() => {
        showToast('User information copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
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
                status={formData.status as 'active' | 'inactive' | 'banned'}
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
                onUploadSuccess={(data) => {
                  // Save both URL and public_id
                  setFormData(prev => ({ 
                    ...prev, 
                    avatar: data.url,
                    avatar_public_id: data.public_id
                  }));
                }}
                onError={(error) => showToast(error, 'error')}
                folder="user-avatar"
                modelType="user"
                maxSize={3}
                shape="rounded-full"
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
                    disabled={isEditingSelf}
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
                    <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                      {isEditingSelf ? 'Cannot ban yourself' : 'Disable account access'}
                    </Typography>
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
            
            <form id="user-edit-form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, email: value }));
                    
                    // Validate email
                    const error = validateEmail(value, false);
                    setEmailError(error);
                  }}
                  placeholder="Email address"
                  inputProps={{ maxLength: 254 }}
                  helperText={emailError || `${formData.email?.length || 0}/254 characters`}
                  error={!!emailError}
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password (leave blank to keep current)"
                  helperText="⚠️ Changing password requires security password verification. Leave blank to keep current."
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, phone: value }));
                    
                    // Validate phone
                    const error = validatePhone(value, false);
                    setPhoneError(error);
                  }}
                  placeholder="Enter phone number"
                  inputProps={{ maxLength: 20, pattern: '[0-9\\s\\-\\(\\)\\+]+' }}
                  helperText={phoneError || `${formData.phone?.length || 0}/20 characters`}
                  error={!!phoneError}
                  sx={textFieldStyles}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#047857' } }}>Phone Country Code</InputLabel>
                  <Select
                    value={formData.phone_country_code || 'VN'}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_country_code: e.target.value }))}
                    label="Phone Country Code"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                    }}
                 >
                    <MenuItem value="VN">+84 (VN)</MenuItem>
                    <MenuItem value="US">+1 (US)</MenuItem>
                    <MenuItem value="UK">+44 (UK)</MenuItem>
                    <MenuItem value="JP">+81 (JP)</MenuItem>
                    <MenuItem value="KR">+82 (KR)</MenuItem>
                  </Select>
                </FormControl>

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
                  inputProps={{ maxLength: 255 }}
                  helperText={`${formData.city?.length || 0}/255 characters`}
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Address"
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.address?.length || 0}/500 characters`}
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Zip Code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                  placeholder="Zip/code"
                  inputProps={{ maxLength: 20 }}
                  helperText={`${formData.zip_code?.length || 0}/20 characters`}
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, bio: value }));
                    
                    // Validate bio
                    const error = validateBio(value, false, 1000);
                    setBioError(error);
                  }}
                  placeholder="Tell us about yourself..."
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 1000 }}
                  helperText={bioError || `${formData.bio.length}/1000 characters`}
                  error={!!bioError}
                  sx={textFieldStyles}
                />

                {currentUserRole === 'admin' && !isEditingSelf && (
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
                
                {isEditingSelf && (
                  <TextField
                    fullWidth
                    label="Role"
                    value={formData.role === 'admin' ? 'Admin' : 'Moderator'}
                    disabled
                    helperText="Cannot change your own role"
                    sx={textFieldStyles}
                  />
                )}

                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#047857' } }}>Status</InputLabel>
                  <Select
                    value={formData.status}
                    disabled={isEditingSelf}
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
                  {isEditingSelf && (
                    <Typography variant="caption" sx={{ mt: 1, color: '#d97706', display: 'block' }}>
                      ⚠️ Cannot change your own status
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
      
      {/* User Confirmation Dialog */}
      <UserConfirmDialog
        open={showUserConfirmDialog}
        userData={{
          name: confirmDialogData?.name || '',
          email: confirmDialogData?.email || '',
          password: confirmDialogData?.password || '',
          role: confirmDialogData?.role || ''
        }}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelConfirm}
        onCopy={handleCopyUserInfo}
        isDarkMode={isDarkMode}
      />

      {/* Security Password Modal */}
      <SecurityPasswordModal
        isOpen={showSecurityModal}
        onClose={() => {
          setShowSecurityModal(false);
          setPendingData(null);
        }}
        onConfirm={handleSecurityConfirm}
        title="Admin Operation Requires Verification"
        message={
          formData.password && formData.password.trim() !== ''
            ? "Changing user passwords requires owner verification. Only the website owner should have this password."
            : "Editing admin users requires owner verification. Only the website owner should have this password."
        }
      />
      
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

export default UserEditForm;
