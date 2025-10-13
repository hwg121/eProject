import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductList from './ProductList';
import ProductCreate from './ProductCreate';
import ProductEdit from './ProductEdit';

interface Product {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'archived';
  views?: number;
  likes?: number;
  rating?: number;
  price?: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  content?: string;
  tags?: string[];
  image?: string;
  link?: string;
  is_featured?: boolean;
  is_published?: boolean;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
}

interface ProductManagementProps {
  activeTab: string;
  isDarkMode: boolean;
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  onCreate: (product: Partial<Product>) => void;
  categories: string[];
  onEditClick?: (product: Product) => void;
  editingProduct?: Product | null;
  onEditCancel?: () => void;
  onCancelCreate?: () => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkStatusChange?: (ids: string[], status: string) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  activeTab,
  isDarkMode,
  products,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onEdit,
  onDelete,
  onView,
  onCreate,
  categories,
  onEditClick,
  editingProduct,
  onEditCancel,
  onCancelCreate,
  onBulkDelete,
  onBulkStatusChange
}) => {

  const handleEditClick = (product: Product) => {
    if (onEditClick) {
      onEditClick(product);
    }
  };

  const handleEditSave = (data: Partial<Product>) => {
    if (editingProduct) {
      // Merge the updated data with the original product
      const updatedProduct = { ...editingProduct, ...data };
      onEdit(updatedProduct);
    }
    if (onEditCancel) {
      onEditCancel();
    }
  };

  const handleQuickEdit = (product: Product) => {
    onEdit(product);
  };

  const handleEditCancel = () => {
    if (onEditCancel) {
      onEditCancel();
    }
  };

  const handleCreateSave = (data: Partial<Product>) => {
    onCreate(data);
  };

  const handleCreateCancel = () => {
    if (onCancelCreate) {
      onCancelCreate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Render based on activeTab */}
      {activeTab === 'product-list' && (
        <ProductList
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onEdit={handleEditClick}
          onDelete={onDelete}
          onView={onView}
          categories={categories}
          isDarkMode={isDarkMode}
          onBulkDelete={onBulkDelete}
          onBulkStatusChange={onBulkStatusChange}
        />
      )}

      {activeTab === 'product-create' && (
        <ProductCreate
          categories={categories}
          onSave={handleCreateSave}
          onCancel={handleCreateCancel}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === 'product-edit' && editingProduct && (
        <ProductEdit
          product={editingProduct}
          categories={categories}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default ProductManagement;
