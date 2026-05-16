import React, { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaBox, FaCalendarCheck, FaWrench, FaRupeeSign, FaSync, FaShoppingCart, FaUserPlus, FaChartLine, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  const fetchDashboardData = useCallback(async (showToast = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
        setLastUpdate(new Date());
        if (showToast) {
          toast.success('Dashboard refreshed');
        }
      } else {
        toast.error(data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Network error. Please check connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchDashboardData(false);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ========== ORIGINAL STAT CARDS + NEW KPI CARDS ==========
  const statCards = [
    { title: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: <FaUsers />, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats?.stats?.totalProducts || 0, icon: <FaBox />, color: 'bg-green-500' },
    { title: 'Active Rentals', value: stats?.stats?.activeRentals || 0, icon: <FaCalendarCheck />, color: 'bg-purple-500' },
    { title: 'Pending Maintenance', value: stats?.stats?.pendingMaintenance || 0, icon: <FaWrench />, color: 'bg-yellow-500' },
    { title: 'Monthly Revenue', value: `₹${(stats?.stats?.monthlyRevenue || 0).toLocaleString()}`, icon: <FaRupeeSign />, color: 'bg-red-500' },
    { title: 'Total Vendors', value: stats?.stats?.totalVendors || 0, icon: <FaUserPlus />, color: 'bg-indigo-500' },
    // ========== NEW KPI CARDS (ADDED - NOT REMOVING ANYTHING) ==========
    { title: 'Total Revenue', value: `₹${(stats?.stats?.totalRevenue || 0).toLocaleString()}`, icon: <FaChartLine />, color: 'bg-emerald-500' },
    { title: 'Product Utilization', value: `${stats?.stats?.productUtilizationRate || 0}%`, icon: <FaChartLine />, color: 'bg-teal-500' },
    { title: 'Customer Retention', value: `${stats?.stats?.customerRetentionRate || 0}%`, icon: <FaUsers />, color: 'bg-pink-500' },
    { title: 'Avg Resolution Time', value: `${stats?.stats?.avgMaintenanceResolutionTime || 0} hrs`, icon: <FaClock />, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
          <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} /> 
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {/* Stats Grid - Updated to handle 10 cards (2 rows of 5 or responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rentals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Rentals</h2>
            <FaShoppingCart className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.recentRentals?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent rentals</p>
            ) : (
              stats?.recentRentals?.slice(0, 5).map((rental, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{rental.product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-500">By: {rental.user?.name || 'Unknown User'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-semibold">₹{rental.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">New Users</h2>
            <FaUserPlus className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.recentUsers?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            ) : (
              stats?.recentUsers?.slice(0, 5).map((user, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {user.role || 'customer'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;