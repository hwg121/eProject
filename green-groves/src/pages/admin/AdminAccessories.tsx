import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Accessory } from '../../types/content';
import { initialAccessories } from '../../data/initialData';
import Card from '../../components/UI/Card';
import ContentTable from '../../components/Admin/ContentTable';
import ContentForm from '../../components/Admin/ContentForm';

const AdminAccessories: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { items, create, update, remove } = useContent<Accessory>('accessories', initialAccessories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Accessory | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formFields = [
    { name: 'title', label: 'Accessory Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, rows: 3 },
    { name: 'category', label: 'Category', type: 'select' as const, required: true, 
      options: ['Lighting', 'Decoration', 'Support', 'Watering', 'Storage', 'Protection'] },
    { name: 'type', label: 'Type', type: 'select' as const, required: true,
      options: ['Decorative', 'Functional', 'Seasonal', 'Smart', 'Traditional'] },
    { name: 'material', label: 'Material', type: 'text' as const, required: true },
    { name: 'size', label: 'Size', type: 'text' as const, required: true },
    { name: 'color', label: 'Color', type: 'text' as const, required: true },
    { name: 'price', label: 'Price ($)', type: 'number' as const, required: true },
    { name: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true },
    { name: 'specifications', label: 'Specifications', type: 'textarea' as const, required: true, rows: 4 },
    { name: 'imageUrl', label: 'Image URL', type: 'url' as const },
    { name: 'isDecorative', label: 'Is Decorative', type: 'checkbox' as const },
    { name: 'weatherResistant', label: 'Weather Resistant', type: 'checkbox' as const },
    { name: 'status', label: 'Status', type: 'select' as const, options: ['published', 'draft'] },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const }
  ];

  const tableColumns = [
    {
      key: 'title',
      label: 'Accessory',
      render: (item: Accessory) => (
        <div className="flex items-center space-x-3">
          <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500">{item.category} - {item.type}</p>
          </div>
        </div>
      )
    },
    { key: 'material', label: 'Material' },
    { key: 'size', label: 'Size' },
    {
      key: 'price',
      label: 'Price',
      render: (item: Accessory) => (
        <span className="font-semibold text-emerald-600">${item.price}</span>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (item: Accessory) => (
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">★</span>
          <span>{item.rating}</span>
        </div>
      )
    },
    {
      key: 'weatherResistant',
      label: 'Weather Resistant',
      render: (item: Accessory) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.weatherResistant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.weatherResistant ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Accessory) => (
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

  const handleEdit = (item: Accessory) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      remove(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Accessories Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening accessories and decorative items
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
          <span>Add Accessory</span>
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
              placeholder="Search accessories..."
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
          getDetailLink={(id) => `/accessories/${id}`}
        />
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <ContentForm
            type="accessory"
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

export default AdminAccessories;