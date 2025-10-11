import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface ContactSetting {
  id: number;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  working_hours?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSettingFormData {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  working_hours?: string;
  is_active?: boolean;
}

class ContactSettingService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get all contact settings (admin)
  async getAll(): Promise<ContactSetting[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/contact-settings`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      throw error;
    }
  }

  // Get active contact settings (public)
  async getActive(): Promise<ContactSetting | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact-settings/active`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active contact settings:', error);
      return null;
    }
  }

  // Get contact setting by ID (admin)
  async getById(id: number): Promise<ContactSetting> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/contact-settings/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact setting:', error);
      throw error;
    }
  }

  // Create new contact setting (admin)
  async create(data: ContactSettingFormData): Promise<ContactSetting> {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/contact-settings`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating contact setting:', error);
      throw error;
    }
  }

  // Update contact setting (admin)
  async update(id: number, data: ContactSettingFormData): Promise<ContactSetting> {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/contact-settings/${id}`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating contact setting:', error);
      throw error;
    }
  }

  // Delete contact setting (admin)
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/admin/contact-settings/${id}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting contact setting:', error);
      throw error;
    }
  }

  // Set contact setting as active (admin)
  async setActive(id: number): Promise<ContactSetting> {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/contact-settings/${id}`, {
        is_active: true
      }, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error setting contact setting as active:', error);
      throw error;
    }
  }
}

export const contactSettingService = new ContactSettingService();
