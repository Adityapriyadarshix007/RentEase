import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import toast from 'react-hot-toast';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 12
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const getProductById = async (id) => {
    try {
      const response = await productService.getProductById(id);
      return response.data.product;
    } catch (err) {
      toast.error('Failed to fetch product details');
      throw err;
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await productService.createProduct(productData);
      toast.success('Product created successfully');
      await fetchProducts();
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      toast.success('Product updated successfully');
      await fetchProducts();
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const changePage = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
  };

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    changePage,
    clearFilters,
    refetch: fetchProducts
  };
};