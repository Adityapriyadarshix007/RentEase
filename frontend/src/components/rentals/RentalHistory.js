import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/formatters';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const RentalHistory = ({ rentals }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredRentals = rentals.filter(rental => {
    if (filter === 'all') return true;
    return rental.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-xl font-semibold">Rental History</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200">
        {filteredRentals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No rental history found
          </div>
        ) : (
          filteredRentals.map((rental) => (
            <div key={rental._id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={rental.product?.images?.[0] || '/api/placeholder/50/50'}
                      alt={rental.product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <Link to={`/products/${rental.product?._id}`}>
                        <h4 className="font-semibold hover:text-primary transition">
                          {rental.product?.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-500">
                        {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatPrice(rental.totalAmount)}</p>
                    <p className="text-sm text-gray-500">{rental.tenureMonths} months</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                    {rental.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => setExpandedId(expandedId === rental._id ? null : rental._id)}
                    className="text-gray-400 hover:text-primary transition"
                  >
                    {expandedId === rental._id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === rental._id && (
                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm animate-fade-in">
                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-medium">{formatPrice(rental.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Security Deposit</p>
                    <p className="font-medium">{formatPrice(rental.securityDeposit)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Method</p>
                    <p className="font-medium">{rental.paymentMethod?.toUpperCase() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created On</p>
                    <p className="font-medium">{formatDate(rental.createdAt)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500">Delivery Address</p>
                    <p className="font-medium">
                      {rental.deliveryAddress?.street}, {rental.deliveryAddress?.city},
                      {rental.deliveryAddress?.state} - {rental.deliveryAddress?.pincode}
                    </p>
                  </div>
                  <Link
                    to={`/rentals/${rental._id}`}
                    className="md:col-span-2 btn-outline text-center flex items-center justify-center gap-2"
                  >
                    <FaSearch size={14} />
                    View Full Details
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RentalHistory;