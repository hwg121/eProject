import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, User, Mail, Lock, Shield, UserPlus } from 'lucide-react';
import Card from '../UI/Card';
import ImageUpload from '../ImageUpload';
import SecurityPasswordModal from './SecurityPasswordModal';

interface UserCreateProps {
  onSave: (userData: any) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  currentUserRole?: string;
}

const UserCreate: React.FC<UserCreateProps> = ({
  onSave,
  onCancel,
  isDarkMode,
  currentUserRole = 'admin'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'moderator',
    status: 'active',
    phone: '',
    bio: '',
    avatar: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if creating admin role - require security password
    if (formData.role === 'admin') {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inputClass = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const labelClass = `block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onCancel}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Create New User
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Add a new user to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <User className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {currentUserRole === 'admin' && (
                <div>
                  <label className={labelClass}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={inputClass}
                  >
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin (Requires Security Password)</option>
                  </select>
                  {formData.role === 'admin' && (
                    <p className="mt-2 text-xs text-yellow-600">
                      ⚠️ Creating admin requires security password verification
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <Lock className="w-5 h-5" />
              <span>Security</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`${inputClass} ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`${inputClass} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <UserPlus className="w-5 h-5" />
              <span>Profile</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Avatar</label>
                <ImageUpload
                  value={formData.avatar}
                  onChange={(url) => handleInputChange('avatar', url)}
                  onError={(error) => alert(error)}
                  folder="user-avatar"
                  modelType="user"
                  maxSize={3}
                />
              </div>

              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={`${inputClass} h-24 resize-none`}
                  placeholder="Tell us about this user..."
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <motion.button
              type="button"
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Create User</span>
              </div>
            </motion.button>
          </div>
        </form>
      </Card>
      
      {/* Security Password Modal */}
      <SecurityPasswordModal
        isOpen={showSecurityModal}
        onClose={() => {
          setShowSecurityModal(false);
          setPendingData(null);
        }}
        onConfirm={handleSecurityConfirm}
        title="Admin Creation Requires Verification"
        message="Creating an admin user requires owner verification. Only the website owner should have this password."
      />
    </div>
  );
};

export default UserCreate;
