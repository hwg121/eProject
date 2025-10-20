import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentList from './ContentList';
import ContentCreate from './ContentCreate';
import ContentEdit from './ContentEdit';
import { ContentItem } from '../../types/admin';
import { ViewButton, EditButton, DeleteButton } from '../ui/ContentIcons';

interface ContentManagementSectionProps {
  activeTab: string;
  contentData: ContentItem[];
  categories: {[key: string]: string[]};
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  isDarkMode: boolean;
  editingItem: ContentItem | null;
  currentContentType?: string; // Add currentContentType prop
  onSearchTermChange: (term: string) => void;
  onSelectedCategoryChange: (category: string) => void;
  onSortByChange: (sortBy: string) => void;
  onEdit: (item: ContentItem, type?: string) => void;
  onDelete: (id: string, type: string) => void;
  onView: (item: ContentItem) => void;
  onCreate: (data: Partial<ContentItem>) => void;
  onCancelCreate?: () => void;
  onCancelEdit?: () => void;
  onBulkDelete?: (ids: string[], types: string[]) => void;
  onBulkStatusChange?: (ids: string[], status: string) => void;
  onQuickStatusChange?: (id: string, newStatus: string) => Promise<void>;
  showConfirmDialog?: (title: string, message: string, onConfirm: () => void, type?: 'warning' | 'success' | 'info' | 'error') => void;
  users?: any[];
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
  currentContentType,
  onSearchTermChange,
  onSelectedCategoryChange,
  onSortByChange,
  onEdit,
  onDelete,
  onView,
  onCreate,
  onCancelCreate,
  onCancelEdit,
  onBulkDelete,
  onBulkStatusChange,
  showConfirmDialog,
  users = [],
  onQuickStatusChange
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
    // Use category from data if currentContentType is not set or is default
    const contentType = currentContentType && currentContentType !== 'Technique' ? currentContentType : (data.category || 'Technique');
    // Add currentContentType to data
    const dataWithType = {
      ...data,
      currentContentType: contentType
    };
    onCreate(dataWithType);
  };

  const handleCreateCancel = () => {
    if (onCancelCreate) {
      onCancelCreate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Render based on activeTab */}
      {activeTab === 'content-list' && (
        <ContentList
          contentData={contentData}
          searchTerm={searchTerm}
          setSearchTerm={onSearchTermChange}
          sortBy={sortBy}
          setSortBy={onSortByChange}
          onEdit={handleEditClick}
          onDelete={onDelete}
          onView={onView}
          isDarkMode={isDarkMode}
          onBulkDelete={onBulkDelete}
          onBulkStatusChange={onBulkStatusChange}
          showConfirmDialog={showConfirmDialog}
          onQuickStatusChange={onQuickStatusChange}
        />
      )}

      {activeTab === 'content-create' && (
        <ContentCreate
          categories={categories}
          onSave={handleCreateSave}
          onCancel={handleCreateCancel}
          isDarkMode={isDarkMode}
          users={users}
        />
      )}

      {activeTab === 'content-edit' && editingItem && (
        <ContentEdit
          content={editingItem}
          categories={categories}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          isDarkMode={isDarkMode}
          users={users}
        />
      )}
    </div>
  );
};

export default ContentManagementSection;