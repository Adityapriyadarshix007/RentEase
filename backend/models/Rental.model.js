const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rentalStartDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  rentalEndDate: {
    type: Date,
    required: true
  },
  tenureMonths: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  securityDeposit: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled', 'overdue'],
    default: 'pending'
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliverySlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    default: 'morning'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'netbanking', 'wallet'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'completed', 'refunded'],  // ← ADDED 'completed' here
    default: 'pending'
  },
  paymentId: String,
  paymentDate: Date,  // ← ADD THIS FIELD
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
rentalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Rental', rentalSchema);