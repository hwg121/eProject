import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Lock, UserPlus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, Button, IconButton, InputAdornment } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../ui/Card';
import Toast from '../ui/Toast';
import ImageUpload from '../common/ImageUpload';
import SecurityPasswordModal from './SecurityPasswordModal';
import UserConfirmDialog from '../ui/UserConfirmDialog';
import { validatePassword } from '../../utils/validation';

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
    avatar: '',
    first_login: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dark mode TextField styles - synced with UserEditForm
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

  // Generate random password function
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setFormData(prev => ({
      ...prev,
      password: newPassword,
      confirmPassword: newPassword
    }));
    // Clear password errors when generating
    setErrors(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      } else if (formData.email.trim().length > 254) {
        newErrors.email = 'Email must not exceed 254 characters';
      }
    }

    // Validate password using utility function
    const passwordError = validatePassword(formData.password, true, 8, 128);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const phoneDigits = formData.phone.replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d+$/.test(phoneDigits)) {
        newErrors.phone = 'Phone can only contain digits, spaces, dashes, and parentheses';
      } else if (phoneDigits.length < 10) {
        newErrors.phone = 'Phone must be at least 10 digits';
      } else if (phoneDigits.length > 15) {
        newErrors.phone = 'Phone must not exceed 15 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show confirmation dialog instead of directly submitting
    setShowConfirmDialog(true);
  };

  const handleConfirmCreate = () => {
    setShowConfirmDialog(false);
    
    // Check if creating admin role - require security password
    if (formData.role === 'admin') {
      setPendingData(formData);
      setShowSecurityModal(true);
    } else {
      onSave(formData);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  const handleCopyUserInfo = () => {
    const userInfo = `Name: ${formData.name}\nEmail: ${formData.email}\nPassword: ${formData.password}\nRole: ${formData.role}`;
    navigator.clipboard.writeText(userInfo).then(() => {
      showToast('User information copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy to clipboard', 'error');
    });
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
    
    // Real-time validation for specific fields
    if (field === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(value.trim())) {
        setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
        return;
      }
    }
    
    if (field === 'phone' && value) {
      const phoneDigits = value.replace(/[\s\-\(\)\+]/g, '');
      if (phoneDigits && !/^\d+$/.test(phoneDigits)) {
        setErrors(prev => ({ ...prev, phone: 'Phone can only contain digits, spaces, dashes, and parentheses' }));
        return;
      }
    }
    
    if (field === 'name' && value.length > 100) {
      setErrors(prev => ({ ...prev, name: 'Name must not exceed 100 characters' }));
      return;
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  return (
    <div className="space-y-4 max-w-4xl mx-auto">
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
      <Card className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: actualDarkMode ? '#fff' : '#1f2937',
              fontWeight: 600
            }}>
              <User className="w-5 h-5" />
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                error={!!errors.name}
                helperText={errors.name || `${formData.name.length}/100 characters (min 2)`}
                inputProps={{ maxLength: 100 }}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                error={!!errors.email}
                helperText={errors.email || 'Valid email format: user@example.com (max 254 chars)'}
                inputProps={{ maxLength: 254 }}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                error={!!errors.phone}
                helperText={errors.phone || 'Format: +1234567890 or (123) 456-7890 (10-15 digits)'}
                inputProps={{ 
                  pattern: '[0-9\\s\\-\\(\\)\\+]{10,20}',
                  maxLength: 20
                }}
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: actualDarkMode ? '#fff' : '#1f2937',
              fontWeight: 600
            }}>
              <Lock style={{ width: '20px', height: '20px' }} />
              Security
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Password Generator Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  onClick={handleGeneratePassword}
                  variant="outlined"
                  startIcon={<RefreshCw style={{ width: '16px', height: '16px' }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: actualDarkMode ? '#4b5563' : '#d1d5db',
                    color: actualDarkMode ? '#e5e7eb' : '#6b7280',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#10b981',
                      color: '#10b981',
                      bgcolor: actualDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                    }
                  }}
                >
                  Generate Random Password
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  error={!!errors.password}
                  helperText={errors.password || 'Password: 8+ chars, uppercase, lowercase, number, special char (!@#$%...)'}
                  inputProps={{ 
                    minLength: 6,
                    maxLength: 128,
                    pattern: '\\S{6,128}'
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: actualDarkMode ? '#9ca3af' : '#6b7280',
                            '&:hover': {
                              color: '#10b981'
                            }
                          }}
                        >
                          {showPassword ? (
                            <EyeOff style={{ width: '20px', height: '20px' }} />
                          ) : (
                            <Eye style={{ width: '20px', height: '20px' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{
                            color: actualDarkMode ? '#9ca3af' : '#6b7280',
                            '&:hover': {
                              color: '#10b981'
                            }
                          }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff style={{ width: '20px', height: '20px' }} />
                          ) : (
                            <Eye style={{ width: '20px', height: '20px' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={textFieldStyles}
                />
              </Box>
            </Box>
          </Box>

          {/* Profile */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: actualDarkMode ? '#fff' : '#1f2937',
              fontWeight: 600
            }}>
              <UserPlus className="w-5 h-5" />
              Profile
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                />
              </Box>

              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={2}
                value={formData.bio}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 1000) return;
                  handleInputChange('bio', value);
                }}
                placeholder="Tell us about this user..."
                helperText={`${formData.bio.length}/1000 characters`}
                inputProps={{ maxLength: 1000 }}
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
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
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
      
      {/* User Confirmation Dialog */}
      <UserConfirmDialog
        open={showConfirmDialog}
        userData={{
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }}
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelConfirm}
        onCopy={handleCopyUserInfo}
        isDarkMode={actualDarkMode}
      />

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
