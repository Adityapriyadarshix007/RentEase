import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { maintenanceService, rentalService } from '../services/index';
import Loader from '../components/common/Loader';
import { MAINTENANCE_TYPES, MAINTENANCE_TYPE_LABELS, MAINTENANCE_STATUS_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { FaPlus, FaWrench, FaEllipsisH } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rentalId: searchParams.get('rental') || '',
    issueType: '',
    issueTitle: '',
    description: '',
    preferredDate: '',
    preferredSlot: 'morning'
  });

  useEffect(() => {
    fetchRequests();
    fetchRentals();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await maintenanceService.getMyRequests();
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await rentalService.getMyRentals({ status: 'active' });
      setRentals(response.data.rentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await maintenanceService.createRequest(formData);
      toast.success('Maintenance request submitted successfully');
      setShowModal(false);
      setFormData({
        rentalId: '',
        issueType: '',
        issueTitle: '',
        description: '',
        preferredDate: '',
        preferredSlot: 'morning'
      });
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <p className="text-gray-600 mt-1">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>New Request</span>
        </button>
      </div>
      
      {loading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold mb-2">No Maintenance Requests</h3>
          <p className="text-gray-600 mb-4">
            You haven't submitted any maintenance requests yet.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-block"
          >
            Submit a Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <Link
              key={request._id}
              to={`/maintenance/${request._id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FaWrench className="text-primary mr-2" />
                    <h3 className="text-lg font-semibold">{request.issueTitle}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="text-gray-500">
                      Product: {request.product?.name}
                    </span>
                    <span className="text-gray-500">
                      Type: {MAINTENANCE_TYPE_LABELS[request.issueType]}
                    </span>
                    <span className="text-gray-500">
                      Created: {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {MAINTENANCE_STATUS_LABELS[request.status]}
                  </span>
                  <FaEllipsisH className="text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Submit Maintenance Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Select Rental *</label>
                  <select
                    value={formData.rentalId}
                    onChange={(e) => setFormData({ ...formData, rentalId: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select a rental</option>
                    {rentals.map(rental => (
                      <option key={rental._id} value={rental._id}>
                        {rental.product?.name} - {formatDate(rental.rentalStartDate)} to {formatDate(rental.rentalEndDate)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Issue Type *</label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select issue type</option>
                    {Object.entries(MAINTENANCE_TYPES).map(([key, value]) => (
                      <option key={value} value={value}>
                        {MAINTENANCE_TYPE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Issue Title *</label>
                  <input
                    type="text"
                    value={formData.issueTitle}
                    onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                    className="input"
                    placeholder="Brief title for the issue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="4"
                    placeholder="Detailed description of the issue"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Preferred Slot</label>
                    <select
                      value={formData.preferredSlot}
                      onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                      className="input"
                    >
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;