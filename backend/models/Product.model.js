const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Furniture', 'Appliances']
  },
  subCategory: {
    type: String,
    required: true,
    enum: ['Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe', 'Dining Table', 'Bookshelf', 
           'Fridge', 'Washing Machine', 'TV', 'AC', 'Microwave', 'Water Purifier', 'Air Cooler']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: [0, 'Monthly rent cannot be negative']
  },
  securityDeposit: {
    type: Number,
    required: true,
    min: [0, 'Security deposit cannot be negative']
  },
  rentalTenureOptions: [{
    type: Number,
    enum: [1, 3, 6, 12]
  }],
  images: [{
    type: String,
    default: []
  }],
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  specifications: {
    brand: String,
    model: String,
    color: String,
    dimensions: String,
    weight: String,
    material: String,
    warranty: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ name: 'text', description: 'text' });

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);