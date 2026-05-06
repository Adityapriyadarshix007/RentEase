import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    try {
      console.log('📦 Fetching products with params:', params);
      const response = await api.get('/products', { params });
      console.log('✅ Products fetched:', response.data.products?.length || 0, 'products');
      return response;
    } catch (error) {
      console.error('❌ Error fetching products:', error.response?.data || error.message);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  getFeatured: async () => {
    try {
      const response = await api.get('/products/featured');
      return response;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
