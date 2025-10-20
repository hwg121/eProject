import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../ui/Toast';
import ImageUpload from '../common/ImageUpload';
import StatusBadge from '../StatusBadge';
import ChangePasswordDialog from '../ui/ChangePasswordDialog';
import { validateEmail, validatePhone, validateBio } from '../../utils/validation';
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
  Breadcrumbs,
  Link,
  Divider,
  Alert,
  AlertTitle
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface UserProfileComponentProps {
  profileData: any;
  setProfileData: (fn: (prev: any) => any) => void;
  onUserProfileChange: (field: string, value: any) => void;
  onSaveUserProfile: () => void;
  userProfile: any;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
  profileData,
  setProfileData,
  onUserProfileChange,
  onSaveUserProfile,
  userProfile
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
      },
      '&.Mui-disabled': {
        color: isDarkMode ? '#6b7280' : '#9ca3af',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? '#94a3b8' : '#64748b',
      '&.Mui-focused': {
        color: '#10b981'
      },
      '&.Mui-disabled': {
        color: isDarkMode ? '#6b7280' : '#9ca3af'
      }
    },
    '& .MuiFormHelperText-root': {
      color: isDarkMode ? '#94a3b8' : '#64748b'
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
  
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://greengroves.io.vn/api';
      
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        showToast('Password changed successfully!', 'success');
        setShowChangePasswordDialog(false);
        // Backend has already set first_login = false
      } else {
        showToast(result.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Failed to change password. Please try again.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Validate and save - Call API directly with current profileData
  const handleSave = async () => {
    // Validate email
    const emailValidationError = validateEmail(profileData?.email || '', false);
    setEmailError(emailValidationError);

    // Validate phone
    const phoneValidationError = validatePhone(profileData?.phone || '', false);
    setPhoneError(phoneValidationError);

    // Validate bio
    const bioValidationError = validateBio(profileData?.bio || '', false, 1000);
    setBioError(bioValidationError);

    // If any validation errors, show toast and return
    if (emailValidationError || phoneValidationError || bioValidationError) {
      showToast('Please fix validation errors before saving', 'error');
      return;
    }

    // Create payload from current profileData (not parent state!)
    const payload = {
      name: profileData?.name || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      phone_country_code: profileData?.phone_country_code || '',
      country: profileData?.country || '',
      address: profileData?.address || '',
      city: profileData?.city || '',
      zip_code: profileData?.zip_code || '',
      bio: profileData?.bio || '',
      avatar: profileData?.avatar || null,
      avatar_public_id: profileData?.avatar_public_id || null,
    };

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://greengroves.io.vn/api';
      
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        showToast('Profile updated successfully!', 'success');
        
        // Sync back to parent state
        Object.keys(profileData).forEach(key => {
          onUserProfileChange(key, (profileData as any)[key]);
        });
        
        // Update localStorage
        if (result.data) {
          const currentUser = JSON.parse(localStorage.getItem('greengroves_user') || '{}');
          localStorage.setItem('greengroves_user', JSON.stringify({
            ...currentUser,
            ...result.data
          }));
        }
      } else {
        showToast(result.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
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
          <Typography variant="body2">User</Typography>
        </Link>
        <Typography variant="body2" color="primary" fontWeight={600}>{profileData?.name || 'User Profile'}</Typography>
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
                status={(profileData?.status || 'active') as 'active' | 'inactive' | 'banned'}
                size="medium"
              />
            </Box>

                {/* Profile Picture */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: isDarkMode ? '#fff' : '#1e293b' }}>
                Profile Picture
              </Typography>
                  <ImageUpload
                    value={profileData.avatar}
                    onChange={(url) => {
                      setProfileData(prev => ({ ...prev, avatar: url }));
                      onUserProfileChange('avatar', url);
                    }}
                    onUploadSuccess={(data) => {
                      // Save both URL and public_id
                      setProfileData(prev => ({ 
                        ...prev, 
                        avatar: data.url,
                        avatar_public_id: data.public_id
                      }));
                      onUserProfileChange('avatar', data.url);
                      onUserProfileChange('avatar_public_id', data.public_id);
                    }}
                    onError={(error) => showToast(error, 'error')}
                    folder="user-avatar"
                    modelType="user"
                    maxSize={3}
                    shape="rounded-full"
                  />
            </Box>

            <Divider sx={{ my: 3 }} />

                {/* Password Management */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: isDarkMode ? '#fff' : '#1e293b' }}>
                Password Management
              </Typography>
              <Button 
                variant="outlined"
                fullWidth
                onClick={() => setShowChangePasswordDialog(true)}
                sx={{
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  color: isDarkMode ? '#10b981' : '#059669',
                  '&:hover': { 
                    borderColor: '#10b981',
                    bgcolor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                 Change Password
              </Button>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                Use this to securely change your password
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

                {/* Note about account management */}
            <Alert severity="info">
              <AlertTitle sx={{ fontWeight: 700 }}>Account Management</AlertTitle>
              <Typography variant="body2">
                To change your account status, role, or delete your account, please contact an administrator.
              </Typography>
            </Alert>

            <Divider sx={{ my: 3 }} />

            {/* Save Button */}
            <Button 
              onClick={handleSave}
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
          </CardContent>
        </Card>

        {/* Right Column - Profile Details Form */}
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
              Profile Details
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Full Name"
                    value={profileData?.name || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Email Address"
                    type="email"
                    value={profileData?.email || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileData(prev => ({ ...prev, email: value }));
                      
                      // Validate email
                      const error = validateEmail(value, false);
                      setEmailError(error);
                    }}
                    placeholder="Email address"
                    inputProps={{ maxLength: 254 }}
                    helperText={emailError || `${(profileData?.email || '').length}/254 characters`}
                    error={!!emailError}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={profileData?.phone || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfileData(prev => ({ ...prev, phone: value }));
                  
                  // Validate phone
                  const error = validatePhone(value, false);
                  setPhoneError(error);
                }}
                placeholder="Enter phone number"
                inputProps={{ maxLength: 20, pattern: '[0-9\\s\\-\\(\\)\\+]+' }}
                helperText={phoneError || `${(profileData?.phone || '').length}/20 characters`}
                error={!!phoneError}
                sx={textFieldStyles}
              />

              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                    '&.Mui-focused': { color: '#10b981' }
                  }}
                >
                  Phone Country Code
                </InputLabel>
                <Select
                  value={profileData?.phone_country_code || 'VN'}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone_country_code: e.target.value }))}
                  label="Phone Country Code"
                  sx={{
                    color: isDarkMode ? '#fff' : '#000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)'
                    },
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
                <InputLabel 
                  sx={{ 
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                    '&.Mui-focused': { color: '#10b981' }
                  }}
                >
                  Country
                </InputLabel>
                <Select
                  value={profileData?.country || 'VN'}
                  onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                  label="Country"
                  sx={{
                    color: isDarkMode ? '#fff' : '#000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)'
                    },
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
                value={profileData?.city || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                inputProps={{ maxLength: 255 }}
                helperText={`${(profileData?.city || '').length}/255 characters`}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Address"
                value={profileData?.address || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Address"
                inputProps={{ maxLength: 500 }}
                helperText={`${(profileData?.address || '').length}/500 characters`}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Zip Code"
                value={profileData?.zip_code || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                placeholder="Zip/code"
                inputProps={{ maxLength: 20 }}
                helperText={`${(profileData?.zip_code || '').length}/20 characters`}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Bio"
                value={profileData?.bio || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfileData(prev => ({ ...prev, bio: value }));
                  
                  // Validate bio
                  const error = validateBio(value, false, 1000);
                  setBioError(error);
                }}
                placeholder="Tell us about yourself..."
                multiline
                rows={3}
                inputProps={{ maxLength: 1000 }}
                helperText={bioError || `${(profileData?.bio || '').length}/1000 characters`}
                error={!!bioError}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Role"
                    value={profileData?.role === 'admin' ? 'Admin' : 'Moderator'}
                    disabled
                helperText="Role cannot be changed from your profile. Contact admin for role changes."
                sx={textFieldStyles}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Toast Notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      
      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onClose={() => setShowChangePasswordDialog(false)}
        onSubmit={handleChangePassword}
        isDarkMode={isDarkMode}
        isLoading={isChangingPassword}
      />
    </Box>
  );
};

export default UserProfileComponent;
