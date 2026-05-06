import React, { useState } from 'react';
import { FaEye, FaCheckCircle } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';
import { MAINTENANCE_STATUS_LABELS, MAINTENANCE_TYPE_LABELS } from '../../utils/constants';

const MaintenanceTable = ({ requests, onView, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.issueTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{request.issueTitle}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{request.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{request.user?.name}</div>
                  <div className="text-sm text-gray-500">{request.user?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{MAINTENANCE_TYPE_LABELS[request.issueType]}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{formatDate(request.createdAt)}</div>
                  {request.preferredDate && (
                    <div className="text-xs text-gray-500">Pref: {formatDate(request.preferredDate)}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[request.status]}`}>
                    {MAINTENANCE_STATUS_LABELS[request.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => onView(request)} className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    {request.status !== 'resolved' && request.status !== 'cancelled' && (
                      <button 
                        onClick={() => onUpdateStatus(request._id, 'resolved')}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as resolved"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;