import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from '../ImageUpload';
import RichTextEditor from './RichTextEditor';
import { ContentFormProps } from '../../types/admin';

interface FormData {
  title: string;
  author?: string;
  instructor?: string;
  category: string;
  status: 'draft' | 'published';
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
  
  const [formData, setFormData] = useState<FormData>(
    item || {
      title: '',
      author: '',
      instructor: '',
      category: categories && categories.length > 0 ? categories[0] : '',
      status: 'draft',
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
    const processedData = {
      ...formData,
      // Ensure required fields have values
      title: formData.title || '',
      status: formData.status || 'draft',
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
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1, -1)}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Slug (URL)</label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className={inputClass}
            placeholder="auto-generated-from-title"
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Leave empty to auto-generate from title
          </p>
        </div>

        {type !== 'suggestions' && (
          <div>
            <label className={labelClass}>
              {isVideoType(type) ? 'Instructor' : 'Author'} *
            </label>
            <input
              type="text"
              value={isVideoType(type) ? formData.instructor : formData.author}
              onChange={(e) => setFormData({ 
                ...formData, 
                [isVideoType(type) ? 'instructor' : 'author']: e.target.value 
              })}
              className={inputClass}
              required
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputClass}
            required
          >
            {categories && Array.isArray(categories) && categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {(type === 'books' || type === 'suggestions') && (
          <>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Product Link</label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/product"
              />
            </div>
          </>
        )}

        {type === 'videos' && (
          <>
            <div>
              <label className={labelClass}>Duration</label>
              <input
                type="text"
                placeholder="e.g., 12:45"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || 0}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
          </>
        )}

        {type === 'books' && (
          <div>
            <label className={labelClass}>ISBN</label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className={inputClass}
            />
          </div>
        )}

        {type === 'techniques' && (
          <>
            <div>
              <label className={labelClass}>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                className={inputClass}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || 0}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
          </>
        )}

        {type === 'suggestions' && (
          <div>
            <label className={labelClass}>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={inputClass}
            >
              <option value="tool">Tool</option>
              <option value="accessory">Accessory</option>
              <option value="book">Book</option>
              <option value="general">General</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Content *</label>
        <RichTextEditor
          key={`rich-editor-${item?.id || 'new'}`} // Force re-render when editing different items
          value={formData.content || formData.body || formData.description || ''}
          onChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="Write detailed content here..."
          isDarkMode={isDarkMode}
          className="min-h-[300px]"
        />
      </div>

      <div>
        <label className={labelClass}>Description (Short Summary)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`${inputClass} h-20 resize-none`}
          placeholder="Brief description for preview..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className={inputClass}
              placeholder="e.g., organic, beginner, indoor"
            />
        </div>

        <div>
          <label className={labelClass}>Featured Image</label>
        <ImageUpload
          value={formData.featured_image}
          onChange={(url) => setFormData({ ...formData, featured_image: url })}
          onError={(error) => alert(error)}
          className="mt-1"
          placeholder="Upload featured image"
        />
        </div>

        {isVideoType(type) && (
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              type="url"
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Paste video URL (YouTube, Vimeo, etc.)
            </p>
          </div>
        )}

        {(type === 'books' || type === 'suggestions') && (
          <>
            <div>
              <label className={labelClass}>Buy Link</label>
              <input
                type="url"
                value={formData.buyLink}
                onChange={(e) => setFormData({ ...formData, buyLink: e.target.value })}
                className={inputClass}
              />
            </div>
            {type === 'books' && (
              <div>
                <label className={labelClass}>Borrow Link</label>
                <input
                  type="url"
                  value={formData.borrowLink}
                  onChange={(e) => setFormData({ ...formData, borrowLink: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className={labelClass.replace('block', 'inline')}>Featured</span>
        </label>
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
    </form>
  );
};

export default ContentForm;