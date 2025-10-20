import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  FileText,
  Video,
  Package,
  Hash,
} from 'lucide-react';
import { tagService } from '../../services/api';
import Toast from '../ui/Toast';
import Card from '../ui/Card';
import ConfirmDialog from '../ui/ConfirmDialog';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articles_count?: number;
  videos_count?: number;
  products_count?: number;
  total_count?: number;
  created_at: string;
  updated_at: string;
}

interface TagManagementProps {
  isDarkMode: boolean;
}

const TagManagement: React.FC<TagManagementProps> = ({ isDarkMode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    slug: '',
  });

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      
      const response = await tagService.getAllAdmin({
        search: searchQuery,
        sortBy: 'name',
        sortOrder: 'asc',
        per_page: 100,
      });
      
      // Handle both formats: 
      // 1. Full Laravel response: {success: true, data: [...]}
      // 2. Unwrapped response: [...] (array directly)
      let tagsData = null;
      
      if (Array.isArray(response)) {
        // Case 2: Response is already unwrapped array
        tagsData = response;
      } else if (response && response.success && response.data) {
        // Case 1: Full Laravel response
        tagsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Case 3: Has data property but no success
        tagsData = response.data;
      }
      
      if (tagsData && Array.isArray(tagsData)) {
        setTags(tagsData);
      } else {
        showToast('No tags data received from server', 'warning');
      }
    } catch (error: any) {
      console.error('🔍 [TagManagement] Step ERROR:', error);
      console.error('🔍 [TagManagement] Error details:', {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data,
      });
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to load tags. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [searchQuery]);

  // Open create dialog
  const handleCreate = () => {
    setSelectedTag(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
    setFormErrors({
      name: '',
      slug: '',
    });
    setDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
    });
    setFormErrors({
      name: '',
      slug: '',
    });
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTag(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      name: '',
      slug: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Tag name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Tag name must be at least 2 characters';
      isValid = false;
    } else if (formData.name.trim().length > 255) {
      errors.name = 'Tag name must not exceed 255 characters';
      isValid = false;
    }

    if (formData.slug) {
      if (formData.slug.length > 255) {
        errors.slug = 'Slug must not exceed 255 characters';
        isValid = false;
      }
      // Validate slug format: only lowercase, numbers, hyphens
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(formData.slug)) {
        errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        isValid = false;
      }
      if (formData.slug.startsWith('-') || formData.slug.endsWith('-')) {
        errors.slug = 'Slug cannot start or end with a hyphen';
        isValid = false;
      }
      if (formData.slug.includes('--')) {
        errors.slug = 'Slug cannot contain consecutive hyphens';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      if (selectedTag) {
        // Update
        const response = await tagService.update(selectedTag.id, data);
        if (response.success) {
          showToast('Tag updated successfully', 'success');
          fetchTags();
          handleCloseDialog();
        }
      } else {
        // Create
        const response = await tagService.create(data);
        if (response.success) {
          showToast('Tag created successfully', 'success');
          fetchTags();
          handleCloseDialog();
        }
      }
    } catch (error: any) {
      console.error('Error saving tag:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save tag. Please try again.';
      
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
    }
  };

  // Handle delete
  const handleDeleteClick = (tagId: number) => {
    setDeleteTagId(tagId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTagId) return;

    try {
      const response = await tagService.delete(deleteTagId);
      if (response.success) {
        showToast('Tag deleted successfully', 'success');
        fetchTags();
      }
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to delete tag. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setConfirmDialogOpen(false);
      setDeleteTagId(null);
    }
  };

  // MUI TextField styles
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#10b981',
        },
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#10b981',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Tag Management
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage tags for articles, videos, and products
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          <span>Create Tag</span>
        </motion.button>
      </div>

      {/* Search */}
      <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-5 h-5 text-gray-400" />
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />
      </Card>

      {/* Tags List */}
      <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {loading ? (
          <div className="p-8 text-center">
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="p-8 text-center">
            <Hash className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {searchQuery ? 'No tags found' : 'No tags yet'}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'Try adjusting your search' : 'Create your first tag to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center space-x-3">
                        <Chip
                          label={tag.name}
                          size="medium"
                          sx={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#059669',
                            },
                          }}
                        />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          /{tag.slug}
                        </span>
                      </div>

                      {tag.description && (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {tag.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4">
                        {tag.articles_count !== undefined && tag.articles_count > 0 && (
                          <Tooltip title="Articles">
                            <div className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                              <FileText className="w-4 h-4" />
                              <span>{tag.articles_count}</span>
                            </div>
                          </Tooltip>
                        )}
                        {tag.videos_count !== undefined && tag.videos_count > 0 && (
                          <Tooltip title="Videos">
                            <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                              <Video className="w-4 h-4" />
                              <span>{tag.videos_count}</span>
                            </div>
                          </Tooltip>
                        )}
                        {tag.products_count !== undefined && tag.products_count > 0 && (
                          <Tooltip title="Products">
                            <div className="flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400">
                              <Package className="w-4 h-4" />
                              <span>{tag.products_count}</span>
                            </div>
                          </Tooltip>
                        )}
                        {tag.total_count !== undefined && tag.total_count === 0 && (
                          <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            No content yet
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(tag)}
                          sx={{ color: '#10b981' }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(tag.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between">
          <span className="font-bold text-xl">
            {selectedTag ? 'Edit Tag' : 'Create Tag'}
          </span>
          <IconButton onClick={handleCloseDialog} size="small">
            <X className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Tag Name *"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 255) return;
              setFormData({ ...formData, name: value });
            }}
            error={!!formErrors.name}
            helperText={formErrors.name || `${formData.name.length}/255 characters (min 2)`}
            inputProps={{ maxLength: 255 }}
            placeholder="e.g., Organic Farming"
            sx={textFieldStyles}
          />
          <TextField
            fullWidth
            label="Slug (URL-friendly)"
            value={formData.slug}
            onChange={(e) => {
              const value = e.target.value;
              // Auto-convert to lowercase and remove invalid chars
              const slugValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
              if (slugValue.length > 255) return;
              setFormData({ ...formData, slug: slugValue });
            }}
            error={!!formErrors.slug}
            helperText={formErrors.slug || `${formData.slug.length}/255 characters - Only lowercase, numbers, hyphens. Leave empty to auto-generate`}
            inputProps={{ 
              maxLength: 255,
              pattern: '[a-z0-9\\-]*'
            }}
            placeholder="e.g., organic-farming"
            sx={textFieldStyles}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 1000) return;
              setFormData({ ...formData, description: value });
            }}
            placeholder="Brief description of this tag..."
            helperText={`${formData.description.length}/1000 characters (optional)`}
            inputProps={{ maxLength: 1000 }}
            sx={textFieldStyles}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseDialog} sx={{ color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#10b981',
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            {selectedTag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Tag"
        message="Are you sure you want to delete this tag? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setDeleteTagId(null);
        }}
      />

      {/* Toast */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export default TagManagement;

