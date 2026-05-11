import api from './api';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Real-time updates
  getRealtimeUpdates: async (lastUpdate) => {
    try {
      const response = await api.get('/admin/realtime-updates', {
        params: { lastUpdate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User Management
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Export Data
  exportData: async (type, startDate, endDate) => {
    try {
      const response = await api.get('/admin/export', {
        params: { type, startDate, endDate },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  exportProducts: async (startDate, endDate) => {
    try {
      const response = await api.get('/admin/export', {
        params: { type: 'products', startDate, endDate },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  exportRentals: async (startDate, endDate) => {
    try {
      const response = await api.get('/admin/export', {
        params: { type: 'rentals', startDate, endDate },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  exportUsers: async (startDate, endDate) => {
    try {
      const response = await api.get('/admin/export', {
        params: { type: 'users', startDate, endDate },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  exportCategories: async () => {
    try {
      const response = await api.get('/admin/export', {
        params: { type: 'categories' },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reports
  getRevenueReport: async (startDate, endDate) => {
    try {
      const response = await api.get('/admin/reports/revenue', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTopProducts: async (limit = 10) => {
    try {
      const response = await api.get('/admin/reports/top-products', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserActivity: async (days = 30) => {
    try {
      const response = await api.get('/admin/reports/user-activity', { 
        params: { days } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Settings
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await api.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Category Management
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Product Management (Admin)
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rental Management (Admin)
  getAllRentals: async (params = {}) => {
    try {
      const response = await api.get('/admin/rentals', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateRentalStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/rentals/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Maintenance Management (Admin)
  getAllMaintenance: async (params = {}) => {
    try {
      const response = await api.get('/admin/maintenance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMaintenanceStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/maintenance/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Contact Messages (Admin)
  getContactMessages: async (params = {}) => {
    try {
      const response = await api.get('/admin/contacts', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteContactMessage: async (id) => {
    try {
      const response = await api.delete(`/admin/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Helper function to download exported file
export const downloadExportedFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};