const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    default: 'good'
  },
  availableQuantity: {
    type: Number,
    default: 0
  },
  specifications: {
    type: Object,
    default: {}
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  ratingDistribution: {
    one: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    five: { type: Number, default: 0 }
  },
  isAvailable: {
    type: Boolean,
    default: true
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

// Method to update rating when new review is added
productSchema.methods.updateRating = async function() {
  const totalReviews = this.reviews.length;
  if (totalReviews === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }
  
  let sum = 0;
  const distribution = { one: 0, two: 0, three: 0, four: 0, five: 0 };
  
  for (const review of this.reviews) {
    sum += review.rating;
    if (review.rating === 1) distribution.one++;
    else if (review.rating === 2) distribution.two++;
    else if (review.rating === 3) distribution.three++;
    else if (review.rating === 4) distribution.four++;
    else if (review.rating === 5) distribution.five++;
  }
  
  this.rating = sum / totalReviews;
  this.numReviews = totalReviews;
  this.ratingDistribution = distribution;
};

module.exports = mongoose.model('Product', productSchema);
