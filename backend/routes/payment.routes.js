const express = require('express');
const router = express.Router();
const { 
  createRazorpayOrder, 
  verifyPayment, 
  updateCODPaymentStatus 
} = require('../controllers/payment.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Create Razorpay order (requires auth)
router.post('/create-order', protect, createRazorpayOrder);

// Verify payment (requires auth)
router.post('/verify', protect, verifyPayment);

// Update COD payment status (admin only)
router.put('/update-cod-status', protect, admin, updateCODPaymentStatus);

module.exports = router;