import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { productService } from '../services/api';

const ProductContext = createContext();

const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    subCategory: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  },
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 12
  }
};

function productReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'SET_FEATURED_PRODUCTS':
      return { ...state, featuredProducts: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await productService.getProducts(state.filters);
      dispatch({ type: 'SET_PRODUCTS', payload: response.data.products });
      dispatch({ type: 'SET_PAGINATION', payload: response.data.pagination });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productService.getFeatured();
      dispatch({ type: 'SET_FEATURED_PRODUCTS', payload: response.data.products });
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    // This would come from an API endpoint
    const categories = [
      { id: 1, name: 'Furniture', slug: 'furniture' },
      { id: 2, name: 'Appliances', slug: 'appliances' }
    ];
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: newFilters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  useEffect(() => {
    fetchProducts();
  }, [state.filters]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider value={{
      ...state,
      fetchProducts,
      fetchFeaturedProducts,
      updateFilters,
      resetFilters
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};