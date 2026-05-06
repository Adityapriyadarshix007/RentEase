import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { formatPrice, formatDate } from '../../utils/formatters';

const RentalTable = ({ rentals, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    overdue: 'bg-orange-100 text-orange-800'
  };

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = rental.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rental.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || rental.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by user or product..."
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
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRentals.map((rental) => (
              <tr key={rental._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{rental.user?.name}</div>
                  <div className="text-sm text-gray-500">{rental.user?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{rental.product?.name}</div>
                  <div className="text-sm text-gray-500">{rental.product?.subCategory}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{formatDate(rental.rentalStartDate)}</div>
                  <div className="text-sm text-gray-500">to {formatDate(rental.rentalEndDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-primary">{formatPrice(rental.totalAmount)}</div>
                  <div className="text-xs text-gray-500">{rental.tenureMonths} months</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[rental.status]}`}>
                    {rental.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onView(rental)} className="text-blue-600 hover:text-blue-800">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalTable;