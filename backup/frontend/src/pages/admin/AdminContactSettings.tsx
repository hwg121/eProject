import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Clock,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { contactSettingService, ContactSetting, ContactSettingFormData } from '../../services/contactSettingService';

const AdminContactSettings: React.FC = () => {
  const [contactSettings, setContactSettings] = useState<ContactSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ContactSettingFormData>({
    email: '',
    phone: '',
    address: '',
    website: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    working_hours: '',
    is_active: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactSettingService.getAll();
      setContactSettings(data);
    } catch (err) {
      setError('Failed to load contact settings');
      console.error('Error loading contact settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (editingId) {
        await contactSettingService.update(editingId, formData);
        setSuccessMessage('Contact settings updated successfully!');
      } else {
        await contactSettingService.create(formData);
        setSuccessMessage('Contact settings created successfully!');
      }
      
      await loadContactSettings();
      
      // Close form after showing success message
      setTimeout(() => {
        resetForm();
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save contact settings');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (contactSetting: ContactSetting) => {
    setFormData({
      email: contactSetting.email || '',
      phone: contactSetting.phone || '',
      address: contactSetting.address || '',
      website: contactSetting.website || '',
      facebook: contactSetting.facebook || '',
      instagram: contactSetting.instagram || '',
      youtube: contactSetting.youtube || '',
      linkedin: contactSetting.linkedin || '',
      working_hours: contactSetting.working_hours || '',
      is_active: contactSetting.is_active
    });
    setEditingId(contactSetting.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact setting?')) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      await contactSettingService.delete(id);
      setSuccessMessage('Contact settings deleted successfully!');
      await loadContactSettings();
      
      // Auto-dismiss success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete contact settings');
      console.error('Delete error:', err);
    }
  };

  const handleSetActive = async (id: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await contactSettingService.setActive(id);
      setSuccessMessage('Contact setting set as active!');
      await loadContactSettings();
      
      // Auto-dismiss success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set contact setting as active');
      console.error('Set active error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      phone: '',
      address: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      working_hours: '',
      is_active: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setFormData({
      email: '',
      phone: '',
      address: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      working_hours: '',
      is_active: false
    });
    setEditingId(null);
    setShowForm(true);
  };

  const filteredSettings = showActiveOnly 
    ? contactSettings.filter(setting => setting.is_active)
    : contactSettings;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contact settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-teal-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Contact Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage contact information displayed on website
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  showActiveOnly
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                }`}
              >
                {showActiveOnly ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {showActiveOnly ? 'Show All' : 'Active Only'}
                </span>
              </button>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add New</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
            >
              <Check className="h-5 w-5 text-green-500" />
              <p className="text-green-700 dark:text-green-300">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${editingId ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-emerald-50 dark:bg-emerald-900/10'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                      {editingId ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {editingId ? 'Edit Contact Settings' : 'Add New Contact Settings'}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {editingId ? 'Update existing contact information' : 'Create new contact information'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="contact@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Address
                    </label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="123 Main Street, City, State 12345"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Globe className="h-4 w-4 inline mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Working Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={formData.working_hours || ''}
                      onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Mon-Fri: 9AM-6PM"
                    />
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Facebook className="h-4 w-4 inline mr-2" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.facebook || ''}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Instagram className="h-4 w-4 inline mr-2" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Youtube className="h-4 w-4 inline mr-2" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={formData.youtube || ''}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Linkedin className="h-4 w-4 inline mr-2" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin || ''}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.is_active || false}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Set as active contact settings (only one can be active at a time)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-3 bg-gradient-to-r ${editingId ? 'from-blue-500 to-blue-600' : 'from-emerald-500 to-green-500'} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2`}
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{submitting ? 'Saving...' : (editingId ? 'Update Settings' : 'Create Settings')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Settings List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSettings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`p-4 ${setting.is_active ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className={`h-5 w-5 ${setting.is_active ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`font-semibold ${setting.is_active ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Contact Settings #{setting.id}
                    </span>
                  </div>
                  {setting.is_active && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-white/20 rounded-full">
                      <Check className="h-3 w-3 text-white" />
                      <span className="text-xs text-white font-medium">Active</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {setting.email && (
                    <div className="flex items-start space-x-3">
                      <Mail className="h-4 w-4 text-emerald-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white font-medium">{setting.email}</p>
                      </div>
                    </div>
                  )}

                  {setting.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-4 w-4 text-emerald-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="text-gray-900 dark:text-white font-medium">{setting.phone}</p>
                      </div>
                    </div>
                  )}

                  {setting.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-emerald-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                        <p className="text-gray-900 dark:text-white font-medium">{setting.address}</p>
                      </div>
                    </div>
                  )}

                  {setting.working_hours && (
                    <div className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-emerald-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hours</p>
                        <p className="text-gray-900 dark:text-white font-medium">{setting.working_hours}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {setting.website && (
                      <a href={setting.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Globe className="h-3 w-3" />
                        <span>Website</span>
                      </a>
                    )}
                    {setting.facebook && (
                      <a href={setting.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors">
                        <Facebook className="h-3 w-3" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {setting.instagram && (
                      <a href={setting.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-pink-600 text-white rounded-md text-xs hover:bg-pink-700 transition-colors">
                        <Instagram className="h-3 w-3" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {setting.youtube && (
                      <a href={setting.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
                        <Youtube className="h-3 w-3" />
                        <span>YouTube</span>
                      </a>
                    )}
                    {setting.linkedin && (
                      <a href={setting.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-blue-700 text-white rounded-md text-xs hover:bg-blue-800 transition-colors">
                        <Linkedin className="h-3 w-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(setting.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {!setting.is_active && (
                      <button
                        onClick={() => handleSetActive(setting.id)}
                        className="p-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                        title="Set as Active"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(setting)}
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(setting.id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSettings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {showActiveOnly ? 'No Active Contact Settings' : 'No Contact Settings'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {showActiveOnly 
                ? 'There are no active contact settings. Create one and set it as active.'
                : 'Get started by creating your first contact settings.'
              }
            </p>
            {!showActiveOnly && (
              <button
                onClick={handleAddNew}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create Contact Settings</span>
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminContactSettings;
