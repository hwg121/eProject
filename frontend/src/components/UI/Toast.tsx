import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

interface ToastProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoHideDuration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 4000,
  position = { vertical: 'bottom', horizontal: 'center' }
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ 
          width: '100%',
          bgcolor: isDarkMode ? '#05150f' : '#eafaf4',
          color: isDarkMode ? '#6ee7b7' : '#047857',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0',
          '& .MuiAlert-icon': {
            color: isDarkMode ? '#6ee7b7' : '#10b981'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
