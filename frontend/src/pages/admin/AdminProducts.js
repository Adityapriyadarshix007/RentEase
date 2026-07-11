import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaUpload, FaBox, FaSync, FaTimesCircle, FaCity, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
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
    specifications: {},
    city: 'All India',
    availableCities: [],
    outOfCityDeliveryCharge: 299,
    deliveryCharge: 0
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';
  const staticCategories = ['Furniture', 'Appliances'];

  const cityOptions = [
    'All India',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Kolkata',
    'Chennai',
    'Hyderabad',
    'Pune'
  ];

  useEffect(() => {
    loadProducts();
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

  const loadProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
        toast.success('Products refreshed successfully!');
      } else {
        setProducts([]);
        toast.error(data.message || 'Failed to refresh products');
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Failed to refresh products');
      setProducts([]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    refreshProducts();
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          const maxHeight = 1200;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.7);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    setUploadingImage(true);
    
    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} is too large. Max 20MB total`);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        continue;
      }
      
      try {
        const compressedBlob = await compressImage(file);
        const reader = new FileReader();
        
        reader.onloadend = () => {
          setImagePreview(prev => [...prev, reader.result]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result]
          }));
        };
        reader.readAsDataURL(compressedBlob);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error('Image compression error:', error);
        toast.error(`Failed to process ${file.name}`);
      }
    }
    setUploadingImage(false);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.monthlyRent) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.description || formData.description.trim() === '') {
      toast.error('Please add a product description');
      return;
    }
    
    const loadingToast = toast.loading(editingProduct ? 'Updating product...' : 'Creating product...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.dismiss(loadingToast);
        toast.error('Please login again');
        return;
      }
      
      const url = editingProduct 
        ? `${API_BASE_URL}/api/products/${editingProduct._id}`
        : `${API_BASE_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const validCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'];
      const filteredAvailableCities = formData.availableCities.filter(city => validCities.includes(city));
      
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        subCategory: formData.subCategory || '',
        description: formData.description.trim(),
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit) || 0,
        availableQuantity: parseInt(formData.availableQuantity) || 0,
        brand: formData.brand || '',
        condition: formData.condition || 'good',
        images: formData.images || [],
        specifications: formData.specifications || {},
        isAvailable: true,
        city: formData.city || 'All India',
        availableCities: filteredAvailableCities,
        outOfCityDeliveryCharge: parseFloat(formData.outOfCityDeliveryCharge) || 299,
        deliveryCharge: 0
      };
      
      console.log('Sending product data:', productData);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      toast.dismiss(loadingToast);
      
      if (response.ok && data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowModal(false);
        resetForm();
        await loadProducts();
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      } else {
        let errorMessage = data.message || 'Operation failed';
        if (data.errors) {
          const errorDetails = Object.values(data.errors).map(err => err.message).join(', ');
          errorMessage = errorDetails || errorMessage;
        }
        toast.error(errorMessage);
        console.error('Error details:', data);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error saving product:', error);
      toast.error('Network error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
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
        await loadProducts();
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error deleting product:', error);
      toast.error('Network error');
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      description: product.description || '',
      monthlyRent: product.monthlyRent || '',
      securityDeposit: product.securityDeposit || 0,
      availableQuantity: product.availableQuantity || '',
      brand: product.brand || '',
      condition: product.condition || 'good',
      images: product.images || [],
      specifications: product.specifications || {},
      city: product.city || 'All India',
      availableCities: product.availableCities || [],
      outOfCityDeliveryCharge: product.outOfCityDeliveryCharge || 299,
      deliveryCharge: product.deliveryCharge || 0
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
      specifications: {},
      city: 'All India',
      availableCities: [],
      outOfCityDeliveryCharge: 299,
      deliveryCharge: 0
    });
    setImagePreview([]);
  };

  const handleCitySelection = (city) => {
    const validCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'];
    
    if (city === 'All India') {
      setFormData(prev => ({
        ...prev,
        city: 'All India',
        availableCities: [...validCities]
      }));
    } else {
      setFormData(prev => {
        const currentCities = prev.availableCities || [];
        let newCities;
        if (currentCities.includes(city)) {
          newCities = currentCities.filter(c => c !== city);
        } else {
          newCities = [...currentCities, city];
        }
        return {
          ...prev,
          availableCities: newCities
        };
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesCity = !selectedCity || product.city === selectedCity || 
                       (product.availableCities && product.availableCities.includes(selectedCity));
    return matchesSearch && matchesCategory && matchesCity;
  });

  const allCategories = [...new Set([...staticCategories, ...categories.map(c => c.name)])];

  if (loading && products.length === 0) {
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
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} /> 
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
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
      </div>

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
          <div className="w-48">
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
          <div className="w-48">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          {(searchTerm || selectedCategory || selectedCity) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedCity('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <FaTimes /> Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2"%3E%3Crect x="2" y="2" width="20" height="20" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="2.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaBox className="text-gray-400 text-lg" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {product.category || 'Uncategorized'}
                      </span>
                      {product.subCategory && (
                        <span className="inline-flex ml-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {product.subCategory}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-green-600">₹{product.monthlyRent}/month</p>
                        {product.securityDeposit > 0 && (
                          <p className="text-xs text-gray-500">Deposit: ₹{product.securityDeposit}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{product.city || 'N/A'}</p>
                        {product.availableCities && product.availableCities.length > 0 && product.city !== 'All India' && (
                          <p className="text-xs text-gray-500">
                            {product.availableCities.length} cities
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {product.city === 'All India' ? (
                          <span className="text-xs text-green-600 font-semibold">🌍 All India</span>
                        ) : (
                          <span className="text-xs text-gray-600">
                            ₹{product.outOfCityDeliveryCharge || 299} out-of-city
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-semibold ${product.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.availableQuantity || 0} units
                      </p>
                      {product.availableQuantity <= 5 && product.availableQuantity > 0 && (
                        <p className="text-xs text-orange-500">Low stock!</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.availableQuantity > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.availableQuantity > 0 ? '● In Stock' : '○ Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <FaTrash size={16} />
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

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>

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
                    placeholder="0"
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

              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaCity className="text-blue-600" /> City & Delivery Settings
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Primary City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        const city = e.target.value;
                        setFormData(prev => ({ ...prev, city }));
                        if (city === 'All India') {
                          const validCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'];
                          setFormData(prev => ({ ...prev, availableCities: [...validCities] }));
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {cityOptions.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Primary location where product is stored</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Out-of-City Delivery Charge (₹)</label>
                    <input
                      type="number"
                      value={formData.outOfCityDeliveryCharge}
                      onChange={(e) => setFormData({ ...formData, outOfCityDeliveryCharge: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="299"
                    />
                    <p className="text-xs text-gray-500 mt-1">Charge when delivering to other cities</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-600" /> Available Cities (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cityOptions.filter(c => c !== 'All India').map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelection(city)}
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          formData.availableCities && formData.availableCities.includes(city)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.availableCities && formData.availableCities.length > 0 
                      ? `Selected ${formData.availableCities.length} cities for delivery`
                      : 'Select cities where this product can be delivered'}
                  </p>
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
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  key={editingProduct?._id || 'new'}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter product description..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Product description is required</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Product Images</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
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
                  <p className="text-xs text-gray-500 mt-2">Max 20MB total for all images | Formats: JPEG, PNG, WEBP</p>
                  {uploadingImage && <p className="text-sm text-gray-500 mt-2">Processing images...</p>}
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
