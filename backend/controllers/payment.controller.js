const Razorpay = require('razorpay');
const crypto = require('crypto');
const Rental = require('../models/Rental.model');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order for Online Payment
const createRazorpayOrder = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }
    
    if (rental.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const amount = (rental.totalAmount + rental.securityDeposit) * 100; // Convert to paise
    
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${rentalId}`,
      payment_capture: 1,
      notes: {
        rentalId: rentalId.toString(),
        userId: req.user._id.toString()
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    rental.razorpayOrderId = order.id;
    await rental.save();
    
    res.json({ 
      success: true, 
      key_id: process.env.RAZORPAY_KEY_ID,
      order: order,
      rentalId: rental._id
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Payment after successful payment
const verifyPayment = async (req, res) => {
  try {
    const { 
      rentalId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentMethod 
    } = req.body;
    
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    // Update rental
    rental.paymentStatus = 'paid';
    rental.paymentId = razorpay_payment_id;
    rental.paymentMethod = paymentMethod;
    rental.paymentDate = new Date();
    rental.status = 'active';
    rental.razorpayOrderId = razorpay_order_id;
    
    await rental.save();
    
    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      rental: {
        _id: rental._id,
        paymentStatus: rental.paymentStatus,
        status: rental.status
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update COD payment status (Admin only)
const updateCODPaymentStatus = async (req, res) => {
  try {
    const { rentalId, paymentStatus } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }
    
    if (rental.paymentMethod === 'cod') {
      rental.paymentStatus = paymentStatus;
      if (paymentStatus === 'completed') {
        rental.paymentDate = new Date();
      }
      await rental.save();
    }
    
    res.json({ success: true, message: `Payment status updated to ${paymentStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createRazorpayOrder, 
  verifyPayment, 
  updateCODPaymentStatus 
};