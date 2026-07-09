const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addProductReview,
  markReviewHelpful,
  getProductReviews,
  validateCityAvailability // ← NEW
} = require('../controllers/product.controller');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);

// ========== NEW: City validation route ==========
router.post('/validate-city', protect, validateCityAvailability);

// Admin only routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

// Review routes (authenticated users)
router.post('/:id/reviews', protect, addProductReview);
router.post('/:productId/reviews/:reviewId/helpful', protect, markReviewHelpful);

module.exports = router;