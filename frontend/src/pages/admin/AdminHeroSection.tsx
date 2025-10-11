import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Monitor, CheckCircle } from 'lucide-react';
import { Card, TextField, Checkbox, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../../components/UI/PageHeader';
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
    } catch (err) {
      setError('Failed to load hero sections');
      console.error('Error loading hero sections:', err);
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
    if (window.confirm('Are you sure you want to delete this hero section?')) {
      try {
        await heroSectionService.delete(id);
        loadHeroSections();
      } catch (err) {
        setError('Failed to delete hero section');
        console.error('Error deleting hero section:', err);
      }
    }
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
    } catch (err) {
      setError('Failed to save hero section');
      showToast('Failed to save hero section', 'error');
      console.error('Error saving hero section:', err);
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
    <div className="space-y-8">
      <PageHeader
        title="Hero Section Management"
        subtitle="Manage the hero section displayed on About Us page"
        icon={<Monitor className="h-10 w-10" />}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-800">Hero Sections</h2>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New</span>
        </button>
      </div>

      {/* Hero Sections List */}
      <div className="grid grid-cols-1 gap-6">
        {heroSections.map((item) => (
          <Card 
            key={item.id} 
            sx={{
              p: 3,
              background: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-emerald-800'}`}>{item.title}</h3>
                  {item.is_active && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Active</span>
                    </span>
                  )}
                </div>
                <p className={`mb-2 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-emerald-600'}`}>{item.description}</p>
                {item.created_at && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-emerald-400 hover:bg-emerald-900/30' 
                      : 'text-emerald-600 hover:bg-emerald-100'
                  }`}
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-red-600 hover:bg-red-100'
                  }`}
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} style={{
            background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
          }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-emerald-800'}`}>
                  {isEditing ? 'Edit Hero Section' : 'Create Hero Section'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setErrors({ ...errors, title: null });
                  }}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  inputProps={{ minLength: 3, maxLength: 100 }}
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
                    setFormData({ ...formData, description: e.target.value });
                    setErrors({ ...errors, description: null });
                  }}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                  inputProps={{ minLength: 10, maxLength: 500 }}
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

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`px-6 py-2 transition-colors ${
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
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-5 w-5" />
                    <span>{saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminHeroSection;