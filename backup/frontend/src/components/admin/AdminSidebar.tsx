import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Package, MessageSquare,
  Menu, X, ChevronRight,
  FileText, Settings
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{className?: string}> | null;
  color?: string;
  description?: string;
  count?: number;
  children?: NavigationItem[];
  adminOnly?: boolean;
}

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    totalUsers: number;
    totalViews: number;
    totalArticles: number;
    totalVideos: number;
    totalBooks: number;
    totalSuggestions: number;
    totalAboutUs: number;
    totalContactMessages: number;
  };
  isCollapsed: boolean;
  onToggle: () => void;
  userRole?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  stats, 
  isCollapsed, 
  onToggle,
  userRole = 'admin'
}) => {
  const { isDarkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const allNavigationItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      color: 'from-emerald-500 to-green-600',
      description: 'Dashboard overview'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      color: 'from-emerald-500 to-green-600',
      description: 'Manage all content',
      children: [
        { id: 'content-list', label: 'List', icon: null },
        { id: 'content-create', label: 'Create', icon: null },
        { id: 'content-edit', label: 'Edit', icon: null }
      ]
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      color: 'from-emerald-500 to-green-600',
      description: 'Manage all products',
      children: [
        { id: 'product-list', label: 'List', icon: null },
        { id: 'product-create', label: 'Create', icon: null },
        { id: 'product-edit', label: 'Edit', icon: null }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      color: 'from-emerald-500 to-green-600',
      description: 'Manage all users',
      children: [
        { id: 'user-profile', label: 'Profile', icon: null }, // All roles can see
        { id: 'user-list', label: 'List', icon: null, adminOnly: true },
        { id: 'user-create', label: 'Create', icon: null, adminOnly: true },
        { id: 'user-edit', label: 'Edit', icon: null, adminOnly: true }
      ]
      // Note: Parent menu visible to all, but children filtered by role
    },
    {
      id: 'site-settings',
      label: 'Site Settings',
      icon: Settings,
      color: 'from-purple-500 to-indigo-600',
      description: 'Manage site settings',
      children: [
        { id: 'hero-section', label: 'Hero Section', icon: null, adminOnly: true },
        { id: 'staff-management', label: 'Staff Members', icon: null, adminOnly: true },
        { id: 'map-settings', label: 'Map Settings', icon: null, adminOnly: true },
        { id: 'contact-settings', label: 'Contact Settings', icon: null, adminOnly: true },
        { id: 'contact-messages', label: 'Contact Messages', icon: null }
      ]
    }
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems
    .filter(item => {
      // Filter parent items
      if (item.adminOnly && userRole !== 'admin') {
        return false;
      }
      return true;
    })
    .map(item => {
      // Filter children items based on adminOnly
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (child.adminOnly && userRole !== 'admin') {
              return false;
            }
            return true;
          })
        };
      }
      return item;
    });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
  };

  return (
    <motion.div
      className={`transition-all duration-300 min-h-screen overflow-hidden ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50' 
        : 'bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200/50'
      } shadow-lg flex flex-col
      hidden lg:block`}
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b flex-shrink-0 ${
        isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      } backdrop-blur-sm`}>
        {!isCollapsed && (
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className={`relative p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white shadow-lg`}>
              <BarChart3 className="h-5 w-5" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>
            <div>
              <h2 className={`font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode 
                  ? 'from-white to-gray-300' 
                  : 'from-gray-800 to-gray-600'
              }`}>
                Admin Panel
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Dashboard v2.0
              </p>
            </div>
          </motion.div>
        )}
        <motion.button
          onClick={onToggle}
          className={`relative p-2.5 rounded-xl transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0 max-h-full">
        <div className="py-4 px-3 space-y-2 pb-6">
          {navigationItems.map((item) => (
            <div key={item.id}>
              {/* Main Item */}
              <motion.div
                className={`relative ${
                  item.children ? 'mb-1' : 'mb-2'
                }`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => item.children ? toggleSection(item.id) : handleItemClick(item.id)}
                  className={`group relative w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id))
                      ? `text-white bg-gradient-to-r ${item.color} shadow-lg border border-white/10`
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-200 border border-transparent hover:border-emerald-400/20'
                        : 'text-gray-600 hover:bg-emerald-50/80 hover:text-emerald-700 border border-transparent hover:border-emerald-200/30'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`relative p-1.5 rounded-md transition-all duration-200 ${
                      activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id))
                        ? 'bg-white/20 text-white' 
                        : isDarkMode 
                          ? 'bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-400/15 group-hover:text-emerald-200'
                          : 'bg-emerald-50/60 text-emerald-500 group-hover:bg-emerald-100/70 group-hover:text-emerald-600'
                    }`}>
                      {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                      {activeTab === item.id && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.count !== undefined && (
                        <motion.span 
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                            activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id))
                              ? 'bg-white/25 text-white shadow-sm' 
                              : isDarkMode 
                                ? 'bg-emerald-500/15 text-emerald-200 group-hover:bg-emerald-400/20' 
                                : 'bg-emerald-100/60 text-emerald-600 group-hover:bg-emerald-200/70'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.count}
                        </motion.span>
                      )}
                      {item.children && (
                        <motion.div
                          animate={{ rotate: expandedSections.includes(item.id) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {(activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id))) && (
                    <motion.div
                      className="absolute left-0 top-1/2 w-1 h-6 bg-white rounded-r-full"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              </motion.div>

              {/* Children Items */}
              <AnimatePresence>
                {item.children && expandedSections.includes(item.id) && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="ml-6 space-y-1 mt-2 overflow-hidden"
                  >
                    {item.children.map((child, index) => (
                      <motion.button
                        key={child.id}
                        onClick={() => handleItemClick(child.id)}
                        className={`group relative w-full flex items-center justify-between px-3 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                          activeTab === child.id
                            ? `text-emerald-700 bg-emerald-100 border border-emerald-200 shadow-sm`
                            : isDarkMode
                              ? 'text-gray-400 hover:bg-emerald-500/8 hover:text-emerald-300 border border-transparent hover:border-emerald-400/15'
                              : 'text-gray-500 hover:bg-emerald-50/60 hover:text-emerald-600 border border-transparent hover:border-emerald-200/25'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                        <div className="flex items-center space-x-3">
                          {child.icon && (
                            <div className={`p-1.5 rounded-md transition-all duration-200 ${
                              activeTab === child.id 
                                ? 'bg-emerald-200 text-emerald-700' 
                                : isDarkMode 
                                  ? 'bg-gray-700/40 text-gray-500 group-hover:bg-gray-600/50 group-hover:text-gray-400'
                                  : 'bg-gray-200/60 text-gray-400 group-hover:bg-gray-300/70 group-hover:text-gray-500'
                            }`}>
                              <child.icon className="h-3.5 w-3.5 flex-shrink-0" />
                            </div>
                          )}
                          <span className="font-medium">{child.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {child.count !== undefined && (
                            <motion.span 
                              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                activeTab === child.id 
                                  ? 'bg-emerald-200 text-emerald-700 shadow-sm' 
                                  : isDarkMode 
                                    ? 'bg-gray-700/60 text-gray-400 group-hover:bg-gray-600/70 group-hover:text-gray-300' 
                                    : 'bg-gray-200/70 text-gray-500 group-hover:bg-gray-300/80 group-hover:text-gray-600'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {child.count}
                            </motion.span>
                          )}
                          {child.children && (
                            <motion.div
                              animate={{ rotate: expandedSections.includes(child.id) ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Active indicator for children */}
                        {activeTab === child.id && (
                          <motion.div
                            className="absolute left-0 top-1/2 w-0.5 h-4 bg-emerald-500 rounded-r-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div 
          className={`p-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm flex-shrink-0`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <motion.div 
              className="flex items-center justify-center space-x-2 mb-2 p-1.5 rounded-lg hover:bg-gray-800/30 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className={`p-1 rounded ${isDarkMode ? 'bg-gray-700/40' : 'bg-gray-200/60'}`}>
                <BarChart3 className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium">Dashboard v2.0</span>
            </motion.div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Dashboard v2.0</p>
              <p className="mt-1">© 2024 Green Groves</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminSidebar;
