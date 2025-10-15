import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, FileText, Package, Video, Book, Lightbulb } from 'lucide-react';
import Card from '../ui/Card';
import ContentForm from './ContentForm';
import { ContentItem } from '../../types/admin';

interface ContentCreateProps {
  categories: {[key: string]: string[]};
  onSave: (content: Partial<ContentItem>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const ContentCreate: React.FC<ContentCreateProps> = ({
  categories,
  onSave,
  onCancel,
  isDarkMode
}) => {
  const [selectedType, setSelectedType] = useState<string>('');

  const contentTypes = [
    {
      id: 'Technique',
      name: 'Technique',
      description: 'Create detailed technique articles with rich content',
      icon: Lightbulb,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'Video',
      name: 'Video',
      description: 'Create video content and tutorials with rich descriptions',
      icon: Video,
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleSave = (data: Partial<ContentItem>) => {
    // Add category to data if not present
    const dataWithCategory = {
      ...data,
      category: selectedType // Ensure category is set to selectedType
    };
    onSave(dataWithCategory);
  };

  const handleCancel = () => {
    if (selectedType) {
      setSelectedType('');
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleCancel}
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
              {selectedType ? `Create ${contentTypes.find(t => t.id === selectedType)?.name}` : 'Create New Content'}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedType ? 'Fill in the content details' : 'Choose a content type to get started'}
            </p>
          </div>
        </div>
      </div>

      {!selectedType ? (
        /* Content Type Selection */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTypeSelect(type.id)}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-emerald-500 bg-gray-800 hover:bg-gray-700' 
                    : 'border-gray-300 hover:border-emerald-500 bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {type.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {type.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Content Form */
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ContentForm
            type={selectedType}
            item={null}
            categories={['Technique', 'Video']}
            onSave={handleSave}
            onCancel={handleCancel}
            isDarkMode={isDarkMode}
          />
        </Card>
      )}
    </div>
  );
};

export default ContentCreate;
