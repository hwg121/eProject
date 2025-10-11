import React, { useState } from 'react';
import { Activity, FileEdit, Trash2, Upload, LogIn, UserPlus, UserCog } from 'lucide-react';
import Card from '../UI/Card';

interface ActivityLog {
  id: number;
  user_name: string;
  user_ip: string | null;
  activity_type: 'public' | 'security';
  action: string;
  entity_type: string | null;
  entity_name: string | null;
  description: string | null;
  created_at: string;
  metadata?: any;
}

interface RecentActivitySectionProps {
  publicActivities: ActivityLog[];
  securityActivities: ActivityLog[];
  isDarkMode: boolean;
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ 
  publicActivities, 
  securityActivities, 
  isDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState<'public' | 'security'>('public');

  // Debug logging

  // Helper function to format time ago
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  // Helper function to format exact date
  const getExactDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get activity icon
  const getActivityIcon = (action: string, entityType: string | null) => {
    if (action === 'login') return LogIn;
    if (action === 'created' && entityType === 'user') return UserPlus;
    if (action === 'updated' && entityType === 'user') return UserCog;
    if (action === 'deleted') return Trash2;
    if (action === 'updated') return FileEdit;
    if (action === 'created') return Upload;
    return Activity;
  };

  // Helper function to get activity color
  const getActivityColor = (action: string) => {
    if (action === 'deleted') return 'bg-red-500';
    if (action === 'created' || action === 'login') return 'bg-green-500';
    if (action === 'updated') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const renderActivities = (activities: ActivityLog[]) => {
    if (activities.length === 0) {
      return (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No activities found
        </div>
      );
    }

    return activities.map((activity) => {
      const Icon = getActivityIcon(activity.action, activity.entity_type);
      const colorClass = getActivityColor(activity.action);
      const timeAgo = getTimeAgo(activity.created_at);
      const exactDate = getExactDate(activity.created_at);

      return (
        <div
          key={activity.id}
          className={`flex items-start space-x-4 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800/30 backdrop-blur-sm border border-gray-700/20' : 'bg-gray-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
              {activity.description || `${activity.user_name} ${activity.action} ${activity.entity_type}: ${activity.entity_name}`}
            </p>
            <div className={`text-sm ${isDarkMode ? 'text-emerald-300' : 'text-gray-600'} mt-1`}>
              <span>by {activity.user_name}</span>
              {activity.user_ip && activeTab === 'security' && (
                <span> • IP: {activity.user_ip}</span>
              )}
              <span> • {exactDate}</span>
              <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({timeAgo})
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
          Recent Activity
        </h3>
        <Activity className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('public')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'public'
              ? isDarkMode
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Public Activity
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'security'
              ? isDarkMode
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Security Activity
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activeTab === 'public' ? renderActivities(publicActivities) : renderActivities(securityActivities)}
      </div>
    </Card>
  );
};

export default RecentActivitySection;
