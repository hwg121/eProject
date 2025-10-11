import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`
        relative p-3 rounded-full transition-all duration-500 overflow-hidden
        ${isDarkMode 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 backdrop-blur-sm' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      {/* Background glow effect */}
      <div className={`
        absolute inset-0 rounded-full blur-lg opacity-30 transition-all duration-500
        ${isDarkMode ? 'bg-indigo-400' : 'bg-yellow-400'}
      `} />
      
      {/* Icon container */}
      <div className="relative z-10">
        <motion.div
          key={isDarkMode ? 'moon' : 'sun'}
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 200
          }}
        >
          {isDarkMode ? (
            <Moon className="h-5 w-5 text-white drop-shadow-lg" />
          ) : (
            <Sun className="h-5 w-5 text-white drop-shadow-lg" />
          )}
        </motion.div>
      </div>

      {/* Animated particles */}
      {!isDarkMode && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: [0, 360],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              initial={{
                rotate: i * 60,
                x: 15,
                y: -0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Stars for dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white text-xs"
              style={{
                top: `${20 + i * 15}%`,
                left: `${15 + i * 20}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default DarkModeToggle;