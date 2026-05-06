import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { FaTh, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  pagination = { page: 1, pages: 1, total: 0, limit: 12 },
  onPageChange,
  onSortChange,
  onViewChange
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (onSortChange) onSortChange(value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (onViewChange) onViewChange(mode);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const totalPages = pagination.pages;
    const currentPage = pagination.page;

    if (totalPages <= maxVisible) {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-56 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <p className="text-gray-600">
          Showing {products.length} of {pagination.total} products
        </p>
        
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="input py-2 px-3 w-40"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 px-3 transition ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 px-3 transition ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>
      
      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl">🛋️</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold hover:text-primary transition">
                        <a href={`/products/${product._id}`}>{product.name}</a>
                      </h3>
                      <p className="text-gray-500 text-sm">{product.subCategory}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{product.monthlyRent}</p>
                      <p className="text-sm text-gray-500">/month</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-500">Deposit: ₹{product.securityDeposit}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-green-600">{product.availableQuantity} in stock</span>
                    </div>
                    <a href={`/products/${product._id}`} className="btn-primary text-sm">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft />
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  page === pagination.page
                    ? 'bg-primary text-white'
                    : page === '...'
                    ? 'cursor-default text-gray-500'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;