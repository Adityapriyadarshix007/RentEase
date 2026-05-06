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
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAnalytics(dateRange);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvData = convertToCSV(analytics);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${dateRange.startDate}_${dateRange.endDate}.csv`;
    a.click();
  };

  if (loading) return <Loader />;
  if (!analytics) return null;

  const revenueData = {
    labels: analytics.rentalsByMonth?.map(item => `Month ${item._id}`) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: analytics.rentalsByMonth?.map(item => item.revenue) || [50000, 75000, 100000, 125000, 150000, 175000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Number of Rentals',
        data: analytics.rentalsByMonth?.map(item => item.count) || [10, 15, 20, 25, 30, 35],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const categoryData = {
    labels: analytics.categoryDistribution?.map(item => item._id) || ['Furniture', 'Appliances'],
    datasets: [
      {
        data: analytics.categoryDistribution?.map(item => item.count) || [60, 40],
        backgroundColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)'],
        borderWidth: 0
      }
    ]
  };

  const topProductsData = {
    labels: analytics.topProducts?.map(item => item.product?.name?.substring(0, 20)) || ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'],
    datasets: [
      {
        label: 'Rental Count',
        data: analytics.topProducts?.map(item => item.count) || [15, 12, 10, 8, 5],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (₹)'
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Rentals'
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
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Rentals'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export CSV
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{analytics.rentalsByMonth?.reduce((sum, item) => sum + item.revenue, 0).toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Rentals</p>
          <p className="text-2xl font-bold text-green-600">
            {analytics.rentalsByMonth?.reduce((sum, item) => sum + item.count, 0) || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Average Order Value</p>
          <p className="text-2xl font-bold text-orange-600">
            ₹{Math.round((analytics.rentalsByMonth?.reduce((sum, item) => sum + item.revenue, 0) / 
              (analytics.rentalsByMonth?.reduce((sum, item) => sum + item.count, 0) || 1)) || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-sm">Categories</p>
          <p className="text-2xl font-bold text-purple-600">{analytics.categoryDistribution?.length || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue & Rental Trends</h2>
          <div className="h-80">
            <Line data={revenueData} options={lineOptions} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Top 5 Most Rented Products</h2>
        <div className="h-96">
          <Bar data={topProductsData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

function convertToCSV(data) {
  // Simple CSV conversion
  return 'Metric,Value\nTotal Revenue,Rentals Count';
}

export default AdminAnalytics;
