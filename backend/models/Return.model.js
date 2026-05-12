const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  returnReason: { type: String, enum: ['damaged', 'not_needed', 'relocating', 'other'], required: true },
  returnDescription: String,
  pickupAddress: Object,
  pickupDate: Date,
  pickupSlot: String,
  condition: { type: String, enum: ['good', 'damaged', 'excellent'], default: 'good' },
  damagePhotos: [String],
  damageAmount: { type: Number, default: 0 },
  refundAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'picked_up', 'inspected', 'refunded', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Return', returnSchema);