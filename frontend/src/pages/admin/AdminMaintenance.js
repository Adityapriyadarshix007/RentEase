import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter, FaTimes, FaEye, FaCheckCircle, FaUserCog, FaTools, FaSpinner, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', icon: <FaClock /> },
    { value: 'assigned', label: 'Assigned', color: 'blue', icon: <FaUserCog /> },
    { value: 'in_progress', label: 'In Progress', color: 'purple', icon: <FaSpinner /> },
    { value: 'resolved', label: 'Resolved', color: 'green', icon: <FaCheckCircle /> }
  ];

  const issueTypes = [
    'plumbing', 'electrical', 'furniture', 'appliance', 'cleaning', 'other'
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/maintenance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.requests || []);
        setFilteredRequests(data.requests || []);
      } else {
        toast.error(data.message || 'Failed to fetch maintenance requests');
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      toast.error('Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];
    
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.issueTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.issueType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/maintenance/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Request status updated to ${newStatus}`);
        fetchRequests();
        if (showModal) setShowModal(false);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update request status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/maintenance/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Maintenance request deleted');
        fetchRequests();
      } else {
        toast.error('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      assigned: <FaUserCog className="text-blue-500" />,
      in_progress: <FaSpinner className="text-purple-500 animate-spin" />,
      resolved: <FaCheckCircle className="text-green-500" />
    };
    return icons[status] || <FaTools className="text-gray-500" />;
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  };

  const getIssueTypeIcon = (type) => {
    const icons = {
      plumbing: '🔧',
      electrical: '⚡',
      furniture: '🪑',
      appliance: '📺',
      cleaning: '🧹',
      other: '📝'
    };
    return icons[type] || '🔧';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    resolved: requests.filter(r => r.status === 'resolved').length
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <p className="text-gray-500 mt-1">Manage and track all maintenance issues</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Requests</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, user, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {(searchTerm || statusFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <FaTimes /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No maintenance requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.issueTitle}</p>
                        {request.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{request.description.substring(0, 60)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{request.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{request.user?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {getIssueTypeIcon(request.issueType)} {request.issueType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                     </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        <select
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request._id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              Set as {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                     </td>
                   </tr>
                ))
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Maintenance Request Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Title</label>
                  <p className="text-gray-900">{selectedRequest.issueTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Type</label>
                  <p className="text-gray-900">{selectedRequest.issueType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusBadge(selectedRequest.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted On</label>
                  <p className="text-gray-900">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedRequest.description || 'No description provided'}
                </p>
              </div>
              
              {selectedRequest.user && (
                <div>
                  <label className="text-sm font-medium text-gray-500">User Information</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedRequest.user.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.user.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRequest.user.phone || 'N/A'}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Update Status</label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => updateRequestStatus(selectedRequest._id, e.target.value)}
                  disabled={updating}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    updateRequestStatus(selectedRequest._id, 'resolved');
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaintenance;