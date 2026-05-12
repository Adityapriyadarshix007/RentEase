const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reason: { 
    type: String, 
    enum: ['damaged', 'not_needed', 'relocating', 'upgrading', 'other'], 
    required: true 
  },
  description: { type: String, default: '' },
  damagePhotos: [{ type: String }],
  damageAmount: { type: Number, default: 0, min: 0 },  // ← MIN 0
  refundAmount: { type: Number, default: 0, min: 0 },  // ← MIN 0
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'completed', 'rejected'], 
    default: 'pending' 
  },
  pickupDate: Date,
  pickupSlot: String,
  inspectionNotes: String,
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to ensure amounts are never negative
returnSchema.pre('save', function(next) {
  if (this.damageAmount < 0) this.damageAmount = 0;
  if (this.refundAmount < 0) this.refundAmount = 0;
  next();
});

module.exports = mongoose.model('Return', returnSchema);
