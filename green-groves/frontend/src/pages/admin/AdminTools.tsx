import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, 
  DollarSign, AlertCircle,
  X, Save
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/UI/Card';
import { publicService } from '../../services/api.ts';

interface Tool {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  category: string;
  specifications: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  rating: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiTool {
  id: number;
  name: string;
  description: string;
  slug: string;
  images_json?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminTools: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Load tools from database
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicService.getTools();
        
        // Transform data to Tool interface
        const transformedTools: Tool[] = (data as ApiTool[]).map((tool: ApiTool) => ({
          id: tool.id.toString(),
          name: tool.name,
          description: tool.description,
          brand: 'Green Groves',
          model: tool.slug || 'GG-001',
          price: 0,
          category: 'Tools',
          specifications: tool.description,
          imageUrl: tool.images_json ? JSON.parse(tool.images_json)[0] : '/image.png',
          status: 'active',
          rating: 4.5,
          inStock: true,
          createdAt: tool.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          updatedAt: tool.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        }));
        
        setTools(transformedTools);
      } catch (err) {
        setError('Failed to load tools');
        console.error('Error loading tools:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  const categories = ['Cutting Tools', 'Hand Tools', 'Power Tools', 'Watering', 'Soil Tools'];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await publicService.deleteItem(id, 'tools');
      setTools(tools.filter(tool => tool.id !== id));
      setShowDeleteConfirm(null);
      console.log('Tool deleted successfully');
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Failed to delete tool. Please try again.');
    }
  };

  const handleSave = async (formData: Partial<Tool>) => {
    try {
      if (editingTool) {
        // Update existing tool
        await publicService.updateItem(editingTool.id, formData, 'tools');
        setTools(tools.map(tool =>
          tool.id === editingTool.id
            ? { ...tool, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : tool
        ));
        console.log('Tool updated successfully');
      } else {
        // Create new tool
        const newTool = await publicService.createItem(formData, 'tools') as Tool;
        setTools([newTool, ...tools]);
        console.log('Tool created successfully');
      }
      setIsModalOpen(false);
      setEditingTool(null);
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Failed to save tool. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-emerald-600 mb-4">Loading Tools</h2>
          <p className="text-gray-600">Please wait while we load your tools...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tools</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Tools Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening tools inventory and information
          </p>
        </div>
        <motion.button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Tool</span>
        </motion.button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
            Total: {filteredTools.length} tools
          </div>
        </div>
      </Card>

      {/* Tools Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tool
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Brand/Model
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Price
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTools.map((tool) => (
                <motion.tr
                  key={tool.id}
                  className={`border-b hover:bg-opacity-50 transition-colors ${
                    isDarkMode 
                      ? 'border-gray-700 hover:bg-gray-800' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {tool.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {tool.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div>
                      <p className="font-medium">{tool.brand}</p>
                      <p className="text-sm">{tool.model}</p>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tool.category}
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">{tool.price}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      tool.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tool.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleEdit(tool)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => setShowDeleteConfirm(tool.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              Previous
            </button>
            <span className={`px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ToolModal
            tool={editingTool}
            categories={categories}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`max-w-md w-full rounded-xl p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Confirm Delete
                </h3>
              </div>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete this tool? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tool Modal Component
interface ToolModalProps {
  tool: Tool | null;
  categories: string[];
  onSave: (data: Partial<Tool>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ToolModal: React.FC<ToolModalProps> = ({ tool, categories, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<Tool>>(
    tool || {
      name: '',
      description: '',
      brand: '',
      model: '',
      price: 0,
      category: categories[0] || '',
      specifications: '',
      imageUrl: '',
      status: 'active',
      rating: 5,
      inStock: true
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.brand?.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model?.trim()) newErrors.model = 'Model is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {tool ? 'Edit Tool' : 'Add New Tool'}
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tool Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter tool name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Brand *</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className={`${inputClass} ${errors.brand ? 'border-red-500' : ''}`}
                placeholder="Enter brand name"
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className={labelClass}>Model *</label>
              <input
                type="text"
                value={formData.model || ''}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className={`${inputClass} ${errors.model ? 'border-red-500' : ''}`}
                placeholder="Enter model number"
              />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className={labelClass}>Price ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className={`${inputClass} ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`${inputClass} ${errors.category ? 'border-red-500' : ''}`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock || false}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="inStock" className={labelClass.replace('block', 'inline')}>
                In Stock
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${inputClass} h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter tool description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className={labelClass}>Specifications</label>
            <textarea
              value={formData.specifications || ''}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              className={`${inputClass} h-24 resize-none`}
              placeholder="Enter technical specifications"
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="h-5 w-5" />
              <span>{tool ? 'Update Tool' : 'Create Tool'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminTools;