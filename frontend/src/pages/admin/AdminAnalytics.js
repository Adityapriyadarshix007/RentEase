import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/index';
import Loader from '../../components/common/Loader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FaDownload, FaCalendarAlt, FaBox, FaShoppingCart, FaUsers, FaChartLine } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('products');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        toast.error(data.message || 'Failed to load analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        setExporting(false);
        return;
      }
      
      const url = `${API_BASE_URL}/api/admin/export?type=${exportType}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      console.log('Exporting from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export failed:', errorText);
        throw new Error(`Export failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url_blob = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = `${exportType}_export_${dateRange.startDate}_${dateRange.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url_blob);
      
      toast.success(`${exportType} exported successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loader />;
  if (!analytics) return null;

  const totalRevenue = analytics.rentalsByMonth?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;
  const totalRentals = analytics.rentalsByMonth?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
  const avgOrderValue = totalRentals > 0 ? Math.round(totalRevenue / totalRentals) : 0;

  const revenueData = {
    labels: analytics.rentalsByMonth?.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[item._id - 1] || `Month ${item._id}`;
    }) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: analytics.rentalsByMonth?.map(item => item.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Number of Rentals',
        data: analytics.rentalsByMonth?.map(item => item.count) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const categoryData = {
    labels: analytics.categoryDistribution?.map(item => item._id || 'Uncategorized') || [],
    datasets: [
      {
        data: analytics.categoryDistribution?.map(item => item.count) || [],
        backgroundColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(139, 92, 246)'],
        borderWidth: 0
      }
    ]
  };

  const topProductsData = {
    labels: analytics.topProducts?.map(item => item.product?.name?.substring(0, 25) || 'Unknown') || [],
    datasets: [
      {
        label: 'Rental Count',
        data: analytics.topProducts?.map(item => item.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
        barPercentage: 0.6
      }
    ]
  };

  const revenueByCategoryData = {
    labels: analytics.revenueByCategory?.map(item => item._id || 'Uncategorized') || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: analytics.revenueByCategory?.map(item => item.total) || [],
        backgroundColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(139, 92, 246)'],
        borderRadius: 8,
        barPercentage: 0.6
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Revenue (₹)') {
                label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (₹)',
          font: { weight: 'bold' }
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Rentals',
          font: { weight: 'bold' }
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Rentals: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Rentals',
          font: { weight: 'bold' }
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const revenueBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'Revenue: ₹' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (₹)',
          font: { weight: 'bold' }
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} products (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your business performance and insights</p>
        </div>
      </div>

      {/* Date Range and Export Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Type</label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="products">📦 Products</option>
              <option value="rentals">🛒 Rentals</option>
              <option value="users">👥 Users</option>
              <option value="categories">📁 Categories</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
          >
            <FaDownload /> {exporting ? 'Exporting...' : 'Export Data'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          <FaCalendarAlt className="inline mr-1" /> Export will include all {exportType} data for selected date range
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <FaChartLine size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Rentals</p>
              <p className="text-2xl font-bold">{totalRentals}</p>
            </div>
            <FaShoppingCart size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Average Order Value</p>
              <p className="text-2xl font-bold">₹{avgOrderValue.toLocaleString()}</p>
            </div>
            <FaChartLine size={32} className="text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Categories</p>
              <p className="text-2xl font-bold">{analytics.categoryDistribution?.length || 0}</p>
            </div>
            <FaBox size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue & Rental Trends</h2>
          <div className="h-80">
            {analytics.rentalsByMonth?.length > 0 ? (
              <Line data={revenueData} options={lineOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No data available for selected period</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            {analytics.categoryDistribution?.length > 0 ? (
              <Doughnut data={categoryData} options={doughnutOptions} />
            ) : (
              <div className="text-gray-500">No categories found</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Top 10 Most Rented Products</h2>
          <div className="h-96">
            {analytics.topProducts?.length > 0 ? (
              <Bar data={topProductsData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No rental data available</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <div className="h-96">
            {analytics.revenueByCategory?.length > 0 ? (
              <Bar data={revenueByCategoryData} options={revenueBarOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No revenue data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Top Products Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Monthly Rent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rental Count</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No products data available</td>
                </tr>
              ) : (
                analytics.topProducts?.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold">#{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{item.product?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm">{item.product?.category || 'Uncategorized'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">₹{item.product?.monthlyRent}/month</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                        {item.count} rentals
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{item.totalRevenue?.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;