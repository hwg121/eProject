// API Configuration and Services for Laravel Backend with Sanctum Authentication
import type { 
  InteractionResponse
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://103.252.93.249/api';


// API Client Configuration
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Always refresh token before making requests
    this.token = localStorage.getItem('auth_token');
    
    // Check if this is a protected endpoint that requires authentication
    const isProtectedEndpoint = endpoint.includes('/users') || 
                               endpoint.includes('/admin/') || 
                               endpoint.includes('/auth/logout') ||
                               endpoint.includes('/auth/me') ||
                               endpoint.includes('/auth/refresh');
    
    if (isProtectedEndpoint) {
      // Check if user has logged out
      const hasLoggedOut = localStorage.getItem('user_logged_out') === 'true';
      if (hasLoggedOut) {
        throw new Error('User has logged out');
      }
      
    }
    
    // Check if this is a file upload request
    const isFileUpload = options.body instanceof FormData;
    
    const config: RequestInit = {
      headers: {
        // Don't set Content-Type for FormData uploads - let browser set it with boundary
        ...(isFileUpload ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug headers for protected endpoints
    if (isProtectedEndpoint) {
      const headers = config.headers as Record<string, string>;
      console.log('🔐 Protected endpoint request:', {
        endpoint,
        hasToken: !!this.token,
        token: this.token ? `${this.token.substring(0, 20)}...` : 'null',
        authorization: headers.Authorization || 'missing'
      });
    }

    try {
      const response = await fetch(url, config);
      
      // Debug response for protected endpoints
      if (isProtectedEndpoint) {
      }
      
      // Handle different response status codes
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('API Error Response:', errorData);
        } catch {
        }
        
        if (response.status === 401) {
          // Only redirect to login if this is a protected endpoint
          if (isProtectedEndpoint) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('greengroves_user');
            localStorage.setItem('user_logged_out', 'true');
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
        
        throw new Error(errorMessage);
      }
      
      // This duplicate check is removed since we already handle it above

      const data = await response.json();
      
      // For upload endpoints, return the full response object
      if (endpoint.includes('/upload/')) {
        return data;
      }
      
      // Handle Laravel API response format for other endpoints
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // Return empty array for network errors instead of throwing
      if (error instanceof TypeError) {
        return [] as T;
      }
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  refreshToken() {
    this.token = localStorage.getItem('auth_token');
    return this.token;
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
      user: unknown;
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
    return this.request<unknown>('/auth/user');
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
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/articles?${queryParams}`);
  }

  async getArticle(id: string) {
    return this.request<unknown>(`/admin/articles/${id}`);
  }

  async createArticle(data: unknown) {
    return this.request<unknown>('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArticle(id: string, data: unknown) {
    return this.request<unknown>(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id: string) {
    return this.request<unknown>(`/admin/articles/${id}`, {
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
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/videos?${queryParams}`);
  }

  async getVideo(id: string) {
    return this.request<unknown>(`/admin/videos/${id}`);
  }

  async createVideo(data: unknown) {
    return this.request<unknown>('/admin/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVideo(id: string, data: Record<string, unknown>) {
    const formData = {
      ...data,
      _method: 'PUT'
    };
    
    return this.request<unknown>(`/admin/videos/${id}`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async deleteVideo(id: string) {
    return this.request<unknown>(`/admin/videos/${id}`, {
      method: 'DELETE',
    });
  }

  // Site Settings
  async getSiteSettings() {
    return this.request<unknown>('/admin/settings');
  }

  async updateSiteSettings(data: unknown) {
    return this.request<unknown>('/admin/settings', {
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

  // Image Upload - SIMPLE VERSION
  async uploadImage(file: File, folder: string = 'featured-images', modelType: string = 'video') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('model_type', modelType);

    try {
      // Try authenticated endpoint first
      const response = await this.request<{
        success: boolean;
        message: string;
        data: {
          url: string;
          public_id: string;
          folder: string;
          width?: number;
          height?: number;
          format?: string;
          bytes?: number;
        };
      }>('/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        return {
          success: true,
          data: {
            url: response.data.url,
            public_id: response.data.public_id,
            folder: response.data.folder,
            width: response.data.width,
            height: response.data.height,
            format: response.data.format,
            bytes: response.data.bytes
          }
        };
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Authenticated upload failed, trying test endpoint:', error);
      
      // Fallback to test endpoint if authenticated upload fails
      try {
        const testResponse = await this.request<{
          success: boolean;
          message: string;
          data: {
            url: string;
            public_id: string;
            folder: string;
            width?: number;
            height?: number;
            format?: string;
            bytes?: number;
          };
        }>('/test/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (testResponse.success) {
          return {
            success: true,
            data: {
              url: testResponse.data.url,
              public_id: testResponse.data.public_id,
              folder: testResponse.data.folder,
              width: testResponse.data.width,
              height: testResponse.data.height,
              format: testResponse.data.format,
              bytes: testResponse.data.bytes
            }
          };
        } else {
          throw new Error(testResponse.message || 'Test upload failed');
        }
      } catch (testError) {
        console.error('Test upload also failed:', testError);
        throw testError;
      }
    }
  }

  // Public API endpoints (for frontend pages)
  async getPublicArticles() {
    try {
      return await this.request<unknown[]>('/articles');
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  async getPublicVideos() {
    try {
      return await this.request<unknown[]>('/videos');
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getPublicTools() {
    try {
      return await this.request<unknown[]>('/products?category=tool');
    } catch (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }
  }

  async getPublicBooks() {
    try {
      return await this.request<unknown[]>('/products?category=book');
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async getPublicEssentials() {
    try {
      return await this.request<unknown[]>('/essentials');
    } catch (error) {
      console.error('Error fetching essentials:', error);
      throw error;
    }
  }

  async getPublicPots() {
    try {
      return await this.request<unknown[]>('/products?category=pot');
    } catch (error) {
      console.error('Error fetching pots:', error);
      throw error;
    }
  }

  async getPublicAccessories() {
    try {
      return await this.request<unknown[]>('/products?category=accessory');
    } catch (error) {
      console.error('Error fetching accessories:', error);
      throw error;
    }
  }

  async getPublicSuggestions() {
    try {
      return await this.request<unknown[]>('/products?category=suggestion');
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  }

  // About Us methods
  async getAboutUs() {
    try {
      return await this.request<unknown[]>('/about-us');
    } catch (error) {
      console.error('Error fetching about us:', error);
      return Promise.resolve([]);
    }
  }

  async getActiveAboutUs() {
    try {
      return await this.request<unknown>('/about-us/active');
    } catch (error) {
      console.error('Error fetching active about us:', error);
      return Promise.resolve(null);
    }
  }

  async getAboutUsById(id: string) {
    try {
      return await this.request<unknown>(`/about-us/${id}`);
    } catch (error) {
      console.error('Error fetching about us by id:', error);
      return Promise.resolve(null);
    }
  }

  async createAboutUs(data: unknown) {
    try {
      return await this.request<unknown>('/about-us', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error creating about us:', error);
      throw error;
    }
  }

  async updateAboutUs(id: string, data: unknown) {
    try {
      return await this.request<unknown>(`/about-us/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating about us:', error);
      throw error;
    }
  }

  async deleteAboutUs(id: string) {
    try {
      return await this.request<unknown>(`/about-us/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting about us:', error);
      throw error;
    }
  }

  // Contact methods
  async sendContactMessage(data: unknown) {
    try {
      return await this.request<unknown>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  }

  async getContactMessages() {
    try {
      return await this.request<unknown[]>('/contact-messages');
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return Promise.resolve([]);
    }
  }

  async getContactMessage(id: string) {
    try {
      return await this.request<unknown>(`/contact-messages/${id}`);
    } catch (error) {
      console.error('Error fetching contact message:', error);
      return Promise.resolve(null);
    }
  }

  async updateContactMessage(id: string, data: unknown) {
    try {
      return await this.request<unknown>(`/contact-messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating contact message:', error);
      throw error;
    }
  }

  async deleteContactMessage(id: string) {
    try {
      return await this.request<unknown>(`/contact-messages/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }
  }

  async getPublicSeeds() {
    try {
      const response = await this.request('/api/public/seeds', { method: 'GET' }) as { data: unknown[] };
      return response.data;
    } catch (error) {
      console.error('Error fetching seeds:', error);
      return [];
    }
  }

  // User Management
  async getUsers(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/users?${queryParams}`);
  }

  async getUserById(id: string) {
    return this.request<unknown>(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request<unknown>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<unknown>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteUser(id: string) {
    return this.request<unknown>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserProfile() {
    return this.request<unknown>('/user/profile');
  }

  async updateUserProfile(data: any) {
    const url = `${this.baseURL}/user/profile`;
    
    const config: RequestInit = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Unauthorized');
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse JSON, use default message
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Return full response object to maintain consistency with other API calls
      return result;
    } catch (error) {
      console.error('Profile update request failed:', error);
      throw error;
    }
  }

  // Product Management
  async getProducts(params?: {
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getProduct(id: string) {
    return this.request<unknown>(`/products/${id}`);
  }

  async createProduct(data: FormData) {
    return this.request<unknown>('/products', {
      method: 'POST',
      body: data,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateProduct(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/products/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteProduct(id: string) {
    return this.request<unknown>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Books CRUD - now uses products with category filter
  async getBooks(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    queryParams.append('category', 'book'); // Always filter by book category
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getBook(id: string) {
    return this.request<unknown>(`/books/${id}`);
  }

  async createBook(data: FormData) {
    return this.request<unknown>('/books', {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateBook(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/books/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteBook(id: string) {
    return this.request<unknown>(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Tools CRUD - now uses products with category filter
  async getTools(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    queryParams.append('category', 'tool'); // Always filter by tool category
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getTool(id: string) {
    return this.request<unknown>(`/tools/${id}`);
  }

  async createTool(data: FormData) {
    return this.request<unknown>('/tools', {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateTool(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/tools/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteTool(id: string) {
    return this.request<unknown>(`/tools/${id}`, {
      method: 'DELETE',
    });
  }

  // Essentials CRUD
  async getEssentials(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    queryParams.append('category', 'tool'); // Essentials now use tool category
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getEssential(id: string) {
    return this.request<unknown>(`/essentials/${id}`);
  }

  async createEssential(data: FormData) {
    return this.request<unknown>('/essentials', {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateEssential(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/essentials/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteEssential(id: string) {
    return this.request<unknown>(`/essentials/${id}`, {
      method: 'DELETE',
    });
  }

  // Pots CRUD
  async getPots(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    queryParams.append('category', 'pot'); // Always filter by pot category
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getPot(id: string) {
    return this.request<unknown>(`/pots/${id}`);
  }

  async createPot(data: FormData) {
    return this.request<unknown>('/pots', {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updatePot(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/pots/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deletePot(id: string) {
    return this.request<unknown>(`/pots/${id}`, {
      method: 'DELETE',
    });
  }

  // Accessories CRUD
  async getAccessories(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    queryParams.append('category', 'accessory'); // Always filter by accessory category
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getAccessory(id: string) {
    return this.request<unknown>(`/accessories/${id}`);
  }

  async createAccessory(data: FormData) {
    return this.request<unknown>('/accessories', {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateAccessory(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/accessories/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteAccessory(id: string) {
    return this.request<unknown>(`/accessories/${id}`, {
      method: 'DELETE',
    });
  }

  // Suggestions CRUD
  async getSuggestions(params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    queryParams.append('category', 'suggestion'); // Always filter by suggestion category
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: unknown[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/products?${queryParams}`);
  }

  async getSuggestion(id: string) {
    return this.request<unknown>(`/suggestions/${id}`);
  }

  async createSuggestion(data: FormData) {
    return this.request<unknown>('/suggestions', {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async updateSuggestion(id: string, data: FormData) {
    // Laravel has issues with FormData + PUT, use POST with _method
    data.append('_method', 'PUT');
    return this.request<unknown>(`/suggestions/${id}`, {
      method: 'POST',
      body: data,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  async deleteSuggestion(id: string) {
    return this.request<unknown>(`/suggestions/${id}`, {
      method: 'DELETE',
    });
  }

  // User Interactions
  async toggleLike(contentType: string, contentId: number) {
    try {
      return await this.request<InteractionResponse>('/interactions/like', {
        method: 'POST',
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
        }),
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      // Return error response instead of mock data
      return {
        success: false,
        message: 'Failed to toggle like',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async submitRating(contentType: string, contentId: number, rating: number) {
    try {
      return await this.request<InteractionResponse>('/interactions/rating', {
        method: 'POST',
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          rating: rating,
        }),
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Return error response instead of mock data
      return {
        success: false,
        message: 'Failed to submit rating',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getUserInteractions(contentType: string, contentId: number) {
    try {
      return await this.request<InteractionResponse>(`/interactions/user?content_type=${contentType}&content_id=${contentId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error getting user interactions:', error);
      // Return error response instead of mock data
      return {
        success: false,
        message: 'Failed to get user interactions',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async trackView(contentType: string, contentId: number) {
    try {
      return await this.request<InteractionResponse>('/interactions/view', {
        method: 'POST',
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
        }),
      });
    } catch (error) {
      console.error('Error tracking view:', error);
      // Return error response instead of mock data
      return {
        success: false,
        message: 'Failed to track view',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getContentStats(contentType: string, contentId: number) {
    try {
      return await this.request<InteractionResponse>(`/interactions/stats?content_type=${contentType}&content_id=${contentId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error getting content stats:', error);
      // Return error response instead of mock data
      return {
        success: false,
        message: 'Failed to get content stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Analytics
  async trackPageView(page: string) {
    return this.request('/analytics/page-view', {
      method: 'POST',
      body: JSON.stringify({ page }),
    });
  }

  async getAnalytics(timeRange: string = '30d') {
    return this.request<unknown>(`/admin/analytics?range=${timeRange}`);
  }

  // Generic delete method for different content types
  async deleteItem(id: string, type: string) {
    const endpoints: { [key: string]: string } = {
      'articles': '/articles',
      'videos': '/videos', 
      'books': '/books',
      'tools': '/tools',
      'essentials': '/essentials',
      'pots': '/pots',
      'accessories': '/accessories',
      'suggestions': '/suggestions',
      'about-us': '/about-us'
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown content type: ${type}`);
    }

    return this.request<unknown>(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic create method for different content types
  async createItem(data: unknown, type: string) {
    const endpoints: { [key: string]: string } = {
      'articles': '/articles',
      'videos': '/videos', 
      'books': '/books',
      'tools': '/tools',
      'essentials': '/essentials',
      'pots': '/pots',
      'accessories': '/accessories',
      'suggestions': '/suggestions',
      'about-us': '/about-us'
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown content type: ${type}`);
    }

    return this.request<unknown>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic update method for different content types
  async updateItem(id: string, data: unknown, type: string) {
    const endpoints: { [key: string]: string } = {
      'articles': '/articles',
      'videos': '/videos', 
      'books': '/books',
      'tools': '/tools',
      'essentials': '/essentials',
      'pots': '/pots',
      'accessories': '/accessories',
      'suggestions': '/suggestions',
      'about-us': '/about-us'
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown content type: ${type}`);
    }

    return this.request<unknown>(`${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
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
  getAll: () => apiClient.getArticles(),
  getById: (id: string) => apiClient.getArticle(id),
  create: (data: unknown) => apiClient.createArticle(data),
  update: (id: string, data: unknown) => apiClient.updateArticle(id, data),
  delete: (id: string) => apiClient.deleteArticle(id),
  getPublic: () => apiClient.getPublicArticles(),
};

export const videosService = {
  getAll: () => apiClient.getVideos(),
  getById: (id: string) => apiClient.getVideo(id),
  create: (data: unknown) => apiClient.createVideo(data),
  update: (id: string, data: Record<string, unknown>) => apiClient.updateVideo(id, data),
  delete: (id: string) => apiClient.deleteVideo(id),
  getPublic: () => apiClient.getPublicVideos(),
};

export const settingsService = {
  get: () => apiClient.getSiteSettings(),
  update: (data: unknown) => apiClient.updateSiteSettings(data),
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
  getArticles: () => apiClient.getPublicArticles(),
  getVideos: () => apiClient.getPublicVideos(),
  getBooks: () => apiClient.getPublicBooks(),
  getEssentials: () => apiClient.getPublicEssentials(),
  getSeeds: () => apiClient.getPublicSeeds(),
  getPots: () => apiClient.getPublicPots(),
  getAccessories: () => apiClient.getPublicAccessories(),
  getSuggestions: () => apiClient.getPublicSuggestions(),
  getAboutUs: () => apiClient.getAboutUs(),
  getActiveAboutUs: () => apiClient.getActiveAboutUs(),
  trackPageView: (page: string) => apiClient.trackPageView(page),
  deleteItem: (id: string, type: string) => apiClient.deleteItem(id, type),
  createItem: (data: unknown, type: string) => apiClient.createItem(data, type),
  updateItem: (id: string, data: unknown, type: string) => apiClient.updateItem(id, data, type),
};

export const aboutUsService = {
  getAll: () => apiClient.getAboutUs(),
  getActive: () => apiClient.getActiveAboutUs(),
  getById: (id: string) => apiClient.getAboutUsById(id),
  create: (data: unknown) => apiClient.createAboutUs(data),
  update: (id: string, data: unknown) => apiClient.updateAboutUs(id, data),
  delete: (id: string) => apiClient.deleteAboutUs(id),
};

export const contactService = {
  sendMessage: (data: unknown) => apiClient.sendContactMessage(data),
  getAll: () => apiClient.getContactMessages(),
  getById: (id: string) => apiClient.getContactMessage(id),
  update: (id: string, data: unknown) => apiClient.updateContactMessage(id, data),
  delete: (id: string) => apiClient.deleteContactMessage(id),
};

export const interactionService = {
  toggleLike: (contentType: string, contentId: number) => apiClient.toggleLike(contentType, contentId),
  submitRating: (contentType: string, contentId: number, rating: number) => apiClient.submitRating(contentType, contentId, rating),
  trackView: (contentType: string, contentId: number) => apiClient.trackView(contentType, contentId),
  getUserInteractions: (contentType: string, contentId: number) => apiClient.getUserInteractions(contentType, contentId),
  getContentStats: (contentType: string, contentId: number) => apiClient.getContentStats(contentType, contentId),
};

export const userService = {
  getAll: (params?: Record<string, unknown>) => apiClient.getUsers(params),
  getById: (id: string) => apiClient.getUserById(id),
  create: (data: FormData) => apiClient.createUser(data),
  update: (id: string, data: FormData) => apiClient.updateUser(id, data),
  delete: (id: string) => apiClient.deleteUser(id),
  getProfile: () => apiClient.getUserProfile(),
  updateProfile: (data: any) => apiClient.updateUserProfile(data),
};

export const productService = {
  getAll: (params?: Record<string, unknown>) => apiClient.getProducts(params),
  getByCategory: (category: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append('category', category);
    return apiClient.getProducts({ category });
  },
  getById: (id: string) => apiClient.getProduct(id),
  create: (data: Record<string, unknown>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    return apiClient.createProduct(formData);
  },
  update: async (id: string, data: Record<string, unknown>) => {
    // Log update for debugging
    console.log('Updating product:', { id, dataKeys: Object.keys(data) });
    
    // Get API base URL and token
    const apiBaseUrl = API_BASE_URL;
    const token = localStorage.getItem('auth_token');
    
    // Check if data contains File objects
    const hasFile = Object.values(data).some(value => value instanceof File);
    
    if (hasFile) {
      // Use FormData for file uploads - POST with _method=PUT to /admin/products/{id}
      const formData = new FormData();
      formData.append('_method', 'PUT');
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Use POST to /admin/products/{id} with _method=PUT for FormData
      const url = `${apiBaseUrl}/admin/products/${id}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } else {
      // Use JSON PUT for simple data updates to /admin/products/{id}
      const url = `${apiBaseUrl}/admin/products/${id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    }
  },
  delete: (id: string) => apiClient.deleteProduct(id),
  getFeatured: () => apiClient.getProducts(),
};

// Legacy services - redirect to productService
export const booksService = {
  getAll: () => productService.getByCategory('book'),
  getById: (id: string) => productService.getById(id),
  create: (data: Record<string, unknown>) => productService.create({ ...data, category: 'book' }),
  update: (id: string, data: Record<string, unknown>) => productService.update(id, { ...data, category: 'book' }),
  delete: (id: string) => productService.delete(id),
};

export const toolsService = {
  getAll: () => productService.getByCategory('tool'),
  getById: (id: string) => productService.getById(id),
  create: (data: Record<string, unknown>) => productService.create({ ...data, category: 'tool' }),
  update: (id: string, data: Record<string, unknown>) => productService.update(id, { ...data, category: 'tool' }),
  delete: (id: string) => productService.delete(id),
};

export const potsService = {
  getAll: () => productService.getByCategory('pot'),
  getById: (id: string) => productService.getById(id),
  create: (data: Record<string, unknown>) => productService.create({ ...data, category: 'pot' }),
  update: (id: string, data: Record<string, unknown>) => productService.update(id, { ...data, category: 'pot' }),
  delete: (id: string) => productService.delete(id),
};

export const accessoriesService = {
  getAll: () => productService.getByCategory('accessory'),
  getById: (id: string) => productService.getById(id),
  create: (data: Record<string, unknown>) => productService.create({ ...data, category: 'accessory' }),
  update: (id: string, data: Record<string, unknown>) => productService.update(id, { ...data, category: 'accessory' }),
  delete: (id: string) => productService.delete(id),
};

export const suggestionsService = {
  getAll: () => productService.getByCategory('suggestion'),
  getById: (id: string) => productService.getById(id),
  create: (data: Record<string, unknown>) => productService.create({ ...data, category: 'suggestion' }),
  update: (id: string, data: Record<string, unknown>) => productService.update(id, { ...data, category: 'suggestion' }),
  delete: (id: string) => productService.delete(id),
};

// Activity Log Service
export const activityLogService = {
  getAll: (params?: { activity_type?: 'public' | 'security'; per_page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiClient.request(`/admin/activity-logs?${queryParams}`, { method: 'GET' });
  },
  getPublicActivities: (limit?: number) => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    return apiClient.request(`/admin/activity-logs/public?${queryParams}`, { method: 'GET' });
  },
  getSecurityActivities: (limit?: number) => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    return apiClient.request(`/admin/activity-logs/security?${queryParams}`, { method: 'GET' });
  },
  getRecentActivities: (limit?: number) => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    return apiClient.request(`/admin/activity-logs/recent?${queryParams}`, { method: 'GET' });
  },
  clearOldLogs: (days?: number) => {
    const queryParams = new URLSearchParams();
    if (days) queryParams.append('days', days.toString());
    return apiClient.request(`/admin/activity-logs/clear?${queryParams}`, { method: 'DELETE' });
  },
};

// Hero Section Service
export const heroSectionService = {
  // Public
  getActive: () => apiClient.request('/hero-sections/active', { method: 'GET' }),
  
  // Admin
  getAll: () => apiClient.request('/admin/hero-sections', { method: 'GET' }),
  getById: (id: string) => apiClient.request(`/admin/hero-sections/${id}`, { method: 'GET' }),
  create: (data: Record<string, unknown>) => apiClient.request('/admin/hero-sections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Record<string, unknown>) => apiClient.request(`/admin/hero-sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiClient.request(`/admin/hero-sections/${id}`, { method: 'DELETE' }),
};

// Staff Member Service
export const staffMemberService = {
  // Public
  getActive: () => apiClient.request('/staff-members/active', { method: 'GET' }),
  
  // Admin
  getAll: () => apiClient.request('/admin/staff-members', { method: 'GET' }),
  getById: (id: string) => apiClient.request(`/admin/staff-members/${id}`, { method: 'GET' }),
  create: (data: FormData) => apiClient.request('/admin/staff-members', {
    method: 'POST',
    body: data,
  }),
  update: (id: string, data: FormData) => apiClient.request(`/admin/staff-members/${id}`, {
    method: 'POST', // Use POST with _method=PUT for file uploads
    body: data,
  }),
  delete: (id: string) => apiClient.request(`/admin/staff-members/${id}`, { method: 'DELETE' }),
  reorder: (orders: Array<{ id: string; display_order: number }>) => apiClient.request('/admin/staff-members/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  }),
};

// Map Setting Service
export const mapSettingService = {
  // Public
  getActive: () => apiClient.request('/map-settings/active', { method: 'GET' }),
  
  // Admin
  getAll: () => apiClient.request('/admin/map-settings', { method: 'GET' }),
  getById: (id: string) => apiClient.request(`/admin/map-settings/${id}`, { method: 'GET' }),
  create: (data: Record<string, unknown>) => apiClient.request('/admin/map-settings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Record<string, unknown>) => apiClient.request(`/admin/map-settings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiClient.request(`/admin/map-settings/${id}`, { method: 'DELETE' }),
};

export default apiClient;
