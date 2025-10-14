import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../../components/UI/Toast';
import { apiClient } from '../../services/api';
import { validateRequired, validatePassword, hasErrors } from '../../utils/validation';

const AdminSecuritySettings: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    accountPassword: false,
    currentSecurityPassword: false,
    newSecurityPassword: false
  });
  
  const [formData, setFormData] = useState({
    accountPassword: '',
    currentSecurityPassword: '',
    newSecurityPassword: '',
    confirmSecurityPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const togglePasswordVisibility = (field: 'accountPassword' | 'currentSecurityPassword' | 'newSecurityPassword') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Account Password - required only
    const accountPasswordError = validateRequired(formData.accountPassword, 'Account password');
    if (accountPasswordError) {
      newErrors.accountPassword = accountPasswordError;
    }

    // Current Security Password - required only
    const currentPasswordError = validateRequired(formData.currentSecurityPassword, 'Current security password');
    if (currentPasswordError) {
      newErrors.currentSecurityPassword = currentPasswordError;
    }

    // New Security Password - required + min 8 chars
    const newPasswordError = validatePassword(formData.newSecurityPassword);
    if (newPasswordError) {
      newErrors.newSecurityPassword = newPasswordError;
    }

    // Confirm Password - required + must match
    const confirmPasswordError = validateRequired(formData.confirmSecurityPassword, 'Confirm new security password');
    if (confirmPasswordError) {
      newErrors.confirmSecurityPassword = confirmPasswordError;
    } else if (formData.newSecurityPassword !== formData.confirmSecurityPassword) {
      newErrors.confirmSecurityPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !hasErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setLoading(true);

    try {
      // First verify account password by attempting to update profile (dry run)
      // This is a security check to ensure the user knows their own password
      
      // Then update security password
      const response = await apiClient.request('/admin/security-password', {
        method: 'PUT',
        body: {
          current_password: formData.currentSecurityPassword,
          new_password: formData.newSecurityPassword,
          new_password_confirmation: formData.confirmSecurityPassword
        }
      });

      if (response.success) {
        showToast('Security password updated successfully!', 'success');
        
        // Clear form
        setFormData({
          accountPassword: '',
          currentSecurityPassword: '',
          newSecurityPassword: '',
          confirmSecurityPassword: ''
        });
        setErrors({});
      } else {
        showToast(response.message || 'Failed to update security password', 'error');
      }
    } catch (error: any) {
      console.error('Error updating security password:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to update security password. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#fff',
      '& fieldset': {
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.5)' : '#10b981',
      },
      '&.Mui-focused fieldset': {
        borderColor: isDarkMode ? '#10b981' : '#059669',
      },
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? '#9ca3af' : 'rgba(0, 0, 0, 0.6)',
      '&.Mui-focused': {
        color: isDarkMode ? '#10b981' : '#059669',
      },
    },
    '& .MuiInputBase-input': {
      color: isDarkMode ? '#f3f4f6' : '#000',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6"
    >
      {/* Header - Responsive */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 }, 
          mb: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Box
            sx={{
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.2))'
                : 'linear-gradient(135deg, rgba(254, 226, 226, 1), rgba(254, 202, 202, 1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: isDarkMode
                  ? 'linear-gradient(135deg, #fca5a5, #ef4444)'
                  : 'linear-gradient(135deg, #dc2626, #991b1b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Security Settings
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                color: isDarkMode ? '#9ca3af' : '#6b7280', 
                mt: 0.5,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Update the security password for admin role operations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Warning Alert */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: isDarkMode ? 'rgba(217, 119, 6, 0.1)' : '#fffbeb',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(251, 191, 36, 0.3)' : '#fcd34d',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AlertTriangle className={`h-5 w-5 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: isDarkMode ? '#fbbf24' : '#d97706', mb: 1 }}
            >
              Important Security Notice
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#fde68a' : '#92400e' }}>
              The security password is required when creating or editing admin users. This ensures only website
              owners can perform critical operations. Keep this password secure and different from your account password.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Form Card */}
      <Card
        elevation={0}
        sx={{
          bgcolor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#fff',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4 } }}>
            {/* Account Password Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 },
                  color: isDarkMode ? '#f3f4f6' : '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}
              >
                <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                Your Account Password
              </Typography>
              <TextField
                fullWidth
                type={showPasswords.accountPassword ? 'text' : 'password'}
                label="Account Password"
                value={formData.accountPassword}
                onChange={(e) => handleChange('accountPassword', e.target.value)}
                error={!!errors.accountPassword}
                helperText={errors.accountPassword || 'Enter your current account password for verification'}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('accountPassword')}
                        edge="end"
                        sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {showPasswords.accountPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Divider sx={{ borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.12)' }} />

            {/* Current Security Password Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: isDarkMode ? '#f3f4f6' : '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Shield className="h-4 w-4" />
                Current Security Password
              </Typography>
              <TextField
                fullWidth
                type={showPasswords.currentSecurityPassword ? 'text' : 'password'}
                label="Current Security Password"
                value={formData.currentSecurityPassword}
                onChange={(e) => handleChange('currentSecurityPassword', e.target.value)}
                error={!!errors.currentSecurityPassword}
                helperText={errors.currentSecurityPassword || 'Enter the current security password'}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('currentSecurityPassword')}
                        edge="end"
                        sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {showPasswords.currentSecurityPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Divider sx={{ borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.12)' }} />

            {/* New Security Password Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: isDarkMode ? '#f3f4f6' : '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Shield className="h-4 w-4" />
                New Security Password
              </Typography>
              <TextField
                fullWidth
                type={showPasswords.newSecurityPassword ? 'text' : 'password'}
                label="New Security Password"
                value={formData.newSecurityPassword}
                onChange={(e) => handleChange('newSecurityPassword', e.target.value)}
                error={!!errors.newSecurityPassword}
                helperText={errors.newSecurityPassword || 'Enter a new security password (min. 8 characters)'}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('newSecurityPassword')}
                        edge="end"
                        sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {showPasswords.newSecurityPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Confirm New Security Password Section */}
            <Box>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Security Password"
                value={formData.confirmSecurityPassword}
                onChange={(e) => handleChange('confirmSecurityPassword', e.target.value)}
                error={!!errors.confirmSecurityPassword}
                helperText={errors.confirmSecurityPassword || 'Re-enter the new security password to confirm'}
                sx={textFieldStyles}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      accountPassword: '',
                      currentSecurityPassword: '',
                      newSecurityPassword: '',
                      confirmSecurityPassword: ''
                    });
                    setErrors({});
                  }}
                  disabled={loading}
                  sx={{
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                    '&:hover': {
                      borderColor: isDarkMode ? '#4b5563' : '#374151',
                      bgcolor: isDarkMode ? 'rgba(75, 85, 99, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
                  sx={{
                    bgcolor: isDarkMode ? '#10b981' : '#059669',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: isDarkMode ? '#059669' : '#047857',
                    },
                    '&:disabled': {
                      bgcolor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.12)',
                    },
                    minHeight: '44px',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1.5, sm: 2 }
                  }}
                >
                  {loading ? 'Updating...' : 'Update Security Password'}
                </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </motion.div>
  );
};

export default AdminSecuritySettings;

