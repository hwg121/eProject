import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { heroSectionService } from '../../services/api';
import { validateText, hasErrors } from '../../utils/validation';

interface HeroSection {
  id?: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

const AdminHeroSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HeroSection>({
    title: '',
    description: '',
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
    loadHeroSections();
  }, []);

  const loadHeroSections = async () => {
    try {
      setLoading(true);

      const response = await heroSectionService.getAll() as HeroSection[];

      // Updated to handle direct array response (no wrapper)
      if (Array.isArray(response)) {
        setHeroSections(response);
      } else {
        console.error('Invalid response format:', response);
        setHeroSections([]);
      }
    } catch (err: any) {
      console.error('Error loading hero sections:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to load hero sections. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
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
      title: '',
      description: '',
      is_active: true
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: HeroSection) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Hero Section',
      message: 'Are you sure you want to delete this hero section? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await heroSectionService.delete(id);
          loadHeroSections();
          showToast('Hero section deleted successfully!', 'success');
        } catch (err: any) {
          console.error('Error deleting hero section:', err);
          
          // Extract proper error message from backend
          let errorMessage = 'Failed to delete hero section. Please try again.';
          
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    newErrors.title = validateText(formData.title, 3, 100, 'Title', true);
    newErrors.description = validateText(formData.description, 10, 500, 'Description', true);
    
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
        await heroSectionService.update(editingId, dataToSave);
        showToast('Hero section updated successfully!', 'success');
      } else {
        await heroSectionService.create(dataToSave);
        showToast('Hero section created successfully!', 'success');
      }
      setShowForm(false);
      loadHeroSections();
    } catch (err: any) {
      console.error('Error saving hero section:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save hero section. Please try again.';
      
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
        <p className="text-emerald-600">Loading hero sections...</p>
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
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-800">Hero Sections</h2>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 min-h-[44px] touch-manipulation w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Create New</span>
        </button>
      </div>

      {/* Hero Sections List - Responsive */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {heroSections.map((item) => (
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
                  <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-emerald-800'} truncate`}>{item.title}</h3>
                  {item.is_active && (
                    <StatusBadge status="active" size="medium" />
                  )}
                </div>
                <p className={`mb-2 leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-emerald-600'} line-clamp-2`}>{item.description}</p>
                {item.created_at && (
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
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
          <div className={`rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} style={{
            background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
          }}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-emerald-800'}`}>
                  {isEditing ? 'Edit Hero Section' : 'Create Hero Section'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-2 min-h-[44px] min-w-[44px] touch-manipulation ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 100) {
                      setErrors({ ...errors, title: 'Title must not exceed 100 characters' });
                      return;
                    }
                    setFormData({ ...formData, title: value });
                    setErrors({ ...errors, title: null });
                  }}
                  error={!!errors.title}
                  helperText={errors.title || `${formData.title.length}/100 characters (min 3)`}
                  inputProps={{ maxLength: 100 }}
                  placeholder="Enter hero section title"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 500) {
                      setErrors({ ...errors, description: 'Description must not exceed 500 characters' });
                      return;
                    }
                    setFormData({ ...formData, description: value });
                    setErrors({ ...errors, description: null });
                  }}
                  error={!!errors.description}
                  helperText={errors.description || `${formData.description.length}/500 characters (min 10)`}
                  inputProps={{ maxLength: 500 }}
                  placeholder="Enter hero section description"
                  sx={textFieldStyles}
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
                  label={
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                      Set as active (will deactivate other hero sections)
                    </span>
                  }
                />

                {/* Form Actions - Responsive */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`px-4 sm:px-6 py-2.5 sm:py-2 transition-colors min-h-[44px] touch-manipulation ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
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

export default AdminHeroSection;