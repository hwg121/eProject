import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface DetailLayoutProps {
  title: string;
  description: string;
  imageUrl: string;
  backLink: string;
  backLabel: string;
  author?: string;
  createdAt?: string;
  category?: string;
  rating?: number;
  views?: number;
  tags?: string[];
  children: React.ReactNode;
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  description,
  imageUrl,
  backLink,
  backLabel,
  author,
  createdAt,
  category,
  rating,
  views,
  tags,
  children
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to={backLink}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'text-emerald-300 hover:bg-gray-800'
              : 'text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to {backLabel}</span>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative h-64 md:h-80">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-gray-200">{description}</p>
          </div>
        </div>

        {/* Meta Information */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {author && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
            )}
            {category && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {category}
              </span>
            )}
            {rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{rating}</span>
              </div>
            )}
            {views && (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{views.toLocaleString()} views</span>
              </div>
            )}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DetailLayout;