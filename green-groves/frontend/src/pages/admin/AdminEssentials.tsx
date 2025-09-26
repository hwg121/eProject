import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, 
  Leaf, Package, Beaker, Thermometer, AlertCircle,
  CheckCircle, X, Save, Upload, Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/UI/Card';
import { publicService } from '../../services/api.ts';

interface Essential {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  material: string;
  careInstructions: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  phLevel: string;
  nutrients: string;
  usage: string;
  createdAt: string;
  updatedAt: string;
}

const AdminEssentials: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [essentials, setEssentials] = useState<Essential[]>([
    {
      id: '1',
      name: 'Organic Compost',
      description: 'Rich organic compost for healthy plant growth',
      type: 'Soil Amendment',
      size: '40lb bag',
      material: 'Organic matter',
      careInstructions: 'Store in dry place, mix with existing soil',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      status: 'active',
      phLevel: '6.5-7.0',
      nutrients: 'High in NPK',
      usage: 'Mix 1:3 ratio with garden soil',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Premium Potting Mix',
      description: 'Well-draining potting mix for container plants',
      type: 'Growing Medium',
      size: '20lb bag',
      material: 'Peat moss, perlite, vermiculite',
      careInstructions: 'Keep moist but not waterlogged',
      imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
      status: 'active',
      phLevel: '6.0-6.8',
      nutrients: 'Balanced NPK',
      usage: 'Use directly for potted plants',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEssential, setEditingEssential] = useState<Essential | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 20;

  const types = ['Soil Amendment', 'Growing Medium', 'Fertilizer', 'Seeds', 'Plant Food'];

  const filteredEssentials = essentials.filter(essential => {
    const matchesSearch = essential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         essential.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         essential.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || essential.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || essential.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEssentials.length / itemsPerPage);
  const paginatedEssentials = filteredEssentials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingEssential(null);
    setIsModalOpen(true);
  };

  const handleEdit = (essential: Essential) => {
    setEditingEssential(essential);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await publicService.deleteItem(id, 'essentials');
      setEssentials(essentials.filter(essential => essential.id !== id));
      setShowDeleteConfirm(null);
      console.log('Essential deleted successfully');
    } catch (error) {
      console.error('Error deleting essential:', error);
      alert('Failed to delete essential. Please try again.');
    }
  };

  const handleSave = async (formData: Partial<Essential>) => {
    try {
      if (editingEssential) {
        // Update existing essential
        await publicService.updateItem(editingEssential.id, formData, 'essentials');
        setEssentials(essentials.map(essential =>
          essential.id === editingEssential.id
            ? { ...essential, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : essential
        ));
        console.log('Essential updated successfully');
      } else {
        // Create new essential
        const newEssential = await publicService.createItem(formData, 'essentials');
        setEssentials([newEssential, ...essentials]);
        console.log('Essential created successfully');
      }
      setIsModalOpen(false);
      setEditingEssential(null);
    } catch (error) {
      console.error('Error saving essential:', error);
      alert('Failed to save essential. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Essentials Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening essentials, soil, fertilizers, and growing mediums
          </p>
        </div>
        <motion.button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Essential</span>
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
              placeholder="Search essentials..."
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
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
            Total: {filteredEssentials.length} items
          </div>
        </div>
      </Card>

      {/* Essentials Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Essential
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Size/Material
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  pH Level
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
              {paginatedEssentials.map((essential) => (
                <motion.tr
                  key={essential.id}
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
                        src={essential.imageUrl}
                        alt={essential.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {essential.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {essential.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {essential.type}
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div>
                      <p className="font-medium">{essential.size}</p>
                      <p className="text-sm">{essential.material}</p>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                      <Beaker className="h-4 w-4" />
                      <span>{essential.phLevel}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      essential.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {essential.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleEdit(essential)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => setShowDeleteConfirm(essential.id)}
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
          <EssentialModal
            essential={editingEssential}
            types={types}
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
                Are you sure you want to delete this essential? This action cannot be undone.
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

// Essential Modal Component
interface EssentialModalProps {
  essential: Essential | null;
  types: string[];
  onSave: (data: Partial<Essential>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const EssentialModal: React.FC<EssentialModalProps> = ({ essential, types, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<Essential>>(
    essential || {
      name: '',
      description: '',
      type: types[0] || '',
      size: '',
      material: '',
      careInstructions: '',
      imageUrl: '',
      status: 'active',
      phLevel: '',
      nutrients: '',
      usage: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.size?.trim()) newErrors.size = 'Size is required';
    if (!formData.material?.trim()) newErrors.material = 'Material is required';
    
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
            {essential ? 'Edit Essential' : 'Add New Essential'}
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
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter essential name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Type *</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={`${inputClass} ${errors.type ? 'border-red-500' : ''}`}
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className={labelClass}>Size *</label>
              <input
                type="text"
                value={formData.size || ''}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className={`${inputClass} ${errors.size ? 'border-red-500' : ''}`}
                placeholder="e.g., 40lb bag, 1 gallon"
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className={labelClass}>Material *</label>
              <input
                type="text"
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className={`${inputClass} ${errors.material ? 'border-red-500' : ''}`}
                placeholder="e.g., Organic matter, Peat moss"
              />
              {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
            </div>

            <div>
              <label className={labelClass}>pH Level</label>
              <input
                type="text"
                value={formData.phLevel || ''}
                onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
                className={inputClass}
                placeholder="e.g., 6.0-7.0"
              />
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
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${inputClass} h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter detailed description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className={labelClass}>Care Instructions</label>
            <textarea
              value={formData.careInstructions || ''}
              onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
              className={`${inputClass} h-24 resize-none`}
              placeholder="Enter care and usage instructions"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nutrients</label>
              <input
                type="text"
                value={formData.nutrients || ''}
                onChange={(e) => setFormData({ ...formData, nutrients: e.target.value })}
                className={inputClass}
                placeholder="e.g., High in NPK, Balanced"
              />
            </div>

            <div>
              <label className={labelClass}>Usage Instructions</label>
              <input
                type="text"
                value={formData.usage || ''}
                onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                className={inputClass}
                placeholder="e.g., Mix 1:3 ratio with soil"
              />
            </div>
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
              <span>{essential ? 'Update Essential' : 'Create Essential'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminEssentials;