import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '../../contexts/NavigationContext';

const FloatingNav: React.FC = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { navItems } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show floating nav when scrolled down more than 300px
      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Don't render if no items
  if (navItems.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            duration: 0.3 
          }}
        >
          <motion.div
            className={`flex items-center px-4 py-3 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 max-w-full overflow-x-auto ${
              isDarkMode
                ? 'bg-gray-900/95 border-gray-700/30 shadow-black/30'
                : 'bg-white/95 border-gray-200/30 shadow-gray-900/10'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.path}
                  className="relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`relative p-2.5 mx-0.5 rounded-full transition-all duration-300 group flex items-center justify-center min-w-[44px] min-h-[44px] ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-emerald-500/30 scale-110`
                        : isDarkMode
                          ? 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-500 hover:shadow-lg hover:shadow-emerald-500/25'
                          : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-500 hover:shadow-lg hover:shadow-emerald-500/25'
                    }`}
                    title={item.label}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-full blur-xl opacity-10 -z-10 ${
          isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-green-400' : 'bg-gradient-to-r from-emerald-500 to-green-500'
          }`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;