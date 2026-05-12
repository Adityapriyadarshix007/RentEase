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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      overdue: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
          
          return (
            <div key={rental._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={mainImage}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                  }}
                />
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name || 'Unknown Product'}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
                    {rental.status}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-2">
                  {product.category || 'Category'} {product.subCategory ? `• ${product.subCategory}` : ''}
                </p>
                
                <div className="space-y-1 text-sm mb-4">
                  <p><span className="text-gray-500">Monthly Rent:</span> <span className="font-semibold">₹{rental.monthlyRent}</span></p>
                  <p><span className="text-gray-500">Total Amount:</span> <span className="font-semibold text-green-600">₹{rental.totalAmount}</span></p>
                  <p><span className="text-gray-500">Tenure:</span> {rental.tenureMonths} months</p>
                  <p><span className="text-gray-500">Rental Period:</span> {new Date(rental.rentalStartDate).toLocaleDateString()} - {new Date(rental.rentalEndDate).toLocaleDateString()}</p>
                  <p><span className="text-gray-500">Payment:</span> 
                    <span className={`ml-1 ${rental.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {rental.paymentStatus || 'pending'}
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
