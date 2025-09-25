import React from 'react';
import { useParams } from 'react-router-dom';
import { DollarSign, Package, Star, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Tool } from '../../types/content';
import DetailLayout from '../../components/Detail/DetailLayout';
import { ROUTES } from '../../constants';

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const { getById } = useContent<Tool>('tools');
  
  const tool = getById(id!);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Tool not found</h2>
        <p className="text-gray-500">The tool you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <DetailLayout
      title={tool.title}
      description={tool.description}
      imageUrl={tool.imageUrl}
      backLink={ROUTES.TOOLS}
      backLabel="Tools"
      createdAt={tool.createdAt}
      category={tool.category}
      rating={tool.rating}
    >
      <div className="space-y-8">
        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Product Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Brand:</span>
                <span>{tool.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Model:</span>
                <span>{tool.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-emerald-600 font-bold">${tool.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Stock:</span>
                <span className={`flex items-center space-x-1 ${
                  tool.inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tool.inStock ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span>{tool.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>
              Rating & Reviews
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(tool.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{tool.rating}/5</span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Specifications
          </h3>
          <p className="text-lg leading-relaxed">{tool.specifications}</p>
        </div>

        {/* Usage Guide */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-emerald-50'
        } shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
          }`}>
            How to Use
          </h3>
          <p className="text-lg leading-relaxed">{tool.usage}</p>
        </div>

        {/* Buy Button */}
        {tool.buyLink && (
          <div className="text-center">
            <a
              href={tool.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Buy Now - ${tool.price}</span>
            </a>
          </div>
        )}
      </div>
    </DetailLayout>
  );
};

export default ToolDetail;