const mongoose = require('mongoose');

let Rental;
try {
  Rental = require('../models/Rental.model');
} catch (error) {
  const rentalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rentalStartDate: Date,
    rentalEndDate: Date,
    tenureMonths: Number,
    monthlyRent: Number,
    totalAmount: Number,
    securityDeposit: Number,
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, default: 'pending' },
    paymentId: String,
    paymentDate: Date,
    razorpayOrderId: String,
    deliveryAddress: Object,
    deliveryDate: Date,
    deliverySlot: String,
    paymentMethod: { type: String, enum: ['cod', 'razorpay'], default: 'cod' },
    createdAt: { type: Date, default: Date.now }
  });
  Rental = mongoose.model('Rental', rentalSchema);
}

const createRental = async (req, res) => {
  try {
    const { productId, tenureMonths, quantity, deliveryAddress, deliveryDate, deliverySlot, paymentMethod } = req.body;
    
    const product = await mongoose.connection.db.collection('products').findOne({ 
      _id: new mongoose.Types.ObjectId(productId) 
    });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const rentalStartDate = new Date();
    const rentalEndDate = new Date();
    rentalEndDate.setMonth(rentalEndDate.getMonth() + tenureMonths);
    
    const totalAmount = product.monthlyRent * tenureMonths * (quantity || 1);
    
    const rental = new Rental({
      user: new mongoose.Types.ObjectId(req.user._id),
      product: new mongoose.Types.ObjectId(productId),
      rentalStartDate,
      rentalEndDate,
      tenureMonths,
      monthlyRent: product.monthlyRent,
      totalAmount,
      securityDeposit: product.securityDeposit || 0,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryAddress,
      deliveryDate: new Date(deliveryDate),
      deliverySlot,
      paymentMethod: paymentMethod,
      createdAt: new Date()
    });
    
    await rental.save();
    
    res.status(201).json({ 
      success: true, 
      rental,
      needsPayment: paymentMethod !== 'cod'
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const validatePincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    
    // Indian pincode regex: 6 digits, first digit can't be 0
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    
    if (pincodeRegex.test(pincode)) {
      res.json({ 
        success: true, 
        message: 'Delivery available at this pincode', 
        deliveryFee: 0 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Please enter a valid 6-digit Indian pincode' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('product', 'name monthlyRent images category subCategory brand')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, rentals });
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
    res.json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
    
    if (rental.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    rental.status = 'cancelled';
    await rental.save();
    res.json({ success: true, message: 'Rental cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const rentals = await Rental.find()
      .populate('user', 'name email')
      .populate('product', 'name images category')
      .sort({ createdAt: -1 });
    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
    
    rental.status = status;
    await rental.save();
    res.json({ success: true, message: 'Rental status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createRental,
  validatePincode,
  getUserRentals,
  getRentalById,
  cancelRental,
  getAllRentals,
  updateRentalStatus
};
