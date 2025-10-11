import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import ImageUpload from '../ImageUpload';

interface UserProfileComponentProps {
  profileData: any;
  setProfileData: (fn: (prev: any) => any) => void;
  onUserProfileChange: (field: string, value: any) => void;
  onSaveUserProfile: () => void;
  userProfile: any;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
  profileData,
  setProfileData,
  onUserProfileChange,
  onSaveUserProfile,
  userProfile
}) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm text-gray-600">Dashboard</span>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <span className="text-sm text-gray-600">User</span>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <span className="text-sm font-medium text-gray-800">{profileData.name}</span>
      </div>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Status and Actions */}
        <div>
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-700 group bg-white/90 backdrop-blur-xl border border-gray-200/30 shadow-xl shadow-emerald-100/20 border border-emerald-100/40 hover:shadow-3xl hover:shadow-emerald-200/40 hover:scale-[1.02] hover:border-emerald-200/60">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl bg-gradient-to-br from-emerald-50/0 via-emerald-100/20 to-green-100/30"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" style={{transform: 'translateX(100%)'}}></div>
            </div>
            <div className="relative z-10">
              <div className="p-6">
                {/* Pending Status */}
                <div className="flex justify-end mb-6">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                    Pending
                  </span>
                </div>

                {/* Profile Picture */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Profile Picture</h3>
                  <ImageUpload
                    value={profileData.avatar}
                    onChange={(url) => {
                      setProfileData(prev => ({ ...prev, avatar: url }));
                      onUserProfileChange('avatar', url);
                    }}
                    onError={(error) => showToast(error, 'error')}
                    folder="user-avatar"
                    modelType="user"
                    maxSize={3}
                  />
                </div>

                {/* Account Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Account Settings</h3>
                  <div className="space-y-6">
                    {/* Status Display (Read-only) */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Account Status</h4>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${profileData.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`font-medium ${profileData.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                            {profileData.status === 'active' ? 'Active' : 'Banned'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {profileData.status === 'active' 
                            ? 'Your account is active and you can access all features.' 
                            : 'Your account has been banned. Please contact administrator for assistance.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note about account management */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Account Management
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>To change your account status or delete your account, please contact an administrator.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-16 translate-x-16 bg-gradient-to-br from-emerald-200/20 via-green-200/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-12 -translate-x-12 bg-gradient-to-tr from-teal-200/20 via-emerald-200/10 to-transparent"></div>
          </div>
        </div>

        {/* Right Column - Profile Details Form */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-700 group bg-white/90 backdrop-blur-xl border border-gray-200/30 shadow-xl shadow-emerald-100/20 border border-emerald-100/40 hover:shadow-3xl hover:shadow-emerald-200/40 hover:scale-[1.02] hover:border-emerald-200/60">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl bg-gradient-to-br from-emerald-50/0 via-emerald-100/20 to-green-100/30"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" style={{transform: 'translateX(100%)'}}></div>
            </div>
            <div className="relative z-10">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">Profile Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Full name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    placeholder="Full name"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Email address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    placeholder="Email address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Password</label>
                  <input
                    type="password"
                    value={profileData.password || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                  <p className="text-xs text-gray-500">Leave blank to keep current password</p>
                </div>

                {/* Phone number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Phone number</label>
                  <div className="flex">
                    <select 
                      value={profileData.phone_country_code || 'VN'}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone_country_code: e.target.value }))}
                      className="px-3 py-3 border border-r-0 rounded-l-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    >
                      <option value="VN">🇻🇳 (+84)</option>
                      <option value="US">🇺🇸 (+1)</option>
                      <option value="UK">🇬🇧 (+44)</option>
                    </select>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Country</label>
                  <select
                    value={profileData.country || 'VN'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                  >
                    <option value="VN">🇻🇳 Vietnam</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="JP">🇯🇵 Japan</option>
                    <option value="KR">🇰🇷 South Korea</option>
                  </select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    placeholder="City"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    placeholder="Address"
                  />
                </div>

                {/* Zip/code */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Zip/code</label>
                  <input
                    type="text"
                    value={profileData.zip_code}
                    onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                    placeholder="Zip/code"
                  />
                </div>

                {/* Role - Disabled for everyone (read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Role</label>
                  <input
                    type="text"
                    value={profileData.role === 'admin' ? 'Admin' : 'Moderator'}
                    disabled
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    Role cannot be changed from your profile. Contact admin for role changes.
                  </p>
                </div>
              </div>

                {/* Save Changes Button */}
                <div className="flex justify-end mt-8">
                  <button 
                    onClick={() => {
                      // Update parent state with local changes
                      Object.keys(profileData).forEach(key => {
                        if ((profileData as any)[key] !== (userProfile as any)[key]) {
                          onUserProfileChange(key, (profileData as any)[key]);
                        }
                      });
                      onSaveUserProfile();
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-16 translate-x-16 bg-gradient-to-br from-emerald-200/20 via-green-200/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-12 -translate-x-12 bg-gradient-to-tr from-teal-200/20 via-emerald-200/10 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserProfileComponent;
