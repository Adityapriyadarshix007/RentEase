const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentHistory,
  updatePaymentStatus 
} = require('../controllers/payment.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// User routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/history', protect, getPaymentHistory);

// Admin routes
router.put('/update-status', protect, admin, updatePaymentStatus);

module.exports = router;