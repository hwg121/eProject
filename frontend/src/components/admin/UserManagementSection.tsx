import React, { useState, memo } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../UI/Card';
import UserCreate from './UserCreate';
import UserProfileComponent from './UserProfileComponent';

interface UserManagementSectionProps {
  activeTab: string;
  onUserProfileChange: (field: string, value: any) => void;
  onSaveUserProfile: () => void;
  onLoadUsers: () => void;
  onUserSearchTermChange: (term: string) => void;
  onEditUser: (user: any) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: (userData: any) => void;
  // Data props
  userProfile: any;
  filteredUsers: any[];
  userSearchTerm: string;
  currentUserRole?: string;
}

const UserManagementSection: React.FC<UserManagementSectionProps> = memo(({
  activeTab,
  onUserProfileChange,
  onSaveUserProfile,
  onLoadUsers,
  onUserSearchTermChange,
  onEditUser,
  onDeleteUser,
  onCreateUser,
  userProfile,
  filteredUsers,
  userSearchTerm,
  currentUserRole = 'admin'
}) => {
  const { isDarkMode } = useTheme();
  
  // Local state for profile form - hoàn toàn độc lập
  const [profileData, setProfileData] = useState(() => ({
    id: userProfile?.id || '',
    name: userProfile?.name || 'Admin User',
    email: userProfile?.email || 'admin@greengroves.com',
    password: userProfile?.password || '••••••••••',
    phone: userProfile?.phone || '123 456 789',
    phone_country_code: userProfile?.phone_country_code || 'VN',
    country: userProfile?.country || 'VN',
    address: userProfile?.address || '908 Jack Locks',
    city: userProfile?.city || 'Rancho Cordova',
    zip_code: userProfile?.zip_code || '85807',
    role: userProfile?.role || 'admin',
    status: userProfile?.status || 'active',
    is_banned: userProfile?.is_banned || false,
    avatar: userProfile?.avatar || null,
    avatar_public_id: userProfile?.avatar_public_id || null,
    avatarPreview: userProfile?.avatarPreview || null
  }));

  // Simple Users List Component
  const UsersListComponent = () => (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Users</h2>
        <button
          onClick={() => onLoadUsers()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={(e) => onUserSearchTermChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto hide-scrollbar touch-optimized">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avatar</th>
              <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
              <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</th>
              <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Role</th>
              <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
              <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((userItem) => (
              <tr key={userItem.id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <td className="py-3 px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                    isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                  }`}>
                    {userItem.avatar ? (
                      <img 
                        src={userItem.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userItem.name}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{userItem.email}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    userItem.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : userItem.role === 'moderator'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userItem.role}
                  </span>
                </td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    userItem.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userItem.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditUser(userItem)}
                      className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteUser(userItem.id)}
                      className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Create User Component
  const CreateUserComponent = () => (
    <UserCreate
      onSave={onCreateUser}
      onCancel={() => {}}
      isDarkMode={false}
      currentUserRole={currentUserRole}
    />
  );

  // Main render logic
  if (activeTab === 'user-profile') {
    return (
      <UserProfileComponent
        profileData={profileData}
        setProfileData={setProfileData}
        onUserProfileChange={onUserProfileChange}
        onSaveUserProfile={onSaveUserProfile}
        userProfile={userProfile}
      />
    );
  } else if (activeTab === 'user-list') {
    return <UsersListComponent />;
  } else if (activeTab === 'user-create') {
    return <CreateUserComponent />;
  } else if (activeTab === 'users') {
    return <UsersListComponent />;
  }

  return null;
});

export default UserManagementSection;