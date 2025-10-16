import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Schedule, Archive, Edit } from '@mui/icons-material';

interface ContentStatusBadgeProps {
  status: 'draft' | 'pending' | 'published' | 'archived';
  size?: 'small' | 'medium';
}

const ContentStatusBadge: React.FC<ContentStatusBadgeProps> = ({ status, size = 'small' }) => {
  const configs = {
    draft: { 
      label: 'Draft', 
      color: 'default' as const, 
      icon: <Edit fontSize="small" /> 
    },
    pending: { 
      label: 'Pending Review', 
      color: 'warning' as const, 
      icon: <Schedule fontSize="small" /> 
    },
    published: { 
      label: 'Published', 
      color: 'success' as const, 
      icon: <CheckCircle fontSize="small" /> 
    },
    archived: { 
      label: 'Archived', 
      color: 'default' as const, 
      icon: <Archive fontSize="small" /> 
    }
  };
  
  const config = configs[status] || configs.draft;
  
  return (
    <Chip 
      label={config.label} 
      color={config.color}
      size={size}
      icon={config.icon}
      sx={{ fontWeight: 500 }}
    />
  );
};

export default ContentStatusBadge;

