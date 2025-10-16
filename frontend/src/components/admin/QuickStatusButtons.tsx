import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Send, Undo, Archive, RestoreFromTrash, Edit, Delete } from '@mui/icons-material';

interface QuickStatusButtonsProps {
  item: any;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  isDarkMode: boolean;
}

const QuickStatusButtons: React.FC<QuickStatusButtonsProps> = ({
  item,
  onStatusChange,
  onEdit,
  onDelete,
  isDarkMode
}) => {
  const status = item.status;
  
  const iconButtonStyle = {
    padding: '6px',
    '&:hover': { bgcolor: isDarkMode ? '#374151' : '#e5e7eb' }
  };

  // DRAFT: Submit, Edit, Delete
  if (status === 'draft') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Submit for review">
          <IconButton 
            onClick={() => onStatusChange(item.id, 'pending')} 
            size="small"
            sx={{ ...iconButtonStyle, color: '#2563eb' }}
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(item)} size="small" sx={iconButtonStyle}>
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(item)} size="small" sx={{ ...iconButtonStyle, color: '#dc2626' }}>
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  // PENDING: Withdraw, Edit, Delete
  if (status === 'pending') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Withdraw">
          <IconButton 
            onClick={() => onStatusChange(item.id, 'draft')} 
            size="small"
            sx={{ ...iconButtonStyle, color: '#f59e0b' }}
          >
            <Undo sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(item)} size="small" sx={iconButtonStyle}>
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(item)} size="small" sx={{ ...iconButtonStyle, color: '#dc2626' }}>
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  // PUBLISHED: Archive, Edit, Delete
  if (status === 'published') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Archive">
          <IconButton 
            onClick={() => onStatusChange(item.id, 'archived')} 
            size="small"
            sx={{ ...iconButtonStyle, color: '#f59e0b' }}
          >
            <Archive sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit (requires re-approval)">
          <IconButton onClick={() => onEdit(item)} size="small" sx={iconButtonStyle}>
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(item)} size="small" sx={{ ...iconButtonStyle, color: '#dc2626' }}>
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  // ARCHIVED: Restore, Delete
  if (status === 'archived') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Restore to draft">
          <IconButton 
            onClick={() => onStatusChange(item.id, 'draft')} 
            size="small"
            sx={{ ...iconButtonStyle, color: '#0891b2' }}
          >
            <RestoreFromTrash sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(item)} size="small" sx={{ ...iconButtonStyle, color: '#dc2626' }}>
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  // Default fallback
  return null;
};

export default QuickStatusButtons;

