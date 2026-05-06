import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maintenanceService } from '../services/index';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatDate, formatDateTime } from '../utils/formatters';
import { MAINTENANCE_TYPE_LABELS, MAINTENANCE_STATUS_LABELS } from '../utils/constants';
import { FaTools, FaUser, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const MaintenanceDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await maintenanceService.getRequestById(id);
      setRequest(response.data.request);
    } catch (error) {
      console.error('Error fetching request:', error);
      navigate('/maintenance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!request) return null;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'assigned':
      case 'in_progress':
        return <FaTools className="text-blue-500 text-2xl" />;
      default:
        return <FaTools className="text-yellow-500 text-2xl" />;
    }
  };

  const breadcrumbItems = [
    { label: 'Maintenance', link: '/maintenance' },
    { label: request.issueTitle }
  ];

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{request.issueTitle}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  request.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                  request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {MAINTENANCE_STATUS_LABELS[request.status]}
                </span>
              </div>
              {getStatusIcon(request.status)}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Product Information</h3>
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                {request.product?.images?.[0] ? (
                  <img src={request.product.images[0]} alt={request.product.name} className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="text-3xl">🛋️</div>
                )}
              </div>
              <div>
                <p className="font-semibold">{request.product?.name}</p>
                <p className="text-sm text-gray-600">{request.product?.subCategory}</p>
                <p className="text-sm text-gray-500 mt-1">Rental ID: {request.rental?._id}</p>
              </div>
            </div>
          </div>
          
          {/* Issue Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Issue Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">Issue Type</p>
                <p className="font-medium">{MAINTENANCE_TYPE_LABELS[request.issueType]}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Description</p>
                <p className="text-gray-700">{request.description}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Preferred Date & Time</p>
                <p>{formatDate(request.preferredDate)} ({request.preferredSlot})</p>
              </div>
            </div>
          </div>
          
          {/* Resolution Details (if resolved) */}
          {request.status === 'resolved' && request.resolutionNotes && (
            <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
              <h3 className="text-lg font-semibold mb-4 text-green-800">Resolution Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-green-700 font-medium">{request.resolutionNotes}</p>
                </div>
                {request.resolutionCost > 0 && (
                  <div>
                    <p className="text-gray-500 text-sm">Resolution Cost</p>
                    <p className="font-medium">₹{request.resolutionCost}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 text-sm">Resolved On</p>
                  <p>{formatDateTime(request.resolvedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Request Timeline</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="mr-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                </div>
                <div>
                  <p className="font-medium">Request Created</p>
                  <p className="text-sm text-gray-500">{formatDateTime(request.createdAt)}</p>
                </div>
              </div>
              
              {request.assignedAt && (
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium">Assigned to Technician</p>
                    <p className="text-sm text-gray-500">{formatDateTime(request.assignedAt)}</p>
                    {request.technicianName && (
                      <p className="text-sm text-gray-600">Technician: {request.technicianName}</p>
                    )}
                  </div>
                </div>
              )}
              
              {request.resolvedAt && (
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium">Resolved</p>
                    <p className="text-sm text-gray-500">{formatDateTime(request.resolvedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Support */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-3">
              Contact our support team for immediate assistance.
            </p>
            <div className="space-y-2 text-sm">
              <p>📞 Phone: +91 1234567890</p>
              <p>✉️ Email: support@rentease.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetail;