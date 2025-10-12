import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Toast from '../UI/Toast';
import { validateText, validateNumber, validateURL } from '../../utils/validation';

interface Product {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'archived';
  price?: number;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  is_featured?: boolean;
  is_published?: boolean;
  views?: number;
  likes?: number;
  rating?: number;
  
  // Book specific
  author?: string;
  pages?: number;
  published_year?: number;
  
  // Pot specific
  drainage_holes?: boolean;
  
  // Accessory specific
  is_waterproof?: boolean;
  is_durable?: boolean;
  
  // Suggestion specific
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  season?: string;
  plant_type?: string;
  estimated_time?: string;
  tags?: string[];
  
  // Generic link
  link?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

interface ProductFormProps {
  type: string;
  item?: Product | null;
  categories: string[];
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  type, 
  item, 
  categories, 
  onSave, 
  onCancel, 
  isDarkMode 
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    item || {
      name: '',
      title: '',
      category: 'tool',
      subcategory: '',
      status: 'published',
      description: '',
      brand: '',
      material: '',
      size: '',
      color: '',
      price: 0,
      rating: 0,
      is_featured: false,
      is_published: false,
      views: 0,
      likes: 0,
      
      // Book specific
      author: '',
      pages: 0,
      published_year: new Date().getFullYear(),
      
      // Pot specific
      drainage_holes: false,
      
      // Accessory specific
      is_waterproof: false,
      is_durable: false,
      
      // Suggestion specific
      difficulty_level: 'beginner',
      season: '',
      plant_type: '',
      estimated_time: '',
      tags: [],
      
      // Generic link
      link: ''
    }
  );

  // Validation error states
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [brandError, setBrandError] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [linkError, setLinkError] = useState('');
  
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

  // Clear all validation errors
  const clearAllErrors = () => {
    setNameError('');
    setDescriptionError('');
    setPriceError('');
    setBrandError('');
    setAuthorError('');
    setLinkError('');
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

  // Update formData when item changes (e.g., after reload or edit)
  useEffect(() => {
    if (item) {
      const processedItem = {
        ...item,
        // Ensure subcategory is loaded (keep original value, even if empty string)
        subcategory: item.subcategory !== undefined && item.subcategory !== null ? item.subcategory : '',
        // Ensure price is number (backend might return string or null)
        price: item.price !== undefined && item.price !== null && item.price !== '' 
          ? (typeof item.price === 'string' ? parseFloat(item.price) : item.price) 
          : null,
        // Ensure rating is number
        rating: item.rating ? (typeof item.rating === 'string' ? parseFloat(item.rating) : item.rating) : 0,
        // Convert tags array to comma-separated string for input display
        tags: item.tags 
          ? (Array.isArray(item.tags) 
            ? item.tags 
            : (typeof item.tags === 'string' ? item.tags : []))
          : []
      };
      
      setFormData(processedItem);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name && !formData.title) {
      setNameError('Product name is required');
      showToast('Product name is required', 'error');
      return;
    }
    
    if (!formData.description) {
      setDescriptionError('Product description is required');
      showToast('Product description is required', 'error');
      return;
    }
    
    if (!formData.category) {
      showToast('Product category is required', 'error');
      return;
    }
    
    const processedData: Partial<Product> = {
      ...formData,
      // Backend uses 'name' field - use either name or title from form
      name: formData.name || formData.title,
      // Remove title field - backend only uses 'name'
      title: undefined,
      // Ensure subcategory is sent (even if empty string)
      subcategory: formData.subcategory || '',
      // Convert tags to array if it's a string
      tags: formData.tags 
        ? (Array.isArray(formData.tags) 
          ? formData.tags 
          : (typeof formData.tags === 'string' 
            ? (formData.tags as string).split(',').map((tag: string) => tag.trim()).filter(Boolean)
            : []))
        : undefined,
      rating: (() => {
        const ratingValue = parseFloat(formData.rating as any) || 0;
        console.log('Frontend - Rating Debug:', {
          original: formData.rating,
          parsed: ratingValue,
          type: typeof formData.rating
        });
        return ratingValue;
      })(),
      // Fix price: parseFloat can return 0, which is valid
      price: formData.price !== undefined && formData.price !== null && formData.price !== '' 
        ? parseFloat(formData.price as any) 
        : null,
      pages: parseInt(formData.pages as any) || undefined,
      published_year: parseInt(formData.published_year as any) || undefined,
      // Ensure link is included
      link: formData.link || undefined,
      // Ensure status and is_published are in sync
      status: formData.status || 'published',
      is_published: formData.is_published !== undefined ? formData.is_published : formData.status === 'published'
    };
    
    try {
      onSave(processedData);
      showToast(item ? 'Product updated successfully!' : 'Product created successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast('Failed to save product', 'error');
    }
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item ? 'Edit' : 'Create'} Product
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextField
            fullWidth
            size="small"
            label="Name"
            value={formData.title || formData.name || ''}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value, name: e.target.value });
              setNameError('');
            }}
            error={!!nameError}
            helperText={nameError}
            required
            inputProps={{ minLength: 2, maxLength: 100 }}
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            select
            size="small"
            label="Category"
            value={formData.category || 'tool'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            required
            sx={textFieldStyles}
          >
            <MenuItem value="tool">Tool</MenuItem>
            <MenuItem value="book">Book</MenuItem>
            <MenuItem value="pot">Pot</MenuItem>
            <MenuItem value="accessory">Accessory</MenuItem>
            <MenuItem value="suggestion">Suggestion</MenuItem>
          </TextField>
        </div>

        <div>
          <TextField
            fullWidth
            size="small"
            label="Subcategory"
            value={formData.subcategory || ''}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="e.g., Công cụ đào đất, Sách nghệ thuật..."
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            type="number"
            size="small"
            label="Price ($)"
            value={formData.price || ''}
            onChange={(e) => {
              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
              setPriceError('');
            }}
            error={!!priceError}
            helperText={priceError}
            inputProps={{ min: 0, max: 999999, step: 0.01 }}
            placeholder="0.00"
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            size="small"
            label="Brand"
            value={formData.brand || ''}
            onChange={(e) => {
              setFormData({ ...formData, brand: e.target.value });
              setBrandError('');
            }}
            error={!!brandError}
            helperText={brandError}
            inputProps={{ minLength: 2, maxLength: 50 }}
            placeholder="Product brand"
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            size="small"
            label="Material"
            value={formData.material || ''}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            placeholder="Product material"
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            size="small"
            label="Size"
            value={formData.size || ''}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="Product size"
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            size="small"
            label="Color"
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="Product color"
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            type="number"
            size="small"
            label="Rating (0-5)"
            value={formData.rating ?? ''}
            onChange={(e) => {
              const newRating = parseFloat(e.target.value) || 0;
              setFormData({ ...formData, rating: newRating });
            }}
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            sx={textFieldStyles}
          />
        </div>

      </div>

        <div>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description || ''}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setDescriptionError('');
            }}
            error={!!descriptionError}
            helperText={descriptionError}
            required
            inputProps={{ minLength: 10, maxLength: 5000 }}
            placeholder="Short product description..."
            sx={textFieldStyles}
          />
        </div>

      {/* Category-specific fields */}

      {formData.category === 'book' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <TextField
              fullWidth
              size="small"
              label="Author"
              value={formData.author || ''}
              onChange={(e) => {
                setFormData({ ...formData, author: e.target.value });
                setAuthorError('');
              }}
              error={!!authorError}
              helperText={authorError}
              inputProps={{ minLength: 2, maxLength: 100 }}
              placeholder="Author name"
              sx={textFieldStyles}
            />
          </div>
          <div>
            <TextField
              fullWidth
              type="number"
              size="small"
              label="Pages"
              value={formData.pages || ''}
              onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
              inputProps={{ min: 1, max: 10000 }}
              placeholder="Number of pages"
              sx={textFieldStyles}
            />
          </div>
          <div>
            <TextField
              fullWidth
              type="number"
              size="small"
              label="Published Year"
              value={formData.published_year || new Date().getFullYear()}
              onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) || new Date().getFullYear() })}
              inputProps={{ min: 1900, max: 2100 }}
              placeholder="2024"
              sx={textFieldStyles}
            />
          </div>
        </div>
      )}

      {formData.category === 'pot' && (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.drainage_holes || false}
                onChange={(e) => setFormData({ ...formData, drainage_holes: e.target.checked })}
                sx={{
                  color: '#10b981',
                  '&.Mui-checked': { color: '#10b981' }
                }}
              />
            }
            label="Has Drainage Holes"
          />
        </div>
      )}

      {formData.category === 'accessory' && (
        <div className="flex items-center space-x-6">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_waterproof || false}
                onChange={(e) => setFormData({ ...formData, is_waterproof: e.target.checked })}
                sx={{
                  color: '#10b981',
                  '&.Mui-checked': { color: '#10b981' }
                }}
              />
            }
            label="Waterproof"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_durable || false}
                onChange={(e) => setFormData({ ...formData, is_durable: e.target.checked })}
                sx={{
                  color: '#10b981',
                  '&.Mui-checked': { color: '#10b981' }
                }}
              />
            }
            label="Durable"
          />
        </div>
      )}

      {formData.category === 'suggestion' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                fullWidth
                select
                size="small"
                label="Difficulty Level"
                value={formData.difficulty_level || 'beginner'}
                onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
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
                size="small"
                label="Season"
                value={formData.season || ''}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder="e.g., Spring, Summer, All year"
                sx={textFieldStyles}
              />
            </div>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Plant Type"
                value={formData.plant_type || ''}
                onChange={(e) => setFormData({ ...formData, plant_type: e.target.value })}
                placeholder="e.g., Indoor plants, Vegetables"
                sx={textFieldStyles}
              />
            </div>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Estimated Time"
                value={formData.estimated_time || ''}
                onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                placeholder="e.g., 30 minutes, 2 hours"
                sx={textFieldStyles}
              />
            </div>
          </div>

          <div>
            <TextField
              fullWidth
              size="small"
              label="Tags (comma-separated)"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value as any })}
              placeholder="tag1, tag2, tag3"
              helperText="Enter tags separated by commas"
              sx={textFieldStyles}
            />
          </div>
        </>
      )}

      {/* Link field for all categories */}
      <div>
        <TextField
          fullWidth
          size="small"
          label="Link (URL or Text)"
          value={formData.link || ''}
          onChange={(e) => {
            setFormData({ ...formData, link: e.target.value });
            setLinkError('');
          }}
          error={!!linkError}
          helperText={linkError}
          placeholder="https://example.com or any text reference"
          sx={textFieldStyles}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Product Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.is_featured || false}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="featured" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Featured Product
          </label>
        </div>

        {/* Status Dropdown */}
        <div>
          <label htmlFor="status" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Status
          </label>
          <select
            id="status"
            value={formData.status || 'published'}
            onChange={(e) => setFormData({ 
              ...formData, 
              status: e.target.value as 'published' | 'archived',
              is_published: e.target.value === 'published' // Auto-set is_published based on status
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6">
        <motion.button
          type="button"
          onClick={onCancel}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {item ? 'Update Product' : 'Create Product'}
        </motion.button>
      </div>
      
      {/* Toast Notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </form>
  );
};

export default ProductForm;
