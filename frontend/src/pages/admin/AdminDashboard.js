import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/index';
import { FaUsers, FaBox, FaCalendarCheck, FaWrench, FaRupeeSign, FaEnvelope } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: <FaUsers />, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats?.stats?.totalProducts || 0, icon: <FaBox />, color: 'bg-green-500' },
    { title: 'Active Rentals', value: stats?.stats?.activeRentals || 0, icon: <FaCalendarCheck />, color: 'bg-purple-500' },
    { title: 'Pending Maintenance', value: stats?.stats?.pendingMaintenance || 0, icon: <FaWrench />, color: 'bg-yellow-500' },
    { title: 'Monthly Revenue', value: `₹${(stats?.stats?.monthlyRevenue || 0).toLocaleString()}`, icon: <FaRupeeSign />, color: 'bg-red-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Rentals</h2>
          <div className="space-y-3">
            {stats?.recentRentals?.slice(0, 5).map((rental, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{rental.product?.name}</p>
                  <p className="text-sm text-gray-500">{rental.user?.name}</p>
                </div>
                <span className="text-sm text-gray-600">₹{rental.totalAmount}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {stats?.recentUsers?.slice(0, 5).map((user, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
