import React from 'react';
import { Check, X, Clock, Eye, EyeOff, CheckCircle, Ban } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatusBadgeProps {
  status: 'active' | 'published' | 'archived' | 'inactive' | 'banned';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'medium',
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
        return {
          label: status === 'active' ? 'Active' : 'Published',
          icon: CheckCircle,
          bgColor: isDarkMode ? '#064e3b' : '#d1fae5', // bg-green-100
          textColor: isDarkMode ? '#6ee7b7' : '#166534', // text-green-800
          iconColor: isDarkMode ? '#10b981' : '#166534',
          borderColor: 'transparent'
        };
      case 'archived':
        return {
          label: 'Archived',
          icon: X,
          bgColor: isDarkMode ? '#1e293b' : '#f3f4f6',
          textColor: isDarkMode ? '#94a3b8' : '#6b7280',
          iconColor: isDarkMode ? '#94a3b8' : '#6b7280',
          borderColor: isDarkMode ? '#334155' : '#e5e7eb'
        };
      case 'inactive':
        return {
          label: 'Inactive',
          icon: EyeOff,
          bgColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
          textColor: isDarkMode ? '#fca5a5' : '#dc2626',
          iconColor: isDarkMode ? '#ef4444' : '#dc2626',
          borderColor: isDarkMode ? '#991b1b' : '#fecaca'
        };
      case 'banned':
        return {
          label: 'Banned',
          icon: Ban,
          bgColor: isDarkMode ? '#7f1d1d' : '#fee2e2', // bg-red-100
          textColor: isDarkMode ? '#fca5a5' : '#dc2626', // text-red-800
          iconColor: isDarkMode ? '#ef4444' : '#dc2626',
          borderColor: 'transparent'
        };
      default:
        return {
          label: status,
          icon: Check,
          bgColor: isDarkMode ? '#064e3b' : '#eafaf4',
          textColor: isDarkMode ? '#6ee7b7' : '#047857',
          iconColor: isDarkMode ? '#10b981' : '#10b981',
          borderColor: isDarkMode ? '#065f46' : '#a7f3d0'
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

  const config = getStatusConfig(status);
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

export default StatusBadge;
