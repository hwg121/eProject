import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, 
  FileText, Image as ImageIcon, Type, Layout, AlertCircle,
  CheckCircle, X, Save, Upload, Move, GripVertical
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/UI/Card';
import ImageUpload from '../../components/ImageUpload';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'heading' | 'list' | 'quote';
  content: string;
  imageUrl?: string;
  order: number;
  status: 'active' | 'inactive';
}

interface AboutPage {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  heroImage: string;
  contentBlocks: ContentBlock[];
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const AdminAbout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [aboutPages, setAboutPages] = useState<AboutPage[]>([
    {
      id: '1',
      title: 'About Green Groves',
      slug: 'about-green-groves',
      metaDescription: 'Learn about Green Groves - your trusted gardening companion',
      heroImage: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      contentBlocks: [
        {
          id: '1',
          type: 'heading',
          content: 'Our Mission',
          order: 1,
          status: 'active'
        },
        {
          id: '2',
          type: 'text',
          content: 'At Green Groves, we believe that everyone deserves to experience the joy and satisfaction of gardening. Our mission is to provide comprehensive, accessible, and inspiring resources that help gardeners of all levels create thriving, beautiful spaces.',
          order: 2,
          status: 'active'
        },
        {
          id: '3',
          type: 'image',
          content: 'Our beautiful garden center',
          imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
          order: 3,
          status: 'active'
        }
      ],
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<AboutPage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [selectedPageForBlocks, setSelectedPageForBlocks] = useState<string | null>(null);
  const itemsPerPage = 20;

  const filteredPages = aboutPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const paginatedPages = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingPage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (page: AboutPage) => {
    setEditingPage(page);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAboutPages(aboutPages.filter(page => page.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSave = (formData: Partial<AboutPage>) => {
    if (editingPage) {
      setAboutPages(aboutPages.map(page =>
        page.id === editingPage.id
          ? { ...page, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : page
      ));
    } else {
      const newPage: AboutPage = {
        id: Date.now().toString(),
        ...formData as AboutPage,
        contentBlocks: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setAboutPages([...aboutPages, newPage]);
    }
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleManageBlocks = (pageId: string) => {
    setSelectedPageForBlocks(pageId);
  };

  const handleAddBlock = (pageId: string) => {
    setSelectedPageForBlocks(pageId);
    setEditingBlock(null);
    setIsBlockModalOpen(true);
  };

  const handleEditBlock = (pageId: string, block: ContentBlock) => {
    setSelectedPageForBlocks(pageId);
    setEditingBlock(block);
    setIsBlockModalOpen(true);
  };

  const handleSaveBlock = (blockData: Partial<ContentBlock>) => {
    if (!selectedPageForBlocks) return;

    setAboutPages(aboutPages.map(page => {
      if (page.id === selectedPageForBlocks) {
        if (editingBlock) {
          // Update existing block
          return {
            ...page,
            contentBlocks: page.contentBlocks.map(block =>
              block.id === editingBlock.id ? { ...block, ...blockData } : block
            ),
            updatedAt: new Date().toISOString().split('T')[0]
          };
        } else {
          // Add new block
          const newBlock: ContentBlock = {
            id: Date.now().toString(),
            ...blockData as ContentBlock,
            order: page.contentBlocks.length + 1
          };
          return {
            ...page,
            contentBlocks: [...page.contentBlocks, newBlock],
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
      }
      return page;
    }));

    setIsBlockModalOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (pageId: string, blockId: string) => {
    setAboutPages(aboutPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          contentBlocks: page.contentBlocks.filter(block => block.id !== blockId),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return page;
    }));
  };

  const moveBlock = (pageId: string, blockId: string, direction: 'up' | 'down') => {
    setAboutPages(aboutPages.map(page => {
      if (page.id === pageId) {
        const blocks = [...page.contentBlocks];
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        
        if (blockIndex === -1) return page;
        
        const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
        
        if (newIndex < 0 || newIndex >= blocks.length) return page;
        
        // Swap blocks
        [blocks[blockIndex], blocks[newIndex]] = [blocks[newIndex], blocks[blockIndex]];
        
        // Update order
        blocks.forEach((block, index) => {
          block.order = index + 1;
        });
        
        return {
          ...page,
          contentBlocks: blocks,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return page;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            About Pages Management
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage about pages and content blocks
          </p>
        </div>
        <motion.button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Page</span>
        </motion.button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search pages..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
            Total: {filteredPages.length} pages
          </div>
        </div>
      </Card>

      {/* Pages List */}
      <div className="space-y-4">
        {paginatedPages.map((page) => (
          <Card key={page.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <img
                  src={page.heroImage}
                  alt={page.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {page.title}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Slug: /{page.slug}
                  </p>
                  <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {page.metaDescription}
                  </p>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {page.contentBlocks.length} content blocks • Updated: {page.updatedAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => handleManageBlocks(page.id)}
                  className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Manage Content Blocks"
                >
                  <Layout className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={() => handleEdit(page)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(page.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Content Blocks Management */}
            {selectedPageForBlocks === page.id && (
              <motion.div
                className="mt-6 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Content Blocks
                  </h4>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleAddBlock(page.id)}
                      className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Block</span>
                    </motion.button>
                    <button
                      onClick={() => setSelectedPageForBlocks(null)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {page.contentBlocks
                    .sort((a, b) => a.order - b.order)
                    .map((block, index) => (
                    <div
                      key={block.id}
                      className={`p-4 border rounded-lg ${
                        isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => moveBlock(page.id, block.id, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded ${
                                index === 0 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              ↑
                            </button>
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <button
                              onClick={() => moveBlock(page.id, block.id, 'down')}
                              disabled={index === page.contentBlocks.length - 1}
                              className={`p-1 rounded ${
                                index === page.contentBlocks.length - 1
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              ↓
                            </button>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                block.type === 'heading' ? 'bg-blue-100 text-blue-800' :
                                block.type === 'text' ? 'bg-green-100 text-green-800' :
                                block.type === 'image' ? 'bg-purple-100 text-purple-800' :
                                block.type === 'list' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {block.type}
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Order: {block.order}
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {block.type === 'image' && block.imageUrl ? (
                                <span>Image: {block.content}</span>
                              ) : (
                                block.content.substring(0, 100) + (block.content.length > 100 ? '...' : '')
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEditBlock(page.id, block)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="h-3 w-3" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteBlock(page.id, block.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {page.contentBlocks.length === 0 && (
                    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No content blocks yet. Add your first block to get started.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </Card>
        ))}
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

      {/* Page Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AboutPageModal
            page={editingPage}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* Content Block Modal */}
      <AnimatePresence>
        {isBlockModalOpen && (
          <ContentBlockModal
            block={editingBlock}
            onSave={handleSaveBlock}
            onCancel={() => setIsBlockModalOpen(false)}
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
                Are you sure you want to delete this page? This action cannot be undone.
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

// About Page Modal Component
interface AboutPageModalProps {
  page: AboutPage | null;
  onSave: (data: Partial<AboutPage>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const AboutPageModal: React.FC<AboutPageModalProps> = ({ page, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<AboutPage>>(
    page || {
      title: '',
      slug: '',
      metaDescription: '',
      heroImage: '',
      status: 'draft'
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.slug?.trim()) newErrors.slug = 'Slug is required';
    if (!formData.metaDescription?.trim()) newErrors.metaDescription = 'Meta description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {page ? 'Edit About Page' : 'Create About Page'}
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Page Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ 
                  ...formData, 
                  title,
                  slug: formData.slug || generateSlug(title)
                });
              }}
              className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter page title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>URL Slug *</label>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={`${inputClass} ${errors.slug ? 'border-red-500' : ''}`}
              placeholder="url-friendly-slug"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              URL will be: /about/{formData.slug}
            </p>
          </div>

          <div>
            <label className={labelClass}>Meta Description *</label>
            <textarea
              value={formData.metaDescription || ''}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className={`${inputClass} h-24 resize-none ${errors.metaDescription ? 'border-red-500' : ''}`}
              placeholder="Brief description for search engines (150-160 characters)"
              maxLength={160}
            />
            {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription}</p>}
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {(formData.metaDescription || '').length}/160 characters
            </p>
          </div>

          <div>
            <label className={labelClass}>Hero Image</label>
            <ImageUpload
              value={formData.heroImage || ''}
              onChange={(url) => setFormData({ ...formData, heroImage: url })}
              onError={(error) => alert(error)}
              className="mt-1"
              placeholder="Upload hero image"
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={formData.status || 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
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
              <span>{page ? 'Update Page' : 'Create Page'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Content Block Modal Component
interface ContentBlockModalProps {
  block: ContentBlock | null;
  onSave: (data: Partial<ContentBlock>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ContentBlockModal: React.FC<ContentBlockModalProps> = ({ block, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<ContentBlock>>(
    block || {
      type: 'text',
      content: '',
      imageUrl: '',
      status: 'active'
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.content?.trim()) newErrors.content = 'Content is required';
    if (formData.type === 'image' && !formData.imageUrl?.trim()) {
      newErrors.imageUrl = 'Image URL is required for image blocks';
    }
    
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
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {block ? 'Edit Content Block' : 'Add Content Block'}
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Block Type</label>
            <select
              value={formData.type || 'text'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentBlock['type'] })}
              className={inputClass}
            >
              <option value="text">Text Paragraph</option>
              <option value="heading">Heading</option>
              <option value="image">Image</option>
              <option value="list">List</option>
              <option value="quote">Quote</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {formData.type === 'image' ? 'Image Caption/Alt Text *' : 'Content *'}
            </label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={`${inputClass} ${formData.type === 'heading' ? 'h-20' : 'h-32'} resize-none ${errors.content ? 'border-red-500' : ''}`}
              placeholder={
                formData.type === 'heading' ? 'Enter heading text' :
                formData.type === 'image' ? 'Enter image caption or alt text' :
                formData.type === 'list' ? 'Enter list items (one per line)' :
                formData.type === 'quote' ? 'Enter quote text' :
                'Enter paragraph content'
              }
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {formData.type === 'image' && (
            <div>
              <label className={labelClass}>Image *</label>
              <ImageUpload
                value={formData.imageUrl || ''}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onError={(error) => alert(error)}
                className="mt-1"
                placeholder="Upload image"
              />
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
            </div>
          )}

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
              <span>{block ? 'Update Block' : 'Create Block'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminAbout;