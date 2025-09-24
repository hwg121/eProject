// API Configuration and Services for Laravel Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API Client Configuration
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('greengroves_user');
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    // Skip API call in demo mode
    throw new Error('Demo mode - API not available');
    
    const response = await this.request<{
      user: any;
      token: string;
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout_api() {
    await this.request('/auth/logout', { method: 'POST' });
    this.logout();
  }

  async getUser() {
    return this.request<any>('/auth/user');
  }

  // Dashboard Statistics
  async getDashboardStats() {
    return this.request<{
      totalUsers: number;
      totalViews: number;
      totalArticles: number;
      totalVideos: number;
      avgRating: number;
      monthlyGrowth: number;
    }>('/admin/dashboard/stats');
  }

  // Articles CRUD
  async getArticles(params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: any[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/articles?${queryParams}`);
  }

  async getArticle(id: string) {
    return this.request<any>(`/admin/articles/${id}`);
  }

  async createArticle(data: any) {
    return this.request<any>('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArticle(id: string, data: any) {
    return this.request<any>(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id: string) {
    return this.request<any>(`/admin/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Videos CRUD
  async getVideos(params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: any[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/videos?${queryParams}`);
  }

  async getVideo(id: string) {
    return this.request<any>(`/admin/videos/${id}`);
  }

  async createVideo(data: any) {
    return this.request<any>('/admin/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVideo(id: string, data: any) {
    return this.request<any>(`/admin/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVideo(id: string) {
    return this.request<any>(`/admin/videos/${id}`, {
      method: 'DELETE',
    });
  }

  // Site Settings
  async getSiteSettings() {
    return this.request<any>('/admin/settings');
  }

  async updateSiteSettings(data: any) {
    return this.request<any>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // File Upload
  async uploadFile(file: File, type: 'image' | 'video' = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<{
      url: string;
      path: string;
      filename: string;
    }>('/admin/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  // Public API endpoints (for frontend pages)
  async getPublicArticles(params?: {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: any[];
      meta: any;
    }>(`/articles?${queryParams}`);
  }

  async getPublicVideos(params?: {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: any[];
      meta: any;
    }>(`/videos?${queryParams}`);
  }

  async getPublicTools() {
    return this.request<any[]>('/tools');
  }

  async getPublicBooks() {
    return this.request<any[]>('/books');
  }

  async getPublicSeeds() {
    return this.request<any[]>('/seeds');
  }

  async getPublicPots() {
    return this.request<any[]>('/pots');
  }

  async getPublicAccessories() {
    return this.request<any[]>('/accessories');
  }

  // Analytics
  async trackPageView(page: string) {
    return this.request('/analytics/page-view', {
      method: 'POST',
      body: JSON.stringify({ page }),
    });
  }

  async getAnalytics(timeRange: string = '30d') {
    return this.request<any>(`/admin/analytics?range=${timeRange}`);
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual services for easier imports
export const authService = {
  login: (email: string, password: string) => apiClient.login(email, password),
  logout: () => apiClient.logout_api(),
  getUser: () => apiClient.getUser(),
};

export const articlesService = {
  getAll: (params?: any) => apiClient.getArticles(params),
  getById: (id: string) => apiClient.getArticle(id),
  create: (data: any) => apiClient.createArticle(data),
  update: (id: string, data: any) => apiClient.updateArticle(id, data),
  delete: (id: string) => apiClient.deleteArticle(id),
  getPublic: (params?: any) => apiClient.getPublicArticles(params),
};

export const videosService = {
  getAll: (params?: any) => apiClient.getVideos(params),
  getById: (id: string) => apiClient.getVideo(id),
  create: (data: any) => apiClient.createVideo(data),
  update: (id: string, data: any) => apiClient.updateVideo(id, data),
  delete: (id: string) => apiClient.deleteVideo(id),
  getPublic: (params?: any) => apiClient.getPublicVideos(params),
};

export const settingsService = {
  get: () => apiClient.getSiteSettings(),
  update: (data: any) => apiClient.updateSiteSettings(data),
};

export const dashboardService = {
  getStats: () => apiClient.getDashboardStats(),
  getAnalytics: (timeRange?: string) => apiClient.getAnalytics(timeRange),
};

export const uploadService = {
  uploadFile: (file: File, type?: 'image' | 'video') => apiClient.uploadFile(file, type),
};

export const publicService = {
  getTools: () => apiClient.getPublicTools(),
  getBooks: () => apiClient.getPublicBooks(),
  getSeeds: () => apiClient.getPublicSeeds(),
  getPots: () => apiClient.getPublicPots(),
  getAccessories: () => apiClient.getPublicAccessories(),
  trackPageView: (page: string) => apiClient.trackPageView(page),
};

export default apiClient;