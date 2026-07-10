import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [rentals, setRentals] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    fetchReturns();
    fetchRentals();
  }, []);

  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/returns/my-returns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setReturns(data.returns);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/rentals/my-rentals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const completedRentals = data.rentals.filter(r => r.status === 'completed' || r.status === 'active');
        setRentals(completedRentals);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const submitReturnRequest = async () => {
    if (!selectedRental || !returnReason) {
      toast.error('Please select reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rentalId: selectedRental,
          reason: returnReason,
          description: returnDescription
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Return request submitted successfully');
        setShowModal(false);
        setReturnReason('');
        setReturnDescription('');
        fetchReturns();
      } else {
        toast.error(data.message || 'Failed to submit');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Returns & Refunds</h1>
        {rentals.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Request Return
          </button>
        )}
      </div>

      {returns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">🔄</div>
          <p className="text-gray-500 mb-4">No return requests yet</p>
          {rentals.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Request a Return
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((returnReq) => (
            <div key={returnReq._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Return Request #{returnReq._id.slice(-6)}</h3>
                  <p className="text-gray-500 text-sm mt-1">Reason: {returnReq.reason}</p>
                  <p className="text-gray-600 text-sm mt-2">{returnReq.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(returnReq.status)}`}>
                  {returnReq.status.toUpperCase()}
                </span>
              </div>
              {returnReq.status === 'approved' && returnReq.pickupDate && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 text-sm">Pickup scheduled for {formatDate(returnReq.pickupDate)}</p>
                </div>
              )}
              {returnReq.status === 'completed' && returnReq.refundAmount > 0 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-semibold">Refund Amount: ₹{returnReq.refundAmount}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Return Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request Return</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Select Product to Return</label>
                <select
                  value={selectedRental || ''}
                  onChange={(e) => setSelectedRental(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select a product</option>
                  {rentals.map(rental => (
                    <option key={rental._id} value={rental._id}>
                      {rental.product?.name} - ₹{rental.totalAmount}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select reason</option>
                  <option value="damaged">Product Damaged</option>
                  <option value="not_needed">No Longer Needed</option>
                  <option value="relocating">Relocating</option>
                  <option value="upgrading">Upgrading to Better Product</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Please provide additional details..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReturnRequest}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReturns;
