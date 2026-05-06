import React from 'react';
import { FaUsers, FaBox, FaCalendarCheck, FaWrench, FaRupeeSign } from 'react-icons/fa';

const AdminStats = ({ stats }) => {
  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: <FaUsers />, 
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: <FaBox />, 
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'increase'
    },
    { 
      title: 'Active Rentals', 
      value: stats.activeRentals, 
      icon: <FaCalendarCheck />, 
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      title: 'Pending Maintenance', 
      value: stats.pendingMaintenance, 
      icon: <FaWrench />, 
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'decrease'
    },
    { 
      title: 'Monthly Revenue', 
      value: `₹${stats.monthlyRevenue?.toLocaleString()}`, 
      icon: <FaRupeeSign />, 
      color: 'bg-red-500',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <div className={`${stat.color} text-white p-3 rounded-lg`}>
              {stat.icon}
            </div>
            <div className={`text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;