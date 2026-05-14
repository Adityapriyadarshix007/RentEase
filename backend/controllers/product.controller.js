const Product = require('../models/Product.model');

// Simple in-memory cache for product list
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

const getProducts = async (req, res) => {
  try {
    const { 
      category, subCategory, search, minPrice, maxPrice, 
      sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 12 
    } = req.query;
    
    // Build cache key based on query parameters
    const cacheKey = JSON.stringify({ category, subCategory, search, minPrice, maxPrice, sortBy, sortOrder, page, limit });
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }
    
    let query = { isAvailable: true, availableQuantity: { $gt: 0 } };
    
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (minPrice || maxPrice) {
      query.monthlyRent = {};
      if (minPrice) query.monthlyRent.$gte = parseInt(minPrice);
      if (maxPrice) query.monthlyRent.$lte = parseInt(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Select only needed fields (exclude large image data)
    const products = await Product.find(query)
      .select('name category subCategory monthlyRent rating numReviews availableQuantity brand images')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOptions)
      .lean();
    
    const total = await Product.countDocuments(query);
    
    const responseData = {
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    };
    
    // Store in cache
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    // Set cache headers
    res.set('Cache-Control', 'public, max-age=30');
    res.json(responseData);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      availableQuantity: req.body.quantity
    };
    const product = await Product.create(productData);
    // Clear cache on product creation
    cache.clear();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    Object.assign(product, req.body);
    product.updatedAt = Date.now();
    await product.save();
    
    // Clear cache on product update
    cache.clear();
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    
    // Clear cache on product deletion
    cache.clear();
    
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true, availableQuantity: { $gt: 0 } })
      .select('name category monthlyRent rating numReviews images')
      .sort({ rating: -1 })
      .limit(8)
      .lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    
    const Rental = require('../models/Rental.model');
    const hasRented = await Rental.findOne({
      user: req.user._id,
      product: product._id,
      status: { $in: ['completed', 'active'] }
    });
    
    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment,
      verifiedPurchase: !!hasRented,
      createdAt: new Date()
    };
    
    product.reviews.push(review);
    await product.updateRating();
    await product.save();
    
    // Clear cache on review addition
    cache.clear();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: review,
      rating: product.rating,
      numReviews: product.numReviews,
      ratingDistribution: product.ratingDistribution
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const markReviewHelpful = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    if (review.helpful.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You already marked this review as helpful' });
    }
    
    review.helpful.push(req.user._id);
    await product.save();
    
    res.json({ success: true, message: 'Review marked as helpful', helpfulCount: review.helpful.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('reviews rating numReviews ratingDistribution')
      .populate('reviews.user', 'name')
      .lean();
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({
      success: true,
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
      ratingDistribution: product.ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFeaturedProducts,
  addProductReview,
  markReviewHelpful,
  getProductReviews
};
