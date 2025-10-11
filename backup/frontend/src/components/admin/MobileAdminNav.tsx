import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Package, FileText, Settings,
  ChevronRight, Shield
} from 'lucide-react';

interface MobileAdminNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  userRole: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{className?: string}>;
  emoji: string;
  color: string;
  description: string;
  adminOnly?: boolean;
}

const MobileAdminNav: React.FC<MobileAdminNavProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
  userRole
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      emoji: '📊',
      color: 'from-emerald-500 to-green-600',
      description: 'Dashboard tổng quan'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      emoji: '📝',
      color: 'from-emerald-500 to-green-600',
      description: 'Quản lý nội dung'
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      emoji: '📦',
      color: 'from-emerald-500 to-green-600',
      description: 'Quản lý sản phẩm'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      emoji: '👥',
      color: 'from-emerald-500 to-green-600',
      description: 'Quản lý người dùng'
    },
    {
      id: 'site-settings',
      label: 'Site Settings',
      icon: Settings,
      emoji: '⚙️',
      color: 'from-purple-500 to-indigo-600',
      description: 'Cài đặt trang web'
    }
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || userRole === 'admin'
  );

  return (
    <>
      {/* Mobile Header */}
      <div className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Admin Panel
            </h1>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative p-2 rounded-xl transition-all duration-300 ${
              isMenuOpen
                ? isDarkMode 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : isDarkMode 
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-5">
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
                  className={`block w-5 h-0.5 rounded-full transition-colors duration-300 ${
                    isMenuOpen 
                      ? 'bg-white' 
                      : isDarkMode ? 'bg-gray-300' : 'bg-gray-600'
                  }`}
                  variants={{
                    open: { rotate: 45, y: 0 },
                    closed: { rotate: 0, y: -4 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className={`block w-5 h-0.5 rounded-full mt-1 transition-colors duration-300 ${
                    isMenuOpen 
                      ? 'bg-white opacity-0' 
                      : isDarkMode ? 'bg-gray-300' : 'bg-gray-600'
                  }`}
                  variants={{
                    open: { opacity: 0 },
                    closed: { opacity: 1 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className={`block w-5 h-0.5 rounded-full mt-1 transition-colors duration-300 ${
                    isMenuOpen 
                      ? 'bg-white' 
                      : isDarkMode ? 'bg-gray-300' : 'bg-gray-600'
                  }`}
                  variants={{
                    open: { rotate: -45, y: -4 },
                    closed: { rotate: 0, y: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className={`h-full ${
                isDarkMode 
                  ? 'bg-gray-900/95 backdrop-blur-2xl' 
                  : 'bg-white/95 backdrop-blur-xl'
              } shadow-2xl border-r ${
                isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100'
              }`}>
                
                {/* Header */}
                <div className={`relative flex items-center justify-between p-6 border-b ${
                  isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur opacity-40"></div>
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h2 className={`text-xl font-bold bg-gradient-to-r ${
                      isDarkMode 
                        ? 'from-emerald-400 to-green-400' 
                        : 'from-emerald-700 to-green-600'
                    } bg-clip-text text-transparent`}>
                      Admin Menu
                    </h2>
                  </div>
                  <div className={`relative z-10 text-xs px-2 py-1 rounded-full ${
                    userRole === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {userRole.toUpperCase()}
                  </div>
                </div>
                
                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredNavItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <button
                        onClick={() => {
                          onTabChange(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`group w-full flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${
                          activeTab === item.id
                            ? 'text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30'
                            : isDarkMode
                              ? 'text-gray-200 bg-gray-800 hover:bg-gray-700 hover:shadow-md hover:text-white'
                              : 'text-gray-700 bg-gray-50 hover:bg-emerald-100 hover:shadow-md hover:text-emerald-800'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                          activeTab === item.id
                            ? 'bg-white/20'
                            : isDarkMode
                              ? 'bg-gray-700 group-hover:bg-emerald-600'
                              : 'bg-white group-hover:bg-emerald-200'
                        }`}>
                          {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-lg block truncate">
                            {item.label}
                          </span>
                          <span className={`text-xs ${
                            activeTab === item.id
                              ? 'text-emerald-100'
                              : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                          }`}>
                            {item.description}
                          </span>
                        </div>
                        <motion.div
                          className={`flex-shrink-0 ${
                            activeTab === item.id ? 'text-white' : 
                            isDarkMode ? 'text-emerald-400' : 'text-emerald-500'
                          }`}
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className={`p-6 border-t ${
                  isDarkMode ? 'border-gray-700/30' : 'border-emerald-100'
                }`}>
                  <div className={`text-center text-sm ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    <p className="font-medium">Green Groves Admin</p>
                    <p className="opacity-75">Management Panel</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileAdminNav;
