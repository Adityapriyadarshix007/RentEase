const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllUsers, 
  getUserById,
  updateUser, 
  deleteUser,
  getAnalytics,
  exportAnalyticsData,
  getRealtimeUpdates,
  getReturnsAnalytics
} = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Real-time updates
router.get('/realtime-updates', getRealtimeUpdates);

// Analytics
router.get('/analytics', getAnalytics);
router.get('/export', exportAnalyticsData);
router.get('/returns-analytics', getReturnsAnalytics);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
