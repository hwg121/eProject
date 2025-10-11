import React from 'react';
import { TrendingUp, Eye, Heart } from 'lucide-react';
import Card from '../UI/Card';
import { TopContentItem } from '../../types/admin';

interface TopContentSectionProps {
  topContent: TopContentItem[];
  isDarkMode: boolean;
}

const TopContentSection: React.FC<TopContentSectionProps> = ({ topContent, isDarkMode }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
          Top Performing Content
        </h3>
        <TrendingUp className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
      </div>
      <div className="space-y-4">
        {topContent.map((content, index) => (
          <div key={content.id} className={`flex items-center space-x-4 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800/30 backdrop-blur-sm border border-gray-700/20' : 'bg-gray-50'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
                {content.title}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-emerald-300' : 'text-gray-600'}`}>
                  <Eye className="h-4 w-4" />
                  <span>{content.views.toLocaleString()}</span>
                </span>
                <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-emerald-300' : 'text-gray-600'}`}>
                  <Heart className="h-4 w-4" />
                  <span>{content.likes.toLocaleString()}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  content.type === 'article' ? 'bg-green-100 text-green-800' :
                  content.type === 'video' ? 'bg-red-100 text-red-800' :
                  content.type === 'book' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {content.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopContentSection;
