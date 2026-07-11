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
    trim: true,
    index: true // ✅ Added index for faster search
  },
  category: {
    type: String,
    required: true,
    index: true // ✅ Added index for faster filtering
  },
  subCategory: {
    type: String,
    default: '',
    index: true // ✅ Added index for faster filtering
  },
  description: {
    type: String,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: 0,
    index: true // ✅ Added index for price range queries
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
    default: '',
    index: true // ✅ Added index for brand search
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    default: 'good'
  },
  availableQuantity: {
    type: Number,
    default: 0,
    index: true // ✅ Added index for stock filtering
  },
  specifications: {
    type: Object,
    default: {}
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    index: true // ✅ Added index for sorting by rating
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
    default: true,
    index: true // ✅ Added index for availability filtering
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // ✅ Added index for sorting by date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // ===== CITY FIELDS =====
  city: {
    type: String,
    enum: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'All India'],
    default: 'All India',
    index: true // ✅ Added index for city filtering
  },
  availableCities: [{
    type: String,
    enum: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune']
  }],
  deliveryCharge: {
    type: Number,
    default: 0
  },
  outOfCityDeliveryCharge: {
    type: Number,
    default: 299
  }
});

// ===== COMPOUND INDEXES FOR COMMON QUERIES =====
productSchema.index({ category: 1, city: 1 });
productSchema.index({ subCategory: 1, city: 1 });
productSchema.index({ monthlyRent: 1, city: 1 });
productSchema.index({ rating: -1, city: 1 });
productSchema.index({ createdAt: -1, city: 1 });
productSchema.index({ name: 'text', brand: 'text' }); // Text search index

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
