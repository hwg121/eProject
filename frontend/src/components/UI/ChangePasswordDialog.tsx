import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Lock,
  Eye,
  EyeOff,
  X,
  AlertTriangle
} from 'lucide-react';
import { validatePassword } from '../../utils/validation';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  isDarkMode?: boolean;
  isLoading?: boolean;
  isRequired?: boolean; // If true, user cannot close dialog
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isDarkMode = false,
  isLoading = false,
  isRequired = false
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // Validate new password using utility function
    const passwordError = validatePassword(formData.newPassword, true, 8, 128);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword && formData.currentPassword.trim() !== '') {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClose = () => {
    // If password change is required, don't allow closing
    if (isRequired) {
      return;
    }
    
    if (!isLoading) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });
      onClose();
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : '#fff',
      '& fieldset': {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : '#c4c4c4',
      },
      '&:hover fieldset': {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : '#10b981',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#10b981',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
      '&.Mui-focused': {
        color: '#10b981',
      },
    },
    '& .MuiFormHelperText-root': {
      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666',
    },
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading || isRequired}
      PaperProps={{
        sx: {
          bgcolor: isDarkMode ? '#1f2937' : '#ffffff',
          backgroundImage: 'none',
          borderRadius: 2,
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 3,
          px: 3,
          color: isDarkMode ? '#fff' : '#1f2937'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: isDarkMode 
                ? '#f59e0b20' 
                : '#f59e0b10',
              flexShrink: 0
            }}
          >
            <AlertTriangle style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Change Password Required
          </Typography>
        </Box>
        {!isRequired && (
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label="close"
            disabled={isLoading}
            sx={{
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              '&:hover': {
                bgcolor: isDarkMode ? '#374151' : '#f3f4f6'
              }
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? '#e5e7eb' : '#4b5563',
            lineHeight: 1.6,
            mb: 3
          }}
        >
          {isRequired 
            ? 'For security reasons, you must change your password before accessing the admin dashboard. This action is required and cannot be skipped.'
            : 'For security reasons, you must change your password before accessing the admin dashboard.'
          }
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Current Password */}
          <TextField
            fullWidth
            label="Current Password"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            placeholder="Enter your current password"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
                    sx={{
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      '&:hover': {
                        color: '#10b981'
                      }
                    }}
                  >
                    {showPasswords.current ? (
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

          {/* New Password */}
          <TextField
            fullWidth
            label="New Password"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            placeholder="Enter your new password"
            error={!!errors.newPassword}
            helperText={errors.newPassword || 'Password: 8+ chars, uppercase, lowercase, number, special char (!@#$%...)'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                    sx={{
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      '&:hover': {
                        color: '#10b981'
                      }
                    }}
                  >
                    {showPasswords.new ? (
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

          {/* Confirm New Password */}
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your new password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                    sx={{
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      '&:hover': {
                        color: '#10b981'
                      }
                    }}
                  >
                    {showPasswords.confirm ? (
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
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        {!isRequired && (
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1.5,
              borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
              color: isDarkMode ? '#e5e7eb' : '#6b7280',
              '&:hover': {
                borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                bgcolor: isDarkMode ? '#374151' : '#f9fafb'
              }
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 1.5,
            bgcolor: '#10b981',
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#059669',
              opacity: 0.9,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            },
            '&:disabled': {
              bgcolor: '#6b7280',
              color: '#fff'
            }
          }}
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
