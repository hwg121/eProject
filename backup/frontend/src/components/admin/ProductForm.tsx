import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from '../ImageUpload';

interface Product {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description: string;
  content?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'draft' | 'archived';
  price?: number;
  image?: string;
  images_json?: string;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  is_featured?: boolean;
  is_published?: boolean;
  views?: number;
  likes?: number;
  rating?: number;
  
  // Tool specific
  usage?: string;
  video_url?: string;
  
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
      status: 'draft',
      description: '',
      content: '',
      image: '',
      images_json: '',
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
      
      // Tool specific
      usage: '',
      video_url: '',
      
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

  // Update formData when item changes (e.g., after reload or edit)
  useEffect(() => {
    if (item) {
      // Ensure tags is always an array or string for the form
      const processedItem = {
        ...item,
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
      alert('Product name is required');
      return;
    }
    
    if (!formData.description) {
      alert('Product description is required');
      return;
    }
    
    if (!formData.category) {
      alert('Product category is required');
      return;
    }
    
    const processedData: Partial<Product> = {
      ...formData,
      // Backend uses 'name' field - use either name or title from form
      name: formData.name || formData.title,
      // Remove title field - backend only uses 'name'
      title: undefined,
      // Convert tags to array if it's a string
      tags: formData.tags 
        ? (Array.isArray(formData.tags) 
          ? formData.tags 
          : (typeof formData.tags === 'string' 
            ? (formData.tags as string).split(',').map((tag: string) => tag.trim()).filter(Boolean)
            : []))
        : undefined,
      // Convert images_json to array if needed
      images_json: formData.images_json 
        ? (Array.isArray(formData.images_json) 
          ? formData.images_json 
          : (typeof formData.images_json === 'string' && formData.images_json 
            ? JSON.parse(formData.images_json)
            : undefined))
        : undefined,
      rating: parseFloat(formData.rating as any) || 0,
      price: parseFloat(formData.price as any) || undefined,
      pages: parseInt(formData.pages as any) || undefined,
      published_year: parseInt(formData.published_year as any) || undefined,
      // Ensure link is included
      link: formData.link || undefined,
      // Ensure status and is_published are in sync
      status: formData.status || 'draft',
      is_published: formData.is_published !== undefined ? formData.is_published : formData.status === 'published'
    };
    
    console.log('Saving product with link:', processedData.link);
    onSave(processedData);
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
          <label className={labelClass}>Name *</label>
          <input
            type="text"
            value={formData.title || formData.name || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={formData.category || 'tool'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className={inputClass}
            required
          >
            <option value="tool">Tool</option>
            <option value="book">Book</option>
            <option value="pot">Pot</option>
            <option value="accessory">Accessory</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Subcategory</label>
          <input
            type="text"
            value={formData.subcategory || ''}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            className={inputClass}
            placeholder="e.g., Công cụ đào đất, Sách nghệ thuật..."
          />
        </div>

        <div>
          <label className={labelClass}>Status *</label>
          <select
            value={formData.status || 'draft'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className={inputClass}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className={labelClass}>Brand</label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className={inputClass}
            placeholder="Product brand"
          />
        </div>

        <div>
          <label className={labelClass}>Material</label>
          <input
            type="text"
            value={formData.material || ''}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            className={inputClass}
            placeholder="Product material"
          />
        </div>

        <div>
          <label className={labelClass}>Size</label>
          <input
            type="text"
            value={formData.size || ''}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className={inputClass}
            placeholder="Product size"
          />
        </div>

        <div>
          <label className={labelClass}>Color</label>
          <input
            type="text"
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className={inputClass}
            placeholder="Product color"
          />
        </div>

        <div>
          <label className={labelClass}>Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating || 5}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
            className={inputClass}
          />
        </div>

      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`${inputClass} min-h-[120px]`}
          placeholder="Short product description..."
          required
        />
      </div>

      <div>
        <label className={labelClass}>Content (Optional)</label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className={`${inputClass} min-h-[200px]`}
          placeholder="Detailed product information, specifications, features..."
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Add detailed product information here
        </p>
      </div>

      {/* Category-specific fields */}
      {formData.category === 'tool' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Usage</label>
            <textarea
              value={formData.usage || ''}
              onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
              className={inputClass}
              rows={2}
              placeholder="How to use this tool"
            />
          </div>
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              type="text"
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className={inputClass}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      )}

      {formData.category === 'book' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Author</label>
            <input
              type="text"
              value={formData.author || ''}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className={inputClass}
              placeholder="Author name"
            />
          </div>
          <div>
            <label className={labelClass}>Pages</label>
            <input
              type="number"
              value={formData.pages || 0}
              onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
              className={inputClass}
              placeholder="Number of pages"
            />
          </div>
          <div>
            <label className={labelClass}>Published Year</label>
            <input
              type="number"
              value={formData.published_year || new Date().getFullYear()}
              onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) || new Date().getFullYear() })}
              className={inputClass}
              placeholder="2024"
            />
          </div>
        </div>
      )}

      {formData.category === 'pot' && (
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="drainage_holes"
              checked={formData.drainage_holes || false}
              onChange={(e) => setFormData({ ...formData, drainage_holes: e.target.checked })}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="drainage_holes" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Has Drainage Holes
            </label>
          </div>
        </div>
      )}

      {formData.category === 'accessory' && (
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_waterproof"
              checked={formData.is_waterproof || false}
              onChange={(e) => setFormData({ ...formData, is_waterproof: e.target.checked })}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_waterproof" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Waterproof
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_durable"
              checked={formData.is_durable || false}
              onChange={(e) => setFormData({ ...formData, is_durable: e.target.checked })}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_durable" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Durable
            </label>
          </div>
        </div>
      )}

      {formData.category === 'suggestion' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Difficulty Level</label>
            <select
              value={formData.difficulty_level || 'beginner'}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
              className={inputClass}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Season</label>
            <input
              type="text"
              value={formData.season || ''}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className={inputClass}
              placeholder="e.g., Spring, Summer, All year"
            />
          </div>
          <div>
            <label className={labelClass}>Plant Type</label>
            <input
              type="text"
              value={formData.plant_type || ''}
              onChange={(e) => setFormData({ ...formData, plant_type: e.target.value })}
              className={inputClass}
              placeholder="e.g., Indoor plants, Vegetables"
            />
          </div>
          <div>
            <label className={labelClass}>Estimated Time</label>
            <input
              type="text"
              value={formData.estimated_time || ''}
              onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
              className={inputClass}
              placeholder="e.g., 30 minutes, 2 hours"
            />
          </div>
        </div>
      )}


      {formData.category === 'suggestion' && (
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            type="text"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value as any })}
            className={inputClass}
            placeholder="tag1, tag2, tag3"
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter tags separated by commas
          </p>
        </div>
      )}

      {/* Link field for all categories */}
      <div>
        <label className={labelClass}>Link (URL or Text)</label>
        <input
          type="text"
          value={formData.link || ''}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className={inputClass}
          placeholder="https://example.com or any text reference"
        />
      </div>

      <div>
        <label className={labelClass}>Featured Image</label>
        <ImageUpload
          value={formData.image || ''}
          onChange={(url) => setFormData({ ...formData, image: url })}
          onError={(error) => alert(error)}
          className="mt-1"
          placeholder="Upload product image"
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
            value={formData.status || 'draft'}
            onChange={(e) => setFormData({ 
              ...formData, 
              status: e.target.value as 'published' | 'draft' | 'archived',
              is_published: e.target.value === 'published' // Auto-set is_published based on status
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="draft">Draft</option>
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
    </form>
  );
};

export default ProductForm;
