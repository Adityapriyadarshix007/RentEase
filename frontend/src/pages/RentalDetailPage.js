import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaRupeeSign, FaMapMarkerAlt, FaBox, FaTruck, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RentalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRental();
  }, [id]);

  const fetchRental = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://rentease-backend-njvk.onrender.com/api/rentals/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch rental');
      }
      
      const data = await response.json();
      setRental(data.rental);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRental = async () => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://rentease-backend-njvk.onrender.com/api/rentals/${id}/cancel`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          toast.success('Rental cancelled successfully');
          fetchRental();
        } else {
          toast.error('Failed to cancel rental');
        }
      } catch (err) {
        toast.error('Network error');
      }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Rental not found</p>
          <button onClick={() => navigate('/my-rentals')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Back to My Rentals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/my-rentals')} className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center gap-2">
        ← Back to My Rentals
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Product Header with Image */}
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-64 h-64 bg-gray-100 flex items-center justify-center">
            {rental.product?.images && rental.product.images[0] ? (
              <img
                src={rental.product.images[0]}
                alt={rental.product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                }}
              />
            ) : (
              <div className="text-6xl">🛋️</div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{rental.product?.name}</h1>
                <p className="text-gray-500">{rental.product?.subCategory}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                {rental.status?.toUpperCase()}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Rental Period</p>
                  <p className="font-medium">{formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaRupeeSign className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="font-medium">₹{rental.monthlyRent}/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rental Details */}
        <div className="border-t p-6">
          <h2 className="text-xl font-semibold mb-4">Rental Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Tenure</p>
              <p className="font-medium">{rental.tenureMonths} months</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="font-medium">₹{rental.totalAmount}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Security Deposit</p>
              <p className="font-medium">₹{rental.securityDeposit}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment Method</p>
              <p className="font-medium">{rental.paymentMethod?.toUpperCase() || 'COD'}</p>
            </div>
          </div>
        </div>
        
        {/* Delivery Details */}
        {rental.deliveryAddress && (
          <div className="border-t p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-blue-600 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">Delivery Address</p>
                  <p className="font-medium">
                    {rental.deliveryAddress.street}<br />
                    {rental.deliveryAddress.city}, {rental.deliveryAddress.state}<br />
                    {rental.deliveryAddress.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaBox className="text-blue-600 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">Delivery Date</p>
                  <p className="font-medium">{formatDate(rental.deliveryDate)}</p>
                  <p className="text-sm text-gray-500">Slot: {rental.deliverySlot}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        {rental.status === 'active' && (
          <div className="border-t p-6 flex gap-3">
            <button
              onClick={() => navigate(`/maintenance?rental=${rental._id}`)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Request Maintenance
            </button>
            <button
              onClick={handleCancelRental}
              className="flex-1 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Cancel Rental
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalDetailPage;
