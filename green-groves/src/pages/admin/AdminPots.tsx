import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Pot } from '../../types/content';
import { initialPots } from '../../data/initialData';
import Card from '../../components/UI/Card';
import ContentTable from '../../components/Admin/ContentTable';
import ContentForm from '../../components/Admin/ContentForm';

const AdminPots: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { items, create, update, remove } = useContent<Pot>('pots', initialPots);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pot | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formFields = [
    { name: 'title', label: 'Pot Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, rows: 3 },
    { name: 'material', label: 'Material', type: 'select' as const, required: true, 
      options: ['Ceramic', 'Plastic', 'Terracotta', 'Metal', 'Wood', 'Fiberglass', 'Concrete'] },
    { name: 'size', label: 'Size', type: 'text' as const, required: true, placeholder: 'e.g., 12 inches diameter' },
    { name: 'color', label: 'Color', type: 'text' as const, required: true },
    { name: 'shape', label: 'Shape', type: 'select' as const, required: true,
      options: ['Round', 'Square', 'Rectangular', 'Oval', 'Hexagonal', 'Decorative'] },
    { name: 'capacity', label: 'Capacity', type: 'text' as const, required: true, placeholder: 'e.g., 2 gallons' },
    { name: 'weight', label: 'Weight', type: 'text' as const, required: true, placeholder: 'e.g., 3.5 lbs' },
    { name: 'price', label: 'Price ($)', type: 'number' as const, required: true },
    { name: 'durability', label: 'Durability', type: 'text' as const, required: true, placeholder: 'e.g., 10+ years' },
    { name: 'careInstructions', label: 'Care Instructions', type: 'textarea' as const, required: true, rows: 3 },
    { name: 'imageUrl', label: 'Image URL', type: 'url' as const },
    { name: 'drainageHoles', label: 'Has Drainage Holes', type: 'checkbox' as const },
    { name: 'status', label: 'Status', type: 'select' as const, options: ['published', 'draft'] },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const }
  ];

  const tableColumns = [
    {
      key: 'title',
      label: 'Pot',
      render: (item: Pot) => (
        <div className="flex items-center space-x-3">
          <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500">{item.material} - {item.shape}</p>
          </div>
        </div>
      )
    },
    { key: 'size', label: 'Size' },
    { key: 'color', label: 'Color' },
    {
      key: 'price',
      label: 'Price',
      render: (item: Pot) => (
        <span className="font-semibold text-emerald-600">${item.price}</span>
      )
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (item: Pot) => (
        <span className="text-sm">{item.capacity}</span>
      )
    },
    {
      key: 'drainageHoles',
      label: 'Drainage',
      render: (item: Pot) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.drainageHoles ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.drainageHoles ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Pot) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
      )
    }
  ];

  const handleSave = (formData: any) => {
    if (editingItem) {
      update(editingItem.id, formData);
    } else {
      create(formData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Pot) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this pot?')) {
      remove(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Pots Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening pots and containers
          </p>
        </div>
        <motion.button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Pot</span>
        </motion.button>
      </div>

      <Card>
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search pots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        <ContentTable
          items={filteredItems}
          columns={tableColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getDetailLink={(id) => `/pots/${id}`}
        />
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <ContentForm
            type="pot"
            item={editingItem}
            fields={formFields}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPots;