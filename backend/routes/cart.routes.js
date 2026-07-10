const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

// Get user's cart with city information
router.get('/', protect, async (req, res) => {
  try {
    const userCity = req.user?.address?.city || 'Delhi';
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = { items: [] };
      return res.json({ 
        success: true, 
        cart: cart.items || [],
        totals: {
          subtotal: 0,
          deliveryTotal: 0,
          grandTotal: 0
        }
      });
    }
    
    // Update delivery charges based on current city
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const isAvailableInCity = product.city === userCity || 
                                 product.city === 'All India' ||
                                 (product.availableCities && product.availableCities.includes(userCity));
        
        item.deliveryCharge = isAvailableInCity ? 0 : (product.outOfCityDeliveryCharge || 299);
        item.isAvailableInCity = isAvailableInCity;
        item.city = product.city;
        item.availableCities = product.availableCities || [];
        item.outOfCityDeliveryCharge = product.outOfCityDeliveryCharge || 299;
        item.monthlyRent = product.monthlyRent;
        item.productName = product.name;
        item.productImage = product.images && product.images.length > 0 ? product.images[0] : '';
      }
    }
    
    await cart.save();
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.tenureMonths * item.monthlyRent);
    }, 0);
    
    const totalDelivery = cart.items.reduce((sum, item) => {
      return sum + (item.deliveryCharge || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      cart: cart.items || [],
      totals: {
        subtotal,
        deliveryTotal: totalDelivery,
        grandTotal: subtotal + totalDelivery
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add item to cart with city information
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, tenureMonths, quantity } = req.body;
    const userCity = req.user?.address?.city || 'Delhi';
    
    // Get product details with city info
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Calculate delivery charge
    const isAvailableInCity = product.city === userCity || 
                             product.city === 'All India' ||
                             (product.availableCities && product.availableCities.includes(userCity));
    
    const deliveryCharge = isAvailableInCity ? 0 : (product.outOfCityDeliveryCharge || 299);
    
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
      // Update existing item with city info
      cart.items[existingItemIndex].quantity = (cart.items[existingItemIndex].quantity || 0) + (quantity || 1);
      if (tenureMonths) cart.items[existingItemIndex].tenureMonths = tenureMonths;
      // Update city fields
      cart.items[existingItemIndex].deliveryCharge = deliveryCharge;
      cart.items[existingItemIndex].isAvailableInCity = isAvailableInCity;
      cart.items[existingItemIndex].city = product.city;
      cart.items[existingItemIndex].availableCities = product.availableCities || [];
      cart.items[existingItemIndex].outOfCityDeliveryCharge = product.outOfCityDeliveryCharge || 299;
    } else {
      // Add new item with all city info
      cart.items.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || null,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit || 0,
        quantity: quantity || 1,
        tenureMonths: tenureMonths || 3,
        category: product.category,
        subCategory: product.subCategory,
        // ===== CITY FIELDS =====
        city: product.city,
        availableCities: product.availableCities || [],
        outOfCityDeliveryCharge: product.outOfCityDeliveryCharge || 299,
        deliveryCharge: deliveryCharge,
        isAvailableInCity: isAvailableInCity
      });
    }
    
    await cart.save();
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.tenureMonths * item.monthlyRent);
    }, 0);
    
    const totalDelivery = cart.items.reduce((sum, item) => {
      return sum + (item.deliveryCharge || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      cart: cart.items,
      totals: {
        subtotal,
        deliveryTotal: totalDelivery,
        grandTotal: subtotal + totalDelivery
      }
    });
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
    const userCity = req.user?.address?.city || 'Delhi';
    
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
    
    // Update delivery charge based on current city
    const product = await Product.findById(productId);
    if (product) {
      const isAvailableInCity = product.city === userCity || 
                               product.city === 'All India' ||
                               (product.availableCities && product.availableCities.includes(userCity));
      
      cart.items[itemIndex].deliveryCharge = isAvailableInCity ? 0 : (product.outOfCityDeliveryCharge || 299);
      cart.items[itemIndex].isAvailableInCity = isAvailableInCity;
      cart.items[itemIndex].city = product.city;
      cart.items[itemIndex].availableCities = product.availableCities || [];
      cart.items[itemIndex].outOfCityDeliveryCharge = product.outOfCityDeliveryCharge || 299;
    }
    
    await cart.save();
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.tenureMonths * item.monthlyRent);
    }, 0);
    
    const totalDelivery = cart.items.reduce((sum, item) => {
      return sum + (item.deliveryCharge || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      cart: cart.items,
      totals: {
        subtotal,
        deliveryTotal: totalDelivery,
        grandTotal: subtotal + totalDelivery
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
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
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.tenureMonths * item.monthlyRent);
    }, 0);
    
    const totalDelivery = cart.items.reduce((sum, item) => {
      return sum + (item.deliveryCharge || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      cart: cart.items,
      totals: {
        subtotal,
        deliveryTotal: totalDelivery,
        grandTotal: subtotal + totalDelivery
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
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
    res.json({ 
      success: true, 
      message: 'Cart cleared',
      cart: [],
      totals: {
        subtotal: 0,
        deliveryTotal: 0,
        grandTotal: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;