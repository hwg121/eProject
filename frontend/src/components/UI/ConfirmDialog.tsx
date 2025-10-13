import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  AlertTriangle as Warning,
  CheckCircle2 as CheckCircle,
  Info,
  XCircle as ErrorIcon,
  X
} from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  type?: 'warning' | 'success' | 'info' | 'error';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDarkMode = false
}) => {
  // Validate required props
  if (!title || !message) {
    console.error('ConfirmDialog: title and message are required');
    return null;
  }

  // Validate callback props
  if (typeof onConfirm !== 'function' || typeof onCancel !== 'function') {
    console.error('ConfirmDialog: onConfirm and onCancel must be functions');
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <Warning className="h-12 w-12 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'info':
        return <Info className="h-12 w-12 text-blue-500" />;
      case 'error':
        return <ErrorIcon className="h-12 w-12 text-red-500" />;
      default:
        return <Warning className="h-12 w-12 text-yellow-500" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'warning':
        return '#eab308'; // yellow-500
      case 'success':
        return '#10b981'; // green-500
      case 'info':
        return '#3b82f6'; // blue-500
      case 'error':
        return '#ef4444'; // red-500
      default:
        return '#eab308';
    }
  };

  // Safe handlers to prevent undefined errors
  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      console.error('ConfirmDialog: Error in onConfirm callback:', error);
    }
  };

  const handleCancel = () => {
    try {
      onCancel();
    } catch (error) {
      console.error('ConfirmDialog: Error in onCancel callback:', error);
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
          {title || 'Confirmation'}
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
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: isDarkMode 
                ? `${getColor()}20` 
                : `${getColor()}10`,
              flexShrink: 0
            }}
          >
            {getIcon()}
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
              {message || 'Are you sure you want to proceed?'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
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
          {cancelText || 'Cancel'}
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
            bgcolor: getColor(),
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: getColor(),
              opacity: 0.9,
              boxShadow: `0 4px 12px ${getColor()}40`
            }
          }}
        >
          {confirmText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

