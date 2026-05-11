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
      status: 'requires_confirmation',
      rentalId: rental._id
    };
    
    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error('Create payment intent error:', error);
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
    
    if (rental.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update rental with payment details
    rental.paymentStatus = 'paid';
    rental.paymentId = paymentId;
    rental.paymentMethod = paymentMethod;
    rental.paymentDate = new Date();
    rental.status = 'active';  // Activate rental after payment
    
    await rental.save();
    
    console.log(`✅ Payment confirmed for rental ${rentalId}: ₹${rental.totalAmount}`);
    
    res.json({ 
      success: true, 
      message: 'Payment confirmed successfully',
      rental: {
        _id: rental._id,
        paymentStatus: rental.paymentStatus,
        status: rental.status,
        totalAmount: rental.totalAmount
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const rentals = await Rental.find({ 
      user: req.user._id,
      paymentStatus: { $in: ['paid', 'completed'] }  // Include both paid and completed
    }).select('paymentId paymentMethod totalAmount createdAt status').sort({ createdAt: -1 });
    
    res.json({ success: true, payments: rentals });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Manually update payment status for COD orders after delivery
const updatePaymentStatus = async (req, res) => {
  try {
    const { rentalId, paymentStatus } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    // Validate payment status transition
    if (paymentStatus === 'completed' && rental.paymentMethod === 'cod') {
      rental.paymentStatus = 'completed';
      rental.paymentDate = new Date();
      await rental.save();
      
      console.log(`✅ COD payment marked as completed for rental ${rentalId}: ₹${rental.totalAmount}`);
      
      res.json({ 
        success: true, 
        message: 'COD payment marked as completed',
        rental: {
          _id: rental._id,
          paymentStatus: rental.paymentStatus,
          totalAmount: rental.totalAmount
        }
      });
    } 
    else if (paymentStatus === 'paid') {
      rental.paymentStatus = 'paid';
      rental.paymentDate = new Date();
      await rental.save();
      
      res.json({ 
        success: true, 
        message: 'Payment marked as paid',
        rental: {
          _id: rental._id,
          paymentStatus: rental.paymentStatus,
          totalAmount: rental.totalAmount
        }
      });
    }
    else {
      res.status(400).json({ 
        success: false, 
        message: `Invalid payment status transition: ${paymentStatus} for payment method ${rental.paymentMethod}` 
      });
    }
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentHistory,
  updatePaymentStatus 
};