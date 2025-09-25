import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Clock, Users, MapPin, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import DarkModeToggle from '../UI/DarkModeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number>(1247);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const countTimer = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
      clearInterval(countTimer);
    };
  }, []);

  const { navItems } = useNavigation();
  
  const displayNavItems = [
    ...navItems,
    ...(user ? [{ 
      path: '/admin', 
      icon: Users, 
      label: 'Admin', 
      emoji: '⚙️',
      color: 'from-gray-500 to-slate-600',
      isVisible: true,
      order: 999
    }] : []),
  ];

  return (
    <>
      {/* Top Info Bar */}
      <motion.div 
        className={`py-2 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-900 via-emerald-900/50 to-gray-900 text-emerald-100' 
            : 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white'
        }`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="container mx-auto px-4 flex justify-center items-center space-x-8 text-sm relative z-10">
          <div className="flex items-center space-x-2">
            <Clock className={`h-4 w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-300'}`} />
            <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className={`h-4 w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-300'}`} />
            <span className="font-medium">{visitorCount.toLocaleString()} visitors</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className={`h-4 w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-300'}`} />
            <span className="font-medium">Worldwide Community</span>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-700 ${
          scrolled 
            ? isDarkMode 
              ? 'bg-gray-900/20 backdrop-blur-2xl shadow-2xl border-b border-emerald-500/20' 
              : 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100'
            : isDarkMode 
              ? 'bg-gray-900/40 backdrop-blur-xl shadow-lg border-b border-gray-700/20' 
              : 'bg-white shadow-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-2 lg:px-4">
          <div className="flex justify-between items-center py-2 lg:py-3 xl:py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-1.5 lg:p-2 xl:p-3 rounded-xl lg:rounded-2xl shadow-lg">
                  <Leaf className="h-5 lg:h-6 xl:h-8 w-5 lg:w-6 xl:w-8 text-white" />
                </div>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Green Groves
                </motion.h1>
                <div className={`text-xs lg:text-xs xl:text-xs font-semibold tracking-wider ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  GARDENING PARADISE
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2">
              {displayNavItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`relative px-1.5 lg:px-2 xl:px-3 2xl:px-4 py-1.5 lg:py-2 text-xs lg:text-xs xl:text-sm font-semibold rounded-lg xl:rounded-xl transition-all duration-300 flex items-center space-x-1 lg:space-x-1 xl:space-x-2 group whitespace-nowrap ${
                      location.pathname === item.path
                        ? 'text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30'
                        : isDarkMode
                          ? 'text-emerald-300 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-green-600/20 hover:shadow-md'
                          : 'text-emerald-700 hover:text-emerald-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:shadow-md'
                    }`}
                  >
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg xl:rounded-xl shadow-lg shadow-emerald-500/30 -z-10"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="text-xs lg:text-xs xl:text-sm">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
              <DarkModeToggle />
              {user ? (
                <motion.button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="flex items-center space-x-1 xl:space-x-2 bg-red-500 text-white px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 rounded-lg xl:rounded-xl hover:bg-red-600 transition-colors font-semibold text-xs lg:text-xs xl:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline xl:inline">Logout</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 xl:space-x-2 bg-emerald-500 text-white px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 rounded-lg xl:rounded-xl hover:bg-emerald-600 transition-colors font-semibold text-xs lg:text-xs xl:text-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden lg:inline xl:inline">Login</span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 lg:p-3 rounded-xl transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/40' 
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 lg:h-6 w-5 lg:w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 lg:h-6 w-5 lg:w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="lg:hidden pb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`rounded-2xl p-6 space-y-3 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-800 to-emerald-900/20' 
                    : 'bg-gradient-to-r from-emerald-50 to-green-50'
                }`}>
                  {displayNavItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 text-lg ${
                          location.pathname === item.path
                            ? 'text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg'
                            : isDarkMode
                              ? 'text-emerald-300 hover:bg-gray-700/50 hover:shadow-md'
                              : 'text-emerald-700 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="font-semibold text-lg">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200/20">
                    <div className="flex justify-center space-x-4 mb-4">
                      <DarkModeToggle />
                    </div>
                    {!user && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: displayNavItems.length * 0.1 }}
                      >
                        <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-lg font-semibold"
                        >
                          <LogIn className="h-5 w-5" />
                          <span className="font-semibold">Login</span>
                        </Link>
                      </motion.div>
                    )}
                    {user && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: displayNavItems.length * 0.1 }}
                      >
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.location.href = '/';
                          }}
                          className="flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors w-full text-lg font-semibold"
                        >
                          <LogIn className="h-5 w-5" />
                          <span className="font-semibold">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};

export default Header;