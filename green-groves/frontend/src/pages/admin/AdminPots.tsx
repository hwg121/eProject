import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, 
  Package, Ruler, Palette, Droplets, AlertCircle,
  CheckCircle, X, Save, Upload, Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/UI/Card';

interface Pot {
  id: string;
  name: string;
  description: string;
  material: string;
  size: string;
  color: string;
  shape: string;
  drainageHoles: boolean;
  capacity: string;
  careInstructions: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  price: number;
  weight: string;
  durability: string;
  createdAt: string;
  updatedAt: string;
}

const AdminPots: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [pots, setPots] = useState<Pot[]>([
    {
      id: '1',
      name: 'Ceramic Garden Pot',
      description: 'Beautiful ceramic pot perfect for indoor and outdoor plants',
      material: 'Ceramic',
      size: '12 inches',
      color: 'Terracotta',
      shape: 'Round',
      drainageHoles: true,
      capacity: '2 gallons',
      careInstructions: 'Clean with mild soap, protect from freezing',
      imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      status: 'active',
      price: 24.99,
      weight: '3.5 lbs',
      durability: '10+ years',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Plastic Planter Set',
      description: 'Lightweight plastic planters ideal for herbs and small plants',
      material: 'Plastic',
      size: '8 inches',
      color: 'Green',
      shape: 'Square',
      drainageHoles: true,
      capacity: '1 gallon',
      careInstructions: 'UV resistant, easy to clean with water',
      imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
      status: 'active',
      price: 12.99,
      weight: '0.8 lbs',
      durability: '5-7 years',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPot, setEditingPot] = useState<Pot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 20;

  const materials = ['Ceramic', 'Plastic', 'Terracotta', 'Metal', 'Wood', 'Fiberglass'];
  const shapes = ['Round', 'Square', 'Rectangular', 'Oval', 'Hexagonal'];
  const colors = ['Terracotta', 'White', 'Black', 'Green', 'Brown', 'Gray', 'Blue', 'Red'];

  const filteredPots = pots.filter(pot => {
    const matchesSearch = pot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pot.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = selectedMaterial === 'all' || pot.material === selectedMaterial;
    const matchesStatus = selectedStatus === 'all' || pot.status === selectedStatus;
    return matchesSearch && matchesMaterial && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPots.length / itemsPerPage);
  const paginatedPots = filteredPots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingPot(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pot: Pot) => {
    setEditingPot(pot);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await publicService.deleteItem(id, 'pots');
      setPots(pots.filter(pot => pot.id !== id));
      setShowDeleteConfirm(null);
      console.log('Pot deleted successfully');
    } catch (error) {
      console.error('Error deleting pot:', error);
      alert('Failed to delete pot. Please try again.');
    }
  };

  const handleSave = async (formData: Partial<Pot>) => {
    try {
      if (editingPot) {
        // Update existing pot
        await publicService.updateItem(editingPot.id, formData, 'pots');
        setPots(pots.map(pot =>
          pot.id === editingPot.id
            ? { ...pot, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : pot
        ));
        console.log('Pot updated successfully');
      } else {
        // Create new pot
        const newPot = await publicService.createItem(formData, 'pots');
        setPots([newPot, ...pots]);
        console.log('Pot created successfully');
      }
      setIsModalOpen(false);
      setEditingPot(null);
    } catch (error) {
      console.error('Error saving pot:', error);
      alert('Failed to save pot. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Pots & Containers Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage plant pots, containers, and planters inventory
          </p>
        </div>
        <motion.button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Pot</span>
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
              placeholder="Search pots..."
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
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Materials</option>
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
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
            Total: {filteredPots.length} pots
          </div>
        </div>
      </Card>

      {/* Pots Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pot
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Material/Size
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Color/Shape
                </th>
                <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Capacity
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
              {paginatedPots.map((pot) => (
                <motion.tr
                  key={pot.id}
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
                        src={pot.imageUrl}
                        alt={pot.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {pot.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {pot.description.substring(0, 40)}...
                        </p>
                        {pot.drainageHoles && (
                          <div className="flex items-center mt-1">
                            <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs text-blue-600">Drainage</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div>
                      <p className="font-medium">{pot.material}</p>
                      <p className="text-sm flex items-center">
                        <Ruler className="h-3 w-3 mr-1" />
                        {pot.size}
                      </p>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div>
                      <p className="font-medium flex items-center">
                        <Palette className="h-3 w-3 mr-1" />
                        {pot.color}
                      </p>
                      <p className="text-sm">{pot.shape}</p>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{pot.capacity}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-semibold">${pot.price}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      pot.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pot.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleEdit(pot)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => setShowDeleteConfirm(pot.id)}
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
          <PotModal
            pot={editingPot}
            materials={materials}
            shapes={shapes}
            colors={colors}
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
                Are you sure you want to delete this pot? This action cannot be undone.
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

// Pot Modal Component
interface PotModalProps {
  pot: Pot | null;
  materials: string[];
  shapes: string[];
  colors: string[];
  onSave: (data: Partial<Pot>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const PotModal: React.FC<PotModalProps> = ({ pot, materials, shapes, colors, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<Pot>>(
    pot || {
      name: '',
      description: '',
      material: materials[0] || '',
      size: '',
      color: colors[0] || '',
      shape: shapes[0] || '',
      drainageHoles: true,
      capacity: '',
      careInstructions: '',
      imageUrl: '',
      status: 'active',
      price: 0,
      weight: '',
      durability: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.material) newErrors.material = 'Material is required';
    if (!formData.size?.trim()) newErrors.size = 'Size is required';
    if (!formData.capacity?.trim()) newErrors.capacity = 'Capacity is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    
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
            {pot ? 'Edit Pot' : 'Add New Pot'}
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
              <label className={labelClass}>Pot Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter pot name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Material *</label>
              <select
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className={`${inputClass} ${errors.material ? 'border-red-500' : ''}`}
              >
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
            </div>

            <div>
              <label className={labelClass}>Size *</label>
              <input
                type="text"
                value={formData.size || ''}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className={`${inputClass} ${errors.size ? 'border-red-500' : ''}`}
                placeholder="e.g., 12 inches, 30cm"
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className={labelClass}>Color</label>
              <select
                value={formData.color || ''}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className={inputClass}
              >
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Shape</label>
              <select
                value={formData.shape || ''}
                onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                className={inputClass}
              >
                {shapes.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Capacity *</label>
              <input
                type="text"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className={`${inputClass} ${errors.capacity ? 'border-red-500' : ''}`}
                placeholder="e.g., 2 gallons, 8 liters"
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
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
              <label className={labelClass}>Weight</label>
              <input
                type="text"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className={inputClass}
                placeholder="e.g., 3.5 lbs, 1.6 kg"
              />
            </div>

            <div>
              <label className={labelClass}>Durability</label>
              <input
                type="text"
                value={formData.durability || ''}
                onChange={(e) => setFormData({ ...formData, durability: e.target.value })}
                className={inputClass}
                placeholder="e.g., 10+ years, 5-7 years"
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

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="drainageHoles"
                checked={formData.drainageHoles || false}
                onChange={(e) => setFormData({ ...formData, drainageHoles: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="drainageHoles" className={labelClass.replace('block', 'inline')}>
                Has Drainage Holes
              </label>
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
              placeholder="Enter care and maintenance instructions"
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
              <span>{pot ? 'Update Pot' : 'Create Pot'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminPots;