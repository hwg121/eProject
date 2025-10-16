import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
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

  // DRAFT: Submit, Edit, Delete
  if (status === 'draft') {
    return (
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Submit for admin review">
          <Button 
            startIcon={<Send />} 
            onClick={() => onStatusChange(item.id, 'pending')} 
            color="primary"
          >
            Submit
          </Button>
        </Tooltip>
        <Tooltip title="Edit content">
          <Button startIcon={<Edit />} onClick={() => onEdit(item)}>
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button startIcon={<Delete />} onClick={() => onDelete(item)} color="error">
            Delete
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
  }

  // PENDING: Withdraw, Edit, Delete
  if (status === 'pending') {
    return (
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Withdraw submission">
          <Button 
            startIcon={<Undo />} 
            onClick={() => onStatusChange(item.id, 'draft')} 
            color="warning"
          >
            Withdraw
          </Button>
        </Tooltip>
        <Tooltip title="Edit content">
          <Button startIcon={<Edit />} onClick={() => onEdit(item)}>
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button startIcon={<Delete />} onClick={() => onDelete(item)} color="error">
            Delete
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
  }

  // PUBLISHED: Archive, Edit (Re-approval needed), Delete
  if (status === 'published') {
    return (
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Take down from public">
          <Button 
            startIcon={<Archive />} 
            onClick={() => onStatusChange(item.id, 'archived')} 
            color="warning"
          >
            Archive
          </Button>
        </Tooltip>
        <Tooltip title="Edit content (will require re-approval)">
          <Button startIcon={<Edit />} onClick={() => onEdit(item)}>
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button startIcon={<Delete />} onClick={() => onDelete(item)} color="error">
            Delete
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
  }

  // ARCHIVED: Restore, Delete
  if (status === 'archived') {
    return (
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Restore to draft for re-editing">
          <Button 
            startIcon={<RestoreFromTrash />} 
            onClick={() => onStatusChange(item.id, 'draft')} 
            color="info"
          >
            Restore
          </Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button startIcon={<Delete />} onClick={() => onDelete(item)} color="error">
            Delete
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
  }

  // Default fallback
  return null;
};

export default QuickStatusButtons;

