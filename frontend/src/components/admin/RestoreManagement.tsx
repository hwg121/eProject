import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, RefreshCw, AlertTriangle, Search, Filter, 
  User, FileText, Video as VideoIcon, Package, Clock,
  X, Check, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';
import RoleBadge from '../ui/RoleBadge';
import StatusBadge from '../StatusBadge';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  TablePagination
} from '@mui/material';
import { apiClient } from '../../services/api';
import { formatDate } from '../../utils/dateUtils';

interface TrashedItem {
  id: number;
  name?: string;
  title?: string;
  email?: string;
  role?: string;
  status?: string;
  author?: string;
  deleted_at: string;
  [key: string]: any;
}

interface RestoreManagementProps {
  onSuccess?: () => void;
}

const RestoreManagement: React.FC<RestoreManagementProps> = ({ onSuccess }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'users' | 'articles' | 'videos' | 'products'>('users');
  const [items, setItems] = useState<TrashedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'restore' | 'delete';
  } | null>(null);

  useEffect(() => {
    fetchTrashedItems();
  }, [activeTab, page, rowsPerPage, searchTerm]);

  const fetchTrashedItems = async () => {
    setLoading(true);
    try {
      const endpoint = `/admin/${activeTab}/trashed/all`;
      const response: any = await apiClient.get(endpoint + `?page=${page + 1}&per_page=${rowsPerPage}${searchTerm ? `&search=${searchTerm}` : ''}`);

      if (response.success) {
        setItems(response.data || []);
        setTotal(response.meta?.total || 0);
      }
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to fetch trashed items',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const endpoint = `/admin/${activeTab}/${id}/restore`;
      const response: any = await apiClient.post(endpoint);

      if (response.success) {
        setToast({
          message: `${activeTab.slice(0, -1)} restored successfully`,
          type: 'success'
        });
        fetchTrashedItems();
        onSuccess?.();
      }
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to restore item',
        type: 'error'
      });
    }
  };

  const handleForceDelete = async (id: number) => {
    try {
      const endpoint = `/admin/${activeTab}/${id}/force`;
      const response: any = await apiClient.delete(endpoint);

      if (response.success) {
        setToast({
          message: `${activeTab.slice(0, -1)} permanently deleted`,
          type: 'success'
        });
        fetchTrashedItems();
      }
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to delete item permanently',
        type: 'error'
      });
    }
  };

  const openRestoreDialog = (item: TrashedItem) => {
    setConfirmDialog({
      open: true,
      title: 'Restore Item',
      message: `Are you sure you want to restore "${item.title || item.name || item.email}"? This will make it visible again.`,
      onConfirm: () => {
        handleRestore(item.id);
        setConfirmDialog(null);
      },
      type: 'restore'
    });
  };

  const openDeleteDialog = (item: TrashedItem) => {
    setConfirmDialog({
      open: true,
      title: 'Permanent Delete',
      message: `Are you sure you want to PERMANENTLY delete "${item.title || item.name || item.email}"? This action CANNOT be undone!`,
      onConfirm: () => {
        handleForceDelete(item.id);
        setConfirmDialog(null);
      },
      type: 'delete'
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'users': return <User className="h-4 w-4" />;
      case 'articles': return <FileText className="h-4 w-4" />;
      case 'videos': return <VideoIcon className="h-4 w-4" />;
      case 'products': return <Package className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Deleted At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </>
        );
      case 'articles':
      case 'videos':
        return (
          <>
            <TableCell>Cover</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Deleted At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </>
        );
      case 'products':
        return (
          <>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Deleted At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item: TrashedItem) => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            <TableCell>
              <Avatar 
                src={item.avatar} 
                alt={item.name}
                sx={{ width: 40, height: 40 }}
              >
                {item.name?.charAt(0).toUpperCase()}
              </Avatar>
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>
              <RoleBadge 
                role={item.role as 'admin' | 'moderator' | 'user'} 
                size="small"
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {formatDate(item.deleted_at)}
              </div>
            </TableCell>
            <TableCell align="right">{renderActions(item)}</TableCell>
          </>
        );
      case 'articles':
      case 'videos':
        return (
          <>
            <TableCell>
              <img 
                src={item.featured_image || item.cover || '/placeholder.png'} 
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
            </TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.author_user?.name || item.creator?.name || 'Unknown'}</TableCell>
            <TableCell>
              <StatusBadge 
                status={item.status as 'published' | 'pending' | 'draft' | 'archived' | 'inactive' | 'banned'} 
                size="small"
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {formatDate(item.deleted_at)}
              </div>
            </TableCell>
            <TableCell align="right">{renderActions(item)}</TableCell>
          </>
        );
      case 'products':
        return (
          <>
            <TableCell>
              <img 
                src={item.image || '/placeholder.png'} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <Chip label={item.category} size="small" />
            </TableCell>
            <TableCell>
              <StatusBadge 
                status={item.status as 'published' | 'pending' | 'draft' | 'archived' | 'inactive' | 'banned'} 
                size="small"
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {formatDate(item.deleted_at)}
              </div>
            </TableCell>
            <TableCell align="right">{renderActions(item)}</TableCell>
          </>
        );
      default:
        return null;
    }
  };

  const renderActions = (item: TrashedItem) => (
    <div className="flex justify-end gap-2">
      <Tooltip title="Restore">
        <IconButton
          onClick={() => openRestoreDialog(item)}
          size="small"
          sx={{ 
            color: 'success.main',
            '&:hover': { backgroundColor: 'success.light', color: 'white' }
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Permanently">
        <IconButton
          onClick={() => openDeleteDialog(item)}
          size="small"
          sx={{ 
            color: 'error.main',
            '&:hover': { backgroundColor: 'error.light', color: 'white' }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Restore Management
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage deleted items - Restore or permanently delete
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-xl border-2 ${
            isDarkMode 
              ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200' 
              : 'bg-yellow-50 border-yellow-300 text-yellow-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Warning</p>
              <p className="text-sm mt-1">
                Items shown here have been soft deleted. You can restore them or permanently delete them. 
                <strong> Permanent deletion cannot be undone!</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Paper elevation={3} className="mb-4">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setPage(0);
            }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem'
              }
            }}
          >
            <Tab 
              value="users" 
              label={
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Users</span>
                </div>
              }
            />
            <Tab 
              value="articles" 
              label={
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Articles</span>
                </div>
              }
            />
            <Tab 
              value="videos" 
              label={
                <div className="flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" />
                  <span>Videos</span>
                </div>
              }
            />
            <Tab 
              value="products" 
              label={
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </div>
              }
            />
          </Tabs>
        </Paper>

        {/* Search Bar */}
        <Paper elevation={2} className="mb-4 p-4">
          <TextField
            fullWidth
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <Search className="h-5 w-5 mr-2 text-gray-400" />
            }}
          />
        </Paper>

        {/* Table */}
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDarkMode ? 'grey.800' : 'grey.100' }}>
                  {renderTableHeaders()}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                      <p className="text-gray-500 mt-2">Loading...</p>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Trash2 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">No deleted {activeTab} found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} hover>
                      {renderTableRow(item)}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {items.length > 0 && (
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          )}
        </Paper>
      </motion.div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
          confirmText={confirmDialog.type === 'restore' ? 'Restore' : 'Delete Permanently'}
          confirmColor={confirmDialog.type === 'restore' ? 'success' : 'error'}
        />
      )}
    </div>
  );
};

export default RestoreManagement;

