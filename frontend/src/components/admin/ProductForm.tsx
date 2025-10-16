import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField, MenuItem, Checkbox, FormControlLabel, Typography, Alert } from '@mui/material';
import Toast from '../ui/Toast';
import TagInput from './TagInput';
import ImageUpload from '../common/ImageUpload';
import { validateNumber, validateURL, hasErrors } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { User, ContentStatus } from '../../types/admin';

interface Product {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description: string;
  image?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: ContentStatus;
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
  
  // Author tracking
  author_id?: number;
  created_by?: number;
  updated_by?: number;
  creator?: {
    id: number;
    name: string;
  };
  updater?: {
    id: number;
    name: string;
  };
  
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
  users?: User[];
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  item, 
  onSave, 
  onCancel, 
  isDarkMode,
  users = []
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [formData, setFormData] = useState<Partial<Product>>(() => {
    if (item) {
      // Handle both 'featured' and 'is_featured' fields
      const featured = (item as any).featured ?? item.is_featured ?? false;
      
      // Convert tags from Tag objects to IDs for TagInput
      let tags = [];
      if (Array.isArray(item.tags)) {
        tags = item.tags.map((tag: any) => typeof tag === 'object' && tag.id ? tag.id : tag).filter(Boolean);
      }
      
      return {
        ...item,
        is_featured: featured,
        tags: tags
      };
    }
    return {
      name: '',
      title: '',
      category: 'tool',
      subcategory: '',
      status: 'published',
      description: '',
      image: '',
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
    };
  });

  // Validation error states
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
        price: item.price !== undefined && item.price !== null && String(item.price) !== '' 
          ? (typeof item.price === 'string' ? parseFloat(item.price) : item.price) 
          : undefined,
        // Ensure rating is number
        rating: item.rating ? (typeof item.rating === 'string' ? parseFloat(item.rating) : item.rating) : 0,
        // Convert tags from Tag objects to IDs for TagInput
        tags: Array.isArray(item.tags) 
          ? item.tags.map((tag: any) => typeof tag === 'object' && tag.id ? tag.id : tag).filter(Boolean)
          : []
      };
      
      setFormData(processedItem);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    
    // Required field validations
    if (!formData.name && !formData.title) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Product description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Product category is required';
    }
    
    // Field length validations
    if (formData.name && formData.name.length > 100) {
      newErrors.name = 'Product name must not exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 5000) {
      newErrors.description = 'Product description must not exceed 5000 characters';
    }
    
    if (formData.brand && formData.brand.length > 50) {
      newErrors.brand = 'Brand must not exceed 50 characters';
    }
    
    if (formData.author && formData.author.length > 100) {
      newErrors.author = 'Author name must not exceed 100 characters';
    }
    
    // Number validations
    if (formData.price !== undefined && formData.price !== null) {
      newErrors.price = validateNumber(formData.price, 0, 999999, 'Price', false);
    }
    
    if (formData.rating !== undefined && formData.rating !== null) {
      newErrors.rating = validateNumber(formData.rating, 0, 5, 'Rating', false);
    }
    
    if (formData.pages !== undefined && formData.pages !== null) {
      newErrors.pages = validateNumber(formData.pages, 1, 10000, 'Pages', false);
    }
    
    if (formData.published_year !== undefined && formData.published_year !== null) {
      newErrors.published_year = validateNumber(formData.published_year, 1900, 2100, 'Published Year', false);
    }
    
    // URL validations
    if (formData.link) {
      newErrors.link = validateURL(formData.link, false);
    }
    
    // Check if there are any errors
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }
    
    // Clear errors if validation passes
    setErrors({});
    
    const processedData: Partial<Product> = {
      ...formData,
      // Backend uses 'name' field - use either name or title from form
      name: formData.name || formData.title,
      // Remove title field - backend only uses 'name'
      title: undefined,
      // Ensure subcategory is sent (even if empty string)
      subcategory: formData.subcategory || '',
      // Tags should be array of tag IDs
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      rating: (() => {
          const ratingValue = parseFloat(formData.rating as any) || 0;
        return ratingValue;
      })(),
      // Fix price: parseFloat can return 0, which is valid
      price: formData.price !== undefined && formData.price !== null && String(formData.price) !== '' 
        ? parseFloat(String(formData.price)) 
        : undefined,
      pages: parseInt(formData.pages as any) || undefined,
      published_year: parseInt(formData.published_year as any) || undefined,
      // Ensure link is included
      link: formData.link || undefined,
      // Force pending for moderator, admin can set any status
      status: isAdmin ? (formData.status || 'published') : 'pending',
      is_published: formData.is_published !== undefined ? formData.is_published : formData.status === 'published',
      // Include author_id if admin set it
      author_id: formData.author_id
    };
    
    // Call parent's onSave - parent will handle success/error messages
    onSave(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
              const value = e.target.value;
              if (value.length > 100) {
                setErrors({ ...errors, name: 'Name must not exceed 100 characters' });
                return;
              }
              setFormData({ ...formData, title: value, name: value });
              setErrors({ ...errors, name: null });
            }}
            error={!!errors.name}
            helperText={errors.name || `${(formData.title || formData.name || '').length}/100 characters (min 2)`}
            inputProps={{ maxLength: 100 }}
            sx={textFieldStyles}
          />
        </div>

        {isAdmin && (
          <div>
            <TextField
              fullWidth
              select
              size="small"
              label="Author (Content Owner)"
              value={formData.author_id || user?.id}
              onChange={(e) => setFormData({ ...formData, author_id: Number(e.target.value) })}
              sx={textFieldStyles}
              helperText="Select the content author/owner"
            >
              {users.map(u => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} ({u.email}) - {u.role}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}

        <div>
          <TextField
            fullWidth
            select
            size="small"
            label="Category"
            value={formData.category || 'tool'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 100) return;
              setFormData({ ...formData, subcategory: value });
            }}
            placeholder="e.g., Digging tools, Art books..."
            helperText={`${(formData.subcategory || '').length}/100 characters`}
            inputProps={{ maxLength: 100 }}
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            fullWidth
            type="number"
            size="small"
            label="Price ($)"
            value={formData.price ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setFormData({ ...formData, price: undefined });
                setErrors({ ...errors, price: null });
                return;
              }
              const numValue = parseFloat(value);
              if (numValue < 0) {
                setErrors({ ...errors, price: 'Price cannot be negative' });
                return;
              }
              if (numValue > 999999) {
                setErrors({ ...errors, price: 'Price cannot exceed $999,999' });
                return;
              }
              setFormData({ ...formData, price: numValue });
              setErrors({ ...errors, price: null });
            }}
            error={!!errors.price}
            helperText={errors.price || 'Enter price between $0 - $999,999'}
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
              const value = e.target.value;
              if (value.length > 50) {
                setErrors({ ...errors, brand: 'Brand must not exceed 50 characters' });
                return;
              }
              setFormData({ ...formData, brand: value });
              setErrors({ ...errors, brand: null });
            }}
            error={!!errors.brand}
            helperText={errors.brand || `${(formData.brand || '').length}/50 characters`}
            inputProps={{ maxLength: 50 }}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 100) return;
              setFormData({ ...formData, material: value });
            }}
            helperText={`${(formData.material || '').length}/100 characters`}
            inputProps={{ maxLength: 100 }}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 50) return;
              setFormData({ ...formData, size: value });
            }}
            helperText={`${(formData.size || '').length}/50 characters`}
            inputProps={{ maxLength: 50 }}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 50) return;
              setFormData({ ...formData, color: value });
            }}
            helperText={`${(formData.color || '').length}/50 characters`}
            inputProps={{ maxLength: 50 }}
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
              const value = e.target.value;
              if (value === '') {
                setFormData({ ...formData, rating: 0 });
                setErrors({ ...errors, rating: null });
                return;
              }
              const numValue = parseFloat(value);
              if (numValue < 0) {
                setErrors({ ...errors, rating: 'Rating cannot be negative' });
                return;
              }
              if (numValue > 5) {
                setErrors({ ...errors, rating: 'Rating cannot exceed 5' });
                return;
              }
              setFormData({ ...formData, rating: numValue });
              setErrors({ ...errors, rating: null });
            }}
            error={!!errors.rating}
            helperText={errors.rating || 'Enter rating between 0.0 - 5.0'}
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
              const value = e.target.value;
              if (value.length > 5000) {
                setErrors({ ...errors, description: 'Description must not exceed 5000 characters' });
                return;
              }
              setFormData({ ...formData, description: value });
              setErrors({ ...errors, description: null });
            }}
            error={!!errors.description}
            helperText={errors.description || `${(formData.description || '').length}/5000 characters (min 10)`}
            inputProps={{ maxLength: 5000 }}
            placeholder="Short product description..."
            sx={textFieldStyles}
          />
        </div>

      {/* Product Image */}
      <div>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? '#e5e7eb' : '#374151' }}>
          Product Image
        </Typography>
        <ImageUpload
          value={formData.image}
          onChange={(url) => setFormData({ ...formData, image: url })}
          onError={(error) => showToast(error, 'error')}
          placeholder="Upload product image"
          modelType="product"
          folder="products"
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
                const value = e.target.value;
                if (value.length > 100) {
                  setErrors({ ...errors, author: 'Author name must not exceed 100 characters' });
                  return;
                }
                setFormData({ ...formData, author: value });
                setErrors({ ...errors, author: null });
              }}
              error={!!errors.author}
              helperText={errors.author || `${(formData.author || '').length}/100 characters (min 2)`}
              inputProps={{ maxLength: 100 }}
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
              value={formData.pages ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setFormData({ ...formData, pages: undefined });
                  setErrors({ ...errors, pages: null });
                  return;
                }
                const numValue = parseInt(value);
                if (numValue < 1) {
                  setErrors({ ...errors, pages: 'Pages must be at least 1' });
                  return;
                }
                if (numValue > 10000) {
                  setErrors({ ...errors, pages: 'Pages cannot exceed 10,000' });
                  return;
                }
                setFormData({ ...formData, pages: numValue });
                setErrors({ ...errors, pages: null });
              }}
              error={!!errors.pages}
              helperText={errors.pages || 'Enter number of pages (1 - 10,000)'}
              inputProps={{ min: 1, max: 10000, step: 1 }}
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
              value={formData.published_year ?? new Date().getFullYear()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setFormData({ ...formData, published_year: new Date().getFullYear() });
                  setErrors({ ...errors, published_year: null });
                  return;
                }
                const numValue = parseInt(value);
                if (numValue < 1900) {
                  setErrors({ ...errors, published_year: 'Year must be 1900 or later' });
                  return;
                }
                if (numValue > 2100) {
                  setErrors({ ...errors, published_year: 'Year cannot exceed 2100' });
                  return;
                }
                setFormData({ ...formData, published_year: numValue });
                setErrors({ ...errors, published_year: null });
              }}
              error={!!errors.published_year}
              helperText={errors.published_year || 'Enter year (1900 - 2100)'}
              inputProps={{ min: 1900, max: 2100, step: 1 }}
              placeholder={new Date().getFullYear().toString()}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 50) return;
                  setFormData({ ...formData, season: value });
                }}
                placeholder="e.g., Spring, Summer, All year"
                helperText={`${(formData.season || '').length}/50 characters`}
                inputProps={{ maxLength: 50 }}
                sx={textFieldStyles}
              />
            </div>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Plant Type"
                value={formData.plant_type || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 100) return;
                  setFormData({ ...formData, plant_type: value });
                }}
                placeholder="e.g., Indoor plants, Vegetables"
                helperText={`${(formData.plant_type || '').length}/100 characters`}
                inputProps={{ maxLength: 100 }}
                sx={textFieldStyles}
              />
            </div>
            <div>
              <TextField
                fullWidth
                size="small"
                label="Estimated Time"
                value={formData.estimated_time || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 50) return;
                  setFormData({ ...formData, estimated_time: value });
                }}
                placeholder="e.g., 30 minutes, 2 hours"
                helperText={`${(formData.estimated_time || '').length}/50 characters`}
                inputProps={{ maxLength: 50 }}
                sx={textFieldStyles}
              />
            </div>
          </div>
        </>
      )}

      {/* Tags field for all categories */}
      <div>
        <TagInput
          value={Array.isArray(formData.tags) ? formData.tags.map(Number).filter(n => !isNaN(n)) : []}
          onChange={(tagIds) => setFormData({ ...formData, tags: tagIds as any })}
          label="Tags"
          placeholder="Select tags..."
          helperText="Select relevant tags for better product discovery"
        />
      </div>

      {/* Link field for all categories */}
      <div>
        <TextField
          fullWidth
          size="small"
          label="Link (URL or Text)"
          value={formData.link || ''}
          onChange={(e) => {
            setFormData({ ...formData, link: e.target.value });
            setErrors({ ...errors, link: null });
          }}
          error={!!errors.link}
          helperText={errors.link}
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

        {/* Status - Admin only */}
        {isAdmin && (
          <div>
            <label htmlFor="status" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              id="status"
              value={formData.status || 'pending'}
              onChange={(e) => setFormData({ 
                ...formData, 
                status: e.target.value as ContentStatus,
                is_published: e.target.value === 'published'
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}
        
        {/* Moderator Alert - No status dropdown */}
        {!isAdmin && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {item ? (
              <Typography variant="body2">
                ⚠️ Saving changes will set status to <strong>Pending</strong> for admin review.
              </Typography>
            ) : (
              <Typography variant="body2">
                Your content will be submitted as <strong>Pending</strong> for admin approval.
              </Typography>
            )}
          </Alert>
        )}
      </div>

      {/* Created by / Updated by info */}
      {item && (item as any).creator && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg mb-4" style={{
          backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
        }}>
          <div>
            <Typography variant="caption" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Created by
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
              {((item as any).creator?.name || 'Unknown')} ({new Date((item as any).createdAt || item.createdAt || '').toLocaleString()})
            </Typography>
          </div>
          <div>
            <Typography variant="caption" sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Last updated by
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
              {((item as any).updater?.name || 'Unknown')} ({new Date((item as any).updatedAt || item.updatedAt || '').toLocaleString()})
            </Typography>
          </div>
        </div>
      )}

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
