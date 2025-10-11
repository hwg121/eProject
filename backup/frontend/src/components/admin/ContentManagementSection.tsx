import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentList from './ContentList';
import ContentCreate from './ContentCreate';
import ContentEdit from './ContentEdit';
import { ContentItem } from '../../types/admin';

interface ContentManagementSectionProps {
  activeTab: string;
  contentData: ContentItem[];
  categories: {[key: string]: string[]};
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  isDarkMode: boolean;
  editingItem: ContentItem | null;
  onSearchTermChange: (term: string) => void;
  onSelectedCategoryChange: (category: string) => void;
  onSortByChange: (sortBy: string) => void;
  onEdit: (item: ContentItem, type?: string) => void;
  onDelete: (id: string, type: string) => void;
  onView: (item: ContentItem) => void;
  onCreate: (data: Partial<ContentItem>) => void;
}

const ContentManagementSection: React.FC<ContentManagementSectionProps> = ({
  activeTab,
  contentData,
  categories,
  searchTerm,
  selectedCategory,
  sortBy,
  isDarkMode,
  editingItem,
  onSearchTermChange,
  onSelectedCategoryChange,
  onSortByChange,
  onEdit,
  onDelete,
  onView,
  onCreate
}) => {

  const handleEditClick = (content: ContentItem) => {
    // Call parent onEdit to set the editing state and switch tab
    // Determine type based on content category
    const type = content.category?.toLowerCase() === 'technique' ? 'articles' : 'videos';
    onEdit(content, type);
  };

  const handleEditSave = (data: Partial<ContentItem>) => {
    // Call parent onCreate to save the edited data
    onCreate(data);
  };

  const handleEditCancel = () => {
    // Switch back to content-list tab
    onEdit(null as any, 'content-list');
  };

  const handleCreateSave = (data: Partial<ContentItem>) => {
    onCreate(data);
  };

  const handleCreateCancel = () => {
    // This will be handled by parent component
  };

  return (
    <div className="space-y-6">
      {/* Render based on activeTab */}
      {activeTab === 'content-list' && (
        <ContentList
          contentData={contentData}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={onSearchTermChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={onSelectedCategoryChange}
          sortBy={sortBy}
          setSortBy={onSortByChange}
          onEdit={handleEditClick}
          onDelete={onDelete}
          onView={onView}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === 'content-create' && (
        <ContentCreate
          categories={categories}
          onSave={handleCreateSave}
          onCancel={handleCreateCancel}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === 'content-edit' && editingItem && (
        <ContentEdit
          content={editingItem}
          categories={categories}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default ContentManagementSection;