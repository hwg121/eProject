import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Tool } from '../../types/content';
import { initialTools } from '../../data/initialData';
import Card from '../../components/UI/Card';
import ContentTable from '../../components/Admin/ContentTable';
import ContentForm from '../../components/Admin/ContentForm';

const AdminTools: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { items, create, update, remove } = useContent<Tool>('tools', initialTools);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tool | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formFields = [
    { name: 'title', label: 'Tool Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, rows: 3 },
    { name: 'brand', label: 'Brand', type: 'text' as const, required: true },
    { name: 'model', label: 'Model', type: 'text' as const, required: true },
    { name: 'category', label: 'Category', type: 'select' as const, required: true, 
      options: ['Cutting Tools', 'Digging Tools', 'Watering Tools', 'Pruning Tools', 'Hand Tools', 'Power Tools'] },
    { name: 'price', label: 'Price ($)', type: 'number' as const, required: true },
    { name: 'specifications', label: 'Specifications', type: 'textarea' as const, required: true, rows: 4 },
    { name: 'usage', label: 'Usage Instructions', type: 'textarea' as const, required: true, rows: 4 },
    { name: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true },
    { name: 'imageUrl', label: 'Image URL', type: 'url' as const },
    { name: 'buyLink', label: 'Buy Link', type: 'url' as const },
    { name: 'inStock', label: 'In Stock', type: 'checkbox' as const },
    { name: 'status', label: 'Status', type: 'select' as const, options: ['published', 'draft'] },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const }
  ];

  const tableColumns = [
    {
      key: 'title',
      label: 'Tool',
      render: (item: Tool) => (
        <div className="flex items-center space-x-3">
          <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500">{item.brand} - {item.model}</p>
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      render: (item: Tool) => (
        <span className="font-semibold text-emerald-600">${item.price}</span>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (item: Tool) => (
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">★</span>
          <span>{item.rating}</span>
        </div>
      )
    },
    {
      key: 'inStock',
      label: 'Stock',
      render: (item: Tool) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Tool) => (
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

  const handleEdit = (item: Tool) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      remove(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Tools Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening tools and equipment
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
          <span>Add Tool</span>
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
              placeholder="Search tools..."
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
          getDetailLink={(id) => `/tools/${id}`}
        />
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <ContentForm
            type="tool"
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

export default AdminTools;