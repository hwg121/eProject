import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Users, Eye, FileText, Star, Save, TrendingUp, ShoppingBag, type LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Toast from '../../components/ui/Toast';
import { campaignService, CampaignStatsResponse } from '../../services/campaignService';

interface MetricConfig {
  name: string;
  label: string;
  icon: LucideIcon;
  bgGradient: string;
  color: string;
  unit?: string;
}


const AdminCampaignSettings: React.FC = () => {
  
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statsOverview, setStatsOverview] = useState<CampaignStatsResponse | null>(null);
  const [goals, setGoals] = useState<Record<string, number>>({});
  const [originalGoals, setOriginalGoals] = useState<Record<string, number>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const metricsConfig: Record<string, MetricConfig> = {
    visitors: {
      name: 'visitors',
      label: 'Visitors',
      icon: Users,
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea',
      unit: ''
    },
    views: {
      name: 'views',
      label: 'Views',
      icon: Eye,
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#10b981',
      unit: ''
    },
    content: {
      name: 'content',
      label: 'Content Items',
      icon: FileText,
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb',
      unit: 'items'
    },
    products: {
      name: 'products',
      label: 'Product Items',
      icon: ShoppingBag,
      bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#06b6d4',
      unit: 'items'
    },
    rating: {
      name: 'rating',
      label: 'Rating',
      icon: Star,
      bgGradient: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
      color: '#ffa726',
      unit: '/ 5.0'
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Check if any goals have changed
    const changed = Object.keys(goals).some(
      metric => goals[metric] !== originalGoals[metric]
    );
    setHasUnsavedChanges(changed);
  }, [goals, originalGoals]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Only need to call getStatsOverview - it has everything we need
      const statsData = await campaignService.getStatsOverview();
      setStatsOverview(statsData);

      // Initialize goals state from stats overview
      const goalsObj: Record<string, number> = {};

      Object.entries(statsData).forEach(([metricName, stat]) => {
        goalsObj[metricName] = stat.goal_value;
      });

      setGoals(goalsObj);
      setOriginalGoals({ ...goalsObj });
    } catch (error: any) {
      console.error('❌ Error loading campaign data:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to load campaign settings. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (metric: string, value: string) => {
    if (value === '') {
      setGoals(prev => ({ ...prev, [metric]: 0 }));
      return;
    }
    
    const numValue = parseFloat(value);
    
    // Validate based on metric type
    if (metric === 'rating') {
      if (numValue < 0 || numValue > 5) {
        showSnackbar('Rating must be between 0 and 5', 'error');
        return;
      }
    } else {
      if (numValue < 0) {
        showSnackbar('Goal value cannot be negative', 'error');
        return;
      }
      if (numValue > 1000000) {
        showSnackbar('Goal value cannot exceed 1,000,000', 'error');
        return;
      }
    }
    
    if (!isNaN(numValue)) {
      setGoals(prev => ({ ...prev, [metric]: numValue }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const changedMetrics = Object.keys(goals).filter(
        metric => goals[metric] !== originalGoals[metric]
      );

      if (changedMetrics.length === 0) {
        showSnackbar('No changes to save', 'error');
        setSaving(false);
        return;
      }

      // Update only changed metrics
      await Promise.all(
        changedMetrics.map(metric =>
          campaignService.updateCampaignSetting(metric, goals[metric])
        )
      );

      // Reload data to get updated stats
      await loadData();

      showSnackbar(
        `Campaign settings updated for ${changedMetrics.length} metric(s)`,
        'success'
      );
    } catch (error: any) {
      console.error('Error saving campaign settings:', error);
      
      // Extract proper error message from backend
      let errorMessage = 'Failed to save campaign settings. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 70) return '#10b981'; // green
    if (progress >= 40) return '#fbbf24'; // yellow
    return '#ef4444'; // red
  };

  const getProgressBadgeColor = (progress: number): 'success' | 'warning' | 'error' => {
    if (progress >= 70) return 'success';
    if (progress >= 40) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: 1800, mx: 'auto' }}>
        {/* Header - Responsive */}
        <Box sx={{ 
          mb: { xs: 2, sm: 3 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1.5, sm: 2 },
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}>
            <Box sx={{ 
              p: { xs: 0.75, sm: 1 }, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex'
            }}>
              <TrendingUp size={20} color="white" className="sm:w-6 sm:h-6" />
            </Box>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? '#fff' : '#1f2937',
                  letterSpacing: '-0.01em',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Campaign Goals
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Set and track your key metrics
              </Typography>
            </Box>
          </Box>

          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <Chip 
              label="Unsaved changes" 
              color="info" 
              size="small"
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                alignSelf: { xs: 'center', sm: 'flex-start' }
              }}
            />
          )}
        </Box>

        {/* Metrics Grid - Responsive */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)' 
          },
          gap: { xs: 1.5, sm: 2 }, 
          mb: { xs: 2, sm: 3 } 
        }}>
        {Object.values(metricsConfig).map((metric, index) => {
          const stat = statsOverview?.[metric.name as keyof CampaignStatsResponse];
          const progress = stat?.progress || 0;
          const currentValue = stat?.current_value || 0;

          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                sx={{
                  position: 'relative',
                  height: '100%',
                  background: isDarkMode
                    ? 'rgba(30, 41, 59, 0.6)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: metric.color,
                    boxShadow: `0 4px 20px ${metric.color}20`
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: metric.bgGradient,
                  }
                }}
              >
                  <CardContent sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    position: 'relative', 
                    zIndex: 1 
                  }}>
                    {/* Icon and Badge */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: { xs: 1, sm: 1.5 } 
                    }}>
                      <Avatar
                        sx={{
                          width: { xs: 32, sm: 40 },
                          height: { xs: 32, sm: 40 },
                          background: metric.bgGradient,
                          boxShadow: `0 4px 12px ${metric.color}40`
                        }}
                      >
                        <metric.icon size={16} color="white" className="sm:w-5 sm:h-5" />
                      </Avatar>

                      <Chip
                        label={`${progress.toFixed(0)}%`}
                        color={getProgressBadgeColor(progress)}
                        size="small"
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      />
                    </Box>

                    {/* Metric Label */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? '#fff' : '#1f2937',
                        mb: { xs: 0.75, sm: 1 },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {metric.label}
                    </Typography>

                    {/* Current Value with Growth */}
                    <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: isDarkMode ? '#94a3b8' : '#64748b', 
                          fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                          mb: 0.5, 
                          display: 'block' 
                        }}
                      >
                        Current Value
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'baseline', 
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: 'wrap'
                      }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            background: metric.bgGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        >
                          {metric.name === 'rating'
                            ? currentValue.toFixed(1)
                            : currentValue.toLocaleString()}
                          {metric.unit && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ 
                                color: isDarkMode ? '#94a3b8' : '#64748b', 
                                ml: 0.5,
                                fontSize: { xs: '0.65rem', sm: '0.75rem' }
                              }}
                            >
                              {metric.unit}
                            </Typography>
                          )}
                        </Typography>
                        {stat && (
                          <Chip
                            label={`${stat.growth >= 0 ? '+' : ''}${stat.growth.toFixed(1)}%`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              bgcolor: stat.growth >= 0 
                                ? 'rgba(16, 185, 129, 0.15)' 
                                : 'rgba(239, 68, 68, 0.15)',
                              color: stat.growth >= 0 ? '#10b981' : '#ef4444',
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: stat.growth >= 0 
                                ? 'rgba(16, 185, 129, 0.3)' 
                                : 'rgba(239, 68, 68, 0.3)'
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Goal Input - Minimal */}
                    <TextField
                      fullWidth
                      type="number"
                      label="Goal"
                      size="small"
                      value={goals[metric.name] || ''}
                      onChange={(e) => handleGoalChange(metric.name, e.target.value)}
                      inputProps={{ 
                        min: 0, 
                        max: metric.name === 'rating' ? 5 : 1000000,
                        step: metric.name === 'rating' ? 0.1 : 1 
                      }}
                      helperText={metric.name === 'rating' ? 'Rating: 0.0 - 5.0' : 'Value: 0 - 1,000,000'}
                      sx={{ 
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: metric.color
                            }
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: metric.color
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.7rem',
                          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                        }
                      }}
                    />

                    {/* Progress Bar - Clean */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isDarkMode ? '#94a3b8' : '#64748b', 
                            fontSize: '0.7rem' 
                          }}
                        >
                          Progress
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ 
                            color: getProgressColor(progress), 
                            fontWeight: 600, 
                            fontSize: '0.7rem' 
                          }}
                        >
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
                          '& .MuiLinearProgress-bar': {
                            background: metric.bgGradient,
                            borderRadius: 1
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
          );
        })}
        </Box>

        {/* Save Button - Compact */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 1,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              },
              '&:disabled': {
                background: isDarkMode ? '#374151' : '#9ca3af',
                color: isDarkMode ? '#6b7280' : 'white',
                boxShadow: 'none'
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Toast for notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default AdminCampaignSettings;

