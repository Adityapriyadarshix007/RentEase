const Product = require('../models/Product.model');

// Simple in-memory cache for product list
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

const getProducts = async (req, res) => {
  try {
    const { 
      category, subCategory, search, minPrice, maxPrice, 
      sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 12,
      city = 'All Cities'
    } = req.query;
    
    const cacheKey = JSON.stringify({ category, subCategory, search, minPrice, maxPrice, sortBy, sortOrder, page, limit, city });
    
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }
    
    let query = {};
    
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    if (subCategory && subCategory !== 'All') {
      query.subCategory = subCategory;
    }
    if (minPrice || maxPrice) {
      query.monthlyRent = {};
      if (minPrice) query.monthlyRent.$gte = parseInt(minPrice);
      if (maxPrice) query.monthlyRent.$lte = parseInt(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    // ===== CITY FILTER LOGIC =====
    // If city is selected, show products available in that city OR All India
    if (city && city !== 'All Cities') {
      query.$or = [
        { city: city },
        { city: 'All India' }
      ];
    }
    
    // ===== GET ALL PRODUCTS (without pagination first) =====
    const allProducts = await Product.find(query)
      .select('name category subCategory description monthlyRent securityDeposit availableQuantity brand condition images city availableCities outOfCityDeliveryCharge deliveryCharge rating numReviews isAvailable _id')
      .lean();
    
    // ===== SORT: City-specific products first, then All India =====
    let sortedProducts = allProducts;
    if (city && city !== 'All Cities') {
      sortedProducts = allProducts.sort((a, b) => {
        const aIsCity = a.city === city;
        const bIsCity = b.city === city;
        
        // City-specific products come first
        if (aIsCity && !bIsCity) return -1;
        if (!aIsCity && bIsCity) return 1;
        
        // If both are city or both are All India, sort by sortBy
        return 0;
      });
    }
    
    // ===== APPLY SORTING =====
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // If sortBy is not city-specific, apply sorting after city priority
    if (sortBy !== 'city') {
      sortedProducts.sort((a, b) => {
        // First priority: city-specific vs All India (if city is selected)
        if (city && city !== 'All Cities') {
          const aIsCity = a.city === city;
          const bIsCity = b.city === city;
          if (aIsCity && !bIsCity) return -1;
          if (!aIsCity && bIsCity) return 1;
        }
        
        // Then apply the requested sort
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'monthlyRent') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else if (sortBy === 'rating') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else if (sortBy === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (aVal < bVal) return sortOrder === 'desc' ? 1 : -1;
        if (aVal > bVal) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    
    // ===== APPLY PAGINATION =====
    const total = sortedProducts.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = sortedProducts.slice(skip, skip + parseInt(limit));
    
    console.log(`📍 City: ${city}, Found: ${total} products, Showing: ${paginatedProducts.length}`);
    
    const responseData = {
      success: true,
      products: paginatedProducts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      },
      filter: {
        city: city || 'All Cities',
        category: category || 'All Categories',
        subCategory: subCategory || 'All'
      }
    };
    
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
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
    console.log("Received product data:", req.body);
    const productData = {
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory || "",
      description: req.body.description || "",
      monthlyRent: parseFloat(req.body.monthlyRent),
      securityDeposit: parseFloat(req.body.securityDeposit) || 0,
      availableQuantity: parseInt(req.body.availableQuantity) || parseInt(req.body.quantity) || 0,
      brand: req.body.brand || "",
      condition: req.body.condition || "good",
      images: req.body.images || [],
      specifications: req.body.specifications || {},
      isAvailable: true,
      createdAt: new Date(),
      city: req.body.city || 'All India',
      availableCities: req.body.availableCities || [],
      outOfCityDeliveryCharge: req.body.outOfCityDeliveryCharge || 299,
      deliveryCharge: req.body.deliveryCharge || 0
    };
    const product = await Product.create(productData);
    cache.clear();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('📥 Updating product with data:', req.body);
    
    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.subCategory = req.body.subCategory || product.subCategory;
    product.description = req.body.description || product.description;
    product.monthlyRent = req.body.monthlyRent !== undefined ? req.body.monthlyRent : product.monthlyRent;
    product.securityDeposit = req.body.securityDeposit !== undefined ? req.body.securityDeposit : product.securityDeposit;
    product.availableQuantity = req.body.availableQuantity !== undefined ? req.body.availableQuantity : product.availableQuantity;
    product.brand = req.body.brand || product.brand;
    product.condition = req.body.condition || product.condition;
    product.images = req.body.images || product.images;
    product.specifications = req.body.specifications || product.specifications;
    product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;
    
    product.city = req.body.city || product.city || 'All India';
    product.availableCities = req.body.availableCities || product.availableCities || [];
    product.outOfCityDeliveryCharge = req.body.outOfCityDeliveryCharge !== undefined ? req.body.outOfCityDeliveryCharge : product.outOfCityDeliveryCharge;
    product.deliveryCharge = req.body.deliveryCharge !== undefined ? req.body.deliveryCharge : product.deliveryCharge;
    
    product.updatedAt = Date.now();
    await product.save();
    
    console.log('✅ Product updated:', product);
    
    cache.clear();
    
    res.json({ 
      success: true, 
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    cache.clear();
    
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true, availableQuantity: { $gt: 0 } })
      .select('name category monthlyRent rating numReviews images city')
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

const validateCityAvailability = async (req, res) => {
  try {
    const { city, productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const isAvailable = product.city === 'All India' || 
                        product.city === city || 
                        (product.availableCities && product.availableCities.includes(city));
    
    res.json({ 
      success: true, 
      available: isAvailable,
      deliveryCharge: isAvailable ? (product.deliveryCharge || 0) : null
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
  getProductReviews,
  validateCityAvailability
};