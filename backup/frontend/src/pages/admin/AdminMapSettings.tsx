import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Map, MapPin, CheckCircle, Eye } from 'lucide-react';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import { mapSettingService } from '../../services/api.ts';

interface MapSetting {
  id?: string;
  embed_url: string;
  location_name?: string;
  address?: string;
  is_active: boolean;
}

const AdminMapSettings: React.FC = () => {
  const [mapSettings, setMapSettings] = useState<MapSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState<MapSetting>({
    embed_url: '',
    location_name: '',
    address: '',
    is_active: true
  });

  useEffect(() => {
    loadMapSettings();
  }, []);

  const loadMapSettings = async () => {
    try {
      setLoading(true);

      const response: any = await mapSettingService.getAll();

      // Updated to handle direct array response (no wrapper)
      if (Array.isArray(response)) {
        setMapSettings(response);
      } else {
        console.error('Invalid response format:', response);
        setMapSettings([]);
      }
    } catch (err) {
      setError('Failed to load map settings');
      console.error('Error loading map settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      embed_url: '',
      location_name: '',
      address: '',
      is_active: true
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: MapSetting) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this map setting?')) {
      try {
        await mapSettingService.delete(id);
        loadMapSettings();
      } catch (err) {
        setError('Failed to delete map setting');
        console.error('Error deleting map setting:', err);
      }
    }
  };

  const handlePreview = (embedUrl: string) => {
    setPreviewUrl(embedUrl);
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // Prevent double submission
    
    try {
      setSaving(true);
      // Ensure is_active is set to true when creating new map setting
      const dataToSave = isEditing ? formData : { ...formData, is_active: true };
      
      if (isEditing && editingId) {
        await mapSettingService.update(editingId, dataToSave);
      } else {
        await mapSettingService.create(dataToSave);
      }
      setShowForm(false);
      loadMapSettings();
    } catch (err) {
      setError('Failed to save map setting');
      console.error('Error saving map setting:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading map settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Map Settings"
        subtitle="Manage Google Maps embed displayed on About Us page"
        icon={<Map className="h-10 w-10" />}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-800">Map Settings</h2>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Map</span>
        </button>
      </div>

      {/* Map Settings List */}
      <div className="grid grid-cols-1 gap-6">
        {mapSettings.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-emerald-800">
                    {item.location_name || 'Map Setting'}
                  </h3>
                  {item.is_active && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Active</span>
                    </span>
                  )}
                </div>
                {item.address && (
                  <p className="text-emerald-600 mb-3">{item.address}</p>
                )}
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {item.embed_url.substring(0, 100)}...
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handlePreview(item.embed_url)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Preview"
                >
                  <Eye className="h-5 w-5" />
                </button>
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-800">
                  {isEditing ? 'Edit Map Setting' : 'Add Map Setting'}
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
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Green Groves Office"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Google Maps Embed Code <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.embed_url}
                    onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                    rows={6}
                    required
                    placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Copy the entire iframe code from Google Maps Share → Embed a map
                  </p>
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
                    Set as active (will deactivate other maps)
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-800">Map Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div 
                className="w-full h-96 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: previewUrl }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMapSettings;

