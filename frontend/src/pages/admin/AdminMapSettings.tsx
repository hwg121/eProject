import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Map, MapPin, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../../components/UI/PageHeader';
import Toast from '../../components/UI/Toast';
import StatusBadge from '../../components/UI/StatusBadge';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { mapSettingService } from '../../services/api.ts';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { validateText, hasErrors } from '../../utils/validation';

interface MapSetting {
  id?: string;
  embed_url: string;
  location_name?: string;
  address?: string;
  is_active: boolean;
}

const AdminMapSettings: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const [mapSettings, setMapSettings] = useState<MapSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState<MapSetting>({
    embed_url: '',
    location_name: '',
    address: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState<{[key: string]: string | null}>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: isDarkMode ? '#fff' : '#000',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)'
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#10b981'
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? '#94a3b8' : '#64748b',
      '&.Mui-focused': {
        color: '#10b981'
      }
    }
  };

  useEffect(() => {
    loadMapSettings();
  }, []);

  const loadMapSettings = async () => {
    try {
      setLoading(true);

      const response: any = await mapSettingService.getAll();

      // Updated to handle direct array response (no wrapper)
      if (Array.isArray(response)) {
        setMapSettings(response);
      } else {
        console.error('Invalid response format:', response);
        setMapSettings([]);
      }
    } catch (err: any) {
      console.error('Error loading map settings:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to load map settings. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      embed_url: '',
      location_name: '',
      address: '',
      is_active: true
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: MapSetting) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Map Setting',
      message: 'Are you sure you want to delete this map setting? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await mapSettingService.delete(id);
          loadMapSettings();
          showToast('Map setting deleted successfully!', 'success');
        } catch (err: any) {
          console.error('Error deleting map setting:', err);
          
          // Extract proper error message from backend
          let errorMessage = 'Failed to delete map setting. Please try again.';
          
          if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err?.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handlePreview = (embedUrl: string) => {
    setPreviewUrl(embedUrl);
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    newErrors.embed_url = validateText(formData.embed_url, 10, 5000, 'Embed Code', true);
    newErrors.location_name = validateText(formData.location_name, 3, 100, 'Location Name', false);
    newErrors.address = validateText(formData.address, 5, 200, 'Address', false);
    
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }
    
    setErrors({});
    
    try {
      setSaving(true);
      const dataToSave = isEditing ? formData : { ...formData, is_active: true };
      
      if (isEditing && editingId) {
        await mapSettingService.update(editingId, dataToSave);
        showToast('Map setting updated successfully!', 'success');
      } else {
        await mapSettingService.create(dataToSave);
        showToast('Map setting created successfully!', 'success');
      }
      setShowForm(false);
      loadMapSettings();
    } catch (err: any) {
      console.error('Error saving map setting:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save map setting. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading map settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Action Buttons - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-800">Map Settings</h2>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 min-h-[44px] touch-manipulation w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Add Map</span>
        </button>
      </div>

      {/* Map Settings List - Responsive */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {mapSettings.map((item) => (
          <Card 
            key={item.id} 
            sx={{
              p: { xs: 2, sm: 3 },
              background: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-emerald-800'} truncate`}>
                      {item.location_name || 'Map Setting'}
                    </h3>
                  </div>
                  {item.is_active && (
                    <StatusBadge status="active" size="medium" />
                  )}
                </div>
                {item.address && (
                  <p className={`mb-3 text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-emerald-600'} line-clamp-2`}>{item.address}</p>
                )}
                <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-xs sm:text-sm font-mono break-all ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.embed_url.substring(0, 100)}...
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => handlePreview(item.embed_url)}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
                    isDarkMode 
                      ? 'text-blue-400 hover:bg-blue-900/30' 
                      : 'text-blue-600 hover:bg-blue-100'
                  }`}
                  title="Preview"
                >
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
                    isDarkMode 
                      ? 'text-emerald-400 hover:bg-emerald-900/30' 
                      : 'text-emerald-600 hover:bg-emerald-100'
                  }`}
                  title="Edit"
                >
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
                    isDarkMode 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-red-600 hover:bg-red-100'
                  }`}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal - Responsive */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className={`rounded-lg max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}
            style={{
              background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-emerald-800'}`}>
                  {isEditing ? 'Edit Map Setting' : 'Add Map Setting'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-2 min-h-[44px] min-w-[44px] touch-manipulation ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                  fullWidth
                  size="small"
                  label="Location Name"
                  value={formData.location_name || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 100) {
                      setErrors({ ...errors, location_name: 'Location name must not exceed 100 characters' });
                      return;
                    }
                    setFormData({ ...formData, location_name: value });
                    setErrors({ ...errors, location_name: null });
                  }}
                  error={!!errors.location_name}
                  helperText={errors.location_name || `${(formData.location_name || '').length}/100 characters (min 3)`}
                  inputProps={{ maxLength: 100 }}
                  placeholder="e.g., Green Groves Office"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  value={formData.address || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 200) {
                      setErrors({ ...errors, address: 'Address must not exceed 200 characters' });
                      return;
                    }
                    setFormData({ ...formData, address: value });
                    setErrors({ ...errors, address: null });
                  }}
                  error={!!errors.address}
                  helperText={errors.address || `${(formData.address || '').length}/200 characters (min 5)`}
                  inputProps={{ maxLength: 200 }}
                  placeholder="Full address"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Google Maps Embed Code"
                  value={formData.embed_url}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 5000) {
                      setErrors({ ...errors, embed_url: 'Embed code must not exceed 5000 characters' });
                      return;
                    }
                    setFormData({ ...formData, embed_url: value });
                    setErrors({ ...errors, embed_url: null });
                  }}
                  error={!!errors.embed_url}
                  helperText={errors.embed_url || `${formData.embed_url.length}/5000 characters - Copy iframe code from Google Maps`}
                  inputProps={{ maxLength: 5000 }}
                  placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
                  sx={{
                    ...textFieldStyles,
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      sx={{
                        color: '#10b981',
                        '&.Mui-checked': { color: '#10b981' }
                      }}
                    />
                  }
                  label="Set as active (will deactivate other maps)"
                />

                {/* Form Actions - Responsive */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 sm:px-6 py-2.5 sm:py-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                  >
                    <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">{saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal - Responsive */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-800">Map Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 min-h-[44px] min-w-[44px] touch-manipulation text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <div 
                className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: previewUrl }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="warning"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default AdminMapSettings;

