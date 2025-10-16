import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="text-center mb-16 relative">
      {/* Simple background decoration */}
      <div className="absolute inset-0 flex justify-center items-center opacity-5">
        <div className={`text-[150px] ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>🌿</div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-8">
          {icon && (
            <div className={`relative p-4 rounded-xl flex-shrink-0 mr-6 ${
              isDarkMode 
                ? 'text-emerald-300 bg-emerald-900/20' 
                : 'text-emerald-600 bg-emerald-100'
            }`}>
              <div className="w-10 h-10 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
          }`}>
            {title}
          </h1>
        </div>
        
        {/* Simple decorative line */}
        <div className="flex justify-center items-center mb-6">
          <div className={`h-0.5 w-20 rounded-full ${
            isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
          }`} />
          <div className={`mx-3 w-2 h-2 rounded-full ${
            isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
          }`} />
          <div className={`h-0.5 w-20 rounded-full ${
            isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
          }`} />
        </div>
      </div>
      
      {subtitle && (
        <p className={`text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed relative z-10 py-1 px-4 ${
          isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;