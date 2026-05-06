const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFeaturedProducts 
} = require('../controllers/product.controller');
const { protect, admin, vendor } = require('../middleware/auth.middleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', protect, vendor, createProduct);
router.put('/:id', protect, vendor, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;