import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../ui/Card';
import ProductForm from './ProductForm';

interface Product {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  category: 'tool' | 'book' | 'pot' | 'accessory' | 'suggestion';
  subcategory?: string;
  status: 'published' | 'archived';
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
  price?: number;
  rating?: number;
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductEditProps {
  product: Product;
  categories: string[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  users?: any[];
}

const ProductEdit: React.FC<ProductEditProps> = ({
  product,
  categories,
  onSave,
  onCancel,
  isDarkMode,
  users = []
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onCancel}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Edit Product
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Update product information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <ProductForm
          type="products"
          item={product}
          categories={['tool', 'book', 'pot', 'accessory', 'suggestion']}
          onSave={onSave}
          onCancel={onCancel}
          isDarkMode={isDarkMode}
          users={users}
        />
      </Card>
    </div>
  );
};

export default ProductEdit;
