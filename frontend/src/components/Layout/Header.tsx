import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import DarkModeToggle from '../UI/DarkModeToggle';
import useGeolocation from '../../hooks/useGeolocation';
import { animationConfig, getAnimationConfig, performanceUtils } from '../../utils/animations';
import { visitorService } from '../../services/visitorService';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [visitorInfo, setVisitorInfo] = useState<{city?: string, country?: string} | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('');
  
  // Use geolocation hook
  const { 
    latitude, 
    longitude, 
    city, 
    country, 
    error: geoError, 
    loading: geoLoading 
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user timezone from geolocation or browser
    const getUserTimezone = async () => {
      try {
        // First try to get timezone from geolocation
        if (latitude && longitude) {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          if (data.timezone) {
            setUserTimezone(data.timezone);
            return;
          }
        }
        
        // Fallback to browser timezone
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(browserTimezone);
      } catch (error) {
        console.error('Error getting timezone:', error);
        // Fallback to browser timezone
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(browserTimezone);
      }
    };

    getUserTimezone();

    // Load visitor data
    const loadVisitorData = async () => {
      try {
        // Track current visitor session
        await visitorService.trackVisitorSession();
        
        const [visitorInfoData, visitorStats] = await Promise.all([
          visitorService.getVisitorInfo(),
          visitorService.getVisitorStatistics(),
        ]);
        
        setVisitorInfo(visitorInfoData);
        setVisitorCount(visitorStats.totalVisitors);
        // setOnlineUsers(visitorStats.onlineUsers);
      } catch (error) {
        console.error('Error loading visitor data:', error);
        // Fallback values
        setVisitorCount(1247);
        // setOnlineUsers(42);
      }
    };

    loadVisitorData();

    // Update visitor count periodically with real data
    const countTimer = setInterval(async () => {
      try {
        const visitorStats = await visitorService.getVisitorStatistics();
        setVisitorCount(visitorStats.totalVisitors);
        // setOnlineUsers(visitorStats.onlineUsers);
      } catch (error) {
        console.error('Error updating visitor count:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
      clearInterval(countTimer);
    };
  }, [latitude, longitude]);

  const { navItems } = useNavigation();
  
  // Navigation items for regular users only
  const displayNavItems = navItems;



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
        <div className="container mx-auto px-3 sm:px-4 flex justify-center items-center space-x-4 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm relative z-10">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Clock className={`h-3 w-3 sm:h-4 sm:w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-300'}`} />
            <span className="font-medium text-xs sm:text-sm">
              {userTimezone ? 
                currentTime.toLocaleTimeString('en-US', { 
                  timeZone: userTimezone,
                  hour12: true,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : 
                currentTime.toLocaleTimeString()
              }
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Users className={`h-3 w-3 sm:h-4 sm:w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-300'}`} />
            <span className="font-medium text-xs sm:text-sm">{visitorCount.toLocaleString()} visitors</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <MapPin className={`h-3 w-3 sm:h-4 sm:w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-300'}`} />
            <span className="font-medium text-xs sm:text-sm">
              {geoLoading ? (
                'Loading...'
              ) : geoError ? (
                visitorInfo?.city && visitorInfo?.country 
                  ? `${visitorInfo.city}, ${visitorInfo.country}`
                  : 'Worldwide'
              ) : city && country ? (
                `${city}, ${country}`
              ) : visitorInfo?.city && visitorInfo?.country ? (
                `${visitorInfo.city}, ${visitorInfo.country}`
              ) : (
                'Worldwide'
              )}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? isDarkMode 
              ? 'bg-gray-900/20 backdrop-blur-2xl shadow-2xl border-b border-emerald-500/20' 
              : 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100'
            : isDarkMode 
              ? 'bg-gray-900/40 backdrop-blur-xl shadow-lg border-b border-gray-700/20' 
              : 'bg-white shadow-lg'
        }`}
        {...getAnimationConfig(animationConfig.headerSlide)}
        style={performanceUtils.willChange('transform')}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
            {/* Logo - Perfect Mobile Sizing */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <motion.div
                className="relative"
                whileHover={getAnimationConfig(animationConfig.logoHover)}
                whileTap={getAnimationConfig(animationConfig.buttonTap)}
                style={performanceUtils.willChange('transform')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img 
                  src="/logo.svg" 
                  alt="Green Groves Logo" 
                  className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 object-contain"
                />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Green Groves
                </motion.h1>
                <div className={`text-xs sm:text-xs font-semibold tracking-wider ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  GARDENING PARADISE
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2">
              {displayNavItems.map((item, index) => {
                return (
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
                    {/* Active indicator */}
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
              );
              })}
            </nav>

            {/* Theme Toggle */}
            <div className="hidden lg:flex items-center">
              <DarkModeToggle />
            </div>

            {/* Mobile Menu Button - Perfect Touch Target */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden relative p-3 sm:p-4 rounded-2xl transition-all duration-300 min-h-[44px] min-w-[44px] touch-manipulation ${
                isMenuOpen
                  ? isDarkMode 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : isDarkMode 
                    ? 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/40 active:bg-emerald-700/50' 
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 active:bg-emerald-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-6">
                <motion.div
                  className="absolute inset-0 flex flex-col justify-center"
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.span
                    className={`block w-6 h-0.5 rounded-full transition-colors duration-300 ${
                      isMenuOpen 
                        ? 'bg-white' 
                        : isDarkMode ? 'bg-emerald-300' : 'bg-emerald-700'
                    }`}
                    variants={{
                      open: { rotate: 45, y: 0 },
                      closed: { rotate: 0, y: -6 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={`block w-6 h-0.5 rounded-full mt-1.5 transition-colors duration-300 ${
                      isMenuOpen 
                        ? 'bg-white opacity-0' 
                        : isDarkMode ? 'bg-emerald-300' : 'bg-emerald-700'
                    }`}
                    variants={{
                      open: { opacity: 0 },
                      closed: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={`block w-6 h-0.5 rounded-full mt-1.5 transition-colors duration-300 ${
                      isMenuOpen 
                        ? 'bg-white' 
                        : isDarkMode ? 'bg-emerald-300' : 'bg-emerald-700'
                    }`}
                    variants={{
                      open: { rotate: -45, y: -6 },
                      closed: { rotate: 0, y: 0 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop - Maximum separation */}
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Menu Panel - Perfect Mobile Responsive */}
                <motion.div
                  className="lg:hidden fixed top-0 right-0 h-full w-80 sm:w-96 max-w-[90vw] z-50"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                  <div className={`h-full relative ${
                    isDarkMode 
                      ? 'bg-gray-900' 
                      : 'bg-white'
                  } shadow-2xl border-l ${
                    isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100'
                  }`} style={{ 
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    opacity: 1
                  }}>
                    {/* Solid overlay to ensure complete separation */}
                    <div className={`absolute inset-0 z-10 ${
                      isDarkMode ? 'bg-gray-900' : 'bg-white'
                    }`}></div>
                    
                    {/* Header - Perfect Mobile Spacing */}
                    <div className={`relative z-20 flex items-center justify-between p-4 sm:p-6 border-b ${
                      isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>
                      <div className="flex items-center space-x-3 relative z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur opacity-40"></div>
                          <div className={`relative w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">GG</span>
                          </div>
                        </div>
                        <h2 className={`text-xl font-bold bg-gradient-to-r ${
                          isDarkMode 
                            ? 'from-emerald-400 to-green-400' 
                            : 'from-emerald-700 to-green-600'
                        } bg-clip-text text-transparent`}>
                          Menu
                        </h2>
                      </div>
                      <div className="relative z-10 flex items-center space-x-2">
                        <DarkModeToggle />
                        {/* Close Button */}
                        <motion.button
                          onClick={() => setIsMenuOpen(false)}
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-gray-800 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                              : 'bg-gray-100 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                          }`}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Close menu"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Navigation Items - Perfect Mobile Touch */}
                    <div className="relative z-20 flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 sm:space-y-3">
                      {displayNavItems.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Link
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`group flex items-center space-x-3 sm:space-x-4 px-4 py-3 sm:py-4 rounded-2xl transition-all duration-300 min-h-[48px] touch-manipulation ${
                              location.pathname === item.path
                                ? 'text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30'
                                : isDarkMode
                                  ? 'text-gray-200 bg-gray-800 hover:bg-gray-700 hover:shadow-md hover:text-white active:bg-gray-600'
                                  : 'text-gray-700 bg-gray-50 hover:bg-emerald-100 hover:shadow-md hover:text-emerald-800 active:bg-emerald-200'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                              location.pathname === item.path
                                ? 'bg-white/20'
                                : isDarkMode
                                  ? 'bg-gray-700 group-hover:bg-emerald-600'
                                  : 'bg-white group-hover:bg-emerald-200'
                            }`}>
                              {item.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-base sm:text-lg block truncate">
                                {item.label}
                              </span>
                              <span className={`text-xs sm:text-sm ${
                                location.pathname === item.path
                                  ? 'text-emerald-100'
                                  : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                              }`}>
                                {item.path === '/' ? 'Trang chủ' : 
                                 item.path === '/essentials' ? 'Công cụ cần thiết' :
                                 item.path === '/techniques' ? 'Kỹ thuật làm vườn' :
                                 item.path === '/videos' ? 'Video hướng dẫn' :
                                 item.path === '/tools' ? 'Công cụ làm vườn' :
                                 item.path === '/pots' ? 'Chậu cây' :
                                 item.path === '/accessories' ? 'Phụ kiện' :
                                 item.path === '/books' ? 'Sách hướng dẫn' :
                                 item.path === '/suggestions' ? 'Gợi ý' :
                                 item.path === '/about-us' ? 'Giới thiệu' : 'Trang khác'}
                              </span>
                            </div>
                            <motion.div
                              className={`flex-shrink-0 ${
                                location.pathname === item.path ? 'text-white' : 
                                isDarkMode ? 'text-emerald-400' : 'text-emerald-500'
                              }`}
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Footer - Perfect Mobile Spacing */}
                    <div className={`p-4 sm:p-6 border-t ${
                      isDarkMode ? 'border-gray-700/30' : 'border-emerald-100'
                    }`}>
                      <div className={`text-center text-sm ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        <p className="font-medium">Green Groves</p>
                        <p className="opacity-75">Gardening Paradise</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};

export default Header;