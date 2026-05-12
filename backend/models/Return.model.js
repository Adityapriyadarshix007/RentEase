const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
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
  reason: { 
    type: String, 
    enum: ['damaged', 'not_needed', 'relocating', 'upgrading', 'other'], 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  damagePhotos: [{ 
    type: String 
  }],
  damageAmount: { 
    type: Number, 
    default: 0 
  },
  refundAmount: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'completed', 'rejected'], 
    default: 'pending' 
  },
  pickupDate: { 
    type: Date 
  },
  pickupSlot: { 
    type: String, 
    enum: ['morning', 'afternoon', 'evening'] 
  },
  inspectionNotes: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Return', returnSchema);