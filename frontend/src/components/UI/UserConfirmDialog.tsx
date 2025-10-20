import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import {
  User,
  Mail,
  Lock,
  Shield,
  X,
  Copy,
  CheckCircle2
} from 'lucide-react';
import RoleBadge from './RoleBadge';

interface UserConfirmDialogProps {
  open: boolean;
  userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  onCopy: () => void;
  isDarkMode?: boolean;
}

const UserConfirmDialog: React.FC<UserConfirmDialogProps> = ({
  open,
  userData,
  onConfirm,
  onCancel,
  onCopy,
  isDarkMode = false
}) => {
  // Validate required props
  if (!userData || !userData.name || !userData.email || !userData.password || !userData.role) {
    console.error('UserConfirmDialog: userData is required with all fields');
    return null;
  }

  // Validate callback props
  if (typeof onConfirm !== 'function' || typeof onCancel !== 'function' || typeof onCopy !== 'function') {
    console.error('UserConfirmDialog: onConfirm, onCancel, and onCopy must be functions');
    return null;
  }

  // Safe handlers to prevent undefined errors
  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      console.error('UserConfirmDialog: Error in onConfirm callback:', error);
    }
  };

  const handleCancel = () => {
    try {
      onCancel();
    } catch (error) {
      console.error('UserConfirmDialog: Error in onCancel callback:', error);
    }
  };

  const handleCopy = () => {
    try {
      onCopy();
    } catch (error) {
      console.error('UserConfirmDialog: Error in onCopy callback:', error);
    }
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
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
        <Typography variant="h6" fontWeight={700}>
          Confirm User Creation
        </Typography>
        <IconButton
          onClick={handleCancel}
          size="small"
          aria-label="close"
          sx={{
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            '&:hover': {
              bgcolor: isDarkMode ? '#374151' : '#f3f4f6'
            }
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: isDarkMode 
                ? '#3b82f620' 
                : '#3b82f610',
              flexShrink: 0
            }}
          >
            <CheckCircle2 
              style={{ 
                width: '48px', 
                height: '48px', 
                color: '#3b82f6' 
              }} 
            />
          </Box>
          <Box sx={{ flex: 1, pt: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: isDarkMode ? '#e5e7eb' : '#4b5563',
                lineHeight: 1.6,
                wordBreak: 'break-word'
              }}
            >
              Are you sure you want to create this user? Please review the information below:
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: isDarkMode ? '#374151' : '#e5e7eb' }} />

        {/* User Information Display */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <User style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
            <Box>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontWeight: 500 }}>
                Name
              </Typography>
              <Typography variant="body1" sx={{ color: isDarkMode ? '#fff' : '#1f2937', fontWeight: 600 }}>
                {userData.name}
              </Typography>
            </Box>
          </Box>

          {/* Email */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Mail style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
            <Box>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontWeight: 500 }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ color: isDarkMode ? '#fff' : '#1f2937', fontWeight: 600 }}>
                {userData.email}
              </Typography>
            </Box>
          </Box>

          {/* Password */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Lock style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
            <Box>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontWeight: 500 }}>
                Password
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: isDarkMode ? '#fff' : '#1f2937', 
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}
              >
                {userData.password}
              </Typography>
            </Box>
          </Box>

          {/* Role */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Shield style={{ width: '20px', height: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
            <Box>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontWeight: 500 }}>
                Role
              </Typography>
              <RoleBadge role={userData.role as 'admin' | 'moderator'} size="small" />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={handleCopy}
          variant="outlined"
          startIcon={<Copy style={{ width: '16px', height: '16px' }} />}
          aria-label="copy"
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
          Copy Information
        </Button>
        <Button
          onClick={handleCancel}
          variant="outlined"
          aria-label="cancel"
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
        <Button
          onClick={handleConfirm}
          variant="contained"
          aria-label="confirm"
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
            }
          }}
        >
          Sure!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserConfirmDialog;
