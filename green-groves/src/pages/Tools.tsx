import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import { Tool } from '../types/content';
import { initialTools } from '../data/initialData';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

const Tools: React.FC = () => {
  const { getPublished } = useContent<Tool>('tools', initialTools);
  const tools = getPublished();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Tools"
        subtitle="Discover the essential tools that make gardening easier and more enjoyable"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full group">
              <Link to={`/tools/${tool.id}`} className="block">
                <img
                  src={tool.imageUrl}
                  alt={tool.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {tool.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{tool.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    <p><strong>Brand:</strong> {tool.brand}</p>
                    <p><strong>Model:</strong> {tool.model}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-emerald-600 font-bold text-lg">
                      <DollarSign className="h-5 w-5" />
                      <span>{tool.price}</span>
                    </div>
                    <span className={`text-sm ${tool.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {tool.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="mr-1">View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tools available</h3>
          <p className="text-gray-500">Check back later for new tool recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default Tools;