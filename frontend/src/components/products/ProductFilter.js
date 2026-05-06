import React from 'react';
import { PRODUCT_CATEGORIES, PRODUCT_SUB_CATEGORIES } from '../../utils/constants';

const ProductFilter = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleClear = () => {
    onFilterChange({
      category: '',
      subCategory: '',
      search: '',
      minPrice: '',
      maxPrice: ''
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
          className="input"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="input"
        >
          <option value="">All Categories</option>
          <option value={PRODUCT_CATEGORIES.FURNITURE}>Furniture</option>
          <option value={PRODUCT_CATEGORIES.APPLIANCES}>Appliances</option>
        </select>
      </div>
      
      {filters.category && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Sub Category</label>
          <select
            name="subCategory"
            value={filters.subCategory}
            onChange={handleChange}
            className="input"
          >
            <option value="">All</option>
            {PRODUCT_SUB_CATEGORIES[filters.category]?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Price Range (₹/month)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
            className="input"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max"
            className="input"
          />
        </div>
      </div>
      
      <button
        onClick={handleClear}
        className="w-full btn-outline"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilter;