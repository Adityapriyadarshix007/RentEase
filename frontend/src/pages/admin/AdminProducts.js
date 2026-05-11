import React, { useState, useEffect, useCallback } from 'react';
import { productService } from '../../services/index';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaTimes, FaEye, FaSave, FaTimesCircle, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    description: '',
    monthlyRent: '',
    securityDeposit: '',
    availableQuantity: '',
    brand: '',
    condition: 'good',
    images: [],
    specifications: {}
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const staticCategories = ['Furniture', 'Appliances'];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingImage(true);
    
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
    setUploadingImage(false);
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading(editingProduct ? 'Updating product...' : 'Creating product...');
    
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `${API_BASE_URL}/api/products/${editingProduct._id}`
        : `${API_BASE_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const productData = {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        availableQuantity: parseInt(formData.availableQuantity)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      toast.dismiss(loadingToast);
      
      if (response.ok && data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error saving product:', error);
      toast.error('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const loadingToast = toast.loading('Deleting product...');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        toast.dismiss(loadingToast);
        
        if (response.ok) {
          toast.success('Product deleted successfully');
          fetchProducts();
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Network error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      description: product.description || '',
      monthlyRent: product.monthlyRent || '',
      securityDeposit: product.securityDeposit || '',
      availableQuantity: product.availableQuantity || '',
      brand: product.brand || '',
      condition: product.condition || 'good',
      images: product.images || [],
      specifications: product.specifications || {}
    });
    setImagePreview(product.images || []);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      subCategory: '',
      description: '',
      monthlyRent: '',
      securityDeposit: '',
      availableQuantity: '',
      brand: '',
      condition: 'good',
      images: [],
      specifications: {}
    });
    setImagePreview([]);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = [...staticCategories, ...categories.map(c => c.name)];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory, edit details, and track stock</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or brand..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <FaTimes /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaBox className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      ₹{product.monthlyRent}/month
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-semibold ${product.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.availableQuantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.availableQuantity > 0 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {product.availableQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit Product"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete Product"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Sub Category</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sofa, Bed, TV"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Available Quantity *</label>
                  <input
                    type="number"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Samsung, Wooden Street"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Product description..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Product Images</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <FaUpload /> Upload Images
                  </label>
                  {uploadingImage && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                </div>
                {imagePreview.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {imagePreview.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Preview ${idx}`} className="w-16 h-16 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimesCircle size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;