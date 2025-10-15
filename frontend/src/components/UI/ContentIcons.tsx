import React from 'react';
import { Chip, ChipProps, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Star } from 'lucide-react';

interface ContentChipProps extends Omit<ChipProps, 'icon' | 'label'> {
  value: number | string;
  isDarkMode?: boolean;
}

interface ActionButtonProps extends Omit<IconButtonProps, 'children'> {
  tooltip: string;
  onClick?: () => void;
}

// Views Chip Component
export const ViewsChip: React.FC<ContentChipProps> = ({ value, isDarkMode, sx, ...props }) => {
  return (
    <Chip
      icon={<VisibilityIcon sx={{ fontSize: 14, color: '#3b82f6 !important' }} />}
      label={typeof value === 'number' ? value.toLocaleString() : value}
      size="small"
      sx={{
        bgcolor: isDarkMode ? '#374151' : '#e5e7eb',
        color: isDarkMode ? '#d1d5db' : '#6b7280',
        fontWeight: 600,
        fontSize: '0.75rem',
        ...sx
      }}
      {...props}
    />
  );
};

// Likes Chip Component
export const LikesChip: React.FC<ContentChipProps> = ({ value, isDarkMode, sx, ...props }) => {
  return (
    <Chip
      icon={<FavoriteIcon sx={{ fontSize: 16, color: '#ec4899' }} />}
      label={typeof value === 'number' ? value.toLocaleString() : value}
      size="small"
      sx={{
        bgcolor: isDarkMode ? '#374151' : '#e2e8f0',
        color: isDarkMode ? '#d1d5db' : '#475569',
        fontWeight: 600,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
          color: '#ec4899',
        },
        ...sx
      }}
      {...props}
    />
  );
};

// Rating Chip Component
export const RatingChip: React.FC<ContentChipProps> = ({ value, isDarkMode, sx, ...props }) => {
  const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
  
  return (
    <Chip
      icon={<Star className="w-3 h-3 text-yellow-500 fill-current" />}
      label={displayValue}
      size="small"
      sx={{
        bgcolor: isDarkMode ? '#374151' : '#fef3c7',
        color: isDarkMode ? '#d1d5db' : '#92400e',
        fontWeight: 600,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
          color: '#fbbf24',
        },
        ...sx
      }}
      {...props}
    />
  );
};

// Edit Button Component
export const EditButton: React.FC<ActionButtonProps> = ({ tooltip, onClick, sx, ...props }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: '#3b82f6',
          '&:hover': {
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s',
          ...sx
        }}
        {...props}
      >
        <EditIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
};

// Delete Button Component
export const DeleteButton: React.FC<ActionButtonProps> = ({ tooltip, onClick, sx, ...props }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: '#ef4444',
          '&:hover': {
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s',
          ...sx
        }}
        {...props}
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
};

// View Button Component
export const ViewButton: React.FC<ActionButtonProps> = ({ tooltip, onClick, sx, ...props }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: '#6b7280',
          '&:hover': {
            bgcolor: 'rgba(107, 114, 128, 0.1)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s',
          ...sx
        }}
        {...props}
      >
        <VisibilityIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
};

// Compound Component: Action Buttons Group
interface ActionButtonsGroupProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const ActionButtonsGroup: React.FC<ActionButtonsGroupProps> = ({
  onView,
  onEdit,
  onDelete,
  showView = false,
  showEdit = true,
  showDelete = true
}) => {
  return (
    <>
      {showView && onView && <ViewButton tooltip="View" onClick={onView} />}
      {showEdit && onEdit && <EditButton tooltip="Edit" onClick={onEdit} />}
      {showDelete && onDelete && <DeleteButton tooltip="Delete" onClick={onDelete} />}
    </>
  );
};

// Compound Component: Content Stats Group
interface ContentStatsGroupProps {
  views: number;
  likes: number;
  rating: number;
  isDarkMode?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const ContentStatsGroup: React.FC<ContentStatsGroupProps> = ({
  views,
  likes,
  rating,
  isDarkMode,
  layout = 'horizontal'
}) => {
  const Container = layout === 'horizontal' ? 'div' : 'div';
  const containerStyle = layout === 'horizontal' 
    ? { display: 'flex', gap: '8px', flexWrap: 'wrap' as const }
    : { display: 'flex', flexDirection: 'column' as const, gap: '8px' };

  return (
    <Container style={containerStyle}>
      <ViewsChip value={views} isDarkMode={isDarkMode} />
      <LikesChip value={likes} isDarkMode={isDarkMode} />
      <RatingChip value={rating} isDarkMode={isDarkMode} />
    </Container>
  );
};

export default {
  ViewsChip,
  LikesChip,
  RatingChip,
  EditButton,
  DeleteButton,
  ViewButton,
  ActionButtonsGroup,
  ContentStatsGroup
};

