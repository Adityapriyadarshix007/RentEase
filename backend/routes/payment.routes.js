const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentHistory,
  updatePaymentStatus,
  razorpayWebhook,
  createGroupOrder,
  verifyGroupPayment
} = require('../controllers/payment.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Single payment routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/history', protect, getPaymentHistory);

// Group payment routes (for multiple cart items)
router.post('/create-group-order', protect, createGroupOrder);
router.post('/verify-group-payment', protect, verifyGroupPayment);

// Admin routes
router.put('/update-status', protect, admin, updatePaymentStatus);

// Webhook (no auth required - Razorpay calls this)
router.post('/webhook', razorpayWebhook);

module.exports = router;
