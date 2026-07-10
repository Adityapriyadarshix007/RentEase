import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateTenure, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryCharges, setDeliveryCharges] = useState({});
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  // Get user's city
  useEffect(() => {
    const city = localStorage.getItem('userCity') || user?.address?.city || 'Delhi';
    setUserCity(city);
  }, [user]);

  // Calculate delivery charges for all cart items
  useEffect(() => {
    if (cartItems.length > 0 && userCity) {
      calculateDeliveryCharges();
    } else {
      setLoading(false);
    }
  }, [cartItems, userCity]);

  const calculateDeliveryCharges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const productIds = cartItems.map(item => item.productId);
      
      const response = await fetch(`${API_URL}/api/products/calculate-delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productIds, 
          userCity 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const charges = {};
        data.data.products.forEach(p => {
          charges[p.productId] = p.deliveryCharge;
        });
        setDeliveryCharges(charges);
      }
    } catch (error) {
      console.error('Error calculating delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  // Calculate totals with delivery
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.monthlyRent * item.tenureMonths * item.quantity);
  }, 0);

  const totalDelivery = cartItems.reduce((sum, item) => {
    return sum + (deliveryCharges[item.productId] || 0);
  }, 0);

  const grandTotal = subtotal + totalDelivery;

  const getDeliveryStatus = (item) => {
    const charge = deliveryCharges[item.productId];
    if (charge === undefined) return 'Calculating...';
    if (charge === 0) return '✅ Free';
    return `🚚 ₹${charge}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <p className="text-gray-600 mb-6">{cartItems.length} items in your cart</p>
      
      {/* City indicator */}
      <div className="bg-blue-50 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-700">
          📍 Delivering to: <strong>{userCity}</strong>
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemTotal = item.monthlyRent * item.tenureMonths * item.quantity;
            const deliveryCharge = deliveryCharges[item.productId] || 0;
            const itemGrandTotal = itemTotal + deliveryCharge;
            
            return (
              <div key={item.productId} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <div className="md:w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-4xl">🛋️</span>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.productName}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.subCategory || item.category}</p>
                    <p className="text-blue-600 font-semibold">₹{item.monthlyRent}/month</p>
                    
                    {/* Delivery info */}
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="text-gray-600">Delivery: </span>
                        <span className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                          {getDeliveryStatus(item)}
                        </span>
                      </p>
                      {deliveryCharge > 0 && (
                        <p className="text-xs text-gray-500">Ships from {item.city || 'another city'}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tenure</label>
                      <select
                        value={item.tenureMonths}
                        onChange={(e) => updateTenure(item.productId, parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {[1, 3, 6, 12].map(tenure => (
                          <option key={tenure} value={tenure}>
                            {tenure} {tenure === 1 ? 'Month' : 'Months'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">₹{itemGrandTotal}</p>
                    <p className="text-sm text-gray-500">
                      Rent: ₹{itemTotal}
                      {deliveryCharge > 0 && (
                        <span className="block text-orange-500 text-xs">+ ₹{deliveryCharge} delivery</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className={totalDelivery > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {totalDelivery > 0 ? `₹${totalDelivery}` : 'FREE'}
                </span>
              </div>
              {totalDelivery > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {cartItems.filter(item => (deliveryCharges[item.productId] || 0) > 0).length} item(s) will be shipped from other cities
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *Security deposits will be collected separately
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Calculating...' : `Proceed to Checkout • ₹${grandTotal}`}
            </button>
            
            <Link to="/products" className="block text-center text-blue-600 hover:underline mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;