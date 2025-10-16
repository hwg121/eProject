import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Clock,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { contactSettingService, ContactSetting, ContactSettingFormData } from '../../services/contactSettingService';
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
  Alert as MuiAlert,
  Paper,
  Divider,
  Grid
} from '@mui/material';
import { validateEmail, validatePhone, validateText, validateURL, hasErrors } from '../../utils/validation';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const AdminContactSettings: React.FC = () => {
  const [contactSettings, setContactSettings] = useState<ContactSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ContactSettingFormData>({
    email: '',
    phone: '',
    address: '',
    website: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    working_hours: '',
    is_active: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
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
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#10b981'
        }
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#10b981'
    }
  };

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactSettingService.getAll();
      setContactSettings(data);
    } catch (err: any) {
      console.error('Error loading contact settings:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to load contact settings. Please try again.';
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    newErrors.email = validateEmail(formData.email || '');
    newErrors.phone = validatePhone(formData.phone || '');
    newErrors.address = validateText(formData.address, 10, 200, 'Address', true);
    newErrors.working_hours = validateText(formData.working_hours, 5, 100, 'Working Hours', false);
    if (formData.website) newErrors.website = validateURL(formData.website, false);
    if (formData.facebook) newErrors.facebook = validateURL(formData.facebook, false);
    if (formData.instagram) newErrors.instagram = validateURL(formData.instagram, false);
    if (formData.youtube) newErrors.youtube = validateURL(formData.youtube, false);
    if (formData.linkedin) newErrors.linkedin = validateURL(formData.linkedin, false);
    
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      setSubmitting(false);
      return;
    }
    
    setErrors({});

    try {
      if (editingId) {
        await contactSettingService.update(editingId, formData);
        showToast('Contact settings updated successfully!', 'success');
      } else {
        await contactSettingService.create(formData);
        showToast('Contact settings created successfully!', 'success');
      }
      
      await loadContactSettings();
      
      // Close form after success
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err: any) {
      console.error('Submit error:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save contact settings. Please try again.';
      
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
      setSubmitting(false);
    }
  };

  const handleEdit = (contactSetting: ContactSetting) => {
    setFormData({
      email: contactSetting.email || '',
      phone: contactSetting.phone || '',
      address: contactSetting.address || '',
      website: contactSetting.website || '',
      facebook: contactSetting.facebook || '',
      instagram: contactSetting.instagram || '',
      youtube: contactSetting.youtube || '',
      linkedin: contactSetting.linkedin || '',
      working_hours: contactSetting.working_hours || '',
      is_active: contactSetting.is_active
    });
    setEditingId(contactSetting.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Contact Setting',
      message: 'Are you sure you want to delete this contact setting? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setError(null);
          setSuccessMessage(null);
          await contactSettingService.delete(id);
          setSuccessMessage('Contact settings deleted successfully!');
          await loadContactSettings();
          
          // Auto-dismiss success message
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        } catch (err: any) {
          console.error('Delete error:', err);
          
          // Extract proper error message from backend
          let errorMessage = 'Failed to delete contact settings. Please try again.';
          
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

  const handleSetActive = async (id: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await contactSettingService.setActive(id);
      setSuccessMessage('Contact setting set as active!');
      await loadContactSettings();
      
      // Auto-dismiss success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Set active error:', err);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to set contact setting as active. Please try again.';
      
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
  };

  const resetForm = () => {
    setFormData({
      email: '',
      phone: '',
      address: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      working_hours: '',
      is_active: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setFormData({
      email: '',
      phone: '',
      address: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      working_hours: '',
      is_active: false
    });
    setEditingId(null);
    setShowForm(true);
  };

  const filteredSettings = showActiveOnly 
    ? contactSettings.filter(setting => setting.is_active)
    : contactSettings;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contact settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Contact Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage contact information displayed on website
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 min-h-[44px] touch-manipulation ${
                  showActiveOnly
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                }`}
              >
                {showActiveOnly ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="text-xs sm:text-sm font-medium">
                  {showActiveOnly ? 'Show All' : 'Active Only'}
                </span>
              </button>
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 min-h-[44px] touch-manipulation"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-medium">Add New</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
            >
              <Check className="h-5 w-5 text-green-500" />
              <p className="text-green-700 dark:text-green-300">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${editingId ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-emerald-50 dark:bg-emerald-900/10'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                      {editingId ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {editingId ? 'Edit Contact Settings' : 'Add New Contact Settings'}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {editingId ? 'Update existing contact information' : 'Create new contact information'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      label="Email Address"
                      value={formData.email || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: null });
                      }}
                      error={!!errors.email}
                      helperText={errors.email || 'Valid email format: contact@example.com (max 254 chars)'}
                      inputProps={{ 
                        maxLength: 254,
                        pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
                      }}
                      placeholder="contact@example.com"
                      sx={textFieldStyles}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      type="tel"
                      label="Phone Number"
                      value={formData.phone || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        setErrors({ ...errors, phone: null });
                      }}
                      error={!!errors.phone}
                      helperText={errors.phone || 'Format: +1234567890 or (555) 123-4567 (10-15 digits)'}
                      inputProps={{ 
                        pattern: '[0-9\\s\\-\\(\\)\\+]{10,20}',
                        maxLength: 20
                      }}
                      placeholder="+1 (555) 123-4567"
                      sx={textFieldStyles}
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Address"
                      value={formData.address || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        setErrors({ ...errors, address: null });
                      }}
                      error={!!errors.address}
                      helperText={errors.address}
                      inputProps={{ minLength: 10, maxLength: 200 }}
                      placeholder="123 Main Street, City, State 12345"
                      sx={textFieldStyles}
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="Website"
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, website: e.target.value });
                        setErrors({ ...errors, website: null });
                      }}
                      error={!!errors.website}
                      helperText={errors.website || 'Full URL with https:// (e.g., https://example.com)'}
                      inputProps={{
                        pattern: 'https?://.+',
                        maxLength: 500
                      }}
                      placeholder="https://example.com"
                      sx={textFieldStyles}
                    />
                  </div>

                  {/* Working Hours */}
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="Working Hours"
                      value={formData.working_hours || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, working_hours: e.target.value });
                        setErrors({ ...errors, working_hours: null });
                      }}
                      error={!!errors.working_hours}
                      helperText={errors.working_hours}
                      inputProps={{ minLength: 5, maxLength: 100 }}
                      placeholder="Mon-Fri: 9AM-6PM"
                      sx={textFieldStyles}
                    />
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="Facebook"
                      value={formData.facebook || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, facebook: e.target.value });
                        setErrors({ ...errors, facebook: null });
                      }}
                      error={!!errors.facebook}
                      helperText={errors.facebook}
                      placeholder="https://facebook.com/yourpage"
                      sx={textFieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="Instagram"
                      value={formData.instagram || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, instagram: e.target.value });
                        setErrors({ ...errors, instagram: null });
                      }}
                      error={!!errors.instagram}
                      helperText={errors.instagram}
                      placeholder="https://instagram.com/yourpage"
                      sx={textFieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="YouTube"
                      value={formData.youtube || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, youtube: e.target.value });
                        setErrors({ ...errors, youtube: null });
                      }}
                      error={!!errors.youtube}
                      helperText={errors.youtube}
                      placeholder="https://youtube.com/yourchannel"
                      sx={textFieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="LinkedIn"
                      value={formData.linkedin || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, linkedin: e.target.value });
                        setErrors({ ...errors, linkedin: null });
                      }}
                      error={!!errors.linkedin}
                      helperText={errors.linkedin}
                      placeholder="https://linkedin.com/company/yourcompany"
                      sx={textFieldStyles}
                    />
                  </div>

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.is_active || false}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          sx={{
                            color: '#10b981',
                            '&.Mui-checked': { color: '#10b981' }
                          }}
                        />
                      }
                      label="Set as active contact settings (only one can be active at a time)"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-3 bg-gradient-to-r ${editingId ? 'from-blue-500 to-blue-600' : 'from-emerald-500 to-green-500'} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2`}
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{submitting ? 'Saving...' : (editingId ? 'Update Settings' : 'Create Settings')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Settings List - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredSettings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`p-3 sm:p-4 ${setting.is_active ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className={`h-4 w-4 sm:h-5 sm:w-5 ${setting.is_active ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-sm sm:text-base font-semibold ${setting.is_active ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Contact Settings #{setting.id}
                    </span>
                  </div>
                  {setting.is_active && (
                    <StatusBadge status="active" size="small" />
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {setting.email && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium break-all">{setting.email}</p>
                      </div>
                    </div>
                  )}

                  {setting.phone && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">{setting.phone}</p>
                      </div>
                    </div>
                  )}

                  {setting.address && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Address</p>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium line-clamp-2">{setting.address}</p>
                      </div>
                    </div>
                  )}

                  {setting.working_hours && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Hours</p>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium line-clamp-2">{setting.working_hours}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                    {setting.website && (
                      <a href={setting.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors min-h-[32px] touch-manipulation">
                        <Globe className="h-3 w-3" />
                        <span className="hidden sm:inline">Website</span>
                        <span className="sm:hidden">Web</span>
                      </a>
                    )}
                    {setting.facebook && (
                      <a href={setting.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors min-h-[32px] touch-manipulation">
                        <Facebook className="h-3 w-3" />
                        <span className="hidden sm:inline">Facebook</span>
                        <span className="sm:hidden">FB</span>
                      </a>
                    )}
                    {setting.instagram && (
                      <a href={setting.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-pink-600 text-white rounded-md text-xs hover:bg-pink-700 transition-colors min-h-[32px] touch-manipulation">
                        <Instagram className="h-3 w-3" />
                        <span className="hidden sm:inline">Instagram</span>
                        <span className="sm:hidden">IG</span>
                      </a>
                    )}
                    {setting.youtube && (
                      <a href={setting.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors min-h-[32px] touch-manipulation">
                        <Youtube className="h-3 w-3" />
                        <span className="hidden sm:inline">YouTube</span>
                        <span className="sm:hidden">YT</span>
                      </a>
                    )}
                    {setting.linkedin && (
                      <a href={setting.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-blue-700 text-white rounded-md text-xs hover:bg-blue-800 transition-colors min-h-[32px] touch-manipulation">
                        <Linkedin className="h-3 w-3" />
                        <span className="hidden sm:inline">LinkedIn</span>
                        <span className="sm:hidden">LI</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(setting.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {!setting.is_active && (
                      <button
                        onClick={() => handleSetActive(setting.id)}
                        className="p-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors min-h-[32px] min-w-[32px] touch-manipulation"
                        title="Set as Active"
                      >
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(setting)}
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors min-h-[32px] min-w-[32px] touch-manipulation"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(setting.id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors min-h-[32px] min-w-[32px] touch-manipulation"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSettings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {showActiveOnly ? 'No Active Contact Settings' : 'No Contact Settings'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {showActiveOnly 
                ? 'There are no active contact settings. Create one and set it as active.'
                : 'Get started by creating your first contact settings.'
              }
            </p>
            {!showActiveOnly && (
              <button
                onClick={handleAddNew}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create Contact Settings</span>
              </button>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Toast Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="warning"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        isDarkMode={false}
      />
    </div>
  );
};

export default AdminContactSettings;
