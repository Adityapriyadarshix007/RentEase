const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = { items: [] };
    }
    
    res.json({ success: true, cart: cart.items || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, tenureMonths, quantity } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user._id,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex !== -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity || 1;
      if (tenureMonths) cart.items[existingItemIndex].tenureMonths = tenureMonths;
    } else {
      // Add new item
      cart.items.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || null,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit || 0,
        quantity: quantity || 1,
        tenureMonths: tenureMonths || 3,
        category: product.category,
        subCategory: product.subCategory
      });
    }
    
    await cart.save();
    res.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update cart item quantity
router.put('/update/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, tenureMonths } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }
    
    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = quantity;
    }
    if (tenureMonths !== undefined) {
      cart.items[itemIndex].tenureMonths = tenureMonths;
    }
    
    await cart.save();
    res.json({ success: true, cart: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    
    await cart.save();
    res.json({ success: true, cart: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear entire cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
