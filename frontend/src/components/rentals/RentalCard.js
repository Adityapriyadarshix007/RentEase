import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../../utils/formatters';
import { FaCalendarAlt, FaRupeeSign, FaTag } from 'react-icons/fa';

const RentalCard = ({ rental }) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <Link to={`/products/${rental.product._id}`} className="md:w-48 h-48">
          <img
            src={rental.product.images?.[0] || '/api/placeholder/200/200'}
            alt={rental.product.name}
            className="w-full h-full object-cover"
          />
        </Link>
        
        {/* Rental Details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <Link to={`/products/${rental.product._id}`}>
              <h3 className="text-xl font-semibold hover:text-primary transition">
                {rental.product.name}
              </h3>
            </Link>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
              {rental.status.toUpperCase()}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mt-1">{rental.product.subCategory}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-2 text-primary" />
              <span className="text-sm">
                {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaRupeeSign className="mr-2 text-primary" />
              <span className="text-sm">{formatPrice(rental.monthlyRent)}/month</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaTag className="mr-2 text-primary" />
              <span className="text-sm">Total: {formatPrice(rental.totalAmount)}</span>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <Link
              to={`/rentals/${rental._id}`}
              className="btn-outline text-sm"
            >
              View Details
            </Link>
            {rental.status === 'active' && (
              <Link
                to={`/maintenance?rental=${rental._id}`}
                className="btn-secondary text-sm"
              >
                Request Support
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;