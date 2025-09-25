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

      const data = await response.json();
      
      // Handle Laravel API response format
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
      }
      
      return data;
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
    try {
      return await this.request<any[]>('/articles');
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to mock data if API fails
      const mockArticles = [
        {
          id: 1,
          title: "Cách trồng cây xanh trong nhà",
          body: "Hướng dẫn chi tiết về cách trồng và chăm sóc cây xanh trong nhà...",
          excerpt: "Học cách trồng cây xanh trong nhà một cách hiệu quả",
          image: "/image.png",
          category: "Trồng trọt",
          tags: ["cây xanh", "trồng trọt", "nhà"],
          created_at: "2025-09-25T00:00:00Z",
          updated_at: "2025-09-25T00:00:00Z"
        },
        {
          id: 2,
          title: "Kỹ thuật tưới nước cho cây",
          body: "Các phương pháp tưới nước hiệu quả cho từng loại cây...",
          excerpt: "Tìm hiểu cách tưới nước đúng cách cho cây trồng",
          image: "/image.png",
          category: "Chăm sóc",
          tags: ["tưới nước", "chăm sóc", "kỹ thuật"],
          created_at: "2025-09-24T00:00:00Z",
          updated_at: "2025-09-24T00:00:00Z"
        }
      ];
      
      return Promise.resolve(mockArticles);
    }
  }

  async getPublicVideos(params?: {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }) {
    try {
      return await this.request<any[]>('/videos');
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback to mock data if API fails
      const mockVideos = [
        {
          id: 1,
          title: "Hướng dẫn trồng cây từ A-Z",
          description: "Video hướng dẫn chi tiết cách trồng cây từ bước đầu",
          embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail: "/image.png",
          created_at: "2025-09-25T00:00:00Z"
        },
        {
          id: 2,
          title: "Cách chăm sóc cây cảnh",
          description: "Bí quyết chăm sóc cây cảnh luôn xanh tươi",
          embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail: "/image.png",
          created_at: "2025-09-24T00:00:00Z"
        }
      ];
      
      return Promise.resolve(mockVideos);
    }
  }

  async getPublicTools() {
    try {
      return await this.request<any[]>('/tools');
    } catch (error) {
      console.error('Error fetching tools:', error);
      // Fallback to mock data if API fails
      const mockTools = [
        {
          id: 1,
          name: "Xẻng trồng cây",
          description: "Xẻng chuyên dụng để trồng cây, làm từ thép không gỉ",
          slug: "xeng-trong-cay",
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          images_json: '["/image.png"]'
        },
        {
          id: 2,
          name: "Bình tưới nước",
          description: "Bình tưới nước 2 lít với vòi phun đa dạng",
          slug: "binh-tuoi-nuoc",
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          images_json: '["/image.png"]'
        }
      ];
      return Promise.resolve(mockTools);
    }
  }

  async getPublicBooks() {
    try {
      return await this.request<any[]>('/books');
    } catch (error) {
      console.error('Error fetching books:', error);
      // Fallback to mock data if API fails
      const mockBooks = [
        {
          id: 1,
          title: "Nghệ thuật trồng cây",
          author: "Nguyễn Văn A",
          description: "Cuốn sách hướng dẫn chi tiết về nghệ thuật trồng cây",
          price: 200000,
          image: "/image.png",
          pages: 300,
          published_year: 2024
        },
        {
          id: 2,
          title: "Cây cảnh trong nhà",
          author: "Trần Thị B",
          description: "Hướng dẫn chọn và chăm sóc cây cảnh trong nhà",
          price: 150000,
          image: "/image.png",
          pages: 250,
          published_year: 2023
        }
      ];
      
      return Promise.resolve(mockBooks);
    }
  }

  async getPublicEssentials() {
    try {
      return await this.request<any[]>('/essentials');
    } catch (error) {
      console.error('Error fetching essentials:', error);
      // Fallback to mock data if API fails
      const mockEssentials = [
        {
          id: 1,
          name: "Phân bón hữu cơ",
          description: "Phân bón hữu cơ tự nhiên cho cây trồng",
          price: 50000,
          image: "/image.png",
          category: "Fertilizer"
        },
        {
          id: 2,
          name: "Đất trồng cây",
          description: "Đất trồng cây chất lượng cao",
          price: 30000,
          image: "/image.png",
          category: "Soil"
        }
      ];
      
      return Promise.resolve(mockEssentials);
    }
  }

  async getPublicPots() {
    try {
      return await this.request<any[]>('/pots');
    } catch (error) {
      console.error('Error fetching pots:', error);
      // Fallback to mock data if API fails
      const mockPots = [
        {
          id: 1,
          name: "Chậu đất nung",
          description: "Chậu đất nung truyền thống",
          price: 100000,
          image: "/image.png",
          material: "Clay",
          size: "20cm"
        },
        {
          id: 2,
          name: "Chậu nhựa",
          description: "Chậu nhựa nhẹ và bền",
          price: 50000,
          image: "/image.png",
          material: "Plastic",
          size: "15cm"
        }
      ];
      
      return Promise.resolve(mockPots);
    }
  }

  async getPublicAccessories() {
    try {
      return await this.request<any[]>('/accessories');
    } catch (error) {
      console.error('Error fetching accessories:', error);
      // Fallback to mock data if API fails
      const mockAccessories = [
        {
          id: 1,
          name: "Phụ kiện trang trí",
          description: "Phụ kiện trang trí cho cây cảnh",
          price: 25000,
          image: "/image.png",
          category: "Decoration"
        },
        {
          id: 2,
          name: "Hệ thống tưới nước",
          description: "Hệ thống tưới nước tự động",
          price: 150000,
          image: "/image.png",
          category: "Irrigation"
        }
      ];
      
      return Promise.resolve(mockAccessories);
    }
  }

  async getPublicSuggestions() {
    try {
      return await this.request<any[]>('/suggestions');
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback to mock data if API fails
      const mockSuggestions = [
        {
          id: 1,
          title: "Cách trồng cây xanh trong nhà",
          description: "Hướng dẫn chi tiết cách trồng cây xanh trong nhà",
          category: "Hướng dẫn cơ bản",
          difficulty_level: "beginner",
          rating: 4.5,
          views: 1000,
          likes: 50,
          image: "/image.png",
          is_featured: true
        },
        {
          id: 2,
          title: "10 loại cây dễ trồng nhất",
          description: "Danh sách các loại cây dễ trồng cho người mới",
          category: "Cây trồng",
          difficulty_level: "beginner",
          rating: 4.3,
          views: 800,
          likes: 40,
          image: "/image.png",
          is_featured: false
        }
      ];
      
      return Promise.resolve(mockSuggestions);
    }
  }

  // About Us methods
  async getAboutUs() {
    try {
      return await this.request<any[]>('/about-us');
    } catch (error) {
      console.error('Error fetching about us:', error);
      return Promise.resolve([]);
    }
  }

  async getActiveAboutUs() {
    try {
      return await this.request<any>('/about-us/active');
    } catch (error) {
      console.error('Error fetching active about us:', error);
      return Promise.resolve(null);
    }
  }

  async getAboutUsById(id: string) {
    try {
      return await this.request<any>(`/about-us/${id}`);
    } catch (error) {
      console.error('Error fetching about us by id:', error);
      return Promise.resolve(null);
    }
  }

  async createAboutUs(data: any) {
    try {
      return await this.request<any>('/about-us', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error creating about us:', error);
      throw error;
    }
  }

  async updateAboutUs(id: string, data: any) {
    try {
      return await this.request<any>(`/about-us/${id}`, {
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
      return await this.request<any>(`/about-us/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting about us:', error);
      throw error;
    }
  }

  // Contact methods
  async sendContactMessage(data: any) {
    try {
      return await this.request<any>('/contact', {
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
      return await this.request<any[]>('/contact-messages');
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return Promise.resolve([]);
    }
  }

  async getContactMessage(id: string) {
    try {
      return await this.request<any>(`/contact-messages/${id}`);
    } catch (error) {
      console.error('Error fetching contact message:', error);
      return Promise.resolve(null);
    }
  }

  async updateContactMessage(id: string, data: any) {
    try {
      return await this.request<any>(`/contact-messages/${id}`, {
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
      return await this.request<any>(`/contact-messages/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }
  }

  async getPublicSeeds() {
    // Mock data for demo
    const mockSeeds = [
      {
        id: 1,
        name: "Hạt giống cà chua",
        variety: "Cà chua cherry",
        price: 25000,
        image: "/image.png",
        germination_days: 7,
        harvest_days: 75
      },
      {
        id: 2,
        name: "Hạt giống rau xà lách",
        variety: "Xà lách romaine",
        price: 15000,
        image: "/image.png",
        germination_days: 5,
        harvest_days: 45
      }
    ];
    
    return Promise.resolve(mockSeeds);
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
};

export const aboutUsService = {
  getAll: () => apiClient.getAboutUs(),
  getActive: () => apiClient.getActiveAboutUs(),
  getById: (id: string) => apiClient.getAboutUsById(id),
  create: (data: any) => apiClient.createAboutUs(data),
  update: (id: string, data: any) => apiClient.updateAboutUs(id, data),
  delete: (id: string) => apiClient.deleteAboutUs(id),
};

export const contactService = {
  sendMessage: (data: any) => apiClient.sendContactMessage(data),
  getAll: () => apiClient.getContactMessages(),
  getById: (id: string) => apiClient.getContactMessage(id),
  update: (id: string, data: any) => apiClient.updateContactMessage(id, data),
  delete: (id: string) => apiClient.deleteContactMessage(id),
};

export default apiClient;