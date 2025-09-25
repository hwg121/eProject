import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import { Technique } from '../types/content';
import { initialTechniques } from '../data/initialData';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

const Techniques: React.FC = () => {
  const { getPublished } = useContent<Technique>('techniques', initialTechniques);
  const techniques = getPublished();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Techniques"
        subtitle="Master the art of gardening with our comprehensive guides and expert advice"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {techniques.map((technique, index) => (
          <motion.div
            key={technique.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full group">
              <Link to={`/techniques/${technique.id}`} className="block">
                <img
                  src={technique.imageUrl}
                  alt={technique.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    {technique.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    technique.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    technique.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {technique.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {technique.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {technique.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{technique.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(technique.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-wrap gap-1">
                    {technique.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="mr-1">Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {techniques.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No techniques available</h3>
          <p className="text-gray-500">Check back later for new gardening techniques and guides.</p>
        </div>
      )}
    </div>
  );
};

export default Techniques;