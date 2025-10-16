import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="max-w-3xl w-full text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated 404 Number */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 10 
          }}
        >
          <motion.h1 
            className="text-9xl sm:text-[12rem] md:text-[16rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 leading-none"
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Floating Plant Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl sm:text-6xl opacity-10"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['🌿', '🌱', '🍃', '🌾', '🌵', '🪴', '🌸', '🌻'][i]}
            </motion.div>
          ))}
        </div>

        {/* Error Message */}
        <motion.div
          className="relative z-10 p-8 sm:p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-emerald-600 dark:text-emerald-300 mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
              It might have been moved or deleted, or you may have mistyped the URL.
            </p>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            className="p-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                  Looking for something specific?
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Try visiting our <a href="/" className="underline hover:text-emerald-800 dark:hover:text-emerald-200">home page</a> or use the navigation menu to explore our content.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleGoHome}
              className="flex items-center justify-center space-x-2 bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="h-5 w-5" />
              <span>Go to Homepage</span>
            </motion.button>

            <motion.button
              onClick={handleGoBack}
              className="flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Popular Pages */}
          <motion.div
            className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Popular Pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: 'Techniques', path: '/techniques', emoji: '🌿' },
                { name: 'Videos', path: '/videos', emoji: '🎥' },
                { name: 'Tools', path: '/tools', emoji: '🔧' },
                { name: 'Books', path: '/books', emoji: '📚' },
                { name: 'About Us', path: '/about-us', emoji: '👥' },
              ].map((link, index) => (
                <motion.a
                  key={link.path}
                  href={link.path}
                  className="px-4 py-2 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                >
                  {link.emoji} {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;

