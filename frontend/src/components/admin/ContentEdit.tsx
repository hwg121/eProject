import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Card from '../ui/Card';
import ContentForm from './ContentForm';
import { ContentItem } from '../../types/admin';

interface ContentEditProps {
  content: ContentItem;
  categories: {[key: string]: string[]};
  onSave: (content: Partial<ContentItem>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  users?: any[];
}

const ContentEdit: React.FC<ContentEditProps> = ({
  content,
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
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`} style={{ whiteSpace: 'nowrap', overflow: 'visible' }}>
              Edit Content
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Update content information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <ContentForm
          type={content.category}
          item={content}
          categories={['Technique', 'Video']}
          onSave={onSave}
          onCancel={onCancel}
          isDarkMode={isDarkMode}
          users={users}
        />
      </Card>
    </div>
  );
};

export default ContentEdit;
