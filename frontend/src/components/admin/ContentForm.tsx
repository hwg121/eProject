import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField, MenuItem, Snackbar, Alert, Checkbox, FormControlLabel, Typography } from '@mui/material';
import ImageUpload from '../ImageUpload';
import RichTextEditor from './RichTextEditor';
import { ContentFormProps } from '../../types/admin';
import { validateText, validateURL, validateNumber, hasErrors } from '../../utils/validation';

interface FormData {
  title: string;
  author?: string;
  instructor?: string;
  category: string;
  status: 'published' | 'archived';
  description?: string;
  excerpt?: string;
  tags?: string | string[];
  featured_image?: string;
  buyLink?: string;
  borrowLink?: string;
  link?: string;
  video_url?: string;
  duration?: string;
  isbn?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  price?: number;
  featured?: boolean;
  is_featured?: boolean;
  type?: string;
  content?: string;
  body?: string;
  slug?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({ type, item, categories, onSave, onCancel, isDarkMode }) => {
  // Helper function to check if type is video
  const isVideoType = (type: string) => type === 'videos' || type === 'video' || type === 'Video';
  
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
  
  const [formData, setFormData] = useState<FormData>(
    item || {
      title: '',
      author: '',
      instructor: '',
      category: type === 'Technique' || type === 'techniques' || type === 'article' ? 'Technique' : type === 'Video' || type === 'videos' || type === 'video' ? 'Video' : (categories && categories.length > 0 ? categories[0] : ''),
      status: 'published',
      description: '',
      tags: '',
      featured_image: '',
      buyLink: '',
      borrowLink: '',
      link: '',
      duration: '',
      isbn: '',
      difficulty: 'beginner',
      rating: 5,
      price: 0,
      featured: false,
      type: 'general'
    }
  );

  // Update formData when item changes (for editing)
  useEffect(() => {
    if (item) {

      // Ensure content is properly loaded from either body or content field
      const processedItem = {
        ...item,
        content: item.body || item.content || item.description || '',
        // Ensure featured image is properly loaded
        featured_image: item.featured_image || '',
        // For videos, prioritize videoUrl, fallback to link
        video_url: isVideoType(type) ? (item.videoUrl || item.link || '') : '',
        // For products, use link
        link: (type === 'books' || type === 'suggestions') ? (item.link || '') : ''
      };
      
      setFormData(processedItem);
    }
  }, [item, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    
    newErrors.title = validateText(formData.title, 3, 200, 'Title', true);
    
    if (!isVideoType(type) && type !== 'suggestions') {
      newErrors.author = validateText(formData.author, 2, 100, 'Author', true);
    }
    if (isVideoType(type)) {
      newErrors.instructor = validateText(formData.instructor, 2, 100, 'Instructor', true);
    }
    
    newErrors.description = validateText(formData.description, 10, 5000, 'Description', false);
    newErrors.excerpt = validateText(formData.excerpt, 10, 500, 'Excerpt', false);
    
    if (formData.video_url) {
      newErrors.video_url = validateURL(formData.video_url, false);
    }
    if (formData.featured_image) {
      newErrors.featured_image = validateURL(formData.featured_image, false);
    }
    if (formData.link) {
      newErrors.link = validateURL(formData.link, false);
    }
    if (formData.buyLink) {
      newErrors.buyLink = validateURL(formData.buyLink, false);
    }
    if (formData.borrowLink) {
      newErrors.borrowLink = validateURL(formData.borrowLink, false);
    }
    
    newErrors.rating = validateNumber(formData.rating, 0, 5, 'Rating', false);
    newErrors.price = validateNumber(formData.price, 0, 999999, 'Price', false);
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.status) newErrors.status = 'Status is required';
    
    // Check if there are any errors
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }
    
    // Clear errors
    setErrors({});
    
    try {
      const processedData = {
        ...formData,
        // Ensure required fields have values
        title: formData.title || '',
        status: formData.status || 'published',
        // Ensure content is saved properly to both content and body fields
        content: formData.content || '',
        body: formData.content || formData.body || '',
        excerpt: formData.excerpt || formData.description || '',
        // Ensure featured image is saved to the correct field
        featured_image: formData.featured_image || '',
        // Video URL for videos, link for products
        video_url: isVideoType(type) ? (formData.video_url || '') : '',
        link: (type === 'books' || type === 'suggestions') ? (formData.link || '') : (isVideoType(type) ? (formData.video_url || '') : ''),
        // Tags should be string for backend (comma-separated)
        tags: formData.tags 
          ? Array.isArray(formData.tags) 
            ? formData.tags.join(', ')
            : typeof formData.tags === 'string' 
              ? formData.tags
              : ''
          : '',
        rating: parseFloat(formData.rating?.toString() || '0') || 0,
        price: parseFloat(formData.price?.toString() || '0') || 0,
        duration: formData.duration || '',
        // Ensure boolean fields are properly cast
        is_featured: Boolean(formData.featured || formData.is_featured)
      };
      
      onSave(processedData);
      showToast(`${item ? 'Updated' : 'Created'} successfully!`, 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast('Failed to save. Please try again.', 'error');
    }
  };

  // MUI TextField styles (matching Campaign Settings)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1, -1)}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
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
            inputProps={{ minLength: 3, maxLength: 200 }}
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            size="small"
            label="Slug (URL)"
            value={formData.slug || ''}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-title"
            sx={textFieldStyles}
            helperText="Leave empty to auto-generate from title"
          />
        </div>

        {type !== 'suggestions' && (
          <div>
            <TextField
              fullWidth
              size="small"
              label={isVideoType(type) ? 'Instructor' : 'Author'}
              value={isVideoType(type) ? formData.instructor : formData.author}
              onChange={(e) => {
                const field = isVideoType(type) ? 'instructor' : 'author';
                setFormData({ ...formData, [field]: e.target.value });
                setErrors({ ...errors, [field]: null });
              }}
              error={!!(isVideoType(type) ? errors.instructor : errors.author)}
              helperText={isVideoType(type) ? errors.instructor : errors.author}
              required
              inputProps={{ minLength: 2, maxLength: 100 }}
              sx={textFieldStyles}
            />
          </div>
        )}

        <div>
          <TextField
            fullWidth
            select
            size="small"
            label="Category"
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              setErrors({ ...errors, category: null });
            }}
            error={!!errors.category}
            helperText={errors.category}
            required
            sx={textFieldStyles}
          >
            {categories && Array.isArray(categories) && categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </TextField>
        </div>

        <div>
          <TextField
            fullWidth
            select
            size="small"
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'archived' })}
            sx={textFieldStyles}
          >
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </div>

        {(type === 'books' || type === 'suggestions') && (
          <>
            <div>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Rating (0-5)"
                value={formData.rating || ''}
                onChange={(e) => {
                  setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 });
                  setErrors({ ...errors, rating: null });
                }}
                error={!!errors.rating}
                helperText={errors.rating}
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                sx={textFieldStyles}
              />
            </div>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Product Link"
                value={formData.link || ''}
                onChange={(e) => {
                  setFormData({ ...formData, link: e.target.value });
                  setErrors({ ...errors, link: null });
                }}
                error={!!errors.link}
                helperText={errors.link}
                placeholder="https://example.com/product"
                sx={textFieldStyles}
              />
            </div>
          </>
        )}

        {type === 'videos' && (
          <>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 12:45"
                sx={textFieldStyles}
              />
            </div>
            <div>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Rating (0-5)"
                value={formData.rating || ''}
                onChange={(e) => {
                  setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 });
                  setErrors({ ...errors, rating: null });
                }}
                error={!!errors.rating}
                helperText={errors.rating}
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                sx={textFieldStyles}
              />
            </div>
          </>
        )}

        {type === 'books' && (
          <div>
            <TextField
              fullWidth
              size="small"
              label="ISBN"
              value={formData.isbn || ''}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              sx={textFieldStyles}
            />
          </div>
        )}

        {type === 'techniques' && (
          <>
            <div>
              <TextField
                fullWidth
                select
                size="small"
                label="Difficulty"
                value={formData.difficulty || 'beginner'}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                sx={textFieldStyles}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </div>
            <div>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Rating (0-5)"
                value={formData.rating || ''}
                onChange={(e) => {
                  setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 });
                  setErrors({ ...errors, rating: null });
                }}
                error={!!errors.rating}
                helperText={errors.rating}
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                sx={textFieldStyles}
              />
            </div>
          </>
        )}

        {type === 'suggestions' && (
          <div>
            <TextField
              fullWidth
              select
              size="small"
              label="Type"
              value={formData.type || 'general'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={textFieldStyles}
            >
              <MenuItem value="tool">Tool</MenuItem>
              <MenuItem value="accessory">Accessory</MenuItem>
              <MenuItem value="book">Book</MenuItem>
              <MenuItem value="general">General</MenuItem>
            </TextField>
          </div>
        )}
      </div>

      <div>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#374151' }}>
          Content *
        </Typography>
        <RichTextEditor
          key={`rich-editor-${item?.id || 'new'}`}
          value={formData.content || formData.body || formData.description || ''}
          onChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="Write detailed content here..."
          isDarkMode={isDarkMode}
          className="min-h-[300px]"
        />
      </div>

      <div>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description (Short Summary)"
          value={formData.description || ''}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            setErrors({ ...errors, description: null });
          }}
          error={!!errors.description}
          helperText={errors.description}
          placeholder="Brief description for preview..."
          inputProps={{ minLength: 10, maxLength: 5000 }}
          sx={textFieldStyles}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <TextField
            fullWidth
            size="small"
            label="Tags (comma-separated)"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., organic, beginner, indoor"
            sx={textFieldStyles}
          />
        </div>

        <div>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#374151' }}>
            Featured Image
          </Typography>
        <ImageUpload
          value={formData.featured_image}
          onChange={(url) => setFormData({ ...formData, featured_image: url })}
          onError={(error) => showToast(error, 'error')}
          className="mt-1"
          placeholder="Upload featured image"
        />
        </div>

        {isVideoType(type) && (
          <div>
            <TextField
              fullWidth
              size="small"
              label="Video URL"
              value={formData.video_url || ''}
              onChange={(e) => {
                setFormData({ ...formData, video_url: e.target.value });
                setErrors({ ...errors, video_url: null });
              }}
              error={!!errors.video_url}
              helperText={errors.video_url || "Paste video URL (YouTube, Vimeo, etc.)"}
              placeholder="https://www.youtube.com/watch?v=..."
              sx={textFieldStyles}
            />
          </div>
        )}

        {(type === 'books' || type === 'suggestions') && (
          <>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Buy Link"
                value={formData.buyLink || ''}
                onChange={(e) => {
                  setFormData({ ...formData, buyLink: e.target.value });
                  setErrors({ ...errors, buyLink: null });
                }}
                error={!!errors.buyLink}
                helperText={errors.buyLink}
                sx={textFieldStyles}
              />
            </div>
            {type === 'books' && (
              <div>
                <TextField
                  fullWidth
                  size="small"
                  label="Borrow Link"
                  value={formData.borrowLink || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, borrowLink: e.target.value });
                    setErrors({ ...errors, borrowLink: null });
                  }}
                  error={!!errors.borrowLink}
                  helperText={errors.borrowLink}
                  sx={textFieldStyles}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              sx={{
                color: '#10b981',
                '&.Mui-checked': {
                  color: '#10b981'
                }
              }}
            />
          }
          label="Featured"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <motion.button
          type="button"
          onClick={onCancel}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {item ? 'Update' : 'Create'}
        </motion.button>
      </div>

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
    </form>
  );
};

export default ContentForm;