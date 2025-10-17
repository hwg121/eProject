import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  FormControlLabel,
} from '@mui/material';
import { Wrench, AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../../components/ui/PageHeader';
import Toast from '../../components/ui/Toast';
import { maintenanceService } from '../../services/api';

interface MaintenanceSettings {
  is_enabled: boolean;
  message: string;
  started_at?: string;
  estimated_end_at?: string;
  enabled_by?: {
    id: number;
    name: string;
    email: string;
  };
}

const AdminMaintenanceSettings: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<MaintenanceSettings>({
    is_enabled: false,
    message: 'We are currently performing scheduled maintenance. We will be back shortly.',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  
  // Security dialog
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<MaintenanceSettings> | null>(null);
  const [securityPassword, setSecurityPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [securityError, setSecurityError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response: any = await maintenanceService.getSettings();
      
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error: any) {
      console.error('Error loading maintenance settings:', error);
      setToast({
        show: true,
        message: error.message || 'Failed to load maintenance settings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = (checked: boolean) => {
    // Prepare changes but don't apply yet
    setPendingChanges({
      ...settings,
      is_enabled: checked,
    });
    setShowSecurityDialog(true);
  };

  const handleMessageChange = (value: string) => {
    setSettings(prev => ({ ...prev, message: value }));
  };

  const handleEstimatedEndChange = (value: string) => {
    setSettings(prev => ({ ...prev, estimated_end_at: value }));
  };

  const handleSaveWithSecurity = () => {
    if (!pendingChanges) return;
    
    // Open security dialog
    setPendingChanges(pendingChanges);
    setShowSecurityDialog(true);
  };

  const handleSecurityConfirm = async () => {
    if (!securityPassword.trim()) {
      setSecurityError('Security password is required');
      return;
    }

    if (!pendingChanges) return;

    try {
      setSaving(true);
      setSecurityError('');

      const response: any = await maintenanceService.update({
        ...pendingChanges,
        security_password: securityPassword,
      });

      if (response.success) {
        setSettings(response.data);
        setToast({
          show: true,
          message: response.message || 'Maintenance settings updated successfully',
          type: 'success'
        });
        setShowSecurityDialog(false);
        setSecurityPassword('');
        setPendingChanges(null);
        // Reload settings to ensure sync
        await loadSettings();
      } else {
        // Handle validation errors (422)
        if (response.errors && response.errors.security_password) {
          setSecurityError(response.errors.security_password[0]);
        } else {
          setSecurityError(response.message || 'Failed to update settings');
        }
      }
    } catch (error: any) {
      console.error('Error updating maintenance settings:', error);
      // Handle error message
      let errorMsg = 'Failed to update maintenance settings';
      if (error.message && error.message.includes('security password')) {
        errorMsg = 'Invalid security password. Please try again.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      setSecurityError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleSecurityCancel = () => {
    setShowSecurityDialog(false);
    setSecurityPassword('');
    setSecurityError('');
    setPendingChanges(null);
    // Revert toggle if it was changed
    if (pendingChanges && pendingChanges.is_enabled !== settings.is_enabled) {
      // Reload settings to reset toggle
      loadSettings();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <PageHeader
        title="Maintenance Mode"
        description="Manage site maintenance status and display message to visitors"
        Icon={Wrench}
      />

      <Card
        sx={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderRadius: 2,
          boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Warning Alert */}
          <Alert 
            severity="warning" 
            icon={<AlertTriangle size={20} />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              <strong>Warning:</strong> When maintenance mode is enabled, all public pages will show the maintenance message. 
              Only administrators can access the site.
            </Typography>
          </Alert>

          {/* Current Status */}
          {settings.is_enabled && settings.enabled_by && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Enabled by:</strong> {settings.enabled_by.name} ({settings.enabled_by.email})
                <br />
                <strong>Started at:</strong> {settings.started_at ? new Date(settings.started_at).toLocaleString() : 'N/A'}
              </Typography>
            </Alert>
          )}

          {/* Enable/Disable Toggle */}
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.is_enabled}
                  onChange={(e) => handleToggleChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10b981',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10b981',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                    Enable Maintenance Mode
                  </Typography>
                  {settings.is_enabled && (
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      ACTIVE
                    </Box>
                  )}
                </Box>
              }
            />
            <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', mt: 1, ml: 4 }}>
              When enabled, visitors will see the maintenance message below
            </Typography>
          </Box>

          {/* Maintenance Message */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
              Maintenance Message
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={settings.message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Enter the message to display to visitors during maintenance"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#475569' : '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#10b981',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                },
              }}
            />
          </Box>

          {/* Estimated End Time */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
              Estimated End Time (Optional)
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={settings.estimated_end_at ? new Date(settings.estimated_end_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleEstimatedEndChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#475569' : '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#10b981',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                },
              }}
            />
            <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', mt: 1 }}>
              When maintenance is expected to be completed
            </Typography>
          </Box>

          {/* Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSaveWithSecurity}
              disabled={saving}
              sx={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#059669',
                },
                '&:disabled': {
                  backgroundColor: '#94a3b8',
                },
              }}
            >
              {saving ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Save Settings'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Security Password Dialog */}
      <Dialog
        open={showSecurityDialog}
        onClose={handleSecurityCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        }}>
          <Shield size={24} style={{ color: '#f59e0b' }} />
          Security Verification Required
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              This action requires security password verification. Please enter your admin security password to continue.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Security Password"
            value={securityPassword}
            onChange={(e) => {
              setSecurityPassword(e.target.value);
              setSecurityError('');
            }}
            error={!!securityError}
            helperText={securityError}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                color: isDarkMode ? '#f1f5f9' : '#1e293b',
                '& fieldset': {
                  borderColor: isDarkMode ? '#475569' : '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#10b981',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10b981',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
          <Button
            onClick={handleSecurityCancel}
            disabled={saving}
            sx={{
              color: isDarkMode ? '#94a3b8' : '#64748b',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSecurityConfirm}
            variant="contained"
            disabled={saving || !securityPassword.trim()}
            sx={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#059669',
              },
              '&:disabled': {
                backgroundColor: '#94a3b8',
              },
            }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Toast
        open={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </Box>
  );
};

export default AdminMaintenanceSettings;

