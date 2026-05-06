import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rentalService, maintenanceService } from '../services/index';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatPrice, formatDate, getDaysRemaining } from '../utils/formatters';
import { FaCalendarAlt, FaRupeeSign, FaMapMarkerAlt, FaTools, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RentalDetailPage = () => {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extensionMonths, setExtensionMonths] = useState(1);
  const [extending, setExtending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRental();
  }, [id]);

  const fetchRental = async () => {
    try {
      const response = await rentalService.getRentalById(id);
      setRental(response.data.rental);
    } catch (error) {
      console.error('Error fetching rental:', error);
      toast.error('Rental not found');
      navigate('/my-rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRental = async () => {
    if (window.confirm('Are you sure you want to cancel this rental? This action cannot be undone.')) {
      try {
        await rentalService.cancelRental(id);
        toast.success('Rental cancelled successfully');
        fetchRental();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel rental');
      }
    }
  };

  const handleExtendRental = async () => {
    setExtending(true);
    try {
      await rentalService.extendRental(id, { extensionMonths });
      toast.success(`Rental extended by ${extensionMonths} month(s)`);
      setShowExtendModal(false);
      fetchRental();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to extend rental');
    } finally {
      setExtending(false);
    }
  };

  const handleRequestMaintenance = () => {
    navigate(`/maintenance?rental=${id}`);
  };

  if (loading) return <Loader />;
  if (!rental) return null;

  const daysRemaining = getDaysRemaining(rental.rentalEndDate);
  const isActive = rental.status === 'active';
  const canExtend = isActive && daysRemaining <= 15;
  const canCancel = isActive && daysRemaining > 0;

  const breadcrumbItems = [
    { label: 'My Rentals', link: '/my-rentals' },
    { label: rental.product?.name || 'Rental Details' }
  ];

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-48 bg-gray-100">
                <img
                  src={rental.product?.images?.[0] || '/api/placeholder/200/200'}
                  alt={rental.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-2">{rental.product?.name}</h2>
                <p className="text-gray-600 mb-4">{rental.product?.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-primary mr-2" />
                    <span>Rented on: {formatDate(rental.rentalStartDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRupeeSign className="text-primary mr-2" />
                    <span>{formatPrice(rental.monthlyRent)}/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rental Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Rental Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Rental Period</p>
                <p className="font-semibold">
                  {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Rental period ended'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tenure</p>
                <p className="font-semibold">{rental.tenureMonths} months</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Monthly Rent</p>
                <p className="font-semibold">{formatPrice(rental.monthlyRent)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <p className="font-semibold text-primary">{formatPrice(rental.totalAmount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Security Deposit</p>
                <p className="font-semibold">{formatPrice(rental.securityDeposit)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  rental.status === 'active' ? 'bg-green-100 text-green-800' :
                  rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  rental.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {rental.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="text-primary mr-2" />
              Delivery Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Delivery Address</p>
                <p className="font-semibold">
                  {rental.deliveryAddress?.street}<br />
                  {rental.deliveryAddress?.city}, {rental.deliveryAddress?.state}<br />
                  {rental.deliveryAddress?.pincode}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Delivery Date</p>
                <p className="font-semibold">{formatDate(rental.deliveryDate)}</p>
                <p className="text-sm text-gray-600">Slot: {rental.deliverySlot}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleRequestMaintenance}
                className="w-full btn-outline flex items-center justify-center space-x-2"
              >
                <FaTools />
                <span>Request Maintenance</span>
              </button>
              
              {canExtend && (
                <button
                  onClick={() => setShowExtendModal(true)}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <FaCalendarAlt />
                  <span>Extend Rental</span>
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={handleCancelRental}
                  className="w-full btn-danger flex items-center justify-center space-x-2"
                >
                  <FaExclamationTriangle />
                  <span>Cancel Rental</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span className={`font-semibold ${
                  rental.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {rental.paymentStatus?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span>{rental.paymentMethod?.toUpperCase() || 'N/A'}</span>
              </div>
              {rental.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="text-sm">{rental.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Extend Rental</h3>
            <p className="text-gray-600 mb-4">
              Current end date: {formatDate(rental.rentalEndDate)}
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Extension Period</label>
              <select
                value={extensionMonths}
                onChange={(e) => setExtensionMonths(parseInt(e.target.value))}
                className="input"
              >
                <option value={1}>1 month</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
            </div>
            <p className="text-primary font-semibold mb-4">
              Additional cost: {formatPrice(rental.monthlyRent * extensionMonths)}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExtendModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendRental}
                disabled={extending}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {extending ? 'Processing...' : 'Confirm Extension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalDetailPage;