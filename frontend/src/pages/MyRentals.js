import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching rentals with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:5001/api/rentals/my-rentals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rentals: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Rentals fetched:', data);
      setRentals(data.rentals || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError(err.message);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchRentals} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-4">No Rentals Yet</h2>
        <p className="text-gray-600 mb-6">You haven't rented any products yet.</p>
        <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Rentals</h1>
      <p className="text-gray-600 mb-6">You have {rentals.length} rental(s)</p>
      
      <div className="space-y-4">
        {rentals.map((rental) => (
          <div key={rental._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{rental.product?.name || 'Product'}</h3>
                  <p className="text-gray-500 text-sm">{rental.product?.subCategory || rental.category}</p>
                </div>
                <span className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                  {rental.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p className="font-medium">
                    {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tenure</p>
                  <p className="font-medium">{rental.tenureMonths} months</p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Rent</p>
                  <p className="font-medium text-blue-600">₹{rental.monthlyRent}/month</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium">₹{rental.totalAmount}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/rentals/${rental._id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
                {rental.status === 'active' && (
                  <button
                    onClick={() => navigate(`/maintenance?rental=${rental._id}`)}
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                  >
                    Request Maintenance
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
