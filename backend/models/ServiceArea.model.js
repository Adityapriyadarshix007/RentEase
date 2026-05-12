const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincodes: [{ type: String }],
  deliveryFee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);
