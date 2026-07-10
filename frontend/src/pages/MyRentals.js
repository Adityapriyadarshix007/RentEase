import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/rentals/my-rentals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setRentals(data.rentals);
      } else {
        toast.error(data.message || 'Failed to load rentals');
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  // ========== Format date to DD MMM YYYY ==========
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // ========== Get status with date check ==========
  const getStatusWithDateCheck = (rental) => {
    const currentDate = new Date();
    const endDate = new Date(rental.rentalEndDate);
    const startDate = new Date(rental.rentalStartDate);
    
    // If status is cancelled, keep it as cancelled
    if (rental.status === 'cancelled') {
      return { status: 'cancelled', label: 'Cancelled' };
    }
    
    // If status is pending, keep it as pending
    if (rental.status === 'pending') {
      return { status: 'pending', label: 'Pending' };
    }
    
    // If rental end date has passed, mark as inactive/expired
    if (currentDate > endDate) {
      return { status: 'inactive', label: 'Inactive' };
    }
    
    // If rental has started and not ended, mark as active
    if (currentDate >= startDate && currentDate <= endDate) {
      return { status: 'active', label: 'Active' };
    }
    
    // If rental hasn't started yet
    if (currentDate < startDate) {
      return { status: 'upcoming', label: 'Upcoming' };
    }
    
    return { status: rental.status, label: rental.status };
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-600',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      overdue: 'bg-orange-100 text-orange-800',
      upcoming: 'bg-purple-100 text-purple-800',
      expired: 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // ========== Get days remaining ==========
  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-2">No Rentals Yet</h2>
        <p className="text-gray-500 mb-4">You haven't rented any products yet.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Rentals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => {
          const product = rental.product || {};
          const mainImage = product.images?.[0] || product.image || 'https://via.placeholder.com/300x200?text=No+Image';
          const statusInfo = getStatusWithDateCheck(rental);
          const daysRemaining = getDaysRemaining(rental.rentalEndDate);
          const isExpired = new Date() > new Date(rental.rentalEndDate);
          
          return (
            <div key={rental._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                <img 
                  src={mainImage}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                  }}
                />
                {/* Status Badge on Image */}
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${getStatusColor(statusInfo.status)}`}>
                  {statusInfo.label}
                </span>
                {statusInfo.status === 'active' && (
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {daysRemaining} remaining
                  </span>
                )}
                {statusInfo.status === 'inactive' && (
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    ⏰ Rental expired
                  </span>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name || 'Unknown Product'}</h3>
                </div>
                
                <p className="text-gray-500 text-sm mb-2">
                  {product.category || 'Category'} {product.subCategory ? `• ${product.subCategory}` : ''}
                </p>
                
                <div className="space-y-1 text-sm mb-4">
                  <p><span className="text-gray-500">Monthly Rent:</span> <span className="font-semibold">₹{rental.monthlyRent}</span></p>
                  <p><span className="text-gray-500">Total Amount:</span> <span className="font-semibold text-green-600">₹{rental.totalAmount}</span></p>
                  <p><span className="text-gray-500">Tenure:</span> {rental.tenureMonths} months</p>
                  <p><span className="text-gray-500">Rental Period:</span> {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}</p>
                  <p><span className="text-gray-500">Payment:</span> 
                    <span className={`ml-1 ${(rental.paymentStatus === 'paid' || rental.paymentStatus === 'completed') ? 'text-green-600' : 'text-yellow-600'}`}>
                      {(rental.paymentStatus === 'paid' || rental.paymentStatus === 'completed') ? '✅ Paid' : (rental.paymentStatus || 'Pending')}
                    </span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/products/${product._id}`} 
                    className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    View Product
                  </Link>
                  {rental.status === 'pending' && rental.paymentMethod === 'cod' && (
                    <button className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
                      Complete Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRentals;