import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, 
  Lightbulb, DollarSign, Star, Package, AlertCircle,
  CheckCircle, X, Save, Upload, Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/UI/Card';
import { publicService } from '../../services/api.ts';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  materials: string;
  steps: string;
  imageUrl: string;
  featured: boolean;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const AdminSuggestions: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Load suggestions from database
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicService.getSuggestions();
        setSuggestions(data);
      } catch (err) {
        setError('Failed to load suggestions');
        console.error('Error loading suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  const categories = [
    'all', 'planting', 'watering', 'pruning', 'fertilizing', 'pest-control', 'harvesting', 'seasonal'
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const statuses = ['all', 'published', 'draft'];

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || suggestion.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'all' || suggestion.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const paginatedSuggestions = filteredSuggestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);

  const handleCreate = () => {
    setEditingSuggestion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (suggestion: Suggestion) => {
    setEditingSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await publicService.deleteItem(id, 'suggestions');
      setSuggestions(suggestions.filter(suggestion => suggestion.id !== id));
      setShowDeleteConfirm(null);
      console.log('Suggestion deleted successfully');
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      alert('Failed to delete suggestion. Please try again.');
    }
  };

  const handleSave = async (formData: Partial<Suggestion>) => {
    try {
      if (editingSuggestion) {
        // Update existing suggestion
        await publicService.updateItem(editingSuggestion.id, formData, 'suggestions');
        setSuggestions(suggestions.map(suggestion =>
          suggestion.id === editingSuggestion.id
            ? { ...suggestion, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : suggestion
        ));
        console.log('Suggestion updated successfully');
      } else {
        // Create new suggestion
        const newSuggestion = await publicService.createItem(formData, 'suggestions');
        setSuggestions([newSuggestion, ...suggestions]);
        console.log('Suggestion created successfully');
      }
      setIsModalOpen(false);
      setEditingSuggestion(null);
    } catch (error) {
      console.error('Error saving suggestion:', error);
      alert('Failed to save suggestion. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-xl text-emerald-600">Loading suggestions...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center p-8 bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Suggestions</h1>
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
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
            Suggestions Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage gardening tips, suggestions, and how-to guides
          </p>
        </div>
        <motion.button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Suggestion</span>
        </motion.button>
      </div>

      {/* Filters */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search suggestions..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Suggestions List */}
      <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Suggestion
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Time
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSuggestions.map((suggestion) => (
                <motion.tr
                  key={suggestion.id}
                  className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
                  whileHover={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)' }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {suggestion.imageUrl ? (
                          <img
                            src={suggestion.imageUrl}
                            alt={suggestion.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Lightbulb className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {suggestion.title}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>
                          {suggestion.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {suggestion.views} views
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {suggestion.likes} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {suggestion.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800'
                        : suggestion.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {suggestion.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {suggestion.estimatedTime}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {suggestion.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleEdit(suggestion)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => setShowDeleteConfirm(suggestion.id)}
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSuggestions.length)} of {filteredSuggestions.length} suggestions
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirm Delete
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete this suggestion? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
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

export default AdminSuggestions;
