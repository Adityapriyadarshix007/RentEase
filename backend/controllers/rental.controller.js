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
    status: String,
    deliveryAddress: Object,
    deliveryDate: Date,
    deliverySlot: String,
    paymentMethod: String,
    createdAt: Date
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
      return res.status(404).json({ message: 'Product not found' });
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
      deliveryAddress,
      deliveryDate: new Date(deliveryDate),
      deliverySlot,
      paymentMethod,
      createdAt: new Date()
    });
    
    await rental.save();
    res.status(201).json({ success: true, rental });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: new mongoose.Types.ObjectId(req.user._id) }).sort({ createdAt: -1 });
    
    const populatedRentals = await Promise.all(rentals.map(async (rental) => {
      const product = await mongoose.connection.db.collection('products').findOne({ _id: rental.product });
      return { ...rental._doc, product };
    }));
    
    res.json({ success: true, rentals: populatedRentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({}).sort({ createdAt: -1 });
    
    const populatedRentals = await Promise.all(rentals.map(async (rental) => {
      const product = await mongoose.connection.db.collection('products').findOne({ _id: rental.product });
      const user = await mongoose.connection.db.collection('users').findOne({ _id: rental.user });
      return { ...rental._doc, product, user };
    }));
    
    res.json({ success: true, rentals: populatedRentals });
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ message: error.message });
  }
};

const getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    
    if (rental.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const product = await mongoose.connection.db.collection('products').findOne({ _id: rental.product });
    res.json({ success: true, rental: { ...rental._doc, product } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    
    if (rental.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    rental.status = 'cancelled';
    await rental.save();
    res.json({ success: true, message: 'Rental cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRental, getUserRentals, getAllRentals, getRentalById, cancelRental };

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    rental.status = status;
    await rental.save();
    
    res.json({ success: true, message: 'Rental status updated successfully' });
  } catch (error) {
    console.error('Error updating rental status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRental, getUserRentals, getAllRentals, getRentalById, cancelRental, updateRentalStatus };

const getAllRentals = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const rentals = await Rental.find({}).sort({ createdAt: -1 });
    
    // Populate product and user details
    const populatedRentals = await Promise.all(rentals.map(async (rental) => {
      const product = await mongoose.connection.db.collection('products').findOne({ 
        _id: rental.product 
      });
      const user = await mongoose.connection.db.collection('users').findOne({ 
        _id: rental.user 
      });
      return {
        ...rental._doc,
        product: product || null,
        user: user ? { name: user.name, email: user.email, _id: user._id } : null
      };
    }));
    
    res.json({ success: true, rentals: populatedRentals });
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    rental.status = status;
    await rental.save();
    
    res.json({ success: true, message: 'Rental status updated successfully' });
  } catch (error) {
    console.error('Error updating rental status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRental, getUserRentals, getAllRentals, getRentalById, cancelRental, updateRentalStatus };
