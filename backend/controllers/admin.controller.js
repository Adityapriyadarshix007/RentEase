const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Rental = require('../models/Rental.model');
const Maintenance = require('../models/Maintenance.model');
const Category = require('../models/Category.model');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    const pendingMaintenance = await Maintenance.countDocuments({ status: 'pending' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalCategories = await Category.countDocuments();
    
    const totalRevenue = await Rental.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const currentMonthRevenue = await Rental.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'completed'] }, createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const last30DaysRevenue = await Rental.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'completed'] }, createdAt: { $gte: last30Days } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const recentRentals = await Rental.find()
      .populate('user', 'name email')
      .populate('product', 'name category monthlyRent images')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        activeRentals,
        pendingMaintenance,
        totalVendors,
        totalCategories,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: currentMonthRevenue[0]?.total || 0,
        last30DaysRevenue: last30DaysRevenue[0]?.total || 0
      },
      recentRentals,
      recentUsers,
      recentProducts
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip);
    const total = await User.countDocuments(query);
    res.json({ success: true, users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    if (req.body.address) user.address = req.body.address;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    if (startDate && endDate) dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    
    const rentalsByMonth = await Rental.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { '_id': 1 } }
    ]);
    
    const topProducts = await Rental.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$product', count: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }, 
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' }
    ]);
    
    const categoryDistribution = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const revenueByCategory = await Rental.aggregate([
      { $match: dateFilter },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({ success: true, analytics: { rentalsByMonth, topProducts, categoryDistribution, revenueByCategory } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportAnalyticsData = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    let data = [];
    let filename = '';
    
    const dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }
    
    switch (type) {
      case 'products':
        data = await Product.find(dateFilter).lean();
        filename = `products_export_${Date.now()}.csv`;
        break;
      case 'rentals':
        const rentalsData = await Rental.find(dateFilter)
          .populate('user', 'name email phone')
          .populate('product', 'name category monthlyRent')
          .sort({ createdAt: -1 })
          .lean();
        data = rentalsData.map(rental => ({
          'User Name': rental.user?.name || 'N/A',
          'User Email': rental.user?.email || 'N/A',
          'User Phone': rental.user?.phone || 'N/A',
          'Product Name': rental.product?.name || 'N/A',
          'Product Category': rental.product?.category || 'N/A',
          'Monthly Rent (₹)': rental.monthlyRent,
          'Total Amount (₹)': rental.totalAmount,
          'Security Deposit (₹)': rental.securityDeposit,
          'Tenure (Months)': rental.tenureMonths,
          'Rental Status': rental.status,
          'Payment Status': rental.paymentStatus,
          'Payment Method': rental.paymentMethod?.toUpperCase() || 'N/A',
          'Start Date': rental.rentalStartDate ? new Date(rental.rentalStartDate).toLocaleDateString() : 'N/A',
          'End Date': rental.rentalEndDate ? new Date(rental.rentalEndDate).toLocaleDateString() : 'N/A',
          'Delivery Date': rental.deliveryDate ? new Date(rental.deliveryDate).toLocaleDateString() : 'N/A',
          'Delivery Slot': rental.deliverySlot || 'N/A',
          'Delivery Address': rental.deliveryAddress ? 
            `${rental.deliveryAddress.street || ''}, ${rental.deliveryAddress.city || ''}, ${rental.deliveryAddress.state || ''} - ${rental.deliveryAddress.pincode || ''}` : 'N/A',
          'Created Date': rental.createdAt ? new Date(rental.createdAt).toLocaleDateString() : 'N/A'
        }));
        filename = `rentals_export_${Date.now()}.csv`;
        break;
      case 'users':
        data = await User.find(dateFilter).select('-password').lean();
        filename = `users_export_${Date.now()}.csv`;
        break;
      case 'categories':
        data = await Category.find({}).lean();
        filename = `categories_export_${Date.now()}.csv`;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid export type' });
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: `No ${type} data found` });
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const item of data) {
      const values = headers.map(header => `"${String(item[header] || '').replace(/"/g, '""')}"`);
      csvRows.push(values.join(','));
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRealtimeUpdates = async (req, res) => {
  try {
    const lastUpdate = req.query.lastUpdate || new Date(0);
    const [newProducts, newRentals, newUsers] = await Promise.all([
      Product.find({ createdAt: { $gt: new Date(lastUpdate) } }).countDocuments(),
      Rental.find({ createdAt: { $gt: new Date(lastUpdate) } }).countDocuments(),
      User.find({ createdAt: { $gt: new Date(lastUpdate) } }).countDocuments()
    ]);
    res.json({ success: true, updates: { newProducts, newRentals, newUsers, timestamp: new Date().toISOString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReturnsAnalytics = async (req, res) => {
  try {
    const Return = require('../models/Return.model');
    
    const totalReturns = await Return.countDocuments();
    const pendingReturns = await Return.countDocuments({ status: 'pending' });
    const approvedReturns = await Return.countDocuments({ status: 'approved' });
    const completedReturns = await Return.countDocuments({ status: 'completed' });
    const rejectedReturns = await Return.countDocuments({ status: 'rejected' });
    
    const totalRefundAmount = await Return.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$refundAmount' } } }
    ]);
    
    const returnsByReason = await Return.aggregate([
      { $group: { _id: '$reason', count: { $sum: 1 } } }
    ]);
    
    const monthlyReturns = await Return.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          totalRefund: { $sum: '$refundAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json({
      success: true,
      analytics: {
        totalReturns,
        pendingReturns,
        approvedReturns,
        completedReturns,
        rejectedReturns,
        totalRefundAmount: totalRefundAmount[0]?.total || 0,
        returnsByReason,
        monthlyReturns
      }
    });
  } catch (error) {
    console.error('Returns analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getDashboardStats, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getAnalytics,
  exportAnalyticsData,
  getRealtimeUpdates,
  getReturnsAnalytics
};
