import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Monitor, CheckCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import { heroSectionService } from '../../services/api';

interface HeroSection {
  id?: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const AdminHeroSection: React.FC = () => {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HeroSection>({
    title: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadHeroSections();
  }, []);

  const loadHeroSections = async () => {
    try {
      setLoading(true);

      const response: any = await heroSectionService.getAll();

      // Updated to handle direct array response (no wrapper)
      if (Array.isArray(response)) {
        setHeroSections(response);
      } else {
        console.error('Invalid response format:', response);
        setHeroSections([]);
      }
    } catch (err) {
      setError('Failed to load hero sections');
      console.error('Error loading hero sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      is_active: true
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: HeroSection) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hero section?')) {
      try {
        await heroSectionService.delete(id);
        loadHeroSections();
      } catch (err) {
        setError('Failed to delete hero section');
        console.error('Error deleting hero section:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // Prevent double submission
    
    try {
      setSaving(true);
      // Ensure is_active is set to true when creating new hero section
      const dataToSave = isEditing ? formData : { ...formData, is_active: true };
      
      if (isEditing && editingId) {
        await heroSectionService.update(editingId, dataToSave);
      } else {
        await heroSectionService.create(dataToSave);
      }
      setShowForm(false);
      loadHeroSections();
    } catch (err) {
      setError('Failed to save hero section');
      console.error('Error saving hero section:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading hero sections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hero Section Management"
        subtitle="Manage the hero section displayed on About Us page"
        icon={<Monitor className="h-10 w-10" />}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-800">Hero Sections</h2>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New</span>
        </button>
      </div>

      {/* Hero Sections List */}
      <div className="grid grid-cols-1 gap-6">
        {heroSections.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold text-emerald-800">{item.title}</h3>
                  {item.is_active && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Active</span>
                    </span>
                  )}
                </div>
                <p className="text-emerald-600 mb-2 leading-relaxed">{item.description}</p>
                {item.created_at && (
                  <p className="text-sm text-gray-500">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
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
                  {isEditing ? 'Edit Hero Section' : 'Create Hero Section'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    placeholder="Enter hero section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={5}
                    required
                    placeholder="Enter hero section description"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-emerald-700">
                    Set as active (will deactivate other hero sections)
                  </label>
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

export default AdminHeroSection;