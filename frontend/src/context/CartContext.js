import React, { createContext, useState, useContext, useEffect } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('rentease_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rentease_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, tenureMonths = 3, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return false;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === product._id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          tenureMonths: tenureMonths
        };
        // Only ONE toast notification
        toast.success(`Updated ${product.name} quantity to ${updatedItems[existingItemIndex].quantity}`);
        return updatedItems;
      } else {
        const newItem = {
          productId: product._id,
          productName: product.name,
          productImage: product.images && product.images[0] ? product.images[0] : null,
          monthlyRent: product.monthlyRent,
          securityDeposit: product.securityDeposit || 0,
          quantity: quantity,
          tenureMonths: tenureMonths,
          category: product.category,
          subCategory: product.subCategory
        };
        // Only ONE toast notification
        toast.success(`${product.name} added to cart!`);
        return [...prevItems, newItem];
      }
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.productId === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.productName} from cart`);
      }
      return prevItems.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const updateTenure = (productId, newTenure) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, tenureMonths: newTenure }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.monthlyRent * item.tenureMonths * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateTenure,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
