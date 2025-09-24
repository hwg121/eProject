import React from 'react';
import { Lightbulb, User, Calendar } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { articles } from '../data/mockData';

const Techniques: React.FC = () => {

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gardening Techniques & Tips"
        subtitle="Master the art of gardening with our comprehensive guides and expert advice"
        icon={<Lightbulb className="h-10 w-10" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Card key={article.id} className="h-full">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              {article.title}
            </h3>
            <p className="text-emerald-600 mb-4 leading-relaxed">
              {article.content}
            </p>
            <div className="flex items-center justify-between text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Author: {article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
        <h3 className="text-2xl font-bold mb-4">Quick Gardening Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">🌱 For Beginners</h4>
            <ul className="space-y-1 text-emerald-100">
              <li>• Start with easy-to-grow plants like herbs</li>
              <li>• Water in early morning or late evening</li>
              <li>• Test your soil pH before planting</li>
              <li>• Use organic compost for better soil health</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">🌿 Advanced Tips</h4>
            <ul className="space-y-1 text-emerald-100">
              <li>• Practice crop rotation for vegetable gardens</li>
              <li>• Implement companion planting strategies</li>
              <li>• Create a composting system</li>
              <li>• Use beneficial insects for pest control</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Techniques;