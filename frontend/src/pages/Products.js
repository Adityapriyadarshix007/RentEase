import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  
  // Static categories (pre-existing)
  const staticCategories = ['Furniture', 'Appliances'];
  
  // Combine static + dynamic categories
  const allCategories = [...staticCategories, ...dynamicCategories.filter(cat => !staticCategories.includes(cat.name))];
  
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 8
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: searchParams.get('subCategory') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Input states (for instant UI updates)
  const [searchInput, setSearchInput] = useState(filters.search);
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setDynamicCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.subCategory) params.append('subCategory', filters.subCategory);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice && filters.minPrice >= 0) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice && filters.maxPrice >= 0) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      params.append('page', filters.page);
      params.append('limit', 8);

      const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
      setPagination({
        total: data.pagination?.total || 0,
        currentPage: data.pagination?.page || 1,
        totalPages: data.pagination?.pages || 1,
        limit: 8
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced filter updates
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 800),
    []
  );

  const debouncedMinPrice = useCallback(
    debounce((value) => {
      const validValue = value < 0 ? 0 : value;
      setFilters(prev => ({ ...prev, minPrice: validValue, page: 1 }));
    }, 800),
    []
  );

  const debouncedMaxPrice = useCallback(
    debounce((value) => {
      const validValue = value < 0 ? 0 : value;
      setFilters(prev => ({ ...prev, maxPrice: validValue, page: 1 }));
    }, 800),
    []
  );

  // Immediate filter changes (for selects and buttons)
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    setShowFilters(false);
  };

  // Input handlers with debounce and validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleMinPriceChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) value = 0;
    if (isNaN(value)) value = '';
    setMinPriceInput(value);
    debouncedMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) value = 0;
    if (isNaN(value)) value = '';
    setMaxPriceInput(value);
    debouncedMaxPrice(value);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1
    });
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Memoize product cards to prevent unnecessary re-renders
  const memoizedProductCards = useMemo(() => {
    return products.map(product => (
      <ProductCard key={product._id} product={product} />
    ));
  }, [products]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Our Products</h1>
          <p className="text-gray-500 mt-1">Showing {products.length} of {pagination.total} products</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Filter Bar - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {staticCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {dynamicCategories
                .filter(cat => !staticCategories.includes(cat.name))
                .map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPriceInput}
              onChange={handleMinPriceChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPriceInput}
              onChange={handleMaxPriceChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="monthlyRent-asc">Price: Low to High</option>
              <option value="monthlyRent-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

          <div>
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal - Mobile */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-500"><FaTimes size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)} 
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  {staticCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {dynamicCategories
                    .filter(cat => !staticCategories.includes(cat.name))
                    .map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <input
                  type="number"
                  min="0"
                  value={minPriceInput}
                  onChange={handleMinPriceChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <input
                  type="number"
                  min="0"
                  value={maxPriceInput}
                  onChange={handleMaxPriceChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Max"
                />
              </div>
              <button onClick={clearFilters} className="w-full bg-gray-500 text-white py-2 rounded-lg">Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memoizedProductCards}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)} 
                disabled={pagination.currentPage === 1} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {getPageNumbers().map((page, index) => (
                <button 
                  key={index} 
                  onClick={() => typeof page === 'number' && handlePageChange(page)} 
                  className={`px-4 py-2 rounded-lg transition ${page === pagination.currentPage ? 'bg-blue-600 text-white' : page === '...' ? 'cursor-default text-gray-500' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`} 
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)} 
                disabled={pagination.currentPage === pagination.totalPages} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
