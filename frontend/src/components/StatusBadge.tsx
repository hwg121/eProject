import React from 'react';
import { Check, X, Clock, Eye, EyeOff, CheckCircle, Ban, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: 'active' | 'published' | 'archived' | 'inactive' | 'banned' | 'draft' | 'pending';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'medium',
  className = ''
}) => {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'draft':
        return {
          label: 'Draft',
          icon: FileText,
          bgColor: '#f1f5f9',
          textColor: '#475569',
          iconColor: '#475569',
          borderColor: '#e2e8f0'
        };
      case 'pending':
        return {
          label: 'Pending Review',
          icon: Clock,
          bgColor: '#fef3c7',
          textColor: '#92400e',
          iconColor: '#92400e',
          borderColor: '#fde68a'
        };
      case 'active':
      case 'published':
        return {
          label: normalizedStatus === 'active' ? 'Active' : 'Published',
          icon: CheckCircle,
          bgColor: '#d1fae5',
          textColor: '#166534',
          iconColor: '#10b981',
          borderColor: 'transparent'
        };
      case 'archived':
        return {
          label: 'Archived',
          icon: X,
          bgColor: '#f3f4f6',
          textColor: '#6b7280',
          iconColor: '#6b7280',
          borderColor: '#e5e7eb'
        };
      case 'inactive':
        return {
          label: 'Inactive',
          icon: EyeOff,
          bgColor: '#fef2f2',
          textColor: '#dc2626',
          iconColor: '#ef4444',
          borderColor: '#fecaca'
        };
      case 'banned':
        return {
          label: 'Banned',
          icon: Ban,
          bgColor: '#fee2e2',
          textColor: '#dc2626',
          iconColor: '#ef4444',
          borderColor: 'transparent'
        };
      default:
        return {
          label: status,
          icon: Check,
          bgColor: '#eafaf4',
          textColor: '#047857',
          iconColor: '#10b981',
          borderColor: '#a7f3d0'
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