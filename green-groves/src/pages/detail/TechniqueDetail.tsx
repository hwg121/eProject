import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Technique } from '../../types/content';
import DetailLayout from '../../components/Detail/DetailLayout';
import { ROUTES } from '../../constants';

const TechniqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const { getById } = useContent<Technique>('techniques');
  
  const technique = getById(id!);

  if (!technique) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Technique not found</h2>
        <p className="text-gray-500">The technique you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <DetailLayout
      title={technique.title}
      description={technique.description}
      imageUrl={technique.imageUrl}
      backLink={ROUTES.TECHNIQUES}
      backLabel="Techniques"
      author={technique.author}
      createdAt={technique.createdAt}
      category={technique.category}
      tags={technique.tags}
    >
      <div className="space-y-8">
        {/* Difficulty and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-emerald-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              Difficulty Level
            </h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              technique.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              technique.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {technique.difficulty.charAt(0).toUpperCase() + technique.difficulty.slice(1)}
            </span>
          </div>
          
          {technique.estimatedTime && (
            <div className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                Estimated Time
              </h3>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{technique.estimatedTime}</span>
              </div>
            </div>
          )}
        </div>

        {/* Materials */}
        {technique.materials && technique.materials.length > 0 && (
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Materials Needed
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technique.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>{material}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Detailed Guide
          </h3>
          <div className={`prose max-w-none ${
            isDarkMode ? 'prose-invert' : ''
          }`}>
            <p className="text-lg leading-relaxed">{technique.content}</p>
          </div>
        </div>

        {/* Steps */}
        {technique.steps && technique.steps.length > 0 && (
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Step-by-Step Instructions
            </h3>
            <div className="space-y-4">
              {technique.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailLayout>
  );
};

export default TechniqueDetail;