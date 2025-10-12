import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../UI/Toast';
import ImageUpload from '../ImageUpload';
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
  Breadcrumbs,
  Link,
  Divider,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update parent state with local changes
    Object.keys(profileData).forEach(key => {
      if ((profileData as any)[key] !== (userProfile as any)[key]) {
        onUserProfileChange(key, (profileData as any)[key]);
      }
    });
    onSaveUserProfile();
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
        <Typography variant="body2" color="primary" fontWeight={600}>{profileData.name}</Typography>
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
                status={profileData.status as 'active' | 'inactive' | 'banned'}
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

            {/* Note */}
            <Box 
              sx={{ 
                bgcolor: '#eff6ff', 
                border: '1px solid #bfdbfe',
                borderRadius: 2,
                p: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{ flexShrink: 0, mr: 1.5 }}>
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, color: '#60a5fa' }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#1e40af', mb: 0.5 }}>
                    Account Management
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#1e40af' }}>
                    To change your account status or delete your account, please contact an administrator.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                type="submit"
                form="user-profile-form"
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
            </Box>
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
            
            <form id="user-profile-form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={profileData.password || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password (leave blank to keep current)"
                  helperText="Leave blank to keep current password"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  sx={textFieldStyles}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#047857' } }}>Country</InputLabel>
                  <Select
                    value={profileData.country || 'VN'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
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
                  value={profileData.city}
                  onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Address"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Zip Code"
                  value={profileData.zip_code}
                  onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                  placeholder="Zip/code"
                  sx={textFieldStyles}
                />

                {/* Role - Read-only */}
                <TextField
                  fullWidth
                  label="Role"
                  value={profileData.role === 'admin' ? 'Admin' : 'Moderator'}
                  disabled
                  helperText="Role cannot be changed from your profile. Contact admin for role changes."
                  sx={textFieldStyles}
                />
              </Box>
            </form>
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
