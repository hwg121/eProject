import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import { staffMemberService } from '../../services/api.ts';

interface StaffMember {
  id?: string;
  name: string;
  role: string;
  short_bio: string;
  avatar?: string;
  display_order: number;
  is_active: boolean;
}

const AdminStaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState<StaffMember>({
    name: '',
    role: '',
    short_bio: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      setLoading(true);

      const response: any = await staffMemberService.getAll();

      // Updated to handle direct array response (no wrapper)
      if (Array.isArray(response)) {
        setStaffMembers(response);
      } else {
        console.error('Invalid response format:', response);
        setStaffMembers([]);
      }
    } catch (err) {
      setError('Failed to load staff members');
      console.error('Error loading staff members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const maxOrder = staffMembers.length > 0 
      ? Math.max(...staffMembers.map(s => s.display_order)) 
      : 0;
    
    setFormData({
      name: '',
      role: '',
      short_bio: '',
      display_order: maxOrder + 1,
      is_active: true
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: StaffMember) => {
    setFormData(item);
    setAvatarFile(null);
    setAvatarPreview(item.avatar || '');
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffMemberService.delete(id);
        loadStaffMembers();
      } catch (err) {
        setError('Failed to delete staff member');
        console.error('Error deleting staff member:', err);
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // Prevent double submission
    
    try {
      setSaving(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('short_bio', formData.short_bio);
      submitData.append('display_order', formData.display_order.toString());
      submitData.append('is_active', formData.is_active ? '1' : '0');
      
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      if (isEditing && editingId) {
        submitData.append('_method', 'PUT');
        await staffMemberService.update(editingId, submitData);
      } else {
        await staffMemberService.create(submitData);
      }
      
      setShowForm(false);
      loadStaffMembers();
    } catch (err) {
      setError('Failed to save staff member');
      console.error('Error saving staff member:', err);
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newStaff = [...staffMembers];
    [newStaff[index - 1], newStaff[index]] = [newStaff[index], newStaff[index - 1]];
    
    const orders = newStaff.map((staff, idx) => ({
      id: staff.id!,
      display_order: idx + 1
    }));
    
    try {
      await staffMemberService.reorder(orders);
      loadStaffMembers();
    } catch (err) {
      console.error('Error reordering staff:', err);
    }
  };

  const moveDown = async (index: number) => {
    if (index === staffMembers.length - 1) return;
    const newStaff = [...staffMembers];
    [newStaff[index], newStaff[index + 1]] = [newStaff[index + 1], newStaff[index]];
    
    const orders = newStaff.map((staff, idx) => ({
      id: staff.id!,
      display_order: idx + 1
    }));
    
    try {
      await staffMemberService.reorder(orders);
      loadStaffMembers();
    } catch (err) {
      console.error('Error reordering staff:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading staff members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Staff Management"
        subtitle="Manage staff members displayed on About Us page (Maximum 5)"
        icon={<Users className="h-10 w-10" />}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-800">
          Staff Members ({staffMembers.length}/5)
        </h2>
        <button
          onClick={handleCreate}
          disabled={staffMembers.length >= 5}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Members List */}
      <div className="grid grid-cols-1 gap-6">
        {staffMembers.map((item, index) => (
          <Card key={item.id} className="p-6">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={item.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name)}
                  alt={item.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-emerald-800">{item.name}</h3>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                    #{item.display_order}
                  </span>
                  {item.is_active && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-emerald-600 font-medium mb-2">{item.role}</p>
                <p className="text-emerald-600 text-sm">{item.short_bio}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:text-gray-400 disabled:hover:bg-transparent"
                    title="Move up"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === staffMembers.length - 1}
                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:text-gray-400 disabled:hover:bg-transparent"
                    title="Move down"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-800">
                  {isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-emerald-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>Upload Avatar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG or GIF. Max 3MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      placeholder="Enter staff member name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      placeholder="e.g., CEO, Developer, Designer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Short Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.short_bio}
                    onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={4}
                    required
                    placeholder="Brief description about this staff member"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      min="1"
                    />
                  </div>

                  <div className="flex items-center pt-6">
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
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-5 w-5" />
                    <span>{saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffManagement;

