import React from 'react';
import { formatPrice, formatDate, getDaysRemaining } from '../../utils/formatters';
import { FaCalendarAlt, FaRupeeSign, FaMapMarkerAlt, FaBox } from 'react-icons/fa';

const RentalDetails = ({ rental, onCancel, onExtend, onMaintenance }) => {
  const daysRemaining = getDaysRemaining(rental.rentalEndDate);
  const isActive = rental.status === 'active';
  const canCancel = isActive && daysRemaining > 0;
  const canExtend = isActive && daysRemaining <= 15;

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      overdue: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{rental.product?.name}</h3>
            <p className="text-gray-600 mt-1">{rental.product?.subCategory}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
            {rental.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={rental.product?.images?.[0] || '/api/placeholder/200/200'}
              alt={rental.product?.name}
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Rental Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500">Rental Period</p>
                <p className="font-semibold">
                  {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}
                </p>
                {daysRemaining > 0 ? (
                  <p className="text-sm text-green-600">{daysRemaining} days remaining</p>
                ) : (
                  <p className="text-sm text-red-600">Rental period ended</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FaRupeeSign className="text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500">Payment Details</p>
                <p className="font-semibold">{formatPrice(rental.monthlyRent)}/month</p>
                <p className="text-sm text-gray-600">Total: {formatPrice(rental.totalAmount)}</p>
                <p className="text-sm text-gray-600">Deposit: {formatPrice(rental.securityDeposit)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FaMapMarkerAlt className="text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="font-medium">{rental.deliveryAddress?.street}</p>
                <p className="text-sm text-gray-600">
                  {rental.deliveryAddress?.city}, {rental.deliveryAddress?.state} - {rental.deliveryAddress?.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FaBox className="text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500">Delivery Schedule</p>
                <p className="font-medium">{formatDate(rental.deliveryDate)}</p>
                <p className="text-sm text-gray-600">Slot: {rental.deliverySlot}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isActive && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onMaintenance}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Request Maintenance
            </button>
            {canExtend && (
              <button
                onClick={onExtend}
                className="btn-primary flex-1 sm:flex-none"
              >
                Extend Rental
              </button>
            )}
            {canCancel && (
              <button
                onClick={onCancel}
                className="btn-danger flex-1 sm:flex-none"
              >
                Cancel Rental
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalDetails;