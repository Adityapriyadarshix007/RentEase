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
    
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const currentMonthRevenue = await Rental.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'completed'] }, createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const recentRentals = await Rental.find().populate('user', 'name email').populate('product', 'name category monthlyRent images').sort({ createdAt: -1 }).limit(10);
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    
    res.json({
      success: true,
      stats: {
        totalUsers, totalProducts, activeRentals, pendingMaintenance, totalVendors, totalCategories,
        monthlyRevenue: currentMonthRevenue[0]?.total || 0
      },
      recentRentals, recentUsers, recentProducts
    });
  } catch (error) {
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
      { $sort: { count: -1 } }, { $limit: 10 },
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

// EXPORT FUNCTION - FIXED
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
  
    console.log(`📅 Exporting from ${start.toISOString()} to ${end.toISOString()}`);
}
    
    switch (type) {
      case 'products':
        data = await Product.find(dateFilter).lean();
        filename = `products_export_${Date.now()}.csv`;
        break;
      case 'rentals':
        data = await Rental.find(dateFilter).populate('user', 'name email').populate('product', 'name').lean();
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
    
    // Convert to CSV
    const headers = Object.keys(data[0]).filter(k => !k.startsWith('_') && k !== '__v');
    const csvRows = [headers.join(',')];
    
    for (const item of data) {
      const values = headers.map(header => {
        let value = item[header];
        if (value && typeof value === 'object') value = value.name || JSON.stringify(value);
        if (header === 'createdAt' && value) value = new Date(value).toLocaleDateString();
        if (header === 'monthlyRent' || header === 'securityDeposit' || header === 'totalAmount') value = `₹${value}`;
        return `"${String(value || '').replace(/"/g, '""')}"`;
      });
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

module.exports = { getDashboardStats, getAllUsers, getUserById, updateUser, deleteUser, getAnalytics, exportAnalyticsData, getRealtimeUpdates };
