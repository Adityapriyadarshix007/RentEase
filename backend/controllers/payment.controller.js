const Rental = require('../models/Rental.model');

const createPaymentIntent = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (rental.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Here you would integrate with a payment gateway like Razorpay, Stripe, etc.
    // For now, we'll just return a mock payment intent
    
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: rental.totalAmount + rental.securityDeposit,
      currency: 'inr',
      status: 'requires_confirmation'
    };
    
    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { rentalId, paymentId, paymentMethod } = req.body;
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    rental.paymentStatus = 'paid';
    rental.paymentId = paymentId;
    rental.paymentMethod = paymentMethod;
    rental.status = 'active';
    await rental.save();
    
    res.json({ success: true, message: 'Payment confirmed', rental });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const rentals = await Rental.find({ 
      user: req.user._id,
      paymentStatus: 'paid'
    }).select('paymentId paymentMethod totalAmount createdAt');
    
    res.json({ success: true, payments: rentals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent, confirmPayment, getPaymentHistory };