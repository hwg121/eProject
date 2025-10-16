import React, { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Button, 
  IconButton, 
  Checkbox, 
  Typography, 
  Card as MuiCard,
  Chip 
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  Edit,
  ShoppingBag,
  Article as ArticleIcon,
  VideoLibrary
} from '@mui/icons-material';
import StatusBadge from '../ui/StatusBadge';
import { ContentItem } from '../../types/admin';

interface ApprovalManagementProps {
  isDarkMode: boolean;
  pendingItems: ContentItem[];
  onApprove: (item: ContentItem) => Promise<void>;
  onReject: (item: ContentItem) => Promise<void>;
  onEdit: (item: ContentItem) => void;
}

const ApprovalManagement: React.FC<ApprovalManagementProps> = ({
  isDarkMode,
  pendingItems,
  onApprove,
  onReject,
  onEdit
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const tabs = ['All Pending', 'Products', 'Articles', 'Videos'];
  
  // Calculate counts for each tab
  const tabCounts = {
    all: pendingItems.length,
    products: pendingItems.filter(item => item.type === 'product').length,
    articles: pendingItems.filter(item => item.type === 'article').length,
    videos: pendingItems.filter(item => item.type === 'video').length
  };
  
  const filteredItems = currentTab === 0 
    ? pendingItems 
    : pendingItems.filter(item => {
        if (currentTab === 1) return item.type === 'product';
        if (currentTab === 2) return item.type === 'article';
        if (currentTab === 3) return item.type === 'video';
        return true;
      });

  const handleBulkApprove = async () => {
    for (const id of selected) {
      const item = pendingItems.find(i => i.id === id);
      if (item) await onApprove(item);
    }
    setSelected([]);
  };

  const handleSelectToggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(itemId => itemId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: isDarkMode ? '#fff' : '#000' }}>
        Approval Management
      </Typography>
      
      <Tabs 
        value={currentTab} 
        onChange={(e, v) => setCurrentTab(v)} 
        sx={{ 
          mb: 3,
          '& .MuiTab-root': { color: isDarkMode ? '#9ca3af' : '#6b7280' },
          '& .Mui-selected': { color: '#10b981 !important' },
          '& .MuiTabs-indicator': { backgroundColor: '#10b981' }
        }}
      >
        {tabs.map((tab, idx) => {
          const count = idx === 0 ? tabCounts.all 
                      : idx === 1 ? tabCounts.products
                      : idx === 2 ? tabCounts.articles
                      : tabCounts.videos;
          return <Tab key={idx} label={`${tab} (${count})`} />;
        })}
      </Tabs>
      
      {selected.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button onClick={handleBulkApprove} variant="contained" color="success" sx={{ mr: 1 }}>
            Approve Selected ({selected.length})
          </Button>
          <Button onClick={() => setSelected([])} variant="outlined" color="error">
            Cancel
          </Button>
        </Box>
      )}
      
      {filteredItems.length === 0 ? (
        <Box sx={{ 
          p: 6, 
          textAlign: 'center', 
          bgcolor: isDarkMode ? '#1f2937' : '#f9fafb',
          borderRadius: 2,
          border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb'
        }}>
          <Typography color="text.secondary" variant="h6">
            No pending items for review
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            All content has been reviewed!
          </Typography>
        </Box>
      ) : (
        filteredItems.map(item => (
          <MuiCard 
            key={item.id} 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: isDarkMode ? '#1f2937' : '#fff',
              border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: isDarkMode ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 4px 12px rgba(16, 185, 129, 0.1)'
              }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="start">
              <Box display="flex" gap={2} flex={1}>
                <Checkbox 
                  checked={selected.includes(item.id)} 
                  onChange={() => handleSelectToggle(item.id)}
                  sx={{ 
                    color: '#10b981',
                    '&.Mui-checked': { color: '#10b981' }
                  }}
                />
                <Box flex={1}>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', mb: 0.5 }}>
                    {item.title || 'Untitled'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    By: {typeof item.authorUser === 'object' ? item.authorUser.name : (item.creator?.name || 'Unknown')} | Created: {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#d1d5db' : '#4b5563', mb: 1 }}>
                    {(item.description || '').substring(0, 150)}{(item.description || '').length > 150 ? '...' : ''}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <StatusBadge status="pending" size="small" />
                    <Chip 
                      icon={item.type === 'product' ? <ShoppingBag sx={{ fontSize: 16 }} /> 
                          : item.type === 'article' ? <ArticleIcon sx={{ fontSize: 16 }} />
                          : <VideoLibrary sx={{ fontSize: 16 }} />}
                      label={item.type === 'product' ? 'Product' : item.type === 'article' ? 'Article' : 'Video'} 
                      size="small" 
                      sx={{
                        bgcolor: item.type === 'product' ? '#dbeafe' : item.type === 'article' ? '#fce7f3' : '#ede9fe',
                        color: item.type === 'product' ? '#1e40af' : item.type === 'article' ? '#9f1239' : '#5b21b6',
                        fontWeight: 500
                      }}
                    />
                    {item.category && (
                      <Chip label={item.category} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box display="flex" gap={1} flexShrink={0} alignItems="center">
                <Button 
                  variant="contained"
                  color="success" 
                  onClick={() => onApprove(item)} 
                  startIcon={<CheckCircle />}
                  size="small"
                  sx={{
                    bgcolor: '#10b981',
                    minWidth: '100px',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  Approve
                </Button>
                <Button 
                  variant="outlined"
                  color="error" 
                  onClick={() => onReject(item)} 
                  startIcon={<Cancel />}
                  size="small"
                  sx={{
                    minWidth: '90px'
                  }}
                >
                  Reject
                </Button>
                <IconButton 
                  onClick={() => onEdit(item)} 
                  size="small"
                  sx={{ 
                    color: isDarkMode ? '#60a5fa' : '#3b82f6',
                    padding: '8px'
                  }}
                >
                  <Edit />
                </IconButton>
              </Box>
            </Box>
          </MuiCard>
        ))
      )}
    </Box>
  );
};

export default ApprovalManagement;

