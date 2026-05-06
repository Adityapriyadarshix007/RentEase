const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, getPaymentHistory } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;