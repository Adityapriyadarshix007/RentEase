import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaSpinner, FaRupeeSign, FaCalendarAlt, FaBox } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReturns();
    fetchAnalytics();
  }, [statusFilter]);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const url = statusFilter 
        ? `${API_URL}/api/admin/returns?status=${statusFilter}`
        : `${API_URL}/api/admin/returns`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setReturns(data.returns);
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/returns/analytics/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const updateReturnStatus = async (id, status, refundAmount = null, damageAmount = null) => {
    setUpdating(true);
    try {
      const body = { status };
      if (refundAmount !== null) body.refundAmount = refundAmount;
      if (damageAmount !== null) body.damageAmount = damageAmount;
      
      const response = await fetch(`${API_URL}/api/admin/returns/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success(`Return request ${status}`);
        fetchReturns();
        fetchAnalytics();
        setShowModal(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Returns Management</h1>
      
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Pending Returns</p>
            <p className="text-2xl font-bold text-yellow-600">{analytics.pendingReturns}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Approved</p>
            <p className="text-2xl font-bold text-blue-600">{analytics.approvedReturns}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{analytics.completedReturns}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">Total Refunded</p>
            <p className="text-2xl font-bold text-purple-600">₹{analytics.totalRefundAmount?.toLocaleString()}</p>
          </div>
        </div>
      )}
      
      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setStatusFilter('')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filter
          </button>
        </div>
      </div>
      
      {/* Returns Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No return requests found
                  </td>
                </tr>
              ) : (
                returns.map((returnReq) => (
                  <tr key={returnReq._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{returnReq._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{returnReq.user?.name}</p>
                        <p className="text-xs text-gray-500">{returnReq.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{returnReq.product?.name}</td>
                    <td className="px-6 py-4 text-sm capitalize">{returnReq.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(returnReq.status)}`}>
                        {returnReq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(returnReq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedReturn(returnReq);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* View Details Modal */}
      {showModal && selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Return Request Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 text-2xl">×</button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><span className="font-medium">Name:</span> {selectedReturn.user?.name}</p>
                <p><span className="font-medium">Email:</span> {selectedReturn.user?.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedReturn.user?.phone || 'N/A'}</p>
              </div>
              
              {/* Product Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p><span className="font-medium">Product:</span> {selectedReturn.product?.name}</p>
                <p><span className="font-medium">Rental Amount:</span> ₹{selectedReturn.rental?.totalAmount}</p>
              </div>
              
              {/* Return Details */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Return Details</h3>
                <p><span className="font-medium">Reason:</span> <span className="capitalize">{selectedReturn.reason}</span></p>
                <p><span className="font-medium">Description:</span> {selectedReturn.description || 'N/A'}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedReturn.status)}`}>
                    {selectedReturn.status}
                  </span>
                </p>
              </div>
              
              {/* Admin Actions */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Admin Actions</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateReturnStatus(selectedReturn._id, 'approved')}
                      disabled={updating}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <FaCheck className="inline mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => updateReturnStatus(selectedReturn._id, 'rejected')}
                      disabled={updating}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      <FaTimes className="inline mr-2" /> Reject
                    </button>
                  </div>
                  
                  {selectedReturn.status === 'approved' && (
                    <div className="space-y-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Refund Amount"
                        className="w-full px-3 py-2 border rounded-lg"
                        id="refundAmount"
                        onChange={(e) => {
                        if (parseFloat(e.target.value) < 0) {
                        e.target.value = 0;
                        }
                        }}
                        />
                      <button
                        onClick={() => {
                          const amount = document.getElementById('refundAmount').value;
                          updateReturnStatus(selectedReturn._id, 'completed', amount);
                        }}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Mark as Completed & Process Refund
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
