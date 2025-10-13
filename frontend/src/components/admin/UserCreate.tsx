import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, User, Mail, Lock, Shield, UserPlus } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../UI/Card';
import Toast from '../UI/Toast';
import ImageUpload from '../ImageUpload';
import SecurityPasswordModal from './SecurityPasswordModal';

interface UserCreateProps {
  onSave: (userData: any) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  currentUserRole?: string;
}

const UserCreate: React.FC<UserCreateProps> = ({
  onSave,
  onCancel,
  isDarkMode,
  currentUserRole = 'admin'
}) => {
  const { isDarkMode: themeDarkMode } = useTheme();
  const actualDarkMode = isDarkMode || themeDarkMode;
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
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'moderator',
    status: 'active',
    phone: '',
    bio: '',
    avatar: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Dark mode TextField styles - đồng bộ với UserEditForm
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: actualDarkMode ? '#fff' : '#000',
      backgroundColor: actualDarkMode ? 'rgba(55, 65, 81, 0.8)' : '#fff',
      '& fieldset': {
        borderColor: actualDarkMode ? 'rgba(255, 255, 255, 0.23)' : '#c4c4c4',
      },
      '&:hover fieldset': {
        borderColor: actualDarkMode ? 'rgba(255, 255, 255, 0.4)' : '#10b981',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#10b981',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: actualDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
      '&.Mui-focused': {
        color: '#10b981',
      },
    },
    '& .MuiFormHelperText-root': {
      color: actualDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666',
    },
    '& .MuiSelect-select': {
      color: actualDarkMode ? '#fff' : '#000',
      backgroundColor: 'transparent',
    },
    '& .MuiSelect-icon': {
      color: actualDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
    },
  };
  const [pendingData, setPendingData] = useState<any>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if creating admin role - require security password
    if (formData.role === 'admin') {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onCancel}
            className={`p-2 rounded-lg ${
              actualDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className={`text-2xl font-bold ${actualDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Create New User
            </h2>
            <p className={`text-sm ${actualDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Add a new user to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card sx={{ 
        p: 3,
        background: actualDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'white',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: actualDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
      }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: actualDarkMode ? '#fff' : '#1f2937',
              fontWeight: 600
            }}>
              <User className="w-5 h-5" />
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                error={!!errors.name}
                helperText={errors.name}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                error={!!errors.email}
                helperText={errors.email}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                error={!!errors.phone}
                helperText={errors.phone}
                sx={textFieldStyles}
              />

              {currentUserRole === 'admin' && (
                <FormControl fullWidth sx={textFieldStyles}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="moderator">Moderator</MenuItem>
                    <MenuItem value="admin">Admin (Requires Security Password)</MenuItem>
                  </Select>
                  {formData.role === 'admin' && (
                    <Typography variant="caption" sx={{ mt: 1, color: '#ca8a04', display: 'block' }}>
                      ⚠️ Creating admin requires security password verification
                    </Typography>
                  )}
                </FormControl>
              )}
            </Box>
          </Box>

          {/* Security */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: actualDarkMode ? '#fff' : '#1f2937',
              fontWeight: 600
            }}>
              <Lock className="w-5 h-5" />
              Security
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                error={!!errors.password}
                helperText={errors.password || 'Minimum 6 characters'}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={textFieldStyles}
              />
            </Box>
          </Box>

          {/* Profile */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: actualDarkMode ? '#fff' : '#1f2937',
              fontWeight: 600
            }}>
              <UserPlus className="w-5 h-5" />
              Profile
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' 
                }}>
                  Avatar
                </Typography>
                <ImageUpload
                  value={formData.avatar}
                  onChange={(url) => handleInputChange('avatar', url)}
                  onError={(error) => showToast(error, 'error')}
                  folder="user-avatar"
                  modelType="user"
                  maxSize={3}
                />
              </Box>

              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about this user..."
                sx={textFieldStyles}
              />

              <FormControl fullWidth sx={textFieldStyles}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="banned">Banned</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <motion.button
              type="button"
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                actualDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Create User</span>
              </div>
            </motion.button>
          </div>
        </form>
      </Card>
      
      {/* Security Password Modal */}
      <SecurityPasswordModal
        isOpen={showSecurityModal}
        onClose={() => {
          setShowSecurityModal(false);
          setPendingData(null);
        }}
        onConfirm={handleSecurityConfirm}
        title="Admin Creation Requires Verification"
        message="Creating an admin user requires owner verification. Only the website owner should have this password."
      />
      
      {/* Toast Notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default UserCreate;
