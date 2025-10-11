import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import ImageUpload from '../ImageUpload';
import SecurityPasswordModal from './SecurityPasswordModal';

interface UserEditFormProps {
  userData: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
  currentUserRole?: string;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  userData,
  onSave,
  onCancel,
  currentUserRole = 'admin'
}) => {
  const [formData, setFormData] = useState({
    id: userData?.id || '',
    name: userData?.name || '',
    email: userData?.email || '',
    password: '',
    phone: userData?.phone || '',
    phone_country_code: userData?.phone_country_code || 'VN',
    country: userData?.country || 'VN',
    address: userData?.address || '',
    city: userData?.city || '',
    zip_code: userData?.zip_code || '',
    role: userData?.role || 'moderator',
    status: userData?.status || 'active',
    is_banned: userData?.is_banned || false,
    avatar: userData?.avatar || '',
    avatar_public_id: userData?.avatar_public_id || ''
  });

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  
  const originalRole = userData?.role || 'moderator';

  // Update formData when userData changes (e.g., after F5/reload)
  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        phone: userData.phone || '',
        phone_country_code: userData.phone_country_code || 'VN',
        country: userData.country || 'VN',
        address: userData.address || '',
        city: userData.city || '',
        zip_code: userData.zip_code || '',
        role: userData.role || 'moderator',
        status: userData.status || 'active',
        is_banned: userData.is_banned || false,
        avatar: userData.avatar || '',
        avatar_public_id: userData.avatar_public_id || ''
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if editing admin or changing to admin - require security password
    const isChangingToAdmin = formData.role === 'admin';
    const isAlreadyAdmin = originalRole === 'admin';
    
    if (isChangingToAdmin || isAlreadyAdmin) {
      setPendingData(formData);
      setShowSecurityModal(true);
    } else {
      onSave(formData);
    }
  };
  
  const handleSecurityConfirm = (securityPassword: string) => {
    if (pendingData) {
      // Add security password to data
      const dataWithSecurity = {
        ...pendingData,
        security_password: securityPassword
      };
      onSave(dataWithSecurity);
      setShowSecurityModal(false);
      setPendingData(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm text-gray-600">Dashboard</span>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <span className="text-sm text-gray-600">User Management</span>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <span className="text-sm font-medium text-gray-800">Edit User</span>
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
                {/* User Status */}
                <div className="flex justify-end mb-6">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    formData.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.status}
                  </span>
                </div>

                {/* Profile Picture */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Profile Picture</h3>
                  <ImageUpload
                    value={formData.avatar}
                    onChange={(url) => setFormData({ ...formData, avatar: url })}
                    onError={(error) => alert(error)}
                    folder="user-avatar"
                    modelType="user"
                    maxSize={3}
                  />
                </div>

                {/* Account Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Account Settings</h3>
                  <div className="space-y-6">
                    {/* Banned Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Banned</h4>
                        <p className="text-sm text-gray-500">Apply disable account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.is_banned}
                          onChange={(e) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              is_banned: e.target.checked,
                              status: e.target.checked ? 'banned' : 'active'
                            }));
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    type="submit"
                    form="user-edit-form"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={onCancel}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-16 translate-x-16 bg-gradient-to-br from-emerald-200/20 via-green-200/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-12 -translate-x-12 bg-gradient-to-tr from-teal-200/20 via-emerald-200/10 to-transparent"></div>
          </div>
        </div>

        {/* Right Column - User Details Form */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-700 group bg-white/90 backdrop-blur-xl border border-gray-200/30 shadow-xl shadow-emerald-100/20 border border-emerald-100/40 hover:shadow-3xl hover:shadow-emerald-200/40 hover:scale-[1.02] hover:border-emerald-200/60">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl bg-gradient-to-br from-emerald-50/0 via-emerald-100/20 to-green-100/30"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" style={{transform: 'translateX(100%)'}}></div>
            </div>
            <div className="relative z-10">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">User Details</h3>
              
                <form id="user-edit-form" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Full name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        placeholder="Full name"
                        required
                      />
                    </div>

                    {/* Email address */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Email address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        placeholder="Email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Password</label>
                      <input
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                          value={formData.phone_country_code || 'VN'}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone_country_code: e.target.value }))}
                          className="px-3 py-3 border border-r-0 rounded-l-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        >
                          <option value="VN">🇻🇳 (+84)</option>
                          <option value="US">🇺🇸 (+1)</option>
                          <option value="UK">🇬🇧 (+44)</option>
                        </select>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Country</label>
                      <select
                        value={formData.country || 'VN'}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
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
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        placeholder="City"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        placeholder="Address"
                      />
                    </div>

                    {/* Zip/code */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Zip/code</label>
                      <input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        placeholder="Zip/code"
                      />
                    </div>

                    {/* Role */}
                    {currentUserRole === 'admin' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                        >
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin (Requires Security Password)</option>
                        </select>
                        {(formData.role === 'admin' || originalRole === 'admin') && (
                          <p className="mt-2 text-xs text-yellow-600">
                            ⚠️ Admin operations require security password verification
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-emerald-500 bg-white border-gray-300 text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-16 translate-x-16 bg-gradient-to-br from-emerald-200/20 via-green-200/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-12 -translate-x-12 bg-gradient-to-tr from-teal-200/20 via-emerald-200/10 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Security Password Modal */}
      <SecurityPasswordModal
        isOpen={showSecurityModal}
        onClose={() => {
          setShowSecurityModal(false);
          setPendingData(null);
        }}
        onConfirm={handleSecurityConfirm}
        title="Admin Operation Requires Verification"
        message="Editing admin users requires owner verification. Only the website owner should have this password."
      />
    </div>
  );
};

export default UserEditForm;
