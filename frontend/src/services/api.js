import axios from 'axios';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
};

export const rentalService = {
  createRental: (data) => api.post('/rentals', data),
  getMyRentals: (params) => api.get('/rentals/my-rentals', { params }),
  getRentalById: (id) => api.get(`/rentals/${id}`),
  cancelRental: (id) => api.put(`/rentals/${id}/cancel`),
};

export const maintenanceService = {
  createRequest: (data) => api.post('/maintenance', data),
  getMyRequests: (params) => api.get('/maintenance/my-requests', { params }),
  getRequestById: (id) => api.get(`/maintenance/${id}`),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
};

export default api;
