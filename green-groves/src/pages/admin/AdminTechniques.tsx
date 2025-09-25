import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Technique } from '../../types/content';
import { initialTechniques } from '../../data/initialData';
import Card from '../../components/UI/Card';
import ContentTable from '../../components/Admin/ContentTable';
import ContentForm from '../../components/Admin/ContentForm';

const AdminTechniques: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { items, create, update, remove } = useContent<Technique>('techniques', initialTechniques);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Technique | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formFields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, rows: 3 },
    { name: 'author', label: 'Author', type: 'text' as const, required: true },
    { name: 'category', label: 'Category', type: 'select' as const, required: true, 
      options: ['Beginner', 'Intermediate', 'Advanced', 'Seasonal', 'Indoor', 'Outdoor'] },
    { name: 'difficulty', label: 'Difficulty', type: 'select' as const, required: true,
      options: ['beginner', 'intermediate', 'advanced'] },
    { name: 'content', label: 'Content', type: 'textarea' as const, required: true, rows: 6 },
    { name: 'estimatedTime', label: 'Estimated Time', type: 'text' as const },
    { name: 'imageUrl', label: 'Image URL', type: 'url' as const },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text' as const },
    { name: 'materials', label: 'Materials (comma-separated)', type: 'text' as const },
    { name: 'steps', label: 'Steps (comma-separated)', type: 'textarea' as const, rows: 4 },
    { name: 'status', label: 'Status', type: 'select' as const, options: ['published', 'draft'] },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const }
  ];

  const tableColumns = [
    {
      key: 'title',
      label: 'Title',
      render: (item: Technique) => (
        <div className="flex items-center space-x-3">
          <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        </div>
      )
    },
    { key: 'author', label: 'Author' },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (item: Technique) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
          item.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.difficulty}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Technique) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
      )
    }
  ];

  const handleSave = (formData: any) => {
    const processedData = {
      ...formData,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((t: string) => t.trim()) : formData.tags || [],
      materials: typeof formData.materials === 'string' ? formData.materials.split(',').map((m: string) => m.trim()) : formData.materials || [],
      steps: typeof formData.steps === 'string' ? formData.steps.split(',').map((s: string) => s.trim()) : formData.steps || []
    };

    if (editingItem) {
      update(editingItem.id, processedData);
    } else {
      create(processedData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Technique) => {
    setEditingItem({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      materials: Array.isArray(item.materials) ? item.materials?.join(', ') : item.materials,
      steps: Array.isArray(item.steps) ? item.steps?.join(', ') : item.steps
    } as any);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technique?')) {
      remove(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Techniques Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening techniques and guides
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
          <span>Add Technique</span>
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
              placeholder="Search techniques..."
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
          getDetailLink={(id) => `/techniques/${id}`}
        />
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <ContentForm
            type="technique"
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

export default AdminTechniques;