const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
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
  issueType: {
    type: String,
    required: true,
    enum: ['damage', 'malfunction', 'cleaning', 'assembly', 'replacement', 'other']
  },
  issueTitle: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  images: [{
    type: String
  }],
  preferredDate: {
    type: Date,
    required: true
  },
  preferredSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    default: 'morning'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'resolved', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: String,
    default: null
  },
  technicianName: String,
  technicianContact: String,
  resolutionNotes: String,
  resolutionCost: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  assignedAt: Date,
  resolvedAt: Date
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);