import React from 'react';
import { Shield, UserCheck, Crown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface RoleBadgeProps {
  role: 'admin' | 'moderator' | 'user';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ 
  role, 
  size = 'medium',
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Crown,
          bgColor: isDarkMode ? '#7c2d12' : '#fef3c7', // bg-amber-100
          textColor: isDarkMode ? '#fbbf24' : '#92400e', // text-amber-800
          iconColor: isDarkMode ? '#f59e0b' : '#d97706',
          borderColor: 'transparent'
        };
      case 'moderator':
        return {
          label: 'Moderator',
          icon: Shield,
          bgColor: isDarkMode ? '#1e3a8a' : '#dbeafe', // bg-blue-100
          textColor: isDarkMode ? '#93c5fd' : '#1e40af', // text-blue-800
          iconColor: isDarkMode ? '#3b82f6' : '#2563eb',
          borderColor: 'transparent'
        };
      case 'user':
        return {
          label: 'User',
          icon: UserCheck,
          bgColor: isDarkMode ? '#374151' : '#f3f4f6', // bg-gray-100
          textColor: isDarkMode ? '#9ca3af' : '#374151', // text-gray-700
          iconColor: isDarkMode ? '#6b7280' : '#4b5563',
          borderColor: 'transparent'
        };
      default:
        return {
          label: role,
          icon: UserCheck,
          bgColor: isDarkMode ? '#374151' : '#f3f4f6',
          textColor: isDarkMode ? '#9ca3af' : '#374151',
          iconColor: isDarkMode ? '#6b7280' : '#4b5563',
          borderColor: 'transparent'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
          text: 'text-xs'
        };
      case 'large':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'h-5 w-5',
          text: 'text-base'
        };
      default: // medium
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'h-4 w-4',
          text: 'text-sm'
        };
    }
  };

  const config = getRoleConfig(role);
  const sizeClasses = getSizeClasses();
  const IconComponent = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${sizeClasses.container}
        ${className}
      `}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.borderColor
      }}
    >
      <IconComponent 
        className={`${sizeClasses.icon}`}
        style={{ color: config.iconColor }}
      />
      <span className={sizeClasses.text}>
        {config.label}
      </span>
    </span>
  );
};

export default RoleBadge;



