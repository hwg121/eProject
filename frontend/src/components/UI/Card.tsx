import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  glow = false 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`
        relative overflow-visible rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-700 group m-2
        ${gradient 
          ? isDarkMode
            ? 'bg-gradient-to-br from-gray-900/50 via-emerald-900/30 to-green-900/40 backdrop-blur-2xl border border-emerald-400/30' 
            : 'bg-gradient-to-br from-white/90 via-emerald-50/60 to-green-50/80 backdrop-blur-xl border border-emerald-200/40'
          : isDarkMode
            ? 'bg-gray-900/40 backdrop-blur-2xl border border-gray-700/40'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200/30'
        } 
        ${glow 
          ? isDarkMode
            ? 'shadow-2xl shadow-emerald-500/40 border border-emerald-400/40' 
            : 'shadow-2xl shadow-emerald-200/40 border border-emerald-200/60'
          : isDarkMode
            ? 'shadow-xl shadow-black/30 border border-gray-600/30'
            : 'shadow-xl shadow-emerald-100/20 border border-emerald-100/40'
        }
        ${hover 
          ? isDarkMode
            ? 'hover:shadow-3xl hover:shadow-emerald-400/40 hover:scale-[1.01] hover:border-emerald-400/50 hover:bg-gray-900/50' 
            : 'hover:shadow-3xl hover:shadow-emerald-200/40 hover:scale-[1.01] hover:border-emerald-200/60'
          : ''
        } 
        ${className}
      `}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      whileHover={hover ? { 
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
    >
      {/* Animated gradient overlay */}
      {hover && (
        <motion.div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-emerald-900/0 via-emerald-800/20 to-green-800/30' 
              : 'bg-gradient-to-br from-emerald-50/0 via-emerald-100/20 to-green-100/30'
          }`}
          initial={false}
        />
      )}
      
      {/* Shimmer effect */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-3xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative elements */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-16 translate-x-16 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-emerald-600/20 via-green-600/10 to-transparent' 
          : 'bg-gradient-to-br from-emerald-200/20 via-green-200/10 to-transparent'
      }`}></div>
      <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-12 -translate-x-12 ${
        isDarkMode 
          ? 'bg-gradient-to-tr from-teal-600/20 via-emerald-600/10 to-transparent' 
          : 'bg-gradient-to-tr from-teal-200/20 via-emerald-200/10 to-transparent'
      }`}></div>
      
      {/* Glow effect */}
      {glow && (
        <div className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30' 
            : 'bg-gradient-to-r from-emerald-400/20 to-green-400/20'
        }`}></div>
      )}
    </motion.div>
  );
};

export default Card;