import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className="text-center mb-16 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Simple background decoration */}
      <div className="absolute inset-0 flex justify-center items-center opacity-5">
        <div className={`text-[150px] ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>🌿</div>
      </div>
      
      <div className="relative z-10">
        <motion.div 
          className="flex justify-center items-center mb-8 py-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {icon && (
            <motion.div 
              className={`relative mr-4 p-4 rounded-2xl shadow-lg ${
                isDarkMode 
                  ? 'text-emerald-300 bg-gradient-to-br from-emerald-900/60 to-green-900/60 shadow-emerald-500/30' 
                  : 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-green-100 shadow-emerald-200/40'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className={`h-4 w-4 ${isDarkMode ? 'text-yellow-300 drop-shadow-lg' : 'text-yellow-500 drop-shadow-md'}`} />
              </motion.div>
            </motion.div>
          )}
          <motion.h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent leading-tight py-2 ${
              isDarkMode 
                ? 'from-emerald-300 via-green-300 to-teal-300' 
                : 'from-emerald-800 via-green-700 to-teal-700'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {title}
          </motion.h1>
        </motion.div>
        
        {/* Simple decorative line */}
        <motion.div
          className="flex justify-center items-center mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={`h-0.5 w-20 rounded-full ${
            isDarkMode 
              ? 'bg-gradient-to-r from-emerald-400 to-green-400' 
              : 'bg-gradient-to-r from-emerald-500 to-green-500'
          }`} />
          <div className={`mx-3 w-2 h-2 rounded-full ${
            isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
          }`} />
          <div className={`h-0.5 w-20 rounded-full ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500'
          }`} />
        </motion.div>
      </div>
      
      {subtitle && (
        <motion.p 
          className={`text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed relative z-10 py-1 px-4 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default PageHeader;