import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../ui/Toast';
import ImageUpload from '../common/ImageUpload';
import StatusBadge from '../StatusBadge';
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

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
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
              <Alert severity={profileData?.status === 'active' ? 'success' : 'error'} sx={{ mb: 2 }}>
                <AlertTitle sx={{ fontWeight: 700 }}>
                  {profileData?.status === 'active' ? 'Account Active' : 'Account Banned'}
                </AlertTitle>
                <Typography variant="body2">
                          {profileData?.status === 'active' 
                            ? 'Your account is active and you can access all features.' 
                            : 'Your account has been banned. Please contact administrator for assistance.'
                          }
                </Typography>
              </Alert>
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
              onClick={() => {
                // Update parent state with local changes
                Object.keys(profileData).forEach(key => {
                  if ((profileData as any)[key] !== (userProfile as any)[key]) {
                    onUserProfileChange(key, (profileData as any)[key]);
                  }
                });
                onSaveUserProfile();
              }}
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
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Password"
                    type="password"
                    value={profileData?.password || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter new password (leave blank to keep current)"
                helperText="Leave blank to keep current password"
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Phone Number"
                      type="tel"
                      value={profileData?.phone || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                sx={textFieldStyles}
              />

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
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Address"
                    value={profileData?.address || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Address"
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Zip Code"
                    value={profileData?.zip_code || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                    placeholder="Zip/code"
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
    </Box>
  );
};

export default UserProfileComponent;
