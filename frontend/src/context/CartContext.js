import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    deliveryTotal: 0,
    grandTotal: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        if (response.data.totals) {
          setCartTotals(response.data.totals);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to localStorage if API fails
      const savedCart = localStorage.getItem('rentease_cart_backup');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
      setIsSynced(true);
    }
  }, [API_URL]);

  // Initial load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save to localStorage as backup
  useEffect(() => {
    if (isSynced) {
      localStorage.setItem('rentease_cart_backup', JSON.stringify(cartItems));
    }
  }, [cartItems, isSynced]);

  const addToCart = async (product, tenureMonths = 3, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return false;
    }

    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await axios.post(`${API_URL}/api/cart/add`, {
        productId: product._id,
        tenureMonths,
        quantity
      }, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        if (response.data.totals) {
          setCartTotals(response.data.totals);
        }
        toast.success(`${product.name} added to cart!`);
        return true;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      const response = await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        if (response.data.totals) {
          setCartTotals(response.data.totals);
        }
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      const response = await axios.put(`${API_URL}/api/cart/update/${productId}`, {
        quantity: newQuantity
      }, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        if (response.data.totals) {
          setCartTotals(response.data.totals);
        }
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const updateTenure = async (productId, newTenure) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      const response = await axios.put(`${API_URL}/api/cart/update/${productId}`, {
        tenureMonths: newTenure
      }, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        if (response.data.totals) {
          setCartTotals(response.data.totals);
        }
      }
    } catch (error) {
      console.error('Update tenure error:', error);
    }
  };

  const clearCart = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      const response = await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      
      if (response.data.success) {
        setCartItems([]);
        setCartTotals({ subtotal: 0, deliveryTotal: 0, grandTotal: 0 });
        toast.success('Cart cleared');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + ((item.monthlyRent || 0) * (item.tenureMonths || 3) * (item.quantity || 1));
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const getDeliveryTotal = () => {
    return cartTotals.deliveryTotal || cartItems.reduce((sum, item) => {
      return sum + (item.deliveryCharge || 0);
    }, 0);
  };

  const getGrandTotal = () => {
    return cartTotals.grandTotal || (getCartTotal() + getDeliveryTotal());
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      cartTotals,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateTenure,
      clearCart,
      getCartTotal,
      getCartCount,
      getDeliveryTotal,
      getGrandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};