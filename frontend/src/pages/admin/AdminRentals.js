import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingPayment, setUpdatingPayment] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/rentals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setRentals(data.rentals || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError(err.message);
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStatus = async (rentalId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        toast.success(`Rental status updated to ${newStatus}`);
        fetchRentals();
      } else {
        toast.error('Failed to update rental status');
      }
    } catch (error) {
      console.error('Error updating rental:', error);
      toast.error('Failed to update rental status');
    }
  };

  // NEW FUNCTION: Update payment status for COD orders
  const updatePaymentStatus = async (rentalId, paymentStatus) => {
    setUpdatingPayment(rentalId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payments/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rentalId, paymentStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Payment marked as ${paymentStatus}`);
        fetchRentals(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setUpdatingPayment(null);
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

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[paymentStatus] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'completed', label: 'Completed', color: 'blue' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'overdue', label: 'Overdue', color: 'orange' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
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
      <div className="p-8 text-center">
        <p className="text-gray-500">No rentals found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Rentals</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rentals.map((rental) => (
                <tr key={rental._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{rental.product?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{rental.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{rental.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(rental.paymentStatus)}`}>
                      {rental.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rental.paymentMethod === 'cod' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {rental.paymentMethod?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(rental.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {/* Rental Status Dropdown */}
                      <select
                        value={rental.status}
                        onChange={(e) => updateRentalStatus(rental._id, e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            Set as {option.label}
                          </option>
                        ))}
                      </select>
                      
                      {/* COD Payment Status Button - Only show for COD orders with pending payment */}
                      {rental.paymentMethod === 'cod' && rental.paymentStatus === 'pending' && (
                        <button
                          onClick={() => updatePaymentStatus(rental._id, 'completed')}
                          disabled={updatingPayment === rental._id}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap"
                        >
                          {updatingPayment === rental._id ? 'Updating...' : '✓ Mark as Paid'}
                        </button>
                      )}
                      
                      {/* Show completed badge for COD orders already paid */}
                      {rental.paymentMethod === 'cod' && rental.paymentStatus === 'completed' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs">
                          Payment Completed
                        </span>
                      )}
                      
                      {/* Show paid badge for online payments */}
                      {rental.paymentMethod !== 'cod' && rental.paymentStatus === 'paid' && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs">
                          Payment Received
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Rentals</p>
          <p className="text-2xl font-bold">{rentals.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Pending COD Payments</p>
          <p className="text-2xl font-bold text-orange-600">
            {rentals.filter(r => r.paymentMethod === 'cod' && r.paymentStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{rentals
              .filter(r => r.paymentStatus === 'paid' || r.paymentStatus === 'completed')
              .reduce((sum, r) => sum + (r.totalAmount || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRentals;