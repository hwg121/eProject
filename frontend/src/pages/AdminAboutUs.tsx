import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Eye, Save, X, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import Toast from '../components/UI/Toast';
import { aboutUsService } from '../services/api.ts';
import { validateText, validateEmail, validatePhone, validateURL, hasErrors } from '../utils/validation';

interface AboutUsData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image: string;
  mission: string;
  vision: string;
  values: string;
  team_members: Array<{
    name: string;
    position: string;
    image: string;
    description: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
  }>;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_links: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  is_active: boolean;
}

const AdminAboutUs: React.FC = () => {
  const [aboutUsList, setAboutUsList] = useState<AboutUsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [errors, setErrors] = useState<{[key: string]: string | null}>({});
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
  
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#10b981'
        }
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#10b981'
    }
  };
  
  const [formData, setFormData] = useState<AboutUsData>({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    image: '',
    mission: '',
    vision: '',
    values: '',
    team_members: [],
    achievements: [],
    contact_email: '',
    contact_phone: '',
    address: '',
    social_links: {
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: ''
    },
    is_active: true
  });

  useEffect(() => {
    loadAboutUs();
  }, []);

  const loadAboutUs = async () => {
    try {
      setLoading(true);
      const data = await aboutUsService.getAll();
      setAboutUsList(data);
    } catch (err) {
      setError('Failed to load about us content');
      console.error('Error loading about us:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      content: '',
      image: '',
      mission: '',
      vision: '',
      values: '',
      team_members: [],
      achievements: [],
      contact_email: '',
      contact_phone: '',
      address: '',
      social_links: {
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: ''
      },
      is_active: true
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: AboutUsData) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this about us content?')) {
      try {
        await aboutUsService.delete(id);
        loadAboutUs();
      } catch (err) {
        setError('Failed to delete about us content');
        console.error('Error deleting about us:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string | null} = {};
    newErrors.title = validateText(formData.title, 3, 200, 'Title', true);
    newErrors.subtitle = validateText(formData.subtitle, 5, 500, 'Subtitle', false);
    newErrors.description = validateText(formData.description, 10, 5000, 'Description', true);
    newErrors.content = validateText(formData.content, 10, 10000, 'Content', false);
    newErrors.mission = validateText(formData.mission, 10, 2000, 'Mission', false);
    newErrors.vision = validateText(formData.vision, 10, 2000, 'Vision', false);
    newErrors.values = validateText(formData.values, 10, 2000, 'Values', false);
    
    if (formData.contact_email) newErrors.contact_email = validateEmail(formData.contact_email);
    if (formData.contact_phone) newErrors.contact_phone = validatePhone(formData.contact_phone);
    if (formData.address) newErrors.address = validateText(formData.address, 5, 200, 'Address', false);
    if (formData.image) newErrors.image = validateURL(formData.image, false);
    if (formData.social_links.facebook) newErrors.facebook = validateURL(formData.social_links.facebook, false);
    if (formData.social_links.instagram) newErrors.instagram = validateURL(formData.social_links.instagram, false);
    if (formData.social_links.youtube) newErrors.youtube = validateURL(formData.social_links.youtube, false);
    
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }
    
    setErrors({});
    
    try {
      if (isEditing && editingId) {
        await aboutUsService.update(editingId, formData);
        showToast('About Us updated successfully!', 'success');
      } else {
        await aboutUsService.create(formData);
        showToast('About Us created successfully!', 'success');
      }
      setShowForm(false);
      loadAboutUs();
    } catch (err) {
      setError('Failed to save about us content');
      showToast('Failed to save about us content', 'error');
      console.error('Error saving about us:', err);
    }
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team_members: [
        ...formData.team_members,
        { name: '', position: '', image: '', description: '' }
      ]
    });
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      team_members: formData.team_members.filter((_, i) => i !== index)
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...formData.team_members];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, team_members: updated });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [
        ...formData.achievements,
        { title: '', description: '' }
      ]
    });
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    const updated = [...formData.achievements];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, achievements: updated });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading about us content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage About Us"
        subtitle="Create and manage about us content"
        icon={<Users className="h-10 w-10" />}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-800">About Us Content</h2>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New</span>
        </button>
      </div>

      {/* About Us List */}
      <div className="grid grid-cols-1 gap-6">
        {aboutUsList.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">{item.title}</h3>
                <p className="text-emerald-600 mb-2">{item.subtitle}</p>
                <p className="text-emerald-600 text-sm mb-4">{item.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-2 py-1 rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-emerald-600">
                    {item.team_members?.length || 0} team members
                  </span>
                  <span className="text-emerald-600">
                    {item.achievements?.length || 0} achievements
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-800">
                  {isEditing ? 'Edit About Us' : 'Create About Us'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="Title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        setErrors({ ...errors, title: null });
                      }}
                      error={!!errors.title}
                      helperText={errors.title}
                      required
                      inputProps={{ minLength: 3, maxLength: 200 }}
                      sx={textFieldStyles}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      label="Subtitle"
                      value={formData.subtitle}
                      onChange={(e) => {
                        setFormData({ ...formData, subtitle: e.target.value });
                        setErrors({ ...errors, subtitle: null });
                      }}
                      error={!!errors.subtitle}
                      helperText={errors.subtitle}
                      inputProps={{ minLength: 5, maxLength: 500 }}
                      sx={textFieldStyles}
                    />
                  </div>
                </div>

                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setErrors({ ...errors, description: null });
                    }}
                    error={!!errors.description}
                    helperText={errors.description}
                    required
                    inputProps={{ minLength: 10, maxLength: 5000 }}
                    sx={textFieldStyles}
                  />
                </div>

                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Content"
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({ ...formData, content: e.target.value });
                      setErrors({ ...errors, content: null });
                    }}
                    error={!!errors.content}
                    helperText={errors.content}
                    inputProps={{ minLength: 10, maxLength: 10000 }}
                    sx={textFieldStyles}
                  />
                </div>

                <div>
                  <TextField
                    fullWidth
                    size="small"
                    label="Image URL"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setErrors({ ...errors, image: null });
                    }}
                    error={!!errors.image}
                    helperText={errors.image}
                    placeholder="https://example.com/image.jpg"
                    sx={textFieldStyles}
                  />
                </div>

                {/* Mission, Vision, Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Mission"
                      value={formData.mission}
                      onChange={(e) => {
                        setFormData({ ...formData, mission: e.target.value });
                        setErrors({ ...errors, mission: null });
                      }}
                      error={!!errors.mission}
                      helperText={errors.mission}
                      inputProps={{ minLength: 10, maxLength: 2000 }}
                      sx={textFieldStyles}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Vision"
                      value={formData.vision}
                      onChange={(e) => {
                        setFormData({ ...formData, vision: e.target.value });
                        setErrors({ ...errors, vision: null });
                      }}
                      error={!!errors.vision}
                      helperText={errors.vision}
                      inputProps={{ minLength: 10, maxLength: 2000 }}
                      sx={textFieldStyles}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Values"
                      value={formData.values}
                      onChange={(e) => {
                        setFormData({ ...formData, values: e.target.value });
                        setErrors({ ...errors, values: null });
                      }}
                      error={!!errors.values}
                      helperText={errors.values}
                      inputProps={{ minLength: 10, maxLength: 2000 }}
                      sx={textFieldStyles}
                    />
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-emerald-700">Team Members</label>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Add Member
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.team_members.map((member, index) => (
                      <div key={index} className="border border-emerald-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-emerald-800">Team Member {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            className="px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            value={member.position}
                            onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                            className="px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={member.image}
                            onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                            className="px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <textarea
                            placeholder="Description"
                            value={member.description}
                            onChange={(e) => updateTeamMember(index, 'description', e.target.value)}
                            className="px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-emerald-700">Achievements</label>
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Add Achievement
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="border border-emerald-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-emerald-800">Achievement {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Title"
                            value={achievement.title}
                            onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <textarea
                            placeholder="Description"
                            value={achievement.description}
                            onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      value={formData.social_links.facebook}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links, facebook: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">Instagram URL</label>
                    <input
                      type="url"
                      value={formData.social_links.instagram}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links, instagram: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">YouTube URL</label>
                    <input
                      type="url"
                      value={formData.social_links.youtube}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links, youtube: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">TikTok URL</label>
                    <input
                      type="url"
                      value={formData.social_links.tiktok}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links, tiktok: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-emerald-700">
                    Active
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>{isEditing ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toast
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default AdminAboutUs;
