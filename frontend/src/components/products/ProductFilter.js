import React, { useState, useEffect } from 'react';

const ProductFilter = ({ filters, onFilterChange, categories = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent negative values for price
    if (name === 'minPrice' || name === 'maxPrice') {
      const numValue = parseInt(value);
      if (numValue < 0) {
        onFilterChange({ [name]: 0 });
        return;
      }
    }
    
    onFilterChange({ [name]: value });
  };

  const handleClear = () => {
    onFilterChange({
      category: '',
      subCategory: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      city: 'All Cities' // ← NEW
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Search</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search products..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* ========== NEW: City Filter ========== */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">City</label>
        <select
          name="city"
          value={filters.city || 'All Cities'}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All Cities">All Cities</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Chennai">Chennai</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id || category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Price Range (₹/month)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={handleClear}
        className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilter;